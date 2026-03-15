"use server";
import { SignJWT } from "jose";
import { jwtDecode } from "jwt-decode";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";


export const registerUser = async (payload: {
  name: string
  email: string
  password: string
  role: "STUDENT" | "TUTOR"
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();
    const storeCookie = await cookies();
    if (result.status === "success") {
      storeCookie.set("token", result?.user?.token);
    }
    return result;
  } catch (error) {
  }
};

export const getUser = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    return null;
  }
};

export const updateUserProfile = async (updatedData: { name?: string; email?: string }) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updatedData),
      
    });

    const result = await res.json();

    if (result.status === "success") {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const newToken = await new SignJWT({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        status: result.user.status,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      storeCookie.set("token", newToken); 
      revalidatePath("/dashboard/profile");
    }

    return result;
  } catch (error) {
  }
};

export const UserLogOut = async () => {
  const storeCookie = await cookies();
  storeCookie.delete("token");
};