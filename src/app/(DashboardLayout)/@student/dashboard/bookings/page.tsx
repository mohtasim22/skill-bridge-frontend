// @student/dashboard/bookings/page.tsx

// import { getStudentBookings } from "@/services/bookings"
import { getUser } from "@/services/auth"
import StudentBookingsPage from "@/components/modules/bookings/StudentBookingsPage"
import { getBookings } from "@/services/bookings"

export default async function BookingsPage() {
  const user = await getUser()
  const  bookings  = await getBookings()

  return <StudentBookingsPage bookings={bookings ?? []} />
}