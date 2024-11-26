"use server";
import { cookies } from "next/headers";

export async function setToken(data: any) {
  const cookie = await cookies();
  cookie.set("token", data);
}

export async function getToken() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  return token;
}
