import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSingleSlot } from "@/services/courseSlots"
import { Calendar, Clock, Star, User, BookOpen, Link, CheckCircle } from "lucide-react"
import BookSlotButton from "@/components/modules/courseSlots/BookSlotButton"

export default async function CourseSlotDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { slot } = await getSingleSlot(id);

  const start = new Date(slot.start_time);
  const end = new Date(slot.end_time);
  const date = new Date(slot.date);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{slot.course.name}</CardTitle>
            <Badge variant={slot.course.status === "ACTIVE" ? "default" : "secondary"}>
              {slot.course.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{slot.name}</p>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Description */}
          <p className="text-sm">{slot.description}</p>

          {/* Date & Time */}
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            <h3 className="font-medium mb-2">Schedule</h3>
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {date.toDateString()}
            </div>
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {start.toLocaleTimeString()} — {end.toLocaleTimeString()}
            </div>
          </div>

          {/* Course Info */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Details
            </h3>
            <p className="text-sm text-muted-foreground">{slot.course.description}</p>
          </div>

          {/* Tutor Info */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Tutor
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-medium">{slot.tutor.display_name}</span>
              {slot.tutor.is_verified && (
                <CheckCircle className="h-4 w-4 text-green-500"  />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{slot.tutor.bio}</p>
            <p className="text-sm text-muted-foreground">
              Qualification: {slot.tutor.qualification}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{slot.tutor.rating_avg}</span>
              <span className="text-muted-foreground">({slot.tutor.total_reviews} reviews)</span>
            </div>
          </div>

          {/* Meeting Link */}
          {/* <div className="border rounded-lg p-4 space-y-2 text-sm">
            <h3 className="font-medium flex items-center gap-2">
              <Link className="h-4 w-4" />
              Meeting Link
            </h3>
            <a
              href={slot.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {slot.meeting_link}
            </a>
          </div> */}

          {/* Booking Button */}
          
            <BookSlotButton
              slotId={slot.id}
              tutorId={slot.tutor_id} 
            />

        </CardContent>
      </Card>
    </div>
  );
}