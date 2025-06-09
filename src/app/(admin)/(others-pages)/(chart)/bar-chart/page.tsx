import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Revenue | MOH",
  description:
    "",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Revenue" />
      <div className="space-y-6">
        <ComponentCard title="Revenue BirrLink channel">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
