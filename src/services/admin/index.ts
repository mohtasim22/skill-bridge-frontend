"use server"

import { cookies } from "next/headers"

const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}

export const getAdminStats = async () => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/stats`, {
    headers: { Authorization: `${token}` },
    cache: "no-store",
  })
  return res.json()
}

export const getAllUsers = async () => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`, {
    headers: { Authorization: `${token}` },
    cache: "no-store",
  })
  const result = await res.json()
  return result
}


export const updateUserStatus = async (userId: string, status: string) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

export const getAllAdminCourses = async () => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`, {
    headers: { Authorization: `${token}` },
    cache: "no-store",
  })
  const result = await res.json()
  return result
}

export const updateCourseStatus = async (courseId: string, status: string) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ status }),
  })
  const result = await res.json()
  return result
}

export const deleteCourse = async (courseId: string) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `${token}` },
  })
  return res.json()
}

export const getAllAdminReviews = async () => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
    headers: { Authorization: `${token}` },
    cache: "no-store",
  })
  return res.json()
}

export const updateReviewStatus = async (reviewId: string, 
    status: "APPROVED" | "REJECTED") => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({status}),
  })
  const result = await res.json()
  return result
}

export const adminDeleteReview = async (reviewId: string) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `${token}` },
  })
  return res.json()
}


export const verifyTutor = async (tutorId: string, is_verified: boolean) => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tutors/${tutorId}/verify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ is_verified }),
  })
  const result = await res.json()
  console.log(result)
  return result
}