'use client';

import React, { useEffect, useState } from 'react';
import { VideoAPI } from '../../../services/api';
import { Video } from '@/type/Video';
import { Play, Calendar, ChevronRight, VideoIcon, X,  } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { RiLogoutCircleLine, RiUserCommunityFill } from 'react-icons/ri';
import { MdDashboard } from 'react-icons/md';
import { FaComment, FaVideo } from 'react-icons/fa';
import { auth } from '@/lib/firebase/client';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";


export default function VideoPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const router = useRouter();
    const [user , setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        fetchVideos();
    }, []);

  

  
    

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("Auth state changed:", currentUser);
        setUser(currentUser);
        
        if (!currentUser) {
            router.push("/login");
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

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await VideoAPI.getAll();
            setVideos(response.data);
            if (response.data.length > 0) {
                setSelectedVideo(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Failed to load videos");
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
            return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
        }
        return '';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
         <div className="min-h-screen bg-[#fcfcfd] pb-20">
            <Toaster position="top-right" />
            
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 text-center">
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
                        <Play size={48} className="text-slate-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700">No Lessons Available</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {videos.map((video, index) => {
                            const isPlaying = selectedVideo?._id === video._id;

                            return (
                                <div key={video._id} className="group flex flex-col">
                                    <div className={`relative aspect-video rounded-[2.5rem] overflow-hidden transition-all duration-500 border-4 shadow-2xl ${
                                        isPlaying 
                                        ? 'border-indigo-600 shadow-indigo-200/50 scale-[1.03]' 
                                        : 'border-white shadow-slate-200/50 hover:-translate-y-2 group-hover:shadow-indigo-100/50'
                                    }`}>
                                        
                                        {isPlaying ? (
                                            <div className="w-full h-full bg-black relative">
                                                <iframe
                                                    src={getEmbedUrl(video.url)}
                                                    title={video.descriptin}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedVideo(null); }}
                                                    className="absolute top-3 right-3 bg-red-600 p-2 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors z-10"
                                                    title="Close Video"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedVideo(video)}
                                                className="w-full h-full relative group bg-slate-900"
                                            >
                                                {/* Thumbnail Background (Gradient and Placeholder) */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-indigo-600/20 to-purple-900/40 opacity-80" />
                                                <div className="absolute inset-0 bg-slate-800 mix-blend-overlay" />
                                                
                                                <div className="absolute top-4 left-6 text-white/10 font-black text-7xl italic select-none">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transform transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600">
                                                        <Play size={28} className="text-indigo-600 fill-current ml-1 transition-colors group-hover:text-white" />
                                                    </div>
                                                </div>

                                                
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-6 px-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            
                                        </div>
                                        <h4 className={`font-bold text-xl leading-snug transition-colors line-clamp-2 ${
                                            isPlaying ? 'text-indigo-600' : 'text-slate-800'
                                        }`}>
                                            {video.descriptin}
                                        </h4>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #fcfcfd; }
                ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; border: 2px solid #fcfcfd; }
                ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
}