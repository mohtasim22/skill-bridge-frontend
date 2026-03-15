"use server"

import { cookies } from "next/headers"

export const createBooking = async (payload: {
  course_slot_id: string
  tutor_id: string
}) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  return result
}


export const getBookings = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            cache: "no-store"
        },
    )

    const result = await res.json();
    console.log(result)
    return result;
}
export const getTutorBookings = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            cache: "no-store"
        },
    )

    const result = await res.json();
    return result;
}

export const updateBookingStatus = async (
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | "COMPLETED" 
) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ booking_status: status }),
    }
  )
  const data = await res.json()
  return data
}