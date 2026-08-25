"use client";

import { useActionState } from "react";
import { bootstrapAdmin, type AuthActionState } from "@/lib/auth/actions";

export function SetupForm() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    bootstrapAdmin,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="displayName" className="block text-base font-semibold text-slate-700">
          お名前
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </div>
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
          パスワード（8文字以上）
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </div>
      {state?.error && <p className="text-sm font-medium text-rose-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 px-5 py-3.5 text-base font-bold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? "登録中…" : "管理者として登録"}
      </button>
    </form>
  );
}
