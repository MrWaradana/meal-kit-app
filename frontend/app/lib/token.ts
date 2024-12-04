"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setToken(data: any, name: any) {
  const cookie = await cookies();
  cookie.set(name, data);
}

export async function getToken() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  return token;
}

export async function getRole() {
  const cookie = await cookies();
  const role = cookie.get("role")?.value;
  return role;
}

export async function removeToken() {
  const cookie = await cookies();
  cookie.delete("token");
  cookie.delete("role");
  redirect(`/login`);
}
