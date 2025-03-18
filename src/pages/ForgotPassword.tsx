
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email required", {
                description: "Please enter your email address.",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            setIsSubmitted(true);
            toast.success("Reset email sent", {
                description: "Check your inbox for password reset instructions.",
            });
        } catch (error) {
            toast.error("Request failed", {
                description: "There was a problem sending the reset email. Please try again.",
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
                        {!isSubmitted ? (
                            <>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold text-center">
                                        Forgot your password?
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        Enter your email address and we'll send you a link to reset your password
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
                                        <Button
                                            type="submit"
                                            className="w-full bg-tutor-blue hover:bg-tutor-blue-dark"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Sending reset email..." : "Send reset email"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </>
                        ) : (
                            <>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold text-center">
                                        Check your email
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        We've sent a password reset link to {email}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center space-y-4">
                                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <Mail className="h-10 w-10 text-green-600" />
                                    </div>
                                    <p className="text-center text-sm text-muted-foreground">
                                        If you don't see the email in your inbox, please check your spam folder.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send another email
                                    </Button>
                                </CardContent>
                            </>
                        )}
                        <CardFooter className="flex justify-center">
                            <Link
                                to="/login"
                                className="flex items-center gap-1 text-sm text-tutor-blue hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
