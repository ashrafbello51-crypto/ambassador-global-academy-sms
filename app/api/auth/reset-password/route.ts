import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/lib/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage =
        parsed.error.flatten().fieldErrors.password?.[0] ||
        parsed.error.flatten().fieldErrors.confirmPassword?.[0] ||
        parsed.error.flatten().fieldErrors.token?.[0] ||
        "Invalid input";

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const success = await AuthService.resetPassword(token, password);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: {
          message: "Password reset successful. You can now log in.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Reset Password Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
