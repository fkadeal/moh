"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Stethoscope } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Type Definitions
interface Patient {
  name: string;
  age: number;
  phone: string;
  visitId: string;
  vitals?: {
    bloodPressure?: string;
    temperature?: string;
    pulse?: string;
  };
}

interface LabTest {
  id: string;
  name: string;
  price: number;
}

const labTests: LabTest[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 25 },
  { id: 'glucose', name: 'Blood Glucose', price: 15 },
  { id: 'lipid', name: 'Lipid Panel', price: 35 },
  { id: 'thyroid', name: 'Thyroid Function Test', price: 45 },
  { id: 'liver', name: 'Liver Function Test', price: 40 },
  { id: 'kidney', name: 'Kidney Function Test', price: 30 },
  { id: 'urine', name: 'Urine Analysis', price: 20 },
  { id: 'xray', name: 'Chest X-Ray', price: 60 },
];

const DoctorInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultation, setConsultation] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const { toast } = useToast();

  const patients: Patient[] = JSON.parse(localStorage.getItem('patients') || '[]');

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.visitId.includes(searchTerm)
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setConsultation('');
    setSelectedTests([]);
  };

  const handleTestChange = (testId: string, checked: boolean) => {
    setSelectedTests((prev) =>
      checked ? [...prev, testId] : prev.filter((id) => id !== testId)
    );
  };

  const handleSubmitLabOrder = () => {
    if (!selectedPatient || selectedTests.length === 0) {
      toast({
        title: "Error",
        description: "Please select a patient and at least one lab test",
        variant: "destructive"
      });
      return;
    }

    const labOrder = {
      visitId: selectedPatient.visitId,
      patientName: selectedPatient.name,
      consultation,
      tests: selectedTests.map((testId) => labTests.find((test) => test.id === testId)),
      orderDate: new Date().toISOString(),
      status: 'pending',
      total: selectedTests.reduce((sum, testId) => {
        const test = labTests.find((t) => t.id === testId);
        return sum + (test?.price || 0);
      }, 0),
    };

    const existingOrders = JSON.parse(localStorage.getItem('labOrders') || '[]');
    existingOrders.push(labOrder);
    localStorage.setItem('labOrders', JSON.stringify(existingOrders));

    toast({
      title: "Lab Order Submitted",
      description: `Order for ${selectedPatient.name} has been recorded`,
    });

    setConsultation('');
    setSelectedTests([]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Search */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search by ID, Phone, or Name</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term..."
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.visitId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?.visitId === patient.visitId
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">ID: {patient.visitId}</div>
                      <div className="text-sm text-gray-600">Phone: {patient.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Profile & Consultation */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-2" />
                Patient Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPatient ? (
                <div className="space-y-6">
                  {/* Patient Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Patient Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {selectedPatient.name}</div>
                      <div><strong>Age:</strong> {selectedPatient.age}</div>
                      <div><strong>Visit ID:</strong> {selectedPatient.visitId}</div>
                      <div><strong>Phone:</strong> {selectedPatient.phone}</div>
                    </div>
                    {selectedPatient.vitals && (
                      <div className="mt-2">
                        <strong>Vitals:</strong>
                        {selectedPatient.vitals.bloodPressure && ` BP: ${selectedPatient.vitals.bloodPressure}`}
                        {selectedPatient.vitals.temperature && ` | Temp: ${selectedPatient.vitals.temperature}°F`}
                        {selectedPatient.vitals.pulse && ` | Pulse: ${selectedPatient.vitals.pulse} BPM`}
                      </div>
                    )}
                  </div>

                  {/* Consultation Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="consultation">Consultation Notes</Label>
                    <Textarea
                      id="consultation"
                      value={consultation}
                      onChange={(e) => setConsultation(e.target.value)}
                      placeholder="Enter consultation notes, diagnosis, and treatment plan..."
                      rows={4}
                    />
                  </div>

                  {/* Lab Tests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Lab Tests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {labTests.map((test) => (
                        <div key={test.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={test.id}
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={(checked) =>
                              handleTestChange(test.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={test.id} className="text-sm">
                            {test.name} - ${test.price}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitLabOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={selectedTests.length === 0}
                  >
                    Submit Lab Order
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a patient to begin consultation
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorInterface;
