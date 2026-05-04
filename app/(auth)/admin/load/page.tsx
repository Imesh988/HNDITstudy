'use client';

import { CommAPI } from "@/services/api";
import { useState, useEffect } from "react";
import React from "react";
import type { Comm } from "@/type/Comm";
import { attachFollow } from "framer-motion";
import { FaVideo } from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsersLine } from "react-icons/fa6";
import { FaCommentSms } from "react-icons/fa6";
import { LayoutDashboard } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { RiLogoutCircleLine } from "react-icons/ri";
import { app } from '@/lib/firebase/client'; 

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}


const auth = getAuth(app);

function CommentLoad() {
    const [comments, setComments] = useState<Comm[]>([]);
    const [allComments, setAllComments] = useState<Comm[]>([]); 
    const router = useRouter();
      const [adminName, setAdminName] = useState('Admin');
    
    
   useEffect(() => {
        fetchComment();
        checkAdminAuth();
    } ,  []);




      const checkAdminAuth = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (!user && !isAdmin) {
          router.push('/login');
        }
      };
    
      useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.displayName) {
          setAdminName(user.displayName);
        } else {
          setAdminName('Admin User');
        }
      }, []);
    
      const handleAdminLogout = async () => {
        try {
          const auth = getAuth();
          await signOut(auth);
          localStorage.removeItem('isAdmin');
          sessionStorage.clear();
          router.push('/login');
        } catch (error) {
          console.error("Logout error:", error);
          toast.error("Logout failed. Please try again.");
        }
      };

    const fetchComment =  async () => {
        try {
            const response = await CommAPI.getAll();
            setAllComments(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

 

    return (
      <div className="flex min-h-screen bg-[#F8F9FD] font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-gray-100 flex-col fixed h-full hidden lg:flex">
             <div className="p-6">
               <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                   <LayoutDashboard size={20} />
                 </div>
                 <span>Admin Portal</span>
               </div>
             </div>
     
             <nav className="flex-1 px-4 space-y-2 mt-4">
               <NavItem icon={<MdSpaceDashboard size={20} />} label="Dashboard" href='/admin' />
               <NavItem icon={<FaVideo size={20} />} label="upload Video" href='/forms/video/admin' />
               <NavItem icon={<FaCommentSms size={20} />} label="Upload Approvals" href='/admin/load' />
             </nav>
     
             <div className="p-4 border-t border-gray-100">
               <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="admin" className="w-10 h-10 rounded-xl bg-indigo-100" />
                 <div className="flex-1">
                   <p className="text-sm font-bold text-slate-800">{adminName}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Administrator</p>
                 </div>
                 <button
                   onClick={handleAdminLogout}
                   className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group"
                   title="Logout"
                 >
                   <RiLogoutCircleLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 </button>
               </div>
             </div>
           </aside>

      

      <main className="flex-1 lg:ml-64 flex flex-col">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <h1 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">IT Student Portal Admin</h1>
          <div className="flex items-center gap-4">
         
            
          </div>
        </header>
 <div className="max-w-7xl mx-auto my-16 px-4">
  <div className="text-center mb-12">

    
  
    <div className="flex items-center justify-center gap-2">
      
    </div>
  </div>

  {allComments.length === 0 ? (
    <div className="max-w-md mx-auto bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 text-center">
      <p className="text-gray-400 font-medium text-lg italic">"Silence is golden, but comments are better."</p>
      <p className="text-gray-500 text-sm mt-2">No comments yet!</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {allComments.map((comments) => (
        <div 
          key={comments._id} 
          className="group relative bg-white border border-gray-100 p-8 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full"
        >
          <div className="absolute -top-4 -left-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.89543 10.9124 7 12.017 7H19.017C20.1216 7 21.017 7.89543 21.017 9V15C21.017 17.2091 19.2261 19 17.017 19H14.017V21H14.017ZM3.01704 21L3.01704 18C3.01704 16.8954 3.91244 16 5.01704 16H8.01704C8.56934 16 9.01704 15.5523 9.01704 15V9C9.01704 8.44772 8.56934 8 8.01704 8H4.01704C3.46474 8 3.01704 8.44772 3.01704 9V12C3.01704 12.5523 2.56934 13 2.01704 13H0.017041C-0.535259 13 -0.982959 12.5523 -0.982959 12V9C-0.982959 7.89543 -0.0875591 7 1.01704 7H8.01704C9.12164 7 10.017 7.89543 10.017 9V15C10.017 17.2091 8.22614 19 6.01704 19H3.01704V21H3.01704Z" />
             </svg>
          </div>

          <div className="flex-1 mt-4">
            <p className="text-gray-600 text-[16px] leading-relaxed font-medium">
              {comments.comment}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center text-gray-800 font-bold shadow-inner">
                {comments.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none">
                {comments.name}
              </h4>
            
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
        
        </div>
      </main>
    </div>
      
    )
}


const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active = false }) => (
  <Link href={href}>
  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
    active ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-indigo-200'
  }`}>
    {icon}
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </div>
  </Link>
);

export default CommentLoad;