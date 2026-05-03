// app/(auth)/register/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerWithEmail } from "@/lib/firebase/auth";
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Real-time validation
  useEffect(() => {
    const newErrors: typeof errors = {};
    
    // Name validation
    if (name && name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name && name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }
    
    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }



    
    // if (password) {
    //   if (password.length < 6) {
    //     newErrors.password = "Password must be at least 6 characters";
    //   } else  (password.length > 50) {
    //     newErrors.password = "Password must be less than 50 characters";
    //   } 
      
    // }
    
    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
  }, [name, email, password, confirmPassword]);

  const validateForm = (): boolean => {
  const newErrors: typeof errors = {};
  let isValid = true;
  
  if (!name || name.trim() === "") {
    newErrors.name = "Full name is required";
    isValid = false;
  } else if (name.trim().length < 2) {
    newErrors.name = "Name must be at least 2 characters";
    isValid = false;
  } else if (name.trim().length > 50) {
    newErrors.name = "Name must be less than 50 characters";
    isValid = false;
  }
  
  if (!email) {
    newErrors.email = "Email address is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email address";
    isValid = false;
  }
  
  if (!password) {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    isValid = false;
  } else if (password.length > 50) {
    newErrors.password = "Password must be less than 50 characters";
    isValid = false;
  }
  
  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
    isValid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }
  
  setErrors(newErrors);
  return isValid;
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error("Please fix the errors in the form", { position: "top-center" });
    return;
  }
  
  setLoading(true);
  
  const trimmedName = name.trim();
  const result = await registerWithEmail(email, password, trimmedName);
  
  if (result.success) {
    toast.success(result.message || "Account created successfully!", { position: "top-center" });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } else {
    let errorMessage = "";
    
    if (result.message.includes("email-already-in-use")) {
      errorMessage = "This email is already registered. Please login instead.";
    } else if (result.message.includes("invalid-email")) {
      errorMessage = "Invalid email format. Please check your email address.";
    } else if (result.message.includes("weak-password")) {
      errorMessage = "Password is too weak. Please use a stronger password.";
    } else {
      errorMessage = result.message || "Registration failed. Please try again.";
    }
    
    toast.error(errorMessage, { position: "top-center" });
    setLoading(false);
  }
};

  const getInputStyle = (fieldName: keyof typeof errors) => {
    return errors[fieldName] 
      ? "w-full p-3.5 bg-white border border-red-300 rounded-xl mt-1 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all shadow-sm"
      : "w-full p-3.5 bg-white border border-gray-100 rounded-xl mt-1 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm";
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col font-sans">
      <Toaster />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
          
          <div className="hidden md:flex md:w-1/2 bg-[#1a1a4d] relative p-12 flex-col justify-end text-white overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80" 
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

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#fbfcff]">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-2xl font-bold text-[#1a1a4d] mb-2">Create Account</h1>
              <p className="text-gray-500 text-sm mb-6">Join our community and start your learning journey today.</p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 ml-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={getInputStyle('name')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 ml-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={getInputStyle('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 ml-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={getInputStyle('password')}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 ml-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={getInputStyle('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {password && !errors.password && password.length > 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                    ✓ Password meets requirements
                  </div>
                )}
                
                {password && password.length > 0 && !errors.password && password.length < 6 && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                    ℹ️ Password must be at least 6 characters
                  </div>
                )}

                <button
                  type="submit"
                 
                  className={`w-full bg-[#ece371] text-[#4a4512] p-4 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 mt-4 transition-all ${
                    loading || Object.keys(errors).length > 0
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-[#e2d85d]"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#4a4512]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Register to IT Academy"
                  )}
                </button>
              </form>
              
              <p className="text-center mt-8 text-gray-500 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-800 font-bold hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}