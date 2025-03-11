
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlockchain } from "@/context/BlockchainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { connectWallet } = useBlockchain();
  const navigate = useNavigate();

  // Check for redirect after login
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    
    // If user is already logged in, redirect them
    const user = localStorage.getItem('user');
    if (user) {
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any well-formed email and password over 6 chars
      if (email.includes('@') && password.length >= 6) {
        localStorage.setItem('user', JSON.stringify({ email }));
        toast.success("Login successful", {
          description: "Welcome back to Blockchain Tutor!",
        });
        
        // Check if there's a redirect path
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error("Invalid credentials", {
          description: "The email or password you entered is incorrect.",
        });
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "There was a problem signing you in. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected", {
        description: "You are now signed in with your blockchain wallet.",
      });
      
      // Check if there's a redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error("Wallet connection failed", {
        description: "There was a problem connecting your wallet. Please try again.",
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-20">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-elevation">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-tutor-blue hover:bg-tutor-blue-dark" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="my-4 flex items-center before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              <span className="px-4 text-muted-foreground text-sm">Or continue with</span>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleWalletLogin} 
              className="w-full"
              disabled={isLoading}
            >
              Connect Wallet
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              <span>Don't have an account? </span>
              <Link to="/register" className="underline text-tutor-blue hover:text-tutor-blue-dark font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
