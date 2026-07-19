import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/lib/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await AuthService.findUserByEmail(email);

    // Always return success to prevent email enumeration
    if (!user || user.deletedAt || !user.isActive) {
      return NextResponse.json(
        {
          data: {
            message:
              "If an account exists with that email, a reset link has been sent.",
          },
        },
        { status: 200 }
      );
    }

    await AuthService.generatePasswordResetToken(user.id);

    return NextResponse.json(
      {
        data: {
          message:
            "If an account exists with that email, a reset link has been sent.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
