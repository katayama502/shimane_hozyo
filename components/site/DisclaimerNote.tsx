import { DISCLAIMER_TEXT } from "@/lib/site";

export function DisclaimerNote() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-base leading-relaxed text-amber-900">
      {DISCLAIMER_TEXT}
    </div>
  );
}
