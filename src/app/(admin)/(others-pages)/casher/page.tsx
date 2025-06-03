"use client";

import CashierInterface from "@/components/CashierInterface";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cashier | MOH",
  description: "", 
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cashier" />
      <CashierInterface />
    </div>
  );
}
