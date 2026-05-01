// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, CheckSquare, Settings, 
  Bell, TrendingUp, ShieldCheck, X, Check, Database, Mail, FileText, Play,
  Search, Filter, MoreHorizontal, UserPlus, ChevronDown
} from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';
import toast, { Toaster } from 'react-hot-toast';

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
  active?: boolean;
}

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({
          id: doc.id,
          email: data.email,
          name: data.name || 'No Name',
          createdAt: data.createdAt?.toDate() || new Date(),
          role: data.role || 'student'
        });
      });
      
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students", { position: "top-center" });
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
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="User Management" />
          <NavItem icon={<BookOpen size={20} />} label="Course Catalog" />
          <NavItem icon={<CheckSquare size={20} />} label="Upload Approvals" />
          <NavItem icon={<Settings size={20} />} label="System Settings" />
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
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="text-indigo-600" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{totalStudents}</h3>
              <p className="text-sm text-slate-500 mt-1">Total Students</p>
              <p className="text-xs text-green-600 mt-2">+{newThisMonth} this month</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <UserPlus className="text-emerald-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{newThisMonth}</h3>
              <p className="text-sm text-slate-500 mt-1">New Registrations</p>
              <p className="text-xs text-slate-400 mt-2">This month</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">24</h3>
              <p className="text-sm text-slate-500 mt-1">Active Courses</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <CheckSquare className="text-amber-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">8</h3>
              <p className="text-sm text-slate-500 mt-1">Pending Approvals</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Student Management</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and monitor all registered students</p>
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
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="admin">Admins</option>
                    <option value="teacher">Teachers</option>
                  </select>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
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
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal size={18} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {filteredStudents.length} of {totalStudents} students
              </p>
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                View All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Registrations</h3>
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 text-xs font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    <p className="text-xs text-slate-400">{student.createdAt.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-colors">
                  <Mail size={18} />
                  <span className="text-sm font-medium">Email All</span>
                </button>
                <button className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-colors">
                  <UserPlus size={18} />
                  <span className="text-sm font-medium">Add Student</span>
                </button>
                <button className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-600 hover:bg-amber-100 transition-colors">
                  <FileText size={18} />
                  <span className="text-sm font-medium">Export Data</span>
                </button>
                <button className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl text-purple-600 hover:bg-purple-100 transition-colors">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-medium">Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
  }`}>
    {icon}
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </div>
);

export default AdminDashboard;