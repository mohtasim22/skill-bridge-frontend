"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"

type Tutor = {
  id: string
  display_name: string
  bio: string
  qualification: string
  rating_avg: number
  total_reviews: number
  is_verified: boolean
}

interface Props {
  tutor: Tutor
}

export default function TutorProfileCard({ tutor }: Props) {
  const router = useRouter();

  const initials = tutor.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleViewProfile = () => {
    const token = document.cookie.includes("token");
    if (!token) {
      router.push(`/login?redirect=/tutors/${tutor.id}`);
      return;
    }
    router.push(`/tutors/${tutor.id}`);
  };

  return (
    <Card className="w-full max-w-sm transition hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {tutor.display_name}
            {tutor.is_verified && (
              <Badge variant="secondary">Verified</Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            {tutor.qualification.toUpperCase()}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {tutor.bio || "No bio provided."}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{tutor.rating_avg}</span>
          <span className="text-muted-foreground">
            ({tutor.total_reviews} reviews)
          </span>
        </div>

        <Button className="w-full" onClick={handleViewProfile}>
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}