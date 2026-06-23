'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

interface FormData {
  name: string;
  username: string;
  email: string;
  mobile: string;
  shareData: boolean;
}

interface Errors {
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);

  const [form, setForm] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    mobile: '',
    shareData: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Field is required';
    if (!form.username.trim()) e.username = 'Field is required';
    if (!form.email.trim()) e.email = 'Field is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.mobile.trim()) e.mobile = 'Field is required';
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.mobile)) e.mobile = 'Invalid mobile';
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setUser({ name: form.name, username: form.username, email: form.email, mobile: form.mobile });
    router.push('/categories');
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* LEFT SIDE */}
      <div
        className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/signup-bg.png')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
          <div className="mt-auto">
            <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-md">
              Discover new things on Superapp
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-single-day text-[#72db73] text-4xl">
              Super app
            </h2>

            <p className="text-white/70 mt-2">
              Create your new account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-[#292929] text-white placeholder-gray-400 px-4 py-3 rounded outline-none ${errors.name ? 'border border-red-500' : ''
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="UserName"
                value={form.username}
                onChange={handleChange}
                className={`w-full bg-[#292929] text-white placeholder-gray-400 px-4 py-3 rounded outline-none ${errors.username ? 'border border-red-500' : ''
                  }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-[#292929] text-white placeholder-gray-400 px-4 py-3 rounded outline-none ${errors.email ? 'border border-red-500' : ''
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                className={`w-full bg-[#292929] text-white placeholder-gray-400 px-4 py-3 rounded outline-none ${errors.mobile ? 'border border-red-500' : ''
                  }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="shareData"
                checked={form.shareData}
                onChange={handleChange}
                className="accent-[#72db73]"
              />
              <span className="text-white/70 text-sm">
                Share my registration data with Superapp
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#72db73] hover:bg-[#63cb64] text-black font-bold py-3 rounded-full mt-2 transition"
            >
              SIGN UP
            </button>

            <p className="text-center text-white/50 text-xs leading-relaxed">
              By clicking on Sign up, you agree to Superapp{" "}
              <span className="text-[#72db73]">
                Terms and Conditions of Use
              </span>
            </p>

            <p className="text-center text-white/50 text-xs leading-relaxed">
              To learn more about how Superapp collects, uses, shares and
              protects your personal data please head Superapp{" "}
              <span className="text-[#72db73]">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
