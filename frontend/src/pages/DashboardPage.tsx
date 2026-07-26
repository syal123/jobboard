import { useEffect, useState } from "react";
import apiClient from "../api/client";

interface Job {
  id: number;
  company: string;
  role: string;
  status: string;
  ownerUsername: string;
  followUpDate: string | null;
}

interface DashboardSummary {
  totalApplications: number;
  statusCounts: Record<string, number>;
  upcomingFollowUps: Job[];
}

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await apiClient.get("/dashboard");
        setSummary(response.data);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>Dashboard</h2>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Dashboard</h2>

      <p>Total Applications: {summary?.totalApplications}</p>

      <h3>Status Counts</h3>
      <ul>
        {summary && Object.entries(summary.statusCounts).map(([status, count]) => (
          <li key={status}>
            {status}: {count}
          </li>
        ))}
      </ul>

      <h3>Upcoming Follow Ups</h3>
      <ul>
        {summary?.upcomingFollowUps.map((job) => (
          <li key={job.id}>
            {job.company} - {job.role} - {job.followUpDate ?? "-"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
