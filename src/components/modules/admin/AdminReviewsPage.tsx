// components/modules/admin/AdminReviewsPage.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Star, Trash2, MessageSquare } from "lucide-react"
import { updateReviewStatus, adminDeleteReview } from "@/services/admin"

type Review = {
  id: string
  rating: number
  comment?: string
  status: string
  createdAt: string
  student: { name: string }
  tutor: { display_name: string }
}

export default function AdminReviewsPage({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusToggle = async (reviewId: string, currentStatus: string) => {
    const newStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED"
    try {
      setLoading(reviewId)
      const res = await updateReviewStatus(reviewId, newStatus as "APPROVED" | "REJECTED" )
      if (res?.status === "success") {
        setReviews((prev) =>
          prev.map((r) => r.id === reviewId ? { ...r, status: newStatus } : r)
        )
        toast.success("Review status updated")
      } else {
        toast.error(res?.message || "Failed to update status")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (reviewId: string) => {
    try {
      setLoading(reviewId)
      const res = await adminDeleteReview(reviewId)
      if (res?.status === "success") {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        toast.success("Review deleted")
      } else {
        toast.error(res?.message || "Failed to delete review")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Reviews</h1>
        <Badge variant="outline">{reviews.length} total</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            All Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="text-sm font-medium">
                    {review.student?.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {review.tutor?.display_name}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.comment || "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.status === "APPROVED" ? "default" : "secondary"}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loading === review.id}
                        onClick={() => handleStatusToggle(review.id, review.status)}
                        className={review.status === "APPROVED"
                          ? "text-red-600 border-red-600 hover:bg-red-50"
                          : "text-green-600 border-green-600 hover:bg-green-50"
                        }
                      >
                        {review.status === "APPROVED" ? "Reject" : "Approve"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            disabled={loading === review.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(review.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}