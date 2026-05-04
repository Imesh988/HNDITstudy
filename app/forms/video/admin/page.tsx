'use client';

import React, { useState, useEffect } from 'react';
import { VideoAPI } from '../../../../services/api';
import { Video } from '@/type/Video';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Check, Video as VideoIcon, Calendar, LayoutGrid, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaVideo } from 'react-icons/fa';
import { FaCommentSms } from 'react-icons/fa6';
import { app } from '@/lib/firebase/client';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { RiLogoutCircleLine } from 'react-icons/ri';


interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}
const auth = getAuth(app);

export default function VideoAdmin() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        url: '',
        description: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const router = useRouter();
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        fetchVideos();
        checkAdminAuth();
    }, []);

    

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

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await VideoAPI.getAll();
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Failed to load videos", {
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeVideoId = (url: string): string | null => {
        if (!url) return null;

        if (url.includes('youtu.be/')) {
            const match = url.match(/youtu\.be\/([^?&]+)/);
            return match ? match[1] : null;
        }
        if (url.includes('youtube.com/watch')) {
            const match = url.match(/[?&]v=([^&]+)/);
            return match ? match[1] : null;
        }
        if (url.includes('youtube.com/embed/')) {
            const match = url.match(/embed\/([^?&]+)/);
            return match ? match[1] : null;
        }
        return null;
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        const videoId = getYouTubeVideoId(url);
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (url.includes('youtube.com/embed/')) {
            return url;
        }

        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'url') {
            const embedUrl = getEmbedUrl(value);
            setPreviewUrl(embedUrl);
        }
    };

    const validateYouTubeUrl = (url: string): boolean => {
        return getYouTubeVideoId(url) !== null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.url.trim()) {
            toast.error("Please enter YouTube URL", {
                position: "top-center",
            });
            return;
        }

        if (!validateYouTubeUrl(formData.url)) {
            toast.error("Invalid YouTube URL. Please use format: https://youtu.be/... or https://www.youtube.com/watch?v=...", {
                position: "top-center",
            });
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Please enter video description", {
                position: "top-center",
            });
            return;
        }

        try {
            if (editingId) {
                await VideoAPI.update(editingId, {
                    ...formData,
                    descriptin: formData.description
                });
                toast.success("Video updated successfully!", {
                    position: "top-center",
                });
            } else {
                await VideoAPI.create({
                    ...formData,
                    descriptin: formData.description
                });
                toast.success("Video added successfully!", {
                    position: "top-center",
                });
            }

            setFormData({ url: '', description: '' });
            setPreviewUrl('');
            setShowForm(false);
            setEditingId(null);
            fetchVideos();
        } catch (error) {
            console.error("Error saving video:", error);
            toast.error("Failed to save video", {
                position: "top-center",
            });
        }
    };

    const handleEdit = (video: Video) => {
        setEditingId(video._id || null);
        setFormData({
            url: video.url,
            description: video.descriptin
        });
        setPreviewUrl(getEmbedUrl(video.url));
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this video?")) {
            try {
                await VideoAPI.delete(id);
                toast.success("Video deleted successfully!", {
                    position: "top-center",
                });
                fetchVideos();
            } catch (error) {
                console.error("Error deleting video:", error);
                toast.error("Failed to delete video", {
                    position: "top-center",
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
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


                <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
                    <Toaster />

                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[120px]" />
                        <div className="absolute top-[20%] -left-[5%] w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[100px]" />
                    </div>

                    <nav className="sticky top-0 z-40  ">
                        <div className="max-w-7xl mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">

                                    <div className="" />

                                </div>

                                <button
                                    onClick={() => {
                                        setShowForm(true);
                                        setEditingId(null);
                                        setFormData({ url: '', description: '' });
                                        setPreviewUrl('');
                                    }}
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.4)] active:scale-95"
                                >
                                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="font-semibold">Upload Video</span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    <main className="max-w-7xl mx-auto px-6 py-10 relative">
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Media Library</h2>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <LayoutGrid size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Videos</p>
                                        <p className="text-sm font-bold text-slate-700">{videos.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {videos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
                                    <VideoIcon size={32} className="text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">No videos uploaded yet</h3>
                                <p className="text-slate-500 mt-2 max-w-sm text-center">
                                    Start building your library by clicking the "Upload Video" button above.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {videos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="group bg-white rounded-[1.5rem] border border-slate-200/60 overflow-hidden hover:border-indigo-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500"
                                    >
                                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                            <iframe
                                                src={getEmbedUrl(video.url)}
                                                title="Video Player"
                                                className="w-full h-full object-cover"
                                                allowFullScreen
                                            />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <p className="text-slate-700 leading-relaxed font-medium line-clamp-2 min-h-[3rem]">
                                                        {video.descriptin}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <Calendar size={14} />
                                                    <span>Added recently</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(video)}
                                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                        title="Edit Video"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(video._id!)}
                                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete Video"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>

                    {showForm && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowForm(false)} />

                            <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl relative overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {editingId ? 'Refine Video' : 'Add New Content'}
                                        </h2>
                                        <p className="text-sm text-slate-500">Enter the details of your video below</p>
                                    </div>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">
                                            YouTube Link
                                        </label>
                                        <input
                                            type="text"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">
                                            Video Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400"
                                            placeholder="Briefly describe the content of this video..."
                                        />
                                    </div>

                                    {previewUrl && (
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider ml-1">Live Preview</p>
                                            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden ring-4 ring-indigo-50 shadow-inner">
                                                <iframe
                                                    src={previewUrl}
                                                    className="w-full h-full"
                                                    title="Video Preview"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Check size={20} />
                                            {editingId ? 'Save Changes' : 'Publish Video'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>



    );
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active = false }) => (
    <Link href={href}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-indigo-200'
            }`}>
            {icon}
            <span className="text-sm font-bold tracking-tight">{label}</span>
        </div>
    </Link>
);