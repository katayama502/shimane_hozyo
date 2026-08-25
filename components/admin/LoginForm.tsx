"use client";

import { useActionState } from "react";
import { signIn, type AuthActionState } from "@/lib/auth/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signIn,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="block text-base font-semibold text-slate-700">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-base font-semibold text-slate-700">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </div>
      {state?.error && <p className="text-sm font-medium text-rose-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 px-5 py-3.5 text-base font-bold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? "ログイン中…" : "ログイン"}
      </button>
    </form>
  );
}
