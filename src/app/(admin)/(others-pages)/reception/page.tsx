// "use client";
import ReceptionInterface from "@/components/ReceptionInterface";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
 title: "Reception | MOH",
  description:
    " ",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reception" />
      <ReceptionInterface />
    </div>
  );
}
