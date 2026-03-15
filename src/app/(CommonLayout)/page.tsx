// app/(CommonLayout)/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, BookOpen, Users, Clock, ArrowRight, CheckCircle } from "lucide-react"
import { getAllTutors } from "@/services/tutor"
export const dynamic = "force-dynamic"

export default async function HomePage() {
  let featuredTutors: any[] = []

  try {
    const data = await getAllTutors()
    const tutors = data?.tutor ?? data?.tutors ?? []
    featuredTutors = tutors
      .sort((a: any, b: any) => b.rating_avg - a.rating_avg)
      .slice(0, 3)
  } catch {
    featuredTutors = []
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="py-24 px-4 text-center space-y-6 border-b">
        <Badge variant="outline" className="text-xs">
          Learn from the best tutors
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
          Find the right tutor for your learning journey
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-base">
          Book one-on-one sessions with verified tutors. Learn at your own pace, on your own schedule.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/course-slots">Browse Slots</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tutors">Meet Tutors</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold">{featuredTutors?.length ?? 0}+</div>
            <p className="text-sm text-muted-foreground">Expert Tutors</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">100+</div>
            <p className="text-sm text-muted-foreground">Sessions Booked</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">4.8★</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">How it works</h2>
            <p className="text-sm text-muted-foreground">Get started in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-6 w-6" />,
                step: "01",
                title: "Browse Tutors",
                desc: "Explore verified tutors and find the perfect match for your needs.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                step: "02",
                title: "Book a Slot",
                desc: "Pick a time that works for you and book your session instantly.",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                step: "03",
                title: "Start Learning",
                desc: "Join the session via the meeting link and start learning.",
              },
            ].map(({ icon, step, title, desc }) => (
              <Card key={step} className="border-none shadow-none">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">{icon}</div>
                    <span className="text-xs text-muted-foreground font-mono">{step}</span>
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Featured Tutors</h2>
              <p className="text-sm text-muted-foreground">
                Top-rated tutors ready to help you
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/tutors" className="flex items-center gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredTutors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No tutors available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTutors.map((tutor: any) => {
                const initials = tutor.display_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <Card key={tutor.id} className="hover:shadow-md transition">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm truncate">
                              {tutor.display_name}
                            </p>
                            {tutor.is_verified && (
                              <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground uppercase truncate">
                            {tutor.qualification}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tutor.bio || "No bio provided."}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{tutor.rating_avg}</span>
                          <span className="text-muted-foreground">
                            ({tutor.total_reviews})
                          </span>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/tutors/${tutor.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center space-y-6">
        <h2 className="text-2xl font-bold">Ready to start learning?</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Join hundreds of students already learning with SkillBridge tutors.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course-slots">Browse Slots</Link>
          </Button>
        </div>
      </section>

    </div>
  )
}