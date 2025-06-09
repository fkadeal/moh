import LineChartOne from "@/components/charts/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Report | MOH",
  description:
    "",
};
export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Appointment" />
      <div className="space-y-6">
        <ComponentCard title="Your Appointments">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
