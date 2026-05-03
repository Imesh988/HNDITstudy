'use client';

import React, { useEffect, useState, useRef } from "react";
import { CommAPI } from "../../../services/api";
import type { Comm } from "@/type/Comm";
import { MessageSquare, Edit2, Trash2, Check, X, Quote, Mail } from 'lucide-react';
import toast from 'react-hot-toast'; 

interface CommentsListProps {
  refreshTrigger?: number;
  currentUserEmail?: string;
  isLoggedIn?: boolean;
  onCommentUpdate?: () => void;
}

export default function CommentsList({ 
  refreshTrigger = 0, 
  onCommentUpdate,
  currentUserEmail = '',
  isLoggedIn = false 
}: CommentsListProps) {
  const [comments, setComments] = useState<Comm[]>([]);
  const [allComments, setAllComments] = useState<Comm[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', comment: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const extractEmailFromName = (name: string): string | null => {
    const emailMatch = name.match(/\[(.*?)\]/);
    if (emailMatch) {
      return emailMatch[1];
    }
    return null;
  };

  const getDisplayName = (fullName: string): string => {
    return fullName.replace(/\[.*?\]/, '').trim();
  };

  useEffect(() => {
    fetchComments();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshTrigger, currentUserEmail]); 

  const fetchComments = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      const response = await CommAPI.getAll();
      setAllComments(response.data);
      filterCommentsByUser(response.data);
    } catch (error: any) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const filterCommentsByUser = (commentsToFilter: Comm[]) => {
    if (isLoggedIn && currentUserEmail) {
      const userComments = commentsToFilter.filter(comment => {
        const commentEmail = extractEmailFromName(comment.name);
        return commentEmail && commentEmail.toLowerCase() === currentUserEmail.toLowerCase();
      });
      setComments(userComments);
    } else {
      // If not logged in, show all comments or empty based on requirement
      setComments([]);
    }
  };

  // Check if comment belongs to current user
  const isOwnComment = (comment: Comm): boolean => {
    if (!currentUserEmail) return false;
    const commentEmail = extractEmailFromName(comment.name);
    return commentEmail ? commentEmail.toLowerCase() === currentUserEmail.toLowerCase() : false;
  };

  const handleEdit = (comment: Comm) => {
    if (!isOwnComment(comment)) {
      toast.error("You can only edit your own comments");
      return;
    }
    setEditingId(comment._id || null);
    setEditFormData({
      name: getDisplayName(comment.name),
      comment: comment.comment
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editFormData.name.trim() || !editFormData.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Get original comment to preserve email
    const originalComment = allComments.find(c => c._id === id);
    const originalEmail = originalComment ? extractEmailFromName(originalComment.name) : currentUserEmail;
    const nameWithEmail = originalEmail ? `${editFormData.name.trim()} [${originalEmail}]` : editFormData.name.trim();

    setActionLoading(true);
    try {
      await CommAPI.update(id, { name: nameWithEmail, comment: editFormData.comment.trim() });
      toast.success("Comment updated successfully!");
      await fetchComments();
      setEditingId(null);
      onCommentUpdate?.();
    } catch (error: any) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error("Error updating comment:", error);
        toast.error("Failed to update comment");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const commentToDelete = allComments.find(c => c._id === id);
    if (commentToDelete && !isOwnComment(commentToDelete)) {
      toast.error("You can only delete your own comments");
      setDeleteConfirm(null);
      return;
    }

    setActionLoading(true);
    try {
      await CommAPI.delete(id);
      toast.success("Comment deleted successfully!");
      setDeleteConfirm(null);
      await fetchComments();
      onCommentUpdate?.();
    } catch (error: any) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: '', comment: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not logged in, show message
  if (!isLoggedIn) {
    return (
      <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Please login to see your feedback</p>
        <p className="text-sm text-gray-400 mt-2">
          Login to view and manage your comments
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with user email */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h4 className="text-sm font-semibold text-gray-700">My Feedback</h4>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Mail size={10} />
            {currentUserEmail}
          </p>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Not feedback yet.</p>
          
        </div>
      ) : (
        comments.map((comment, index) => {
          const displayName = getDisplayName(comment.name);
          const commentEmail = extractEmailFromName(comment.name);
          
          return (
            <div
              key={comment._id || index}
              className="group bg-white border border-indigo-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 bg-indigo-50/30"
            >
              {editingId === comment._id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editFormData.name}
                    // onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={true}
                    placeholder="Your name"
                  />
                  <textarea
                    value={editFormData.comment}
                    onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    rows={3}
                    disabled={actionLoading}
                    placeholder="Your comment"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(comment._id!)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Check size={14} /> Update
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={actionLoading}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-inner transform rotate-3 group-hover:rotate-0 transition-transform">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {displayName}
                          <span className="ml-2 text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        </h4>
                        {commentEmail && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Mail size={10} className="text-gray-400" />
                            <p className="text-[9px] text-gray-400">
                              {commentEmail}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit2 size={15} />
                        </button>

                        {deleteConfirm === comment._id ? (
                          <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl">
                            <button 
                              onClick={() => handleDelete(comment._id!)} 
                              disabled={actionLoading}
                              className="p-1.5 bg-red-500 text-white rounded-lg"
                            >
                              <Check size={12}/>
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)} 
                              className="p-1.5 bg-gray-400 text-white rounded-lg"
                            >
                              <X size={12}/>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(comment._id!)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 relative">
                      <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                        {comment.comment}
                      </p>
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-500/5 -z-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}