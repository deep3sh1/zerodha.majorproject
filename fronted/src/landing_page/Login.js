import React, { useState } from "react";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username/email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      // Parse JSON safely
      const data = await res.json().catch(() => null);

      if (!data) {
        alert("Server returned an unexpected response. Check backend.");
        return;
      }

      if (res.ok && data.token) {
        // Save user info and token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // Redirect to dashboard (port 3001)
        window.location.href = `http://localhost:3001?token=${data.token}&username=${data.user.username}`;
      } else {
        alert(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-lg rounded-4 p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Login to Your Account</h2>
          <p className="text-muted">Start your investment journey</p>
        </div>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-muted mt-3 mb-0">
          Don't have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
