import { auth } from "@/lib/firebase/client";

import { useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';



export default function AuthGuard({children}: {children: React.ReactNode}) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect (() => {
        if(!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);
    

    if(loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return user ? <>{children}</> : null;

}
