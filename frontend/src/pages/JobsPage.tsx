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

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await apiClient.post("/jobs", {
        company,
        role,
        status,
        followUpDate: followUpDate || null,
      });
      setCompany("");
      setRole("");
      setStatus("");
      setFollowUpDate("");
      await fetchJobs();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Jobs</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Company
            <br />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Role
            <br />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Status
            <br />
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Follow Up Date
            <br />
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Job</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Follow Up Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.company}</td>
                <td>{job.role}</td>
                <td>{job.status}</td>
                <td>{job.followUpDate ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default JobsPage;
