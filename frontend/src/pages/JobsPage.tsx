import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

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

interface Job {
  id: number;
  company: string;
  role: string;
  status: string;
  ownerUsername: string;
  followUpDate: string | null;
}

const cardStyle: React.CSSProperties = {
  maxWidth: 1400,
  margin: "40px auto",
  padding: 32,
  backgroundColor: "#ffffff",
  color: "#1e293b",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const fieldWrapperStyle: React.CSSProperties = { marginBottom: 16 };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  color: "#1e293b",
  boxSizing: "border-box",
  marginTop: 4,
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  marginLeft: 8,
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  marginLeft: 8,
};

function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  type SortKey = "company" | "role" | "status" | "followUpDate";
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await apiClient.get("/jobs");
      setJobs(response.data);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: number) => {
    setErrorMessage("");
    try {
      await apiClient.delete(`/jobs/${id}`);
      await fetchJobs();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to delete job");
    }
  };

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStatus("");
    setFollowUpDate("");
    setEditingJobId(null);
  };

  const handleEditClick = (job: Job) => {
    setEditingJobId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setFollowUpDate(job.followUpDate ?? "");
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (editingJobId !== null) {
        await apiClient.put(`/jobs/${editingJobId}`, {
          company,
          role,
          status,
          followUpDate: followUpDate || null,
        });
      } else {
        await apiClient.post("/jobs", {
          company,
          role,
          status,
          followUpDate: followUpDate || null,
        });
      }
      resetForm();
      await fetchJobs();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          (editingJobId !== null ? "Failed to update job" : "Failed to create job")
      );
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const dueFollowUps = jobs.filter((job) => job.followUpDate && job.followUpDate <= today);

  const isDuplicate =
    company.trim() !== "" &&
    role.trim() !== "" &&
    jobs.some(
      (job) =>
        job.id !== editingJobId &&
        job.company.trim().toLowerCase() === company.trim().toLowerCase() &&
        job.role.trim().toLowerCase() === role.trim().toLowerCase()
    );

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === "" || job.status === statusFilter;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      job.company.toLowerCase().includes(term) ||
      job.role.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const visibleJobs = [...filteredJobs].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey] ?? "";
    const bValue = b[sortKey] ?? "";
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleExportCsv = () => {
    const headers = ["Company", "Role", "Status", "Follow Up Date"];
    const rows = visibleJobs.map((job) => [
      job.company,
      job.role,
      job.status,
      job.followUpDate ?? "",
    ]);
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-applications-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: "#dc2626" }}>💼 Jobs</h2>

      {dueFollowUps.length > 0 && (
        <div
          style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            color: "#92400e",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          ⏰ You have {dueFollowUps.length} follow-up{dueFollowUps.length > 1 ? "s" : ""} due:{" "}
          {dueFollowUps.map((job) => `${job.company} (${job.role})`).join(", ")}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={fieldWrapperStyle}>
          <label>
            Company
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={fieldWrapperStyle}>
          <label>
            Role
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={fieldWrapperStyle}>
          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
        </div>
        <div style={fieldWrapperStyle}>
          <label>
            Follow Up Date
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
        {isDuplicate && (
          <p style={{ color: "#b45309", marginBottom: 8, fontWeight: 600 }}>
            ⚠️ You already have an application for {role} at {company}. Submitting will add a
            second one.
          </p>
        )}

        <button type="submit" style={primaryButtonStyle}>
          {editingJobId !== null ? "Update Job" : "Add Job"}
        </button>
        {editingJobId !== null && (
          <button type="button" onClick={handleCancelEdit} style={secondaryButtonStyle}>
            Cancel
          </button>
        )}
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, maxWidth: 280, marginTop: 0 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...inputStyle, maxWidth: 180, marginTop: 0 }}
        >
          <option value="">All statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        {jobs.length > 0 && (
          <button type="button" onClick={handleExportCsv} style={secondaryButtonStyle}>
            ⬇ Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p style={{ padding: 16, color: "#64748b", textAlign: "center" }}>
          You haven't added any applications yet — add your first one above to get started.
        </p>
      ) : (
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("company")}>
                  Company{sortIndicator("company")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("role")}>
                  Role{sortIndicator("role")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                  Status{sortIndicator("status")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("followUpDate")}>
                  Follow Up Date{sortIndicator("followUpDate")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>{job.role}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(job.status) }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>{job.followUpDate ?? "-"}</td>
                  <td>
                    <button type="button" onClick={() => handleEditClick(job)} style={editButtonStyle}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleJobs.length === 0 && (
            <p style={{ padding: 16, color: "#64748b" }}>No jobs match your search/filter.</p>
          )}
        </div>
      )}

      <button
        type="button"
        className="dashboard-fab"
        onClick={() => navigate("/dashboard")}
      >
        📊 Dashboard
      </button>
    </div>
  );
}

export default JobsPage;
