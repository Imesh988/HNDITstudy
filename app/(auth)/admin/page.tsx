// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, 
  Search,
  CheckSquare,
  BookOpen,
  UserPlus,
} from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { FaVideo } from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsersLine } from "react-icons/fa6";
import { FaCommentSms } from "react-icons/fa6";
import CommentsList from '@/app/forms/comments/commentList';
import CommentLoad from './load/page';
import { CommAPI, VideoAPI } from '@/services/api';
import { Comm } from '@/type/Comm';
import { Video } from '@/type/Video';



interface Student {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [allowComments , setAllowComments ] = useState<Comm[]>([]);
  const [allowVideo , setAllowVideo] = useState<Video[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchComments();
    fetchVideo();
  }, []);


  const fetchComments = async () => {
   try {
    setLoading(true);
    const response = await CommAPI.getAll();
    setAllowComments(response.data);
    console.log(response.data);
    
    
   } catch (error) {
    console.error("Error fetching comments:", error);
    toast.error("Failed to load comments");
   } finally {
    setLoading(false);
   }
  }

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await VideoAPI.getAll();
      setAllowVideo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching video:", error);
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  }

const fetchStudents = async () => {
  try {
    setLoading(true);
    const db = getFirestore(app);
    
    const usersRef = collection(db, 'users');
    
    console.log("🔍 Fetching from users collection...");
    
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${querySnapshot.size} documents`);
    
    if (querySnapshot.empty) {
      console.warn("⚠️ No documents in users collection!");
      toast.error('No users found in Firestore');
      setStudents([]);
      return;
    }
    
    const studentsData: Student[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 Document ${doc.id}:`, data);
      
      studentsData.push({
        id: doc.id,
        email: data.email || 'No email',
        name: data.displayName || data.name || 'No Name',
        createdAt: data.createAt?.toDate() || new Date(),
        role: data.role || 'user'
      });
    });
    
    setStudents(studentsData);
    console.log(`✅ Loaded ${studentsData.length} users successfully`);
    
  } catch (error: any) {
    console.error("❌ Error fetching students:", error);
    
    if (error.code === 'permission-denied') {
      toast.error('Permission denied! Check Firestore security rules');
    } else if (error.code === 'failed-precondition') {
      toast.error('Missing index! Check console for link to create index');
    } else {
      toast.error(`Error: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};  

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || student.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalStudents = students.length;
  const newThisMonth = students.filter(s => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return s.createdAt >= startOfMonth;
  }).length;

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans text-slate-900">
      <Toaster position="top-center" />
      



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
          {/* <NavItem icon={<FaUsersLine size={20} />} label="User Management" href='/admin/users' /> */}
          <NavItem icon={<FaVideo size={20} />} label="upload Video" href='/forms/video/admin' />
          <NavItem icon={<FaCommentSms size={20} />} label="Upload Approvals" href='/admin/load' />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="admin" className="w-10 h-10 rounded-xl bg-indigo-100" />
            <div>
              <p className="text-sm font-bold text-slate-800">Admin Central</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Controller</p>
            </div>
          </div>
        </div>
      </aside>

      

      <main className="flex-1 lg:ml-64 flex flex-col">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <h1 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">IT Student Portal Admin</h1>
          <div className="flex items-center gap-4">
         
            
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  
  {/* Card 1 - Total Students */}
  <div className="group relative bg-gradient-to-br from-yellow-50 via-yellow-50/50 to-white p-6 rounded-2xl shadow-lg border border-yellow-100 hover:shadow-2xl hover:shadow-yellow-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-300 rounded-full -ml-8 -mb-8 opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
        <Users className="text-white" size={28} />
      </div>
      
    </div>
    
    <h3 className="text-3xl font-bold text-gray-800 relative z-10 group-hover:text-yellow-700 transition-colors duration-300">
      {totalStudents}
    </h3>
    <p className="text-sm font-medium text-gray-500 mt-2 relative z-10">Total Students</p>
    
    
  </div>

  {/* Card 2 - All Comments */}
  <div className="group relative bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-300 rounded-full -ml-8 -mb-8 opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
        <FaCommentSms className="text-white" size={28} />
      </div>
      <div className="px-2 py-1 bg-emerald-100 rounded-full animate-pulse">
        <span className="text-xs font-bold text-emerald-700">New</span>
      </div>
    </div>
    
    <h3 className="text-3xl font-bold text-gray-800 relative z-10 group-hover:text-emerald-700 transition-colors duration-300">
      {allowComments.length}
    </h3>
    <p className="text-sm font-medium text-gray-500 mt-2 relative z-10">All Comments</p>
    
   
  </div>

  {/* Card 3 - All Videos */}
  <div className="group relative bg-gradient-to-br from-purple-50 via-purple-50/50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-300 rounded-full -ml-8 -mb-8 opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 group-hover:-rotate-6">
        <FaVideo className="text-white" size={28} />
      </div>
      <div className="px-2 py-1 bg-purple-100 rounded-full">
        <span className="text-xs font-bold text-purple-700">{allowVideo.length} Total</span>
      </div>
    </div>
    
    <h3 className="text-3xl font-bold text-gray-800 relative z-10 group-hover:text-purple-700 transition-colors duration-300">
      {allowVideo.length}
    </h3>
    <p className="text-sm font-medium text-gray-500 mt-2 relative z-10">All Videos</p>
    
    
  </div>

  
</div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Student Management</h2>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                    />
                  </div>
                 
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-bold text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{student.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{student.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            student.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {student.role || 'student'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {student.createdAt.toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

           
          </div>

          
        </div>
      </main>
    </div>
  );
};

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

export default AdminDashboard;