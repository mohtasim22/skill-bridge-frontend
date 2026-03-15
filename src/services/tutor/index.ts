"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const getAllTutors = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tutors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    const result = await res.json();
    console.log("t back ",result)

    return result;

  } catch (error) {
    return { tutor: [] }
  }
};

export const getTutorProfile = async ({
  userId,
  tutorId,
}: {
  userId?: string;
  tutorId?: string;
}) => {
  const query = userId ? `userId=${userId}` : `tutorId=${tutorId}`;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tutors/single?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    return result;
  } catch (error) {
    console.log(error);
  }
};


export const updateTutorProfile = async (updatedData: FieldValues) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tutors/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await res.json();
    console.log(result)
    return result;
  } catch (error) {
    console.log(error);
  }
};


export const createTutorProfile = async (payload: {
  display_name: string
  bio: string
  qualification: string
  email: string | null
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tutors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  const result = await res.json();
  console.log(result)
    return result;
}