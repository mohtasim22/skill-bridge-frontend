"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Star, Pencil, BookOpen, Calendar, Clock } from "lucide-react"
import { createReview, updateReview } from "@/services/reviews"

type Review = {
    id: string
    rating: number
    comment?: string
    status: string
}

type Booking = {
    id: string
    booking_status: "COMPLETED"
    createdAt: string
    tutor_id: string
    tutor: {
        display_name: string
        qualification: string
    }
    courseSlot: {
        name: string
        description: string
        date: string
        start_time: string
        end_time: string
    }
    review?: Review
}

type ReviewFormValues = {
    rating: number
    comment: string
}

interface Props {
    bookings: Booking[]
}

// Star Rating Component
const StarRating = ({
    value,
    onChange,
}: {
    value: number
    onChange: (rating: number) => void
}) => {
    const [hovered, setHovered] = useState(0)

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${star <= (hovered || value)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                />
            ))}
        </div>
    )
}

// Display Stars (read-only)
const DisplayStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`h-4 w-4 ${star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    }`}
            />
        ))}
    </div>
)

export default function StudentBookingHistoryPage({ bookings }: Props) {
    const [bookingList, setBookingList] = useState<Booking[]>(bookings)
    const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const form = useForm<ReviewFormValues>({
  defaultValues: {
    rating: 0,
    comment: "",
  },
  // ✅ add validation
  resolver: undefined, // or use zodResolver if you have zod
})

    const openReviewDialog = (booking: Booking, editing = false) => {
        setActiveBooking(booking)
        setIsEditing(editing)
        setOpen(true)
        form.reset({
            rating: booking.review?.rating ?? 0,
            comment: booking.review?.comment ?? "",
        })
    }

    const onSubmit = async (values: ReviewFormValues) => {
        if (!activeBooking) return
        if (values.rating === 0) {
            toast.error("Please select a rating")
            return
        }

        try {
            setLoading(true)
            const payload = {
                ...values,
                booking_id: activeBooking.id,
                tutor_id: activeBooking.tutor_id,
            }

            const res = isEditing && activeBooking.review
                ? await updateReview(activeBooking.review.id, values)
                : await createReview(payload)

            if (res?.status === "success") {
                setBookingList((prev) =>
                    prev.map((b) =>
                        b.id === activeBooking.id
                            ? { ...b, review: res.review }
                            : b
                    )
                )
                setOpen(false)
                toast.success(isEditing ? "Review updated!" : "Review submitted!")
            } else {
                toast.error(res?.message || "Failed to submit review")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Booking History</h1>
                <Badge variant="outline">{bookingList.length} completed</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Completed Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {bookingList.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No completed bookings yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Slot</TableHead>
                                    <TableHead>Tutor</TableHead>
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
                                    <TableHead>Your Review</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookingList.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>
                                            <div className="font-medium">{booking.courseSlot.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {booking.courseSlot.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {booking.tutor.display_name}
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

                                        {/* Review */}
                                        <TableCell>
                                            {booking.review ? (
                                                <div className="space-y-1">
                                                    <DisplayStars rating={booking.review.rating} />
                                                    {booking.review.comment && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {booking.review.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No review yet</span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            {booking.review ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openReviewDialog(booking, true)}
                                                >
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    Edit Review
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => openReviewDialog(booking, false)}
                                                >
                                                    <Star className="h-4 w-4 mr-1" />
                                                    Leave Review
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Review Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Edit Your Review" : "Leave a Review"}
                        </DialogTitle>
                    </DialogHeader>
                    {activeBooking && (
                        <div className="text-sm text-muted-foreground mb-2">
                            {activeBooking.courseSlot.name} — {activeBooking.tutor.display_name}
                        </div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Star Rating */}
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <FormControl>
                                            <StarRating
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Comment */}
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment (optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                rows={3}
                                                placeholder="Share your experience..."
                                                maxLength={150}
                                            />
                                        </FormControl>
                                        {/* ✅ character counter */}
                                        <p className="text-xs text-muted-foreground text-right">
                                            {field.value?.length ?? 0}/150
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}