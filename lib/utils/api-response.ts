import { NextResponse } from "next/server";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function successWithMeta<T>(data: T, meta: Record<string, unknown>, status = 200) {
  return NextResponse.json({ data, meta }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function badRequest(message: string, code = "VALIDATION_ERROR") {
  return NextResponse.json({ error: message, code }, { status: 400 });
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json({ error: message, code: "UNAUTHORIZED" }, { status: 401 });
}

export function forbidden(message = "You do not have permission") {
  return NextResponse.json({ error: message, code: "FORBIDDEN" }, { status: 403 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ error: message, code: "NOT_FOUND" }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ error: message, code: "CONFLICT" }, { status: 409 });
}

export function serverError(error?: unknown) {
  console.error("[API Error]", error);
  return NextResponse.json(
    { error: "An unexpected error occurred", code: "SERVER_ERROR" },
    { status: 500 }
  );
}
