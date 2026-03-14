// components/modules/tutors/TutorsClient.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TutorProfileCard from "./tutorCards"

type Tutor = {
  id: string
  display_name: string
  bio: string
  qualification: string
  rating_avg: number
  total_reviews: number
  is_verified: boolean
  courses?: { name: string }[]
  slots?: { name: string }[]
}

export default function TutorsClient({ tutors }: { tutors: Tutor[] }) {
  const [query, setQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("ALL")
  const [courseFilter, setCourseFilter] = useState("ALL")

  // get unique course names from all tutors
  const allCourses = Array.from(
    new Set(
      tutors.flatMap((t) => t.courses?.map((c) => c.name) ?? [])
    )
  )

  const filtered = tutors.filter((tutor) => {
    const q = query.toLowerCase()

    // search filter
    const matchesSearch =
      !q ||
      tutor.display_name.toLowerCase().includes(q) ||
      tutor.courses?.some((c) => c.name.toLowerCase().includes(q)) ||
      tutor.slots?.some((s) => s.name.toLowerCase().includes(q))

    // rating filter
    const matchesRating =
      ratingFilter === "ALL" ||
      tutor.rating_avg >= parseInt(ratingFilter)

    // course filter
    const matchesCourse =
      courseFilter === "ALL" ||
      tutor.courses?.some((c) => c.name === courseFilter)

    return matchesSearch && matchesRating && matchesCourse
  })

  const hasActiveFilters = query || ratingFilter !== "ALL" || courseFilter !== "ALL"

  const clearFilters = () => {
    setQuery("")
    setRatingFilter("ALL")
    setCourseFilter("ALL")
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tutors</h1>
        <Badge variant="outline">{filtered.length} tutors</Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tutor, course or slot name..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Rating Filter */}
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Ratings</SelectItem>
            <SelectItem value="5">5★ only</SelectItem>
            <SelectItem value="4">4★ & above</SelectItem>
            <SelectItem value="3">3★ & above</SelectItem>
            <SelectItem value="2">2★ & above</SelectItem>
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Courses</SelectItem>
            {allCourses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary">
              Search: "{query}"
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setQuery("")}
              />
            </Badge>
          )}
          {ratingFilter !== "ALL" && (
            <Badge variant="secondary">
              Rating: {ratingFilter}★+
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setRatingFilter("ALL")}
              />
            </Badge>
          )}
          {courseFilter !== "ALL" && (
            <Badge variant="secondary">
              Course: {courseFilter}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setCourseFilter("ALL")}
              />
            </Badge>
          )}
          <p className="text-sm text-muted-foreground self-center">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Tutors Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No tutors found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((tutor) => (
            <TutorProfileCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  )
}