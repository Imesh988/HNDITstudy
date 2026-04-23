'use client'

import React, { useState } from "react";
import { registerWithEmail } from "@/lib/firebase/auth";
import { registerSchema } from "@/lib/validations/authSchema";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange  = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
       setFormData(prev => ({
        ...prev,
        [name]: value,
       }));

       if(error[name]) {
        setError(prev => ({
            ...prev,
            [name]: "",
        }));
       }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError({});
        setSuccessMessage('');

        const result = registerSchema.safeParse(formData);

        if(!result.success){
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                formattedErrors[issue.path[0] as string] = issue.message;
            });
            setError(formattedErrors);
            setLoading(false);
            return;
        }

        const response = await registerWithEmail(formData.email, formData.password, formData.displayName);

        if(response.success) {
            setSuccessMessage(response.message);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            setError({ general: response.message });
        }
        
        setLoading(false);
    };

    return (
        <Card title="Create Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error.general}
                    </div>
                )}

                    <Input
                    label="full name "
                    name="displayName"
                    type="text"
                    placeholder="Jone Doe"
                    value={formData.displayName}
                    onChange={handleChange}
                    error={error.displayName}
                    required
                    >
                    
                    </Input>

                            <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={error.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={error.password}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={error.confirmPassword}
          required
        />

                <Button type="submit" disabled={loading}>
                    Create account
                </Button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </form>
            
        </Card>
    )


}