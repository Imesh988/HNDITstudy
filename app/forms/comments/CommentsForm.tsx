'use client';

import React, { useEffect, useState } from "react";
import { CommAPI } from "../../../services/api";
import { toast, Toaster } from 'react-hot-toast';
import type { Comm } from "@/type/Comm";
import { User, MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';
import { FaComment, FaVideo } from "react-icons/fa";
import { RiLogoutCircleLine, RiUserCommunityFill } from "react-icons/ri";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import CommentsList from "./commentList";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function CommentsForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Comm>({
        name: "",
        comment: ""
    });
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const router = useRouter();

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser);
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Update form name when user changes
    useEffect(() => {
        if (user) {
            const displayName = user.displayName || user.email?.split('@')[0] || '';
            if (displayName) {
                setFormData(prev => ({
                    ...prev,
                    name: displayName
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                name: ""
            }));
        }
    }, [user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleCommentSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = formData.name.trim();
        const trimmedComment = formData.comment.trim();

        if (!trimmedName) {
            toast.error("Please enter your name");
            return;
        }

        if (trimmedName.length < 2) {
            toast.error("Name must be at least 2 characters long");
            return;
        }

        if (trimmedName.length > 50) {
            toast.error("Name must be less than 50 characters");
            return;
        }

        if (!trimmedComment) {
            toast.error("Please write your feedback before submitting");
            return;
        }

        if (trimmedComment.length < 5) {
            toast.error("Please write at least 5 characters for your feedback");
            return;
        }

        if (trimmedComment.length > 500) {
            toast.error("Feedback must be less than 500 characters");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Submitting your feedback...");

        try {
            const userEmail = user?.email || '';
            // Save email in the name field with format: "Name [email@example.com]"
            const nameWithEmail = userEmail ? `${trimmedName} [${userEmail}]` : trimmedName;
            
            await CommAPI.create({
                name: nameWithEmail, 
                comment: trimmedComment
            });

            toast.dismiss(loadingToast);
            toast.success("🎉 Thank you for your valuable feedback!");

            // Reset form
            if (user) {
                const displayName = user.displayName ?? user.email?.split('@')[0] ?? '';
                setFormData({ name: displayName, comment: "" });
            } else {
                setFormData({ name: "", comment: "" });
            }

            setRefreshTrigger(prev => prev + 1);

        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.error('Error submitting feedback:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const Navbar = () => {
        return (
           <nav className="flex items-center justify-between px-6 md:px-8 py-3 bg-white/70 backdrop-blur-md sticky top-4 z-50 max-w-6xl mx-auto rounded-full border border-indigo-50 shadow-lg mt-4">

        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="hidden sm:block font-bold text-slate-800 text-lg">IT<span className="text-indigo-600">Study</span></span>
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-6">

          <div className="hidden md:flex items-center gap-4 border-r border-gray-200 pr-6">
            <Link href="/forms/comments">
              <div className="cursor-pointer group">
                <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-all duration-300">
                  <FaComment className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                </div>
              </div>
            </Link>

            
            <Link href="/forms/video">
            <div className="cursor-pointer group">
              <div className="p-2.5 bg-rose-50 rounded-xl group-hover:bg-rose-600 transition-all duration-300">
                <FaVideo className="w-5 h-5 text-rose-600 group-hover:text-white" />
              </div>
            </div>
            </Link>

            <Link href="/dashboard">
              <div className="cursor-pointer group">
                <div className="p-2.5 bg-gray-100 rounded-xl group-hover:bg-gray-400 transition-all duration-300">
                  <MdDashboard className="w-5 h-5 text-gray-700 group-hover:text-white" />
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3 pl-2">
            <div className="flex flex-col items-end hidden lg:flex">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user?.displayName || 'Guest User'}
              </span>
              <span className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">Student</span>
            </div>

            <div className="bg-indigo-100 p-2 rounded-full border-2 border-white shadow-sm">
              <RiUserCommunityFill className="w-6 h-6 text-indigo-600 cursor-pointer" />
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
            >
              <RiLogoutCircleLine className="w-7 h-7" />
            </button>
          </div>

        </div>
      </nav>
        )
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <>
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden font-sans">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-l from-rose-100/20 to-orange-100/20 rounded-full blur-[100px] animate-bounce-slow" />

                <Toaster />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Left side - Feedback Form */}
                        <div className="flex-1 w-full">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

                                <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                                Student <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Feedback</span>
                                            </h2>
                                        </div>
                                        <div className="bg-indigo-50 p-3 rounded-2xl">
                                            <Sparkles className="text-indigo-600" size={24} />
                                        </div>
                                    </div>

                                    <form onSubmit={handleCommentSave} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                                                <User size={16} className="text-indigo-500" /> Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                                maxLength={50}
                                            />
                                            {user && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    ✓ Using your account: {user.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-indigo-500" /> Your Message
                                            </label>
                                            <textarea
                                                name="comment"
                                                value={formData.comment}
                                                onChange={handleInputChange}
                                                placeholder="What did you learn today?"
                                                rows={4}
                                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                                                maxLength={500}
                                            />
                                            <div className="flex justify-end">
                                                <span className="text-xs text-gray-400">
                                                    {formData.comment.length}/500
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Post Feedback</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Comments List - Shows ONLY logged in user's comments */}
                        <div className="lg:w-[450px] w-full">
                            <div className="sticky top-24">
                                <CommentsList
                                    refreshTrigger={refreshTrigger}
                                    currentUserEmail={user?.email || ''}
                                    isLoggedIn={!!user}
                                    onCommentUpdate={() => {
                                        setRefreshTrigger(prev => prev + 1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}