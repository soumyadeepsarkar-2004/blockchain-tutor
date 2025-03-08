
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Check, 
  Clipboard, 
  Copy, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { toast } from 'sonner';

const SmartContractDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoComplete, setIsDemoComplete] = useState(false);

  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TutorSession {
    address public tutor;
    address public student;
    uint256 public sessionPrice;
    uint256 public sessionTime;
    bool public completed;
    bool public refunded;
    
    event SessionScheduled(address student, address tutor, uint256 time);
    event SessionCompleted(address student, address tutor);
    event SessionRefunded(address student, address tutor);
    
    constructor(address _tutor, uint256 _sessionTime, uint256 _price) {
        tutor = _tutor;
        sessionTime = _sessionTime;
        sessionPrice = _price;
        student = msg.sender;
        completed = false;
        refunded = false;
        
        emit SessionScheduled(student, tutor, sessionTime);
    }
    
    function completeSession() external {
        require(msg.sender == student, "Only student can mark as complete");
        require(!completed, "Session already completed");
        require(!refunded, "Session was refunded");
        
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
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const simulateTransaction = () => {
    setIsProcessing(true);
    
    toast.info("Processing blockchain transaction...", {
      description: "Connecting to the network and initializing smart contract",
    });
    
    // Simulate blockchain processing time
    setTimeout(() => {
      toast.success("Session booked successfully!", {
        description: "Transaction confirmed. Smart contract deployed at 0x7bE8....5c2F",
      });
      setIsProcessing(false);
      setIsDemoComplete(true);
    }, 3000);
  };

  return (
    <section className="py-16 px-6 bg-tutor-neutral">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-sm font-medium bg-tutor-blue/10 text-tutor-blue rounded-full">
            Blockchain in Action
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Smart Contracts for <span className="text-gradient">Secure Learning</span>
          </h2>
          <p className="max-w-2xl mx-auto text-tutor-neutral-dark mb-8">
            Our platform uses blockchain smart contracts to ensure transparent, secure, and automated tutoring sessions. Try our interactive demo below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contract code display */}
          <div className="glass-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Code size={18} className="text-tutor-blue" />
                TutorSession Smart Contract
              </h3>
              <button 
                onClick={copyToClipboard}
                className="text-sm flex items-center gap-1 text-tutor-neutral-dark hover:text-tutor-blue transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check size={14} className="text-tutor-success" />
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
              <pre className="text-xs md:text-sm bg-black/80 rounded-lg p-4 overflow-x-auto text-white">
                <code>{contractCode}</code>
              </pre>
            </div>
          </div>
          
          {/* Demo interaction panel */}
          <div className="glass-card overflow-hidden">
            <div className="bg-gradient-to-r from-tutor-blue to-tutor-blue-dark text-white p-6">
              <h3 className="font-bold text-xl mb-2">Demo: Book a Tutor Session</h3>
              <p className="text-white/80 text-sm">
                Experience how blockchain secures and automates the tutoring process
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-tutor-blue/10 flex items-center justify-center text-tutor-blue shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Selected Session</h4>
                    <p className="text-sm text-tutor-neutral-dark">
                      Introduction to Blockchain Development with Michael Chen
                    </p>
                    <p className="text-sm text-tutor-neutral-dark mt-1">
                      Tomorrow at 3:00 PM (60 minutes)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-tutor-blue/10 flex items-center justify-center text-tutor-blue shrink-0 mt-0.5">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Payment Details</h4>
                    <p className="text-sm text-tutor-neutral-dark">
                      Session Fee: <span className="font-medium">$75.00</span>
                    </p>
                    <p className="text-sm text-tutor-neutral-dark mt-1">
                      Payment secured by smart contract. Funds are only released when you mark the session as complete.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  {isDemoComplete ? (
                    <div className="bg-tutor-success/10 text-tutor-success rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Check size={18} />
                        Transaction Successful
                      </div>
                      <p className="text-sm">
                        Your session has been booked. The smart contract has been deployed to the blockchain.
                      </p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-tutor-blue hover:bg-tutor-blue-dark h-12"
                      onClick={simulateTransaction}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </div>
                      ) : (
                        <>Deploy Smart Contract</>
                      )}
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-tutor-neutral-dark mt-3">
                    This is a demo. No actual blockchain transaction will be performed.
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
