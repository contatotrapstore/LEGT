import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <AuthForm />
    </div>
  );
}
