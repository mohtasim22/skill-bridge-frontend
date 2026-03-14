// components/modules/courseSlots/CourseSlotsClient.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CourseSlotCard from "./slotCards"

type Slot = {
  id: string
  name: string
  start_time: string
  end_time: string
  tutor: { display_name: string }
  course: { name: string }
}

export default function CourseSlotsClient({ slots }: { slots: Slot[] }) {
  const [query, setQuery] = useState("")

  const filtered = slots.filter((slot) => {
    const q = query.toLowerCase()
    return (
      slot.name.toLowerCase().includes(q) ||
      slot.course?.name.toLowerCase().includes(q) ||
      slot.tutor?.display_name.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Course Slots</h1>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by slot, course or tutor name..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
        </p>
      )}

      {/* Slots Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No slots found for "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((slot) => (
            <CourseSlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  )
}