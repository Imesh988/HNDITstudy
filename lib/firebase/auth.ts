// lib/firebase/auth.ts
'use client';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    reload,
    type User
} from "firebase/auth";
import { auth, db } from "./client";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create user document in Firestore
export async function createUserDocument(user: User, additionalData?: any) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { email, uid } = user;
        const createAt = new Date();

        try {
            await setDoc(userRef, {
                uid,
                email,
                createAt,
                role: 'user',
                emailVerified: false,
                ...additionalData
            });
            return { success: true };
        } catch (error) {
            console.error("Error creating user document:", error);
            return { success: false, error: "Failed to create user document" };
        }
    }
    return { success: true };
}

// Register function
export async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
) {
    console.log("📝 Starting registration for:", email);
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("✅ User created:", user.uid);
        
        await updateProfile(user, { displayName });
        await sendEmailVerification(user);
        console.log("📧 Verification email sent to:", email);
        
        await createUserDocument(user, { displayName });
        await signOut(auth);
        
        return { 
            success: true, 
            message: "Account created! Please check your email to verify your account." 
        };
        
    } catch (error: any) {
        console.error("Registration error:", error.code, error.message);
        
        let message = 'Registration failed';
        switch(error.code) {
            case 'auth/email-already-in-use':
                message = 'Email already in use. Please login instead.';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak. Use at least 6 characters.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address format.';
                break;
            default:
                message = error.message;
        }
        
        return { success: false, message };
    }
}

// Login function
export async function loginWithEmail(email: string, password: string) {
    console.log("📧 Login attempt for:", email);
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await reload(user);
        
        console.log("✅ Login successful!");
        console.log("✅ Email verified:", user.emailVerified);
        
        if (!user.emailVerified) {
            console.log("⚠️ Email NOT verified");
            await signOut(auth);
            return { 
                success: false, 
                message: "Please verify your email address first.",
                emailVerified: false 
            };
        }
        
        return { success: true, message: 'Login successful', emailVerified: true, user };
        
    } catch (error: any) {
        console.error("Login error:", error.code, error.message);
        
        let message = 'Login failed';
        switch(error.code) {
            case 'auth/invalid-credential':
                message = 'Invalid email or password.';
                break;
            case 'auth/user-not-found':
                message = 'No account found. Please register first.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password.';
                break;
            default:
                message = error.message;
        }
        
        return { success: false, message };
    }
}

// Resend verification email
export async function resendVerificationEmail() {
    const user = auth.currentUser;
    
    if (!user) {
        return { success: false, message: "No user logged in" };
    }
    
    if (user.emailVerified) {
        return { success: false, message: "Email already verified" };
    }
    
    try {
        await sendEmailVerification(user);
        return { success: true, message: "Verification email sent! Check your spam folder." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// Reset password
export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error: any) {
        let message = 'Failed to send password reset email';
        if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email.';
        }
        return { success: false, message };
    }
}

// Logout
export async function logout() {
    try {
        await signOut(auth);
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        return { success: false, message: 'Logout failed' };
    }
}

// Get current user
export function getCurrentUser() {
    if (typeof window === 'undefined') {
        return null;
    }
    return auth.currentUser;
}

// Check verification status
export async function checkVerificationStatus() {
    const user = auth.currentUser;
    if (!user) {
        return { verified: false, email: null };
    }
    
    await reload(user);
    return { verified: user.emailVerified, email: user.email };
}