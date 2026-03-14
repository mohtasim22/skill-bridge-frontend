"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

type CourseSlot = {
  id: string
  name: string
  start_time: string
  end_time: string
  tutor: {
    display_name: string
  }
  course: {
    name: string
  }
}

interface Props {
  slot: CourseSlot
}

export default function CourseSlotCard({ slot }: Props) {
  const router = useRouter();
  const start = new Date(slot.start_time)
  const end = new Date(slot.end_time)

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleMoreDetails = () => {
    const token = document.cookie.includes("token");
    if (!token) {
      router.push(`/login?redirect=/course-slots/${slot.id}`);
      return;
    }
    router.push(`/course-slots/${slot.id}`);
  };  

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="text-lg">
          {slot.course.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {slot.name}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(start)}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatTime(start)} — {formatTime(end)}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Tutor: {slot.tutor.display_name}
        </p>

        <Button className="w-full" onClick={handleMoreDetails}>
            More Details
          
        </Button>
      </CardContent>
    </Card>
  )
}