"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from 'lucide-react';

 
// const onBack = () => {
//   window.history.back();
// }


const ReceptionInterface = ( ) => {
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    age: '',
    doctorRoom: '',
    vitals: {
      bloodPressure: '',
      temperature: '',
      pulse: '',
    }
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visitId = `V${Date.now()}`;
    
    // Store patient data in localStorage for other components to access
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const newPatient = {
      ...patientData,
      visitId,
      checkInTime: new Date().toISOString(),
      status: 'checked-in'
    };
    
    existingPatients.push(newPatient);
    localStorage.setItem('patients', JSON.stringify(existingPatients));
    
    toast({
      
      title: "Patient Checked In",
      description: `Visit ID: ${visitId} - Directed to ${patientData.doctorRoom}`,
    });
    
    setPatientData({
      name: '',
      phone: '',
      age: '',
      doctorRoom: '',
      vitals: { bloodPressure: '', temperature: '', pulse: '' }
    });
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        {/* <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Reception - Visitor Check-in</h1>
        </div> */}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Patient Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Patient Name</Label>
                  <Input
                    id="name"
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                    placeholder="Enter age"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doctorRoom">Doctor/Room Assignment</Label>
                  <Input
                    id="doctorRoom"
                    value={patientData.doctorRoom}
                    onChange={(e) => setPatientData({...patientData, doctorRoom: e.target.value})}
                    placeholder="e.g., Dr. Smith - Room 101"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bp">Blood Pressure</Label>
                    <Input
                      id="bp"
                      value={patientData.vitals.bloodPressure}
                      onChange={(e) => setPatientData({
                        ...patientData, 
                        vitals: {...patientData.vitals, bloodPressure: e.target.value}
                      })}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="temp">Temperature (°F)</Label>
                    <Input
                      id="temp"
                      value={patientData.vitals.temperature}
                      onChange={(e) => setPatientData({
                        ...patientData, 
                        vitals: {...patientData.vitals, temperature: e.target.value}
                      })}
                      placeholder="e.g., 98.6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pulse">Pulse (BPM)</Label>
                    <Input
                      id="pulse"
                      value={patientData.vitals.pulse}
                      onChange={(e) => setPatientData({
                        ...patientData, 
                        vitals: {...patientData.vitals, pulse: e.target.value}
                      })}
                      placeholder="e.g., 72"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Check In Patient
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionInterface;
