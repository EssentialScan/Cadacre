"use client";

import { useActionState, useEffect, useState } from "react";
import { saveProfileSettings } from "@/app/account/actions";
import { Loader2, Check } from "lucide-react";

export function ProfileSettingsForm({ 
  initialUsername, 
  initialIsPublic 
}: { 
  initialUsername: string, 
  initialIsPublic: boolean 
}) {
  const [state, formAction, isPending] = useActionState(saveProfileSettings, { success: false });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {state.error}
        </div>
      )}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
          Username
        </label>
        <input 
          type="text"
          name="username"
          id="username"
          defaultValue={initialUsername}
          required
          maxLength={30}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue sm:text-sm"
          placeholder="Choose a unique username"
        />
        <p className="mt-1 text-xs text-slate-500">
          This is how you will appear in the Community section.
        </p>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isPortfolioPublic"
            name="isPortfolioPublic"
            type="checkbox"
            defaultChecked={initialIsPublic}
            className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isPortfolioPublic" className="font-medium text-slate-700">
            Public Portfolio
          </label>
          <p className="text-slate-500">
            Allow other users in the community to view your portfolio holdings. 
            (Quantities and dollar values are always hidden).
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          Save Settings
        </button>
        {showSuccess && (
          <span className="flex items-center text-sm font-medium text-data-green">
            <Check className="h-4 w-4 mr-1" />
            Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
