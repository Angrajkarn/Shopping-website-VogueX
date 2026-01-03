import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface GoogleButtonProps {
    onSuccess: (token: string) => void
    onError: () => void
}

declare global {
    interface Window {
        google: any
    }
}

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"

export function GoogleButton({ onSuccess, onError }: GoogleButtonProps) {
    const router = useRouter()
    const { login } = useAuthStore()

    const [isLoading, setIsLoading] = React.useState(false)

    const handleGoogleLogin = async () => {
        if (isLoading) return

        try {
            // Start popup immediately to preserve user activation
            const loginPromise = signInWithPopup(auth, googleProvider);
            setIsLoading(true) // Show loader while popup is open

            const result = await loginPromise;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const googleIdToken = credential?.idToken;

            if (!googleIdToken) {
                throw new Error("Could not retrieve Google ID Token");
            }

            // Exchange Google ID Token for Backend JWT
            const res = await api.googleLogin(googleIdToken)

            await login(res.access); // Store Backend JWT
            onSuccess(res.access);
            router.push('/profile')
        } catch (error: any) {
            console.error("Google login error:", error);
            if (error?.code === 'auth/popup-blocked') {
                alert("Please allow popups for this website to sign in with Google.");
            } else if (error?.code !== 'auth/cancelled-popup-request' && error?.code !== 'auth/popup-closed-by-user') {
                onError();
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full bg-white text-black hover:bg-gray-100 relative h-11"
            onClick={handleGoogleLogin}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
            )}
            Sign in with Google
        </Button>
    )
}
