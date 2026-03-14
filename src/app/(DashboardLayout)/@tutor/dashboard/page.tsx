// @tutor/dashboard/page.tsx
import { getUser } from "@/services/auth"
import { getTutorProfile } from "@/services/tutor"
import { getBookings } from "@/services/bookings"
import { getTutorReviews } from "@/services/reviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CalendarCheck,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default async function TutorDashboardPage() {
  const user = await getUser()
  const { tutor } = await getTutorProfile({ userId: user?.id })
  const [bookings, { reviews }] = await Promise.all([
    getBookings(),
    getTutorReviews(),
  ])

  const pending = bookings?.filter((b: any) => b.booking_status === "PENDING").length ?? 0
  const confirmed = bookings?.filter((b: any) => b.booking_status === "CONFIRMED").length ?? 0
  const completed = bookings?.filter((b: any) => b.booking_status === "COMPLETED").length ?? 0
  const total = bookings?.length ?? 0

  const recentBookings = bookings?.slice(0, 3) ?? []
  const recentReviews = reviews?.slice(0, 2) ?? []

  const initials = tutor?.display_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "TU"

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">

      {/* Welcome */}
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              Welcome back, {tutor?.display_name} 👋
            </h1>
            {tutor?.is_verified && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here is an overview of your teaching activity.
          </p>
        </div>
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
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Completed</span>
            </div>
            <div className="text-2xl font-bold">{completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-muted">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{tutor?.rating_avg ?? 0}</span>
                <span className="text-sm text-muted-foreground">
                  ({tutor?.total_reviews ?? 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/reviews" className="flex items-center gap-1">
              View Reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm text-muted-foreground text-center py-4">
                No bookings yet.
              </p>
            ) : (
              recentBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border rounded-lg p-3 text-sm"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium">{booking.courseSlot?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.student?.name} •{" "}
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

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Reviews</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/reviews" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No reviews yet.
              </p>
            ) : (
              recentReviews.map((review: any) => (
                <div key={review.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{review.student?.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/slots">
              <Plus className="h-4 w-4 mr-2" />
              Manage Slots
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/bookings">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Booked Slots
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/reviews">
              <MessageSquare className="h-4 w-4 mr-2" />
              Reviews
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}