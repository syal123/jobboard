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

const tableStyle: React.CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
};

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

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

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: "#dc2626" }}>💼 Jobs</h2>

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
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            />
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

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e2e8f0" }}>Company</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e2e8f0" }}>Role</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e2e8f0" }}>Status</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e2e8f0" }}>Follow Up Date</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e2e8f0" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>{job.company}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>{job.role}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>{job.status}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>{job.followUpDate ?? "-"}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>
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
      )}
    </div>
  );
}

export default JobsPage;
