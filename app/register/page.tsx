'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/buttons';
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
  shareData?: string;
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

    if (!name) e.name = 'Field is required';
    else if (countLetters(name) < 4) e.name = 'Name must be more than 3 letters';
    else if (!namePattern.test(name)) e.name = 'Name can only contain letters and spaces';

    if (!username) e.username = 'Field is required';
    else if (countLetters(username) < 4) e.username = 'Username must include more than 3 letters';
    else if (!usernamePattern.test(username)) {
      e.username = 'Username must start with a letter and use only letters, numbers, or underscores';
    }

    if (!email) e.email = 'Field is required';
    else if (!emailPattern.test(email)) e.email = 'Enter a valid email address';

    if (!form.mobile.trim()) e.mobile = 'Field is required';
    else if (!/^\+?\d+$/.test(mobile)) e.mobile = 'Mobile number can only contain digits';
    else if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      e.mobile = 'Mobile number must be 10 to 15 digits';
    }

    if (!form.shareData) e.shareData = 'Check this box if you want to proceed';

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
    <div className="min-h-screen bg-[#1f1f1f] p-2">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1074px] flex-col bg-black lg:flex-row">
      <div className="relative min-h-[50vh] w-full bg-signup-hero bg-cover bg-center lg:min-h-[calc(100vh-1rem)] lg:w-[49%]">
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-10">
          <div className="mt-auto">
            <h2 className="max-w-md text-3xl font-bold leading-tight text-white lg:text-[34px]">
              Discover new things on Superapp
            </h2>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-black px-8 py-10 lg:w-[51%]">
        <div className="w-full max-w-[322px]">
          <div className="mb-7 text-center">
            <h2 className="font-display text-[40px] leading-none text-brand">
              Super app
            </h2>

            <p className="mt-6 text-[15px] text-white">
              Create your new account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                className={`h-10 w-full rounded-sm bg-surface-field px-3 text-xs text-white placeholder-gray-400 outline-none ${errors.name ? 'border border-red-600' : ''
                  }`}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="username"
                placeholder="UserName"
                value={form.username}
                onChange={handleChange}
                aria-invalid={Boolean(errors.username)}
                className={`h-10 w-full rounded-sm bg-surface-field px-3 text-xs text-white placeholder-gray-400 outline-none ${errors.username ? 'border border-red-600' : ''
                  }`}
              />
              {errors.username && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                className={`h-10 w-full rounded-sm bg-surface-field px-3 text-xs text-white placeholder-gray-400 outline-none ${errors.email ? 'border border-red-600' : ''
                  }`}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                aria-invalid={Boolean(errors.mobile)}
                className={`h-10 w-full rounded-sm bg-surface-field px-3 text-xs text-white placeholder-gray-400 outline-none ${errors.mobile ? 'border border-red-600' : ''
                  }`}
              />
              {errors.mobile && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.mobile}
                </p>
              )}
            </div>

            <label className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                name="shareData"
                checked={form.shareData}
                onChange={handleChange}
                aria-invalid={Boolean(errors.shareData)}
                className="h-3 w-3 accent-brand"
              />
              <span className="text-xs text-white/60">
                Share my registration data with Superapp
              </span>
            </label>
            {errors.shareData && (
              <p className="-mt-1 text-xs text-red-600">
                {errors.shareData}
              </p>
            )}

            <SubmitButton className="mt-1 h-9 py-0 text-base font-bold text-white">
              SIGN UP
            </SubmitButton>

            <p className="mt-1 text-[11px] leading-relaxed text-white/50">
              By clicking on Sign up, you agree to Superapp{" "}
              <span className="font-bold text-brand">
                Terms and Conditions of Use
              </span>
            </p>

            <p className="text-[11px] leading-relaxed text-white/50">
              To learn more about how Superapp collects, uses, shares and
              protects your personal data please head Superapp{" "}
              <span className="font-bold text-brand">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
