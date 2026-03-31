"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";


export const LogoutButton = () => {
    return (
        <Button variant="outline" onClick={() => {
            signOut({ callbackUrl: "/" });
        }} size="lg" className="w-full font-bold uppercase tracking-widest">
            Logout
        </Button>
    )
}