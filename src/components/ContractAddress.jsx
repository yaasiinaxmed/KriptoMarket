import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check } from 'lucide-react';

const ContractAddress = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Contract address copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Contract Address:</h3>
      <div className="flex items-center bg-gray-700 p-2 rounded">
        <p className="break-all mr-2 text-sm flex-grow">{address}</p>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-600"
          onClick={() => copyToClipboard(address)}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ContractAddress;
