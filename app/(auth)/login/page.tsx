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

      if (email === "admin@gmail.com" && password === "admin123") {
      // Set admin session
      localStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('adminSession', Date.now().toString());
      window.location.href = "/admin";
      return;
    }
    
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Login successful!");
      console.log("Email verified:", user.emailVerified);
      
      if (!user.emailVerified) {
        setError("Please verify your email first. Check your spam folder.");
        setLoading(false);
        return;
      }
      
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
          <div className="min-h-screen bg-[#f8faff] flex flex-col font-sans">
      
      

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
          
          <div className="hidden md:flex md:w-1/2 bg-[#1a1a4d] relative p-12 flex-col justify-end text-white overflow-hidden">
            <div className="absolute inset-0 opacity-40">
                <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80" 
                    alt="Coding" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a4d] to-transparent"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Improve Your IT Skills
              </h2>
              
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#fbfcff]">
            
            {!showReset ? (
              <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-[#1a1a4d] mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm mb-8">Please enter your details to access your learning dashboard.</p>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs border border-red-100">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-100 rounded-xl mt-1 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-semibold text-gray-600">Password</label>
                      <button 
                        type="button" 
                        onClick={() => setShowReset(true)}
                        className="text-[10px] font-bold text-blue-800 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-100 rounded-xl mt-1 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ece371] text-[#4a4512] p-4 rounded-xl hover:bg-[#e2d85d] transition-colors font-bold shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? "Signing in..." : "Login to Dashboard →"}
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                  </div>

                 
                </form>
                
                <p className="text-center mt-8 text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <a href="/register" className="text-blue-800 font-bold hover:underline">
                    Register
                  </a>
                </p>
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto animate-fade-in">
                <h1 className="text-2xl font-bold text-[#1a1a4d] mb-4">Reset Password</h1>
                
                {resetMessage && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4 text-sm border border-green-100">
                    {resetMessage}
                  </div>
                )}
                
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-[#1a1a4d] text-white p-4 rounded-xl hover:bg-[#252563] transition-colors font-bold shadow-lg"
                  >
                    {resetLoading ? "Sending..." : "Send Reset Email"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full mt-2 text-gray-500 hover:text-[#1a1a4d] text-sm font-medium"
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 gap-4">
        
    
      </div>
    </div>
  );
}