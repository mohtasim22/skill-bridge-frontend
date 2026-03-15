"use server";

import { cookies } from "next/headers";

const formatDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  const d = new Date(year, month - 1, day, hours, minutes, 0)
  return d.toISOString()
}

export const createSlot = async (payload: {
  name: string
  description: string
  date: string
  start_time: string
  end_time: string
  meeting_link: string
  course_id: string
}) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const formattedPayload = {
    name: payload.name,
    description: payload.description,
    meeting_link: payload.meeting_link,
    course_id: payload.course_id,
    date: new Date(payload.date).toISOString(),
    start_time: formatDateTime(payload.date, payload.start_time),
    end_time: formatDateTime(payload.date, payload.end_time),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(formattedPayload),
  })
  return res.json()
}

export const updateSlot = async (slotId: string, payload: Partial<{
  name: string
  description: string
  date: string
  start_time: string
  end_time: string
  meeting_link: string
  course_id: string
}>) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const formattedPayload = {
    ...(payload.name && { name: payload.name }),
    ...(payload.description && { description: payload.description }),
    ...(payload.meeting_link && { meeting_link: payload.meeting_link }),
    ...(payload.course_id && { course_id: payload.course_id }),
    ...(payload.date && { date: new Date(payload.date).toISOString() }),
    ...(payload.date && payload.start_time && {
      start_time: formatDateTime(payload.date, payload.start_time),
    }),
    ...(payload.date && payload.end_time && {
      end_time: formatDateTime(payload.date, payload.end_time),
    }),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots/${slotId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(formattedPayload),
  })
  return res.json()
}



export const getAllCourseSlots = async () => {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots/allslots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleSlot = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
        cache: "no-store"
      },
    );

    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
export const getSlotByTutor = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots/tutor/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store"
      },
    );

    const result = await res.json();
    
    return result;
  } catch (error: any) {
    return Error(error);
  }
};


export const deleteSlot = async (slotId: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/slots/${slotId}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
    },
  })
  return res.json()
}