"use client";
import DoctorInterface from "@/components/DoctorInterface";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Doctors | MOH",
  description: "", // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Doctor " />
      <DoctorInterface />
      {/* <h1>hello</h1> */}
    </div>
  );
}
