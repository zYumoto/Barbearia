import { addMinutes } from "./format";
import type { Appointment, Barber, DayOff, WorkingHour } from "./types";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function hasBarberConflict(params: {
  appointments: Appointment[];
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  ignoreAppointmentId?: string;
}) {
  const start = toMinutes(params.startTime);
  const end = toMinutes(params.endTime);
  return params.appointments.some((appointment) => {
    if (appointment.id === params.ignoreAppointmentId) return false;
    if (appointment.status === "cancelled") return false;
    if (appointment.barberId !== params.barberId) return false;
    if (appointment.appointmentDate !== params.date) return false;
    return start < toMinutes(appointment.endTime) && end > toMinutes(appointment.startTime);
  });
}

function isBarberWorking(params: {
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  workingHours: WorkingHour[];
  daysOff: DayOff[];
}) {
  if (params.daysOff.some((day) => day.barberId === params.barberId && day.date === params.date)) return false;
  const weekday = new Date(`${params.date}T12:00:00`).getDay();
  const rule = params.workingHours.find((hour) => hour.weekday === weekday && hour.active && (hour.barberId === params.barberId || hour.barberId === null));
  if (!rule) return false;
  return toMinutes(params.startTime) >= toMinutes(rule.open) && toMinutes(params.endTime) <= toMinutes(rule.close);
}

export function findAvailableBarberId(params: {
  barbers: Barber[];
  appointments: Appointment[];
  workingHours: WorkingHour[];
  daysOff: DayOff[];
  date: string;
  startTime: string;
  endTime: string;
}) {
  return params.barbers.find((barber) => {
    if (!barber.active) return false;
    if (!isBarberWorking({ barberId: barber.id, date: params.date, startTime: params.startTime, endTime: params.endTime, workingHours: params.workingHours, daysOff: params.daysOff })) return false;
    return !hasBarberConflict({ appointments: params.appointments, barberId: barber.id, date: params.date, startTime: params.startTime, endTime: params.endTime });
  })?.id ?? null;
}

export function getAvailableSlots(params: {
  date: string;
  barberId: string | null;
  duration: number;
  barbers?: Barber[];
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
  const slots: { time: string; disabled: boolean }[] = [];
  for (let cursor = start; cursor + params.duration <= close; cursor += 30) {
    const time = addMinutes("00:00", cursor);
    const endTime = addMinutes(time, params.duration);
    const disabled = params.barberId
      ? hasBarberConflict({ appointments: params.appointments, barberId: params.barberId, date: params.date, startTime: time, endTime })
      : !findAvailableBarberId({ barbers: params.barbers ?? [], appointments: params.appointments, workingHours: params.workingHours, daysOff: params.daysOff, date: params.date, startTime: time, endTime });
    slots.push({ time, disabled });
  }
  return slots;
}
