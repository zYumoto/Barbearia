import { addMinutes } from "./format";
import type { Appointment, DayOff, WorkingHour } from "./types";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getAvailableSlots(params: {
  date: string;
  barberId: string | null;
  duration: number;
  workingHours: WorkingHour[];
  appointments: Appointment[];
  daysOff: DayOff[];
}) {
  const weekday = new Date(`${params.date}T12:00:00`).getDay();
  const rule = params.workingHours.find((hour) => hour.weekday === weekday && hour.active && (hour.barberId === params.barberId || hour.barberId === null));
  if (!rule) return [];
  if (params.barberId && params.daysOff.some((day) => day.barberId === params.barberId && day.date === params.date)) return [];
  const start = toMinutes(rule.open);
  const close = toMinutes(rule.close);
  const occupied = params.appointments.filter((appointment) => appointment.appointmentDate === params.date && appointment.status !== "cancelled" && (!params.barberId || appointment.barberId === params.barberId));
  const slots: { time: string; disabled: boolean }[] = [];
  for (let cursor = start; cursor + params.duration <= close; cursor += 30) {
    const end = cursor + params.duration;
    const disabled = occupied.some((appointment) => cursor < toMinutes(appointment.endTime) && end > toMinutes(appointment.startTime));
    slots.push({ time: addMinutes("00:00", cursor), disabled });
  }
  return slots;
}
