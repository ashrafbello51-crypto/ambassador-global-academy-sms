"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";

const slides = [
  { src: "/images/slide-1.jpg", alt: "Students celebrating academic achievement", pos: "center 30%" },
  { src: "/images/slide-2.jpg", alt: "School event gathering",                    pos: "center center" },
  { src: "/images/slide-3.jpg", alt: "Students in school activity",               pos: "center 40%" },
  { src: "/images/slide-4.jpg", alt: "School assembly",                           pos: "center center" },
  { src: "/images/slide-5.jpg", alt: "Students at school ceremony",               pos: "center 35%" },
];

const AUTO_INTERVAL = 6000;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginInput>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTransitioning(false);
    }, 400);
  }, [active]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<LoginInput> = {};
      const f = result.error.flatten();
      f.fieldErrors.email?.forEach((e) => { errors.email = e; });
      f.fieldErrors.password?.forEach((e) => { errors.password = e; });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-900 flex">

      {/* ═══════════════════════════════════════════════
          FULL-SCREEN BACKGROUND SLIDESHOW
      ═══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity: i === active ? (transitioning ? 0 : 1) : 0,
              transition: "opacity 800ms ease-in-out",
              zIndex: i === active ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* ═══════════════════════════════════════════════
          TOP-LEFT SCHOOL LOGO (desktop)
      ═══════════════════════════════════════════════ */}
      <div className="absolute top-5 left-6 z-30 hidden md:flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">AG</span>
        </div>
        <div className="leading-tight">
          <p className="text-white text-[11px] font-bold tracking-[0.18em] uppercase leading-none">Ambassador</p>
          <p className="text-white/70 text-[10px] tracking-[0.22em] uppercase">Global Academy</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          BOTTOM COPYRIGHT (desktop)
      ═══════════════════════════════════════════════ */}
      <div className="absolute bottom-4 left-0 right-0 z-30 hidden md:flex items-center justify-center">
        <p className="text-white/30 text-[11px] tracking-wide">
          © {new Date().getFullYear()} Ambassador Global Academy · School Management System
        </p>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
      ═══════════════════════════════════════════════ */}
      <div className="md:hidden relative z-20 w-full flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">AG</span>
          </div>
          <p className="text-white text-xs font-semibold tracking-widest uppercase">Ambassador Global Academy</p>
        </div>

        {/* Mobile form card */}
        <div className="flex-1 flex items-end px-4 pb-6">
          <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">Welcome Back.</p>
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">Sign in to your school portal</h1>
            <p className="text-xs text-gray-500 mb-5">A secure space for teachers, parents, and staff to connect.</p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-xs text-red-700">{error}</div>
            )}

            <MobileForm
              formData={formData}
              setFormData={setFormData}
              fieldErrors={fieldErrors}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />

            {/* Mobile thumbnails */}
            <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => goTo(i)}
                  className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                    i === active ? "border-brand-500 scale-105 shadow-md" : "border-transparent opacity-70"
                  }`}
                  aria-label={`View ${s.alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex relative z-20 w-full items-center justify-between px-10 lg:px-16 xl:px-20">

        {/* ── LOGIN CARD ── */}
        <div className="w-full max-w-[360px] lg:max-w-[380px] bg-white/92 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 p-7 lg:p-8 my-16">

          {/* Card header */}
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600 mb-1.5">Welcome Back.</p>
          <h1 className="text-2xl lg:text-[26px] font-bold text-gray-900 leading-snug mb-1">
            Sign in to your<br />school portal
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            A secure space for teachers, parents, and staff to connect.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email-desktop" className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email-desktop"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@school.edu"
                  className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-50"
                  }`}
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password-desktop" className="text-xs font-semibold text-gray-600 tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password-desktop"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            Having trouble?{" "}
            <span className="text-gray-500 font-medium">Contact school administration.</span>
          </p>
        </div>

        {/* ── RIGHT THUMBNAIL GALLERY ── */}
        <div className="hidden lg:flex flex-col gap-3 py-16 w-36 xl:w-40 flex-shrink-0">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => goTo(i)}
              className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 focus:outline-none group ${
                i === active
                  ? "ring-2 ring-white shadow-xl shadow-black/40 scale-105"
                  : "opacity-70 hover:opacity-90 hover:scale-102"
              }`}
              style={{ aspectRatio: "4/3" }}
              aria-label={`View ${s.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
              {/* Active indicator bar */}
              {i === active && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-b-xl" />
              )}
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 ${i === active ? "bg-white/5" : ""}`} />
            </button>
          ))}

          {/* Branding under gallery */}
          <div className="mt-2 text-right">
            <p className="text-white/50 text-[9px] tracking-[0.15em] uppercase leading-relaxed">
              Prepared today<br />for the world<br />of tomorrow
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile form (extracted to keep JSX clean)
───────────────────────────────────────────── */
function MobileForm({
  formData,
  setFormData,
  fieldErrors,
  showPassword,
  setShowPassword,
  isLoading,
  onSubmit,
}: {
  formData: LoginInput;
  setFormData: (d: LoginInput) => void;
  fieldErrors: Partial<LoginInput>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email-mobile" className="block text-xs font-semibold text-gray-600 mb-1.5">Email address</label>
        <input
          id="email-mobile"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@school.edu"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            fieldErrors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-50"
          }`}
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password-mobile" className="text-xs font-semibold text-gray-600">Password</label>
          <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot password?</Link>
        </div>
        <div className="relative">
          <input
            id="password-mobile"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
            className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              fieldErrors.password ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-50"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="Toggle password"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in…
          </>
        ) : "Sign in"}
      </button>
    </form>
  );
}
