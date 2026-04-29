import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = {
  username: "",
  email: "",
  dateOfBirth: "",
};

function formatBirthday(dateIso) {
  const date = new Date(dateIso);
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function App() {
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const celebrantCount = useMemo(() => users.length, [users.length]);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not fetch celebrants.");
      }
      setUsers(data.users || []);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setNotice({ type: "", message: "" });
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to save user.");
      }

      setForm(emptyForm);
      setNotice({ type: "success", message: "Celebrant added successfully." });
      await loadUsers();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Birthday Reminder App</p>
        <h1>Never miss a birthday celebration again</h1>
        <p className="lead">
          Add users once and let the backend run a 7:00 AM daily check to send
          birthday wishes automatically.
        </p>
        <div className="stats">
          <span>{celebrantCount}</span>
          <p>People currently enrolled for birthday wishes</p>
        </div>
      </header>

      <main className="layout">
        <section className="card">
          <h2>Add celebrant</h2>
          <p className="muted">
            Capture only the essentials: username, unique email, and date of birth.
          </p>

          <form className="form" onSubmit={onSubmit}>
            <label>
              Username
              <input
                required
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="e.g. Ada"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="e.g. ada@example.com"
              />
            </label>
            <label>
              Date of Birth
              <input
                required
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={onChange}
              />
            </label>
            <button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save Celebrant"}
            </button>
          </form>

          {notice.message ? (
            <p className={`notice ${notice.type}`}>{notice.message}</p>
          ) : null}
        </section>

        <section className="card">
          <div className="row">
            <h2>Saved celebrants</h2>
            <button type="button" className="secondary" onClick={loadUsers}>
              Refresh
            </button>
          </div>

          {isLoading ? <p className="muted">Loading celebrants...</p> : null}

          {!isLoading && users.length === 0 ? (
            <p className="muted">No celebrants yet. Add your first one.</p>
          ) : null}

          <ul className="list">
            {users.map((user) => (
              <li key={user._id}>
                <div>
                  <p className="name">{user.username}</p>
                  <p className="muted">{user.email}</p>
                </div>
                <p className="date">{formatBirthday(user.dateOfBirth)}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
