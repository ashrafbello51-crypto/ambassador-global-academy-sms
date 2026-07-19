"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordInput>({
    token: token || "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<ResetPasswordInput>>({});

  if (!token) {
    return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Alert variant="error">
          No reset token provided. Please request a new password reset link.
        </Alert>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<ResetPasswordInput> = {};
      const fe = result.error.flatten().fieldErrors;
      if (fe.password?.[0]) errors.password = fe.password[0];
      if (fe.confirmPassword?.[0]) errors.confirmPassword = fe.confirmPassword[0];
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: formData.token, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess(data.data?.message || "Password reset successful. You can now log in.");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <Alert variant="error">{error}</Alert>}
        {success && (
          <>
            <Alert variant="success">{success}</Alert>
            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                Go to sign in
              </Link>
            </div>
          </>
        )}

        {!success && (
          <>
            <p className="text-sm text-gray-600">Enter your new password below.</p>

            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={fieldErrors.password}
            />

            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={fieldErrors.confirmPassword}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset password
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
