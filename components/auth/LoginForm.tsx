// app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, resendVerificationEmail, resetPassword, getCurrentUser } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const user = getCurrentUser();
      if (user && user.emailVerified) {
        console.log("User already logged in, redirecting to dashboard...");
        window.location.href = "/dashboard"
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    const result = await loginWithEmail(email, password);
    
    console.log("Login result:", result);
    
    if (result.success) {
      setSuccess("Login successful! Redirecting to dashboard...");
      console.log("Redirecting to dashboard in 1 second...");
      
      // Use setTimeout to ensure state updates before redirect
      setTimeout(() => {
        console.log("Now redirecting to /dashboard");
        router.push("/dashboard");
      }, 1000);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    
    setLoading(true);
    const result = await resendVerificationEmail();
    
    if (result.success) {
      setSuccess(result.message);
      setError("");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      setSuccess(result.message);
      setShowReset(false);
      setResetEmail("");
      setError("");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
            {error.includes("verify") && (
              <button 
                onClick={handleResendVerification}
                className="block w-full mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                📧 Resend Verification Email
              </button>
            )}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}
        
        {!showReset ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="w-full mt-3 text-gray-600 p-3 rounded-lg hover:text-gray-800 text-sm"
            >
              Back to Login
            </button>
          </div>
        )}
        
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}