
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (user) {
            if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);
            } else {
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

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
            const success = await login(email, password);
            
            if (success) {
                const redirectPath = localStorage.getItem("redirectAfterLogin");
                if (redirectPath) {
                    localStorage.removeItem("redirectAfterLogin");
                    navigate(redirectPath);
                } else {
                    navigate("/dashboard");
                }
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center py-20">
                <div className="w-full max-w-md px-4">
                    <Card className="border-0 shadow-elevation">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Welcome back
                            </CardTitle>
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
                                    <div className="text-right">
                                        <Link 
                                            to="/forgot-password" 
                                            className="text-sm text-tutor-blue hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-tutor-blue hover:bg-tutor-blue-dark"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <div className="text-center text-sm text-muted-foreground">
                                <span>Don't have an account? </span>
                                <Link
                                    to="/register"
                                    className="underline text-tutor-blue hover:text-tutor-blue-dark font-medium"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
