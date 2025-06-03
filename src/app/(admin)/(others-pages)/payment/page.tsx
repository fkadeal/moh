"use client";
import CheckoutInterface from "@/components/CheckoutInterface";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Checkout | MOH",
  description:
    "Checkout",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Checkout" />
      <CheckoutInterface />
    </div>
  );
}
