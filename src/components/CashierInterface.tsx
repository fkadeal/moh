"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Calculator } from "lucide-react";

interface LabTest {
  name: string;
  price: number;
}

interface LabOrder {
  visitId: string;
  patientName: string;
  orderDate: string;
  total: number;
  tests: LabTest[];
}

interface BillData {
  billId: string;
  visitId: string;
  patientName: string;
  services: LabTest[];
  total: number;
  generatedAt: string;
}

const CashierInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("labOrders");
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders) as LabOrder[];
        setLabOrders(parsedOrders);
      } catch (error) {
        console.error("Failed to parse lab orders:", error);
      }
    }
  }, []);

  const filteredOrders = labOrders.filter((order) =>
    order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.visitId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderSelect = (order: LabOrder) => {
    setSelectedOrder(order);
  };

  const handleGenerateBill = () => {
    if (!selectedOrder) return;

    const billData: BillData = {
      billId: `B${Date.now()}`,
      visitId: selectedOrder.visitId,
      patientName: selectedOrder.patientName,
      services: selectedOrder.tests,
      total: selectedOrder.total,
      generatedAt: new Date().toISOString(),
    };

    localStorage.setItem("paymentData", JSON.stringify(billData));
    alert("Bill generated and saved to localStorage!");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Patient Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search by Name or Visit ID</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter name or visit ID..."
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredOrders.map((order, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder?.visitId === order.visitId
                          ? "bg-purple-50 border-purple-300"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="font-medium">{order.patientName}</div>
                      <div className="text-sm text-gray-600">Visit ID: {order.visitId}</div>
                      <div className="text-sm text-gray-600">
                        Tests: {order.tests.length} | Total: ${order.total}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order Date: {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && searchTerm && (
                    <div className="text-center py-4 text-gray-500">
                      No orders found for "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Bill Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Patient Information</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {selectedOrder.patientName}</div>
                      <div><strong>Visit ID:</strong> {selectedOrder.visitId}</div>
                      <div><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Tests */}
                  <div>
                    <h3 className="font-semibold mb-3">Ordered Lab Tests</h3>
                    <div className="space-y-2">
                      {selectedOrder.tests.map((test, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-white border rounded"
                        >
                          <span className="text-sm">{test.name}</span>
                          <span className="font-medium">${test.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">${selectedOrder.total}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateBill}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Generate Bill & Proceed to Payment
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a patient order to view bill details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CashierInterface;
