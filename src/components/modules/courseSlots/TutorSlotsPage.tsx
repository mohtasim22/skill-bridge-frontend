"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react"
import { createSlot, updateSlot, deleteSlot } from "@/services/courseSlots"

type Course = {
  id: string
  name: string
}

type Slot = {
  id: string
  name: string
  description: string
  start_time: string
  end_time: string
  date: string
  meeting_link: string
  course_id: string
  course: { name: string }
}

type SlotFormValues = {
  name: string
  description: string
  date: string
  start_time: string
  end_time: string
  meeting_link: string
  course_id: string
}

interface Props {
  initialSlots: Slot[]
  courses: Course[]
}

export default function TutorSlotsPage({ initialSlots, courses }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [openCreate, setOpenCreate] = useState(false)
  const [editSlot, setEditSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)

  const createForm = useForm<SlotFormValues>({
    defaultValues: {
      name: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      meeting_link: "",
      course_id: "",
    },
  })

  const editForm = useForm<SlotFormValues>({
    defaultValues: {
      name: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      meeting_link: "",
      course_id: "",
    },
  })

  const toTimeString = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  const toDateString = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const handleCreate = async (values: SlotFormValues) => {
    try {
      setLoading(true)
      const res = await createSlot(values)

      if (res?.status === "success") {
        setSlots((prev) => [...prev, res.slot])
        setOpenCreate(false)
        createForm.reset()
        toast.success("Slot created successfully")
      } else {
        toast.error(res?.message || "Failed to create slot")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (values: SlotFormValues) => {
    if (!editSlot) return
    try {
      setLoading(true)
      const res = await updateSlot(editSlot.id, values)

      if (res?.status === "success") {
        setSlots((prev) =>
          prev.map((s) => (s.id === editSlot.id ? res.slot : s)) // ✅ use res.slot
        )
        setEditSlot(null)
        toast.success("Slot updated successfully")
      } else {
        toast.error(res?.message || "Failed to update slot")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slotId: string) => {
    try {
      setLoading(true)
      const res = await deleteSlot(slotId)

      if (res?.status === "success") {
        setSlots((prev) => prev.filter((s) => s.id !== slotId))
        toast.success("Slot deleted successfully")
      } else {
        toast.error(res?.message || "Failed to delete slot")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }
  const openEditDialog = (slot: Slot) => {
    setEditSlot(slot)
    editForm.reset({
      name: slot.name,
      description: slot.description,
      date: toDateString(slot.date),
      start_time: toTimeString(slot.start_time),
      end_time: toTimeString(slot.end_time),
      meeting_link: slot.meeting_link,
      course_id: slot.course_id,
    })
  }

  const SlotForm = ({
    form,
    onSubmit,
    submitLabel,
  }: {
    form: any
    onSubmit: (values: SlotFormValues) => void
    submitLabel: string
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Course */}
        <FormField
          control={form.control}
          name="course_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slot Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="e.g. CSE110 Slot 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} rows={2} placeholder="Slot description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start & End Time */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Meeting Link */}
        <FormField
          control={form.control}
          name="meeting_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Link</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="https://meet.google.com/..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  )

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Slots</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Slot</DialogTitle>
            </DialogHeader>
            <SlotForm form={createForm} onSubmit={handleCreate} submitLabel="Create Slot" />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No slots yet. Create your first slot.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>Course</TableHead>
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
                  <TableHead>Meeting Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>
                      <div className="font-medium">{slot.name}</div>
                      <div className="text-xs text-muted-foreground">{slot.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {slot.course?.name ?? slot.course_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(slot.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(slot.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" — "}
                      {new Date(slot.end_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>

                      <a href={slot.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs"
                      >
                        Join Link
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <Dialog
                          open={editSlot?.id === slot.id}
                          onOpenChange={(open) => !open && setEditSlot(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(slot)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Slot</DialogTitle>
                            </DialogHeader>
                            <SlotForm
                              form={editForm}
                              onSubmit={handleEdit}
                              submitLabel="Save Changes"
                            />
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Slot</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`Are you sure you want to delete "${slot.name}"? This action cannot be undone.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(slot.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}