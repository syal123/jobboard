import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  deletedJobsCount: number;
  editedJobsCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  Applied: "#2563eb",
  Interview: "#f97316",
  Offer: "#16a34a",
  Rejected: "#dc2626",
};

const DEFAULT_STATUS_COLOR = "#64748b";

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
}

const cardStyle: React.CSSProperties = {
  maxWidth: "100%",
  margin: "24px 0",
  padding: 32,
  backgroundColor: "#ffffff",
  color: "#1e293b",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#dc2626",
  margin: "0 0 12px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "16px 20px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
};

const rowListStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  overflow: "hidden",
};

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const [summaryResponse, jobsResponse] = await Promise.all([
          apiClient.get("/dashboard"),
          apiClient.get("/jobs"),
        ]);
        setSummary(summaryResponse.data);
        setAllJobs(jobsResponse.data);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: "#dc2626" }}>📊 Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: "#dc2626" }}>📊 Dashboard</h2>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  const statusChartData = summary
    ? [
        ...Object.entries(summary.statusCounts).map(([status, count]) => ({ status, count })),
        { status: "Edited", count: summary.editedJobsCount },
        { status: "Deleted", count: summary.deletedJobsCount },
      ]
    : [];

  const filteredJobs =
    selectedFilter === null
      ? []
      : selectedFilter === "ALL"
      ? allJobs
      : allJobs.filter((job) => job.status === selectedFilter);

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 24, color: "#dc2626" }}>
        📊 Dashboard
      </h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
        <div
          className="stat-card-clickable"
          style={{
            ...statCardStyle,
            minWidth: 180,
          }}
          onClick={() => setSelectedFilter("ALL")}
        >
          <div style={{ fontSize: 36, fontWeight: 700, color: "#0f172a" }}>
            {summary?.totalApplications}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Total Applications</div>
        </div>

        {summary &&
          Object.entries(summary.statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="stat-card-clickable"
              style={{
                ...statCardStyle,
                minWidth: 140,
                borderTop: `3px solid ${getStatusColor(status)}`,
              }}
              onClick={() => setSelectedFilter(status)}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: getStatusColor(status) }}>
                {count}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{status}</div>
            </div>
          ))}

        <div
          style={{
            ...statCardStyle,
            minWidth: 140,
            borderTop: "3px solid #d97706",
            cursor: "default",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#d97706" }}>
            {summary?.editedJobsCount}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Edited Jobs</div>
        </div>

        <div
          style={{
            ...statCardStyle,
            minWidth: 140,
            borderTop: "3px solid #64748b",
            cursor: "default",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#64748b" }}>
            {summary?.deletedJobsCount}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Deleted Jobs</div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={sectionHeadingStyle}>Applications by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="status" stroke="#334155" tick={{ fill: "#334155" }} />
            <YAxis allowDecimals={false} stroke="#334155" tick={{ fill: "#334155" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              labelStyle={{ color: "#1e293b" }}
              itemStyle={{ color: "#1e293b" }}
            />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: selectedFilter !== null ? 32 : 0 }}>
        <h3 style={sectionHeadingStyle}>Upcoming Follow Ups</h3>
        {summary && summary.upcomingFollowUps.length > 0 ? (
          <div style={rowListStyle}>
            {summary.upcomingFollowUps.map((job, index) => (
              <div
                key={job.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom:
                    index === summary.upcomingFollowUps.length - 1 ? "none" : "1px solid #e2e8f0",
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{job.company}</span>
                  <span style={{ color: "#64748b" }}> — {job.role}</span>
                </div>
                <div style={{ color: "#334155" }}>{job.followUpDate ?? "-"}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#64748b" }}>No upcoming follow ups.</p>
        )}
      </div>

      {selectedFilter !== null && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3 style={{ ...sectionHeadingStyle, margin: 0 }}>
              Showing: {selectedFilter === "ALL" ? "All Applications" : `${selectedFilter} Applications`}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedFilter(null)}
              style={{
                backgroundColor: "#f1f5f9",
                color: "#1e293b",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Clear filter
            </button>
          </div>
          {filteredJobs.length > 0 ? (
            <div style={rowListStyle}>
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom:
                      index === filteredJobs.length - 1 ? "none" : "1px solid #e2e8f0",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{job.company}</span>
                    <span style={{ color: "#64748b" }}> — {job.role}</span>
                  </div>
                  <div style={{ color: "#334155" }}>
                    {job.status} · {job.followUpDate ?? "-"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>No matching applications.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
