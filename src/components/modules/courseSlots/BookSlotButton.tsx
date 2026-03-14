// components/modules/courseSlots/BookSlotButton.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createBooking } from "@/services/bookings"

interface Props {
  slotId: string
  tutorId: string
}

export default function BookSlotButton({ slotId, tutorId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBooking = async () => {
    const token = document.cookie.includes("token")
    if (!token) {
      router.push(`/login?redirect=/course-slots/${slotId}`)
      return
    }

    try {
      setLoading(true)
      const res = await createBooking({
        course_slot_id: slotId,
        tutor_id: tutorId
      })

      if (res?.status === "success") {
        toast.success("Slot booked successfully!")
        router.push("/dashboard/bookings")
      } else {
        toast.error(res?.message || "Failed to book slot")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleBooking} disabled={loading}>
      {loading ? "Booking..." : "Book This Slot"}
    </Button>
  )
}