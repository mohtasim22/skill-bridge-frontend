"use server";

import { cookies } from "next/headers"

const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}

export const createCourse = async (payload: {
  name: string
  description: string
}) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  })
  const result = await res.json();
  console.log(result)
        return result;
}

export const updateCourse = async (
  courseId: string,
  payload: { name?: string; description?: string }
) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const deleteCourse = async (courseId: string) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `${token}` },
  })
  return res.json()
}

export const getAllCoursesByTutorId = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await res.json();
        console.log("c back",result)
        return result;

    } catch (error) {
        console.log(error);
    }
};