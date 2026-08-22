"use server";

import { redirect } from "next/navigation";
import { demoPassword, setAuthed } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/");
  if (password !== demoPassword()) {
    redirect("/login?error=1");
  }
  await setAuthed();
  redirect(next.startsWith("/") ? next : "/");
}
