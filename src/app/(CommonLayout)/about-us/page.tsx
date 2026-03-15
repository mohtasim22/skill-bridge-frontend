// app/(CommonLayout)/about-us/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Users, Star, Shield, Target, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const team = [
  {
    name: "Shahed Haque",
    role: "Founder & CEO",
    bio: "Passionate about making quality education accessible to everyone.",
    initials: "SH",
  },
  {
    name: "Fahim Hossain",
    role: "Lead Developer",
    bio: "Building seamless experiences for students and tutors alike.",
    initials: "FH",
  },
  {
    name: "Ayesha Rahman",
    role: "Head of Tutors",
    bio: "Ensuring every tutor meets our high quality standards.",
    initials: "AR",
  },
]

const values = [
  {
    icon: <Target className="h-5 w-5" />,
    title: "Quality First",
    desc: "Every tutor is verified and vetted to ensure the best learning experience.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Student Focused",
    desc: "Everything we build is designed with the student's success in mind.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Trust & Safety",
    desc: "A safe and transparent platform for both students and tutors.",
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Excellence",
    desc: "We hold ourselves and our tutors to the highest standards.",
  },
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="py-24 px-4 text-center space-y-6 border-b">
        <Badge variant="outline" className="text-xs">Our Story</Badge>
        <h1 className="text-4xl font-bold tracking-tight max-w-xl mx-auto">
          We believe great learning starts with the right tutor
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          SkillBridge was built to close the gap between students who want to learn
          and expert tutors who want to teach — making quality education accessible
          to everyone, everywhere.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-md bg-muted">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <h3 className="font-semibold">Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              To make personalized learning accessible and affordable for every student.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-md bg-muted">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <h3 className="font-semibold">Our Community</h3>
            <p className="text-sm text-muted-foreground">
              A growing network of verified tutors and motivated students from all backgrounds.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-md bg-muted">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <h3 className="font-semibold">Our Vision</h3>
            <p className="text-sm text-muted-foreground">
              A world where anyone can learn anything from the best minds around them.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">What we stand for</h2>
            <p className="text-sm text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map(({ icon, title, desc }) => (
              <Card key={title} className="border shadow-none">
                <CardContent className="pt-6 flex gap-4">
                  <div className="p-2 rounded-md bg-muted h-fit">{icon}</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center space-y-6">
        <h2 className="text-2xl font-bold">Join SkillBridge today</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Whether you want to learn or teach, there is a place for you here.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tutors">Browse Tutors</Link>
          </Button>
        </div>
      </section>

    </div>
  )
}