
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlockchain, NETWORKS } from "@/context/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/utils/blockchain";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentDetails {
  itemType: 'course' | 'tutor';
  itemId: string;
  price: number;
  timestamp: string;
}

const Payment = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connectWallet, bookSession, currentNetwork, switchNetwork } = useBlockchain();
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>(currentNetwork);
  const navigate = useNavigate();

  // Get payment details from localStorage
  useEffect(() => {
    const paymentInfo = localStorage.getItem('pendingPayment');
    
    if (!paymentInfo) {
      toast.error("No payment information found", {
        description: "Please select a course or tutor to purchase.",
      });
      navigate('/');
      return;
    }
    
    try {
      const parsedPaymentInfo = JSON.parse(paymentInfo);
      setPaymentDetails(parsedPaymentInfo);
    } catch (error) {
      console.error("Error parsing payment info:", error);
      toast.error("Invalid payment information", {
        description: "There was an error processing your payment. Please try again.",
      });
      navigate('/');
    }
  }, [navigate]);

  // Update selected network when current network changes
  useEffect(() => {
    setSelectedNetwork(currentNetwork);
  }, [currentNetwork]);

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value as keyof typeof NETWORKS);
  };

  const handlePayment = async () => {
    if (!paymentDetails) return;
    
    if (!isConnected) {
      try {
        await connectWallet(selectedNetwork);
      } catch (error) {
        toast.error("Wallet connection failed", {
          description: "Please connect your wallet to proceed with payment.",
        });
        return;
      }
    } else if (currentNetwork !== selectedNetwork) {
      // Switch to the selected network if needed
      const switched = await switchNetwork(selectedNetwork);
      if (!switched) {
        toast.error("Network switch failed", {
          description: "Please manually switch networks in your wallet.",
        });
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      // Process payment based on item type
      if (paymentDetails.itemType === 'course') {
        // Simulate course purchase
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Save to enrolled courses in localStorage
        const enrolledCoursesData = localStorage.getItem('enrolledCourses');
        const enrolledCourses = enrolledCoursesData ? JSON.parse(enrolledCoursesData) : [];
        
        // Add this course if not already enrolled
        if (!enrolledCourses.some((c: any) => c.id === paymentDetails.itemId)) {
          enrolledCourses.push({
            id: paymentDetails.itemId,
            title: `Course ${paymentDetails.itemId}`, // This would come from API in a real app
            enrolledDate: new Date().toISOString(),
            progress: 0
          });
          
          localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        }
        
        toast.success("Course purchased successfully!", {
          description: "You have been enrolled in the course.",
        });
        
      } else if (paymentDetails.itemType === 'tutor') {
        // Use blockchain contract to book a session
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentName = user.name || user.email;
        
        // This would come from API in a real app
        const tutorName = `Tutor ${paymentDetails.itemId}`;
        const sessionTime = 100; // 1 hour in hundredths
        
        const success = await bookSession(
          tutorName,
          sessionTime,
          paymentDetails.price
        );
        
        if (success) {
          toast.success("Tutor session booked successfully!", {
            description: `Your session has been added to the ${NETWORKS[selectedNetwork].name} blockchain.`,
          });
        } else {
          throw new Error("Blockchain transaction failed");
        }
      }
      
      // Clear the pending payment
      localStorage.removeItem('pendingPayment');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed", {
        description: "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container py-12 px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
          
          {paymentDetails ? (
            <div className="max-w-lg mx-auto">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Review your order before proceeding with payment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Item Type</p>
                    <p className="font-medium capitalize">{paymentDetails.itemType}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Item ID</p>
                    <p className="font-medium">{paymentDetails.itemId}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium text-lg">${formatPrice(paymentDetails.price * 100)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Blockchain Network</p>
                    <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(NETWORKS).map((networkKey) => (
                          <SelectItem key={networkKey} value={networkKey}>
                            {NETWORKS[networkKey as keyof typeof NETWORKS].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedNetwork === 'SEPOLIA' && (
                    <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-600">
                        Using Sepolia requires an Infura ID. You'll need to set this in your wallet connection.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay $${formatPrice(paymentDetails.price * 100)}`}
                    </Button>
                    
                    <p className="text-xs text-center mt-4 text-muted-foreground">
                      By clicking Pay, you agree to our Terms of Service and authorize a blockchain transaction on {NETWORKS[selectedNetwork].name}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>Loading payment details...</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
