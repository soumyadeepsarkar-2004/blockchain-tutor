import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Code, Check, Copy, Clock, DollarSign, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain, NETWORKS } from "@/context/BlockchainContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPreferredNetwork, isNetworkConfigured } from "@/utils/blockchain";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SmartContractDemo = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDemoComplete, setIsDemoComplete] = useState(false);
    const MAX_SESSION_FEE = 50000;
    const MIN_SESSION_FEE = 1;
    const [sessionFee, setSessionFee] = useState(10);
    const [ethAmount, setEthAmount] = useState(1);
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("usd");
    const [ethPrice, setEthPrice] = useState(0);
    const [warning, setWarning] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isConnected, connectWallet, currentNetwork, switchNetwork } = useBlockchain();
    const preferredNetwork = getPreferredNetwork();
    const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>(preferredNetwork);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, []);

    useEffect(() => {
        // Set the selected network to match current network when it changes
        if (currentNetwork === 'EDUCHAIN' || currentNetwork === 'SEPOLIA') {
            setSelectedNetwork(currentNetwork);
        } else {
            setSelectedNetwork(preferredNetwork);
        }
    }, [currentNetwork, preferredNetwork]);

    // Check if Sepolia is configured properly
    const isSepoliaConfigured = isNetworkConfigured('SEPOLIA');

    const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TutorSession {
    address public tutor;
    address public student;
    uint256 public sessionPrice;
    uint256 public sessionTime;
    bool public completed;
    bool public refunded;

    event SessionScheduled(address indexed student, address indexed tutor, uint256 time, uint256 price);
    event SessionCompleted(address indexed student, address indexed tutor);
    event SessionRefunded(address indexed student, address indexed tutor);

    constructor(address _tutor, uint256 _sessionTime) payable {
        require(msg.value > 0, "Payment required to schedule session");

        tutor = _tutor;
        sessionTime = _sessionTime;
        sessionPrice = msg.value;
        student = msg.sender;
        completed = false;
        refunded = false;

        emit SessionScheduled(student, tutor, sessionTime, msg.value);
    }

    function completeSession() external {
        require(msg.sender == student, "Only student can mark as complete");
        require(!completed, "Session already completed");
        require(!refunded, "Session was refunded");
        require(address(this).balance >= sessionPrice, "Insufficient funds in contract");

        completed = true;
        payable(tutor).transfer(address(this).balance);

        emit SessionCompleted(student, tutor);
    }

    function refundSession() external {
        require(
            msg.sender == tutor || 
            (msg.sender == student && block.timestamp > sessionTime + 1 days),
            "Not authorized for refund"
        );
        require(!completed, "Session already completed");
        require(!refunded, "Already refunded");

        refunded = true;
        payable(student).transfer(address(this).balance);

        emit SessionRefunded(student, tutor);
    }

    receive() external payable {}
}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(contractCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleNetworkChange = (value: string) => {
        setSelectedNetwork(value as keyof typeof NETWORKS);
    };

    const simulateTransaction = async () => {
        if (!isLoggedIn) {
            toast.error("Authentication required", {
                description: "Please login to book a session",
            });
            return;
        }
        
        // Check if we're using Sepolia and it's properly configured
        if (selectedNetwork === 'SEPOLIA' && !isSepoliaConfigured) {
            toast.error("Sepolia configuration required", {
                description: "Please set your Infura ID in the application configuration.",
            });
            return;
        }
        
        setIsProcessing(true);
        
        // Connect wallet or switch network if needed
        if (!isConnected) {
            try {
                await connectWallet(selectedNetwork);
            } catch (error) {
                toast.error("Wallet connection failed", {
                    description: "Please connect your wallet to proceed.",
                });
                setIsProcessing(false);
                return;
            }
        } else if (currentNetwork !== selectedNetwork) {
            // Switch to the selected network
            const switched = await switchNetwork(selectedNetwork);
            if (!switched) {
                toast.error("Network switch failed", {
                    description: "Please manually switch networks in your wallet.",
                });
                setIsProcessing(false);
                return;
            }
        }
        
        toast.info("Processing transaction...", {
            description: `Connecting to the ${NETWORKS[selectedNetwork].name} network`,
        });

        setTimeout(() => {
            toast.success("Session booked successfully!", {
                description: `Transaction confirmed on ${NETWORKS[selectedNetwork].name}`,
            });
            setIsProcessing(false);
            setIsDemoComplete(true);
            
            // Store booked session in local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const sessions = user.sessions || [];
            sessions.push({
                id: Date.now(),
                title: "Introduction to Blockchain Development",
                tutor: "Michael Chen",
                date: "Tomorrow at 3:00 PM",
                duration: "60 minutes",
                price: sessionFee,
                currency: selectedCurrency.toUpperCase(),
                network: NETWORKS[selectedNetwork].name,
                status: "Upcoming"
            });
            user.sessions = sessions;
            localStorage.setItem('user', JSON.stringify(user));
        }, 3000);
    };

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
            .then((res) => res.json())
            .then((data) => setCurrencies(data))
            .catch((error) => console.error("Error fetching currencies:", error));
    }, []);

    useEffect(() => {
        if (selectedCurrency) {
            fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${selectedCurrency}`
            )
                .then((res) => res.json())
                .then((data) => setEthPrice(data.ethereum[selectedCurrency]))
                .catch((error) => console.error("Error fetching ETH price:", error));
        }
    }, [selectedCurrency]);

    useEffect(() => {
        if (ethPrice > 0) {
            setEthAmount(sessionFee / ethPrice);
        } else {
            setEthAmount(0);
        }
    }, [sessionFee, ethPrice]);

    const handleSessionFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseFloat(e.target.value) || 0;

        if (value > MAX_SESSION_FEE) {
            setWarning(`Maximum allowed fee is $${MAX_SESSION_FEE}`);
            value = MAX_SESSION_FEE;
        } else if (value < MIN_SESSION_FEE) {
            setWarning(`Minimum allowed fee is $${MIN_SESSION_FEE}`);
            value = MIN_SESSION_FEE;
        } else {
            setWarning("");
        }

        setSessionFee(value);
    };

    return (
        <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block mb-6">
                        <span className="px-3 py-1 text-sm font-medium bg-[#0A84FF]/10 text-[#0A84FF] rounded-full">
                            Blockchain in Action
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                        Smart Contracts for{" "}
                        <span className="text-gradient">Secure Learning</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-[#86868b] mb-8">
                        Our platform uses blockchain smart contracts to ensure transparent, secure, and automated tutoring sessions.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Code size={18} className="text-[#0A84FF]" />
                                TutorSession Smart Contract
                            </h3>
                            <button onClick={copyToClipboard} className="text-sm flex items-center gap-1 text-[#86868b] hover:text-[#0A84FF] transition-colors">
                                {isCopied ? (
                                    <>
                                        <Check size={14} className="text-[#34C759]" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <pre className="h-[545px] text-xs md:text-sm bg-black/80 rounded-md p-4 overflow-x-auto text-white">
                                <code>{contractCode}</code>
                            </pre>
                        </div>
                    </div>
                    <div className="glass-card overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0A84FF] to-[#0055D4] text-white p-6">
                            <h3 className="font-bold text-xl mb-2">
                                Book a Session
                            </h3>
                            <p className="text-white/80 text-sm">
                                Schedule a blockchain tutoring session with payment via smart contract
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-start gap-3 flex-col">
                                    <div className="flex gap-3 items-center justify-center">
                                        <div className="h-8 w-8 rounded-full bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0 mt-0.5">
                                            <Clock size={18} />
                                        </div>
                                        <h4 className="font-medium mb-1">Selected Session</h4>
                                    </div>
                                    <div className="px-11">
                                        <p className="text-sm text-[#86868b]">
                                            Introduction to Blockchain Development with Michael Chen
                                        </p>
                                        <p className="text-sm text-[#86868b] mt-1">
                                            Tomorrow at 3:00 PM (60 minutes)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 flex-col">
                                    <div className="flex gap-3 items-center justify-center">
                                        <div className="h-8 w-8 rounded-full bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0">
                                            <Wallet size={18} />
                                        </div>
                                        <h4 className="font-medium mb-1">Network Selection</h4>
                                    </div>
                                    <div className="px-11">
                                        <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
                                            <SelectTrigger className="w-full mb-2">
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
                                        {selectedNetwork === 'SEPOLIA' && !isSepoliaConfigured && (
                                            <Alert className="mt-2 mb-2 bg-yellow-50 border-yellow-200 p-2">
                                                <AlertDescription className="text-yellow-600 text-xs">
                                                    To use Sepolia, you need to set your Infura ID in the application configuration.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <p className="text-sm text-[#86868b]">
                                            Transaction will be processed on the {NETWORKS[selectedNetwork].name} network.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 flex-col">
                                    <div className="flex gap-3 items-center justify-center">
                                        <div className="h-8 w-8 rounded-full bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0">
                                            <DollarSign size={18} />
                                        </div>
                                        <h4 className="font-medium mb-1">Payment Details</h4>
                                    </div>
                                    <div className="px-11">
                                        <div className="flex items-center">
                                            <label className="text-sm text-[#86868b]">Session Fee:</label>&nbsp;
                                            <Input type="number" className="h-[34px] p-1 border text-center rounded-md w-16" value={sessionFee} onChange={handleSessionFeeChange} min={MIN_SESSION_FEE} max={MAX_SESSION_FEE} />&nbsp;
                                            <select className="h-[34px] p-1 border rounded-md focus:outline-none" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                                                {currencies.map((currency) => (
                                                    <option key={currency} value={currency} className="text-center">
                                                        {currency.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {warning && <p className="text-red-500 text-xs mt-1">{warning}</p>}
                                        <p className="text-sm text-[#86868b] mt-1">
                                            Payment secured by smart contract. Funds are only released when you mark the session as complete.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col px-11">
                                    <h2 className="font-medium">ETH Conversion</h2>
                                    <p className="font-medium">
                                        {sessionFee} {selectedCurrency.toUpperCase()} ≈ {ethAmount.toFixed(6)} {selectedNetwork === 'EDUCHAIN' ? 'EDU' : 'ETH'}
                                    </p>
                                </div>
                                <div className="border-t border-white/20">
                                    {isDemoComplete ? (
                                        <div className="bg-[#34C759]/10 text-[#34C759] rounded-lg px-11 py-6 mb-4">
                                            <div className="flex items-center gap-2 font-medium mb-1">
                                                <Check size={18} />
                                                Transaction Successful
                                            </div>
                                            <p className="text-sm">
                                                Your session has been booked on the {NETWORKS[selectedNetwork].name} network.
                                            </p>
                                        </div>
                                    ) : (
                                        <Button className="bg-[#0A84FF] border border-[#0A84FF] hover:bg-[#0055D4] hover:border-[#0055D4] text-white h-12 block mx-auto" onClick={simulateTransaction} disabled={isProcessing}>
                                            {isProcessing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                <>Book Session</>
                                            )}
                                        </Button>
                                    )}
                                    <p className="text-xs text-center text-[#86868b] mt-3">
                                        {!isLoggedIn ? "Please login to book a session" : `By continuing, you agree to process this transaction on the ${NETWORKS[selectedNetwork].name} network`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SmartContractDemo;
