// app/(auth)/dashboard/page.tsx
'use client';

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/client";
import { ArrowRight } from "lucide-react";
import { RiUserCommunityFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaComment } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";





const auth = getAuth(app);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const HeroSection = [
    "https://static.vecteezy.com/system/resources/thumbnails/002/173/392/small/student-studying-at-home-free-vector.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUXdH-d8q7_IYe_qJHWPmDtRPyts7G07GZOw&s",
    "https://img.freepik.com/free-vector/education-learning-concept-love-reading-people-reading-students-studying-preparing-examination-library-book-lovers-readers-modern-literature-flat-cartoon-vector-illustration_1150-60938.jpg?semt=ais_hybrid&w=740&q=80"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HeroSection.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [HeroSection.length])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user, redirect to login
        router.replace("/login");
      } else if (!user.emailVerified) {
        // Email not verified, redirect to login
        router.replace("/login");
      } else {
        // User is logged in and verified
        setUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  return (


    <main className="min-h-screen bg-[#F5F7FF] relative overflow-hidden">


      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-rose-100/60 rounded-full blur-[80px] animate-bounce-slow" />

      <div className="absolute inset-0 opacity-[0.15]"
        style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }}>
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-32 md:pt-52 relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1]">
            Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              IT Career
            </span> <br />
            <span className="text-gray-800">IT Study</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-lg leading-relaxed">
            The comprehensive learning platform tailored specifically for Higher National Diploma in Information Technology students. Accelerate your career with industry-aligned curriculum.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1">
              Get Started <ArrowRight size={20} />
            </button>

            <button className="bg-white/80 backdrop-blur-md border-2 border-indigo-100 text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-sm">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.6rem] blur opacity-20"></div>

          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/50">
            <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={HeroSection[currentIndex]}
                  alt="Students Studying"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-[-10px] bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-indigo-50"
            >
              <div className="bg-rose-100 p-3 rounded-full">
                <div className="bg-rose-500 w-2 h-3 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">98%</p>
                <p className="text-xs text-slate-500 font-medium">Success Rate</p>
              </div>
            </motion.div>
          </div>

          <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        </motion.div>
      </div>

      {/* <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Why Choose HND Study?</h2>

        <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full mb-12"></div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <div className="bg-indigo-500 w-8 h-8 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-4">Feature {item}</h3>
              <p className="text-slate-600 mt-2">Description of feature {item}</p>
            </div>
          ))}
          
        </div>

          
      </section> */}


    </main>



    // <div className="min-h-screen bg-gray-100">
    //   <nav className="bg-white shadow-sm">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    //       <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
    //      
    //     </div>
    //   </nav>

    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    //     <div className="bg-white rounded-lg shadow-md p-6">
    //       <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h2>

    //       <div className="space-y-2">
    //         <p><strong>Email:</strong> {user?.email}</p>
    //         <p><strong>Email Verified:</strong> ✅ Yes</p>
    //         <p><strong>User ID:</strong> {user?.uid}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}