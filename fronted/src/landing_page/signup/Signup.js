import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Replace with your deployed backend URL
  const API_URL = "https://zerodha-majorproject-dashboard.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Signup successful!");
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard (frontend URL) after signup
        window.location.href = `https://zerodha-majorproject-dashboard.onrender.com/dashboard?token=${data.token}`;
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white px-4">
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full items-center">
        <div className="hidden md:flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            Invest in everything
          </h1>
          <p className="text-slate-600 text-lg">
            Online platform to invest in stocks, derivatives, mutual funds, and more.
          </p>
          <div className="flex gap-4">
            <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-xl text-sm font-medium">Simple</span>
            <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-xl text-sm font-medium">Secure</span>
            <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-xl text-sm font-medium">Fast</span>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border w-full">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1">Start your investment journey today</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full rounded-xl text-base py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold mt-2"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-2">
              Already have an account?{" "}
              <span
                className="text-sky-600 cursor-pointer hover:underline"
                onClick={() => navigate("/Login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

