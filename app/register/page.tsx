'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUser, useAppDispatch } from '@/lib/store';

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const usernamePattern = /^[A-Za-z][A-Za-z0-9_]*$/;

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function countLetters(value: string) {
  return (value.match(/[A-Za-z]/g) ?? []).length;
}

function normalizeMobile(value: string) {
  return value.replace(/[\s()-]/g, '');
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    mobile: '',
    shareData: false,
  });
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const e: Errors = {};
    const name = normalizeName(form.name);
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = normalizeMobile(form.mobile);
    const mobileDigits = mobile.replace(/^\+/, '');

    if (!name) e.name = 'Name is required';
    else if (countLetters(name) < 4) e.name = 'Name must be more than 3 letters';
    else if (!namePattern.test(name)) e.name = 'Name can only contain letters and spaces';

    if (!username) e.username = 'Username is required';
    else if (countLetters(username) < 4) e.username = 'Username must include more than 3 letters';
    else if (!usernamePattern.test(username)) {
      e.username = 'Username must start with a letter and use only letters, numbers, or underscores';
    }

    if (!email) e.email = 'Email is required';
    else if (!emailPattern.test(email)) e.email = 'Enter a valid email address';

    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\+?\d+$/.test(mobile)) e.mobile = 'Mobile number can only contain digits';
    else if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      e.mobile = 'Mobile number must be 10 to 15 digits';
    }

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
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    dispatch(setUser({
      name: normalizeName(form.name),
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: normalizeMobile(form.mobile),
    }));
    router.push('/categories');
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* LEFT SIDE */}
      <div className="relative min-h-[50vh] w-full bg-signup-hero bg-cover bg-center lg:min-h-screen lg:w-1/2">
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
            <h2 className="font-display text-4xl text-brand">
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
                aria-invalid={Boolean(errors.name)}
                className={`w-full rounded bg-surface-field px-4 py-3 text-white placeholder-gray-400 outline-none ${errors.name ? 'border border-red-500' : ''
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
                aria-invalid={Boolean(errors.username)}
                className={`w-full rounded bg-surface-field px-4 py-3 text-white placeholder-gray-400 outline-none ${errors.username ? 'border border-red-500' : ''
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
                aria-invalid={Boolean(errors.email)}
                className={`w-full rounded bg-surface-field px-4 py-3 text-white placeholder-gray-400 outline-none ${errors.email ? 'border border-red-500' : ''
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
                aria-invalid={Boolean(errors.mobile)}
                className={`w-full rounded bg-surface-field px-4 py-3 text-white placeholder-gray-400 outline-none ${errors.mobile ? 'border border-red-500' : ''
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
                className="accent-brand"
              />
              <span className="text-white/70 text-sm">
                Share my registration data with Superapp
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-brand py-3 font-bold text-black transition hover:bg-brand-hover"
            >
              SIGN UP
            </button>

            <p className="text-center text-white/50 text-xs leading-relaxed">
              By clicking on Sign up, you agree to Superapp{" "}
              <span className="text-brand">
                Terms and Conditions of Use
              </span>
            </p>

            <p className="text-center text-white/50 text-xs leading-relaxed">
              To learn more about how Superapp collects, uses, shares and
              protects your personal data please head Superapp{" "}
              <span className="text-brand">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
