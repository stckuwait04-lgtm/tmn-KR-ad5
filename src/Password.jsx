import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverRoute } from "./App";

export default function Password() {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("step1Auth")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverRoute}/admin/second-auth/verify`,
        { password },
      );
      const randomToken = Math.random().toString(36).slice(2);
      localStorage.setItem("token", randomToken);
      localStorage.setItem(
        "adminAuthVersion",
        String(data?.authVersion ?? 0),
      );
      return navigate("/");
    } catch {
      setErrorMsg("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center md:justify-start flex-col gap-y-5 py-5 h-screen">
      <img src="/logo.ico" alt="logo" className="w-16" />
      <h3 className="mb-4 font-bold text-xl text-center">Tameen Dashboard</h3>
      <form onSubmit={handleSubmit} className="md:w-1/3 w-10/12">
        {errorMsg && (
          <div className="w-full text-center text-red-500" role="alert">
            {errorMsg}
          </div>
        )}
        <div className="mb-3 flex flex-col gap-y-4">
          <label className="text-xl">Password</label>
          <input
            type="password"
            className="form-control bg-gray-100 rounded-lg text-lg p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
