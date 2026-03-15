
"use server"

import { cookies } from "next/headers"

export const createReview = async (payload: {
  booking_id: string
  tutor_id: string
  rating: number
  comment?: string
}) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}


export const getTutorReviews = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`
    },
    cache: "no-store",
  })
  return res.json()
}

// services/reviews/index.ts
export const getTutorReviewsById = async (tutorId: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${tutorId}`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`
      },
      cache: "no-store"
    }
  )
  const result = await res.json();
  return result
}

export const updateReview = async (
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const getPublicTutorReviews = async (tutorId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/tutor/${tutorId}/public`,
    { cache: "no-store" }
  )
  const result = await res.json();
  console.log(result)
  return result
}