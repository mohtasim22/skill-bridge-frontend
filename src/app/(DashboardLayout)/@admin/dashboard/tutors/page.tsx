// @admin/dashboard/tutors/page.tsx
import AdminTutorsPage from "@/components/modules/admin/AdminTutorsPage"
import { getAllTutors } from "@/services/tutor"


export default async function TutorsPage() {
  const { tutor } = await getAllTutors()
  console.log("t front", tutor)
  return <AdminTutorsPage initialTutors={tutor ?? []} />
}