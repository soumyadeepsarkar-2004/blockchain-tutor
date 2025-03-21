
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlockchain, NETWORKS } from "@/context/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice, getPreferredNetwork, isNetworkConfigured, priceToHundredths } from "@/utils/blockchain";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, XCircle } from "lucide-react";
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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { isConnected, connectWallet, bookSession, currentNetwork, switchNetwork } = useBlockchain();
  const preferredNetwork = 'SEPOLIA'; // Always use Sepolia
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>(preferredNetwork);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Always set to Sepolia
    setSelectedNetwork('SEPOLIA');
  }, [currentNetwork]);

  const handlePayment = async () => {
    if (!paymentDetails) return;
    
    if (!isConnected) {
      try {
        await connectWallet('SEPOLIA'); // Always connect to Sepolia
      } catch (error) {
        toast.error("Wallet connection failed", {
          description: "Please connect your wallet to proceed with payment.",
        });
        return;
      }
    } else if (currentNetwork !== 'SEPOLIA') {
      const switched = await switchNetwork('SEPOLIA');
      if (!switched) {
        toast.error("Network switch failed", {
          description: "Please manually switch to Sepolia network in your wallet.",
        });
        return;
      }
    }
    
    setIsProcessing(true);
    setPaymentStatus('pending');
    
    try {
      if (paymentDetails.itemType === 'course') {
        // Create a unique session name for the blockchain transaction
        const courseId = paymentDetails.itemId;
        const timestamp = Date.now();
        const sessionName = `Course_${courseId}_${timestamp}`;
        
        // Get user data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentName = user.name || user.email || 'Student';
        
        // Convert price to contract format
        const priceInHundredths = priceToHundredths(paymentDetails.price);
        const sessionTime = 100; // Dummy value for course purchase
        
        // Call blockchain function to record the purchase
        const success = await bookSession(
          sessionName,
          sessionTime,
          paymentDetails.price
        );
        
        if (success) {
          // Store enrolled course in localStorage
          const enrolledCoursesData = localStorage.getItem('enrolledCourses');
          const enrolledCourses = enrolledCoursesData ? JSON.parse(enrolledCoursesData) : [];
          
          if (!enrolledCourses.some((c: any) => c.id === paymentDetails.itemId)) {
            enrolledCourses.push({
              id: paymentDetails.itemId,
              title: `Course ${paymentDetails.itemId}`,
              enrolledDate: new Date().toISOString(),
              progress: 0
            });
            
            localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
          }
          
          // Also update the user object
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          const userEnrolledCourses = userObj.enrolledCourses || [];
          
          if (!userEnrolledCourses.includes(paymentDetails.itemId)) {
            userEnrolledCourses.push(paymentDetails.itemId);
            userObj.enrolledCourses = userEnrolledCourses;
            localStorage.setItem('user', JSON.stringify(userObj));
          }
          
          setPaymentStatus('success');
          setTransactionHash('0x'); // Will be replaced with actual hash
          
          toast.success("Course purchased successfully!", {
            description: "Your transaction has been recorded on the Sepolia blockchain.",
          });
          
          // Redirect after a short delay to show success screen
          setTimeout(() => {
            localStorage.removeItem('pendingPayment');
            navigate(`/courses/${paymentDetails.itemId}`);
          }, 3000);
        } else {
          throw new Error("Blockchain transaction failed");
        }
      } else if (paymentDetails.itemType === 'tutor') {
        // Handle tutor booking - using existing code
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentName = user.name || user.email;
        
        const tutorName = `Tutor ${paymentDetails.itemId}`;
        const sessionTime = 100;
        
        const success = await bookSession(
          tutorName,
          sessionTime,
          paymentDetails.price
        );
        
        if (success) {
          setPaymentStatus('success');
          setTransactionHash('0x'); // Will be replaced with actual hash
          
          toast.success("Tutor session booked successfully!", {
            description: `Your session has been added to the ${NETWORKS[selectedNetwork].name} blockchain.`,
          });
          
          setTimeout(() => {
            localStorage.removeItem('pendingPayment');
            navigate('/dashboard');
          }, 3000);
        } else {
          throw new Error("Blockchain transaction failed");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus('failed');
      
      toast.error("Payment failed", {
        description: "There was an error processing your payment on the blockchain. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentStatus = () => {
    if (paymentStatus === 'success') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">
            Your transaction has been confirmed on the {NETWORKS[selectedNetwork].name} network.
          </p>
          <p className="text-sm text-muted-foreground">
            You will be redirected shortly...
          </p>
        </div>
      );
    } else if (paymentStatus === 'failed') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Payment Failed</h2>
          <p className="text-muted-foreground">
            There was an error processing your transaction on the blockchain.
          </p>
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => setPaymentStatus(null)}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
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
                
                {paymentStatus ? (
                  <CardContent>
                    {renderPaymentStatus()}
                  </CardContent>
                ) : (
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
                      <p className="font-medium">Ethereum Sepolia Testnet</p>
                    </div>
                    
                    {!isNetworkConfigured('SEPOLIA') && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-600">
                          Using Sepolia requires an Infura ID. Please update the NETWORKS configuration with your Infura ID.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : `Pay $${formatPrice(paymentDetails.price * 100)} with Sepolia ETH`}
                      </Button>
                      
                      <p className="text-xs text-center mt-4 text-muted-foreground">
                        By clicking Pay, you agree to our Terms of Service and authorize a blockchain transaction on {NETWORKS['SEPOLIA'].name}.
                      </p>
                    </div>
                  </CardContent>
                )}
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
