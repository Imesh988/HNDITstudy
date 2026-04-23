// app/(auth)/login/page.tsx
'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , sendPasswordResetEmail} from "firebase/auth";
import { app } from "@/lib/firebase/client";

const auth = getAuth(app);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset , setShowReset] = useState(false);
  const [resetEmail , setResetEmail] = useState("");
  const [resetMessage , setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        console.log("User already logged in, redirecting to dashboard...");
        router.replace("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Login successful!");
      console.log("Email verified:", user.emailVerified);
      
      if (!user.emailVerified) {
        setError("Please verify your email first. Check your spam folder.");
        setLoading(false);
        return;
      }
      
      // Force redirect using window.location
      console.log("Redirecting to dashboard...");
      window.location.href = "/dashboard";
      
    } catch (error: any) {
      console.error("Login error:", error.code);
      
      let message = "Login failed";
      switch(error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password";
          break;
        case "auth/user-not-found":
          message = "No account found";
          break;
        case "auth/wrong-password":
          message = "Wrong password";
          break;
        default:
          message = error.message;
      }
      setError(message);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e:React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    setResetMessage("");

    if(!resetEmail){
      setError("Please enter your email address  !!")
      setResetLoading(false)
      return
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  const handleBackToLogin = () => {
    setShowReset(false);
    setError("");
    setResetMessage("");
    setResetEmail("");
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        
        {!showReset ? (
          // LOGIN FORM
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
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
            
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Create one
              </a>
            </p>
          </>
        ) : (
          // FORGOT PASSWORD FORM
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            {resetMessage && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                {resetMessage}
              </div>
            )}
            
            <form onSubmit={handleResetPassword}>
              <p className="text-gray-600 text-sm mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <input
                type="email"
                placeholder="Email Address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {resetLoading ? "Sending..." : "Send Reset Email"}
              </button>
              
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full mt-3 text-gray-600 p-3 rounded-lg hover:text-gray-800 text-sm"
              >
                Back to Login
              </button>
            </form>
          </>
        )}
        
      </div>
    </div>
  );
}