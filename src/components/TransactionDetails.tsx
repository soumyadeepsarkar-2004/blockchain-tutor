
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, AlertTriangle } from "lucide-react";
import { formatAddress, estimateGasFee } from "@/utils/blockchain";
import { NETWORKS } from "@/context/BlockchainContext";

interface TransactionDetailsProps {
  price: number;
  network: keyof typeof NETWORKS;
  walletAddress?: string | null;
}

const TransactionDetails = ({ price, network, walletAddress }: TransactionDetailsProps) => {
  const estimatedGas = estimateGasFee(price);
  
  return (
    <Card className="mt-6 bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Transaction Details</CardTitle>
        <CardDescription>Estimated blockchain interaction details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span>Network</span>
          </div>
          <span className="font-medium">{NETWORKS[network].name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Estimated Gas Fee</span>
          </div>
          <span className="font-medium">{estimatedGas} ETH</span>
        </div>
        
        {walletAddress && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>From</span>
            </div>
            <span className="font-medium">{formatAddress(walletAddress)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-2 text-amber-600 bg-amber-50 p-2 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-xs">This is a testnet transaction. No real ETH will be spent.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
