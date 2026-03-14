// @student/dashboard/page.tsx
import { getUser } from "@/services/auth"
import { getBookings } from "@/services/bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Clock, BookOpen, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function StudentDashboardPage() {
  const user = await getUser()
  const bookings = await getBookings() ?? []

  const pending = bookings.filter((b: any) => b.booking_status === "PENDING").length
  const confirmed = bookings.filter((b: any) => b.booking_status === "CONFIRMED").length
  const completed = bookings.filter((b: any) => b.booking_status === "COMPLETED").length
  const total = bookings.length

  const recentBookings = bookings.slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is an overview of your learning activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Total Bookings</span>
            </div>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Pending</span>
            </div>
            <div className="text-2xl font-bold">{pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarCheck className="h-4 w-4" />
              <span className="text-xs">Confirmed</span>
            </div>
            <div className="text-2xl font-bold">{confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="text-xs">Completed</span>
            </div>
            <div className="text-2xl font-bold">{completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/bookings" className="flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentBookings.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No bookings yet.{" "}
              <Link href="/course-slots" className="text-foreground underline">
                Browse slots
              </Link>
            </div>
          ) : (
            recentBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border rounded-lg p-3 text-sm"
              >
                <div className="space-y-0.5">
                  <p className="font-medium">{booking.courseSlot?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.tutor?.display_name} •{" "}
                    {new Date(booking.courseSlot?.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.booking_status === "CONFIRMED"
                      ? "default"
                      : booking.booking_status === "CANCELLED"
                      ? "destructive"
                      : booking.booking_status === "COMPLETED"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {booking.booking_status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/course-slots">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Slots
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/tutors">
              <Star className="h-4 w-4 mr-2" />
              Find Tutors
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/history">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Booking History
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}