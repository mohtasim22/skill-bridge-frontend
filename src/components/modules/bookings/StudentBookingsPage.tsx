"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookOpen, Calendar, Clock, Link2, User } from "lucide-react"

type Booking = {
  id: string
  student_id: string
  tutor_id: string
  course_slot_id: string
  booking_status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: string
  updatedAt: string
  tutor: {
    display_name: string
    qualification: string
    is_verified: boolean
  }
  courseSlot: {
    id: string
    name: string
    description: string
    start_time: string
    end_time: string
    date: string
    meeting_link: string
  }
}

interface Props {
  bookings: Booking[]
}

const statusVariant: Record< // ✅ fixed missing 
  Booking["booking_status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  CONFIRMED: "default",
  PENDING: "secondary",
  CANCELLED: "destructive",
  COMPLETED: "outline",
}

export default function StudentBookingsPage({ bookings }: Props) {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Badge variant="outline">{bookings.length} total</Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => (
          <Card key={status}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {bookings.filter((b) => b.booking_status === status).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No bookings yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Tutor
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Meeting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.courseSlot.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.courseSlot.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{booking.tutor.display_name}</span>
                        {booking.tutor.is_verified && (
                          <Badge variant="outline" className="text-xs px-1 py-0">✓</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {booking.tutor.qualification}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.courseSlot.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.courseSlot.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" — "}
                      {new Date(booking.courseSlot.end_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[booking.booking_status]}>
                        {booking.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.booking_status === "CONFIRMED" ? (
                        <a 
                          href={booking.courseSlot.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
                        >
                          <Link2 className="h-4 w-4" />
                          Join
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}