"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminDashboard from "@/components/dashboards/AdminDashboard";
import TechnicianDashboard from "@/components/dashboards/TechnicianDashboard";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  switch (user.role) {
    case "administrator":
      return <AdminDashboard />;
    case "technician":
      return <TechnicianDashboard />;
    case "customer":
      return <CustomerDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>No dashboard available for this role.</p>
        </div>
      );
  }
}