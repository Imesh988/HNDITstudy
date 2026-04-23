import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

export async function POST() {
  try {
    await signOut(auth);
    return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
  } catch (error) {
    return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
  }
}