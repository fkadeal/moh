"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Smartphone,
  QrCode,
  Wallet,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "ussd", name: "USSD", icon: Smartphone },
  { id: "qr", name: "QR Code", icon: QrCode },
  { id: "wallet", name: "Mobile Wallet", icon: Wallet },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "agent", name: "Agent", icon: Users },
];

const CheckoutInterface = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem("paymentData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleInitiatePayment = async () => {
     window.open("https://checkout.birrlink.et/checkout/BL-c89b9e74-065b-41ad-ac91-80bf371eab87", "_blank");
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number for payment",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("https://api.birrlink.et/api/v1/payments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": "dTY1mcrRJq65OuPeLBdIo_QLtGUi7nshfSGEtISUCkE",
  },
  body: JSON.stringify({
    amount: data.total,
    currency: "ETB",
    phone_number: phoneNumber,
    title: `Lab Tests Payment - ${data.patientName} (${data.visitId})`,
  }),
});


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const paymentResponse = await response.json();

      if (
        paymentResponse.status === "success" &&
        paymentResponse.redirect_url
      ) {
        const paymentRecord = {
          billId: data.billId,
          visitId: data.visitId,
          patientName: data.patientName,
          amount: data.total,
          paymentMethod: selectedPaymentMethod,
          phoneNumber,
          status: "initiated",
          timestamp: new Date().toISOString(),
          services: data.services
            .map((service: any) => service.name)
            .join(", "),
          redirectUrl: paymentResponse.redirect_url,
        };

        const existingPayments = JSON.parse(
          localStorage.getItem("payments") || "[]"
        );
        existingPayments.push(paymentRecord);
        localStorage.setItem("payments", JSON.stringify(existingPayments));

        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment page...",
        });

       
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error initiating the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No payment data available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Bill ID:</strong> {data.billId}
                </div>
                <div>
                  <strong>Visit ID:</strong> {data.visitId}
                </div>
                <div>
                  <strong>Patient Name:</strong> {data.patientName}
                </div>
                <div>
                  <strong>Generated:</strong>{" "}
                  {data.generatedAt
                    ? new Date(data.generatedAt).toLocaleString()
                    : "N/A"}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Services:</h4>
                <div className="space-y-2">
                  {data.services?.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span>{service.name}</span>
                      <span>{service.price} ETB</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">{data.total} ETB</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., 251977777777)"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent className="  bg-white">
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center">
                        <method.icon className="w-4 h-4 mr-2" />
                        {method.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
 
            </div>

            <Button
              onClick={handleInitiatePayment}
              disabled={
                !selectedPaymentMethod || !phoneNumber || processing
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            >
              {processing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Initiate Payment - ${data.total} ETB`
              )}
            </Button>

            {selectedPaymentMethod && phoneNumber && (
              <div className="text-sm text-gray-600 text-center">
                Payment will be processed via{" "}
                {
                  paymentMethods.find(
                    (m) => m.id === selectedPaymentMethod
                  )?.name
                }{" "}
                to {phoneNumber}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutInterface;
