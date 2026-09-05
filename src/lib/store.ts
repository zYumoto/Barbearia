import { addDaysIso, addMinutes, nextBusinessDayIso, todayIso } from "./format";
import type { Appointment, AppointmentStatus, Barber, Database, Payment, Profile, Service } from "./types";

const DB_KEY = "mt-barbearia-db-v2";
const SESSION_KEY = "mt-barbearia-session";

const adminId = "admin-fixed";
const demoId = "demo-customer";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function seed(): Database {
  const now = new Date().toISOString();
  const services: Service[] = [
    ["svc-corte", "Corte Masculino", "Corte personalizado de acordo com seu estilo e formato de rosto.", 45, 40, "scissors"],
    ["svc-barba", "Barba", "Modelagem completa da barba, aparo e acabamento profissional.", 35, 30, "razor"],
    ["svc-combo", "Corte + Barba", "Experiência completa para renovar completamente seu visual.", 70, 60, "sparkles"],
    ["svc-premium", "Corte Premium", "Consultoria de estilo, corte com tesoura/navalha, lavagem e finalização.", 65, 50, "crown"],
    ["svc-sobrancelha", "Sobrancelha", "Limpeza e alinhamento para valorizar a expressão.", 20, 15, "eye"],
    ["svc-pigmentacao", "Pigmentação de Barba", "Correção sutil de falhas e definição.", 40, 30, "brush"]
  ].map(([serviceId, name, description, price, durationMinutes, iconKey], index) => ({
    id: serviceId as string,
    name: name as string,
    description: description as string,
    price: price as number,
    durationMinutes: durationMinutes as number,
    iconKey: iconKey as string,
    active: true,
    sortOrder: index + 1
  }));
  const barbers: Barber[] = [
    ["barber-lucas", "Lucas Oliveira", ["Degradê", "Social", "Barba"], 4.9, 620, "Técnica limpa e atendimento consultivo para visuais executivos."],
    ["barber-rafael", "Rafael Almeida", ["Navalhado", "Corte premium", "Finalização"], 4.9, 460, "Especialista em desenho de corte e acabamento de alta definição."],
    ["barber-diego", "Diego Souza", ["Barbas longas", "Pigmentação", "Sobrancelha"], 4.8, 390, "Olhar preciso para barba cheia, volume e correção natural."],
    ["barber-marcos", "Marcos Lima", ["Cacheados", "Social", "Corte + barba"], 4.9, 430, "Combina tradição e textura para estilos modernos sem exagero."]
  ].map(([barberId, name, specialties, rating, appointmentsCount, bio]) => ({
    id: barberId as string,
    name: name as string,
    specialties: specialties as string[],
    rating: rating as number,
    appointmentsCount: appointmentsCount as number,
    bio: bio as string,
    active: true,
    createdAt: now
  }));
  const profiles: Profile[] = [
    { id: adminId, fullName: "Administrador Mt Barbearia", email: "admin@mtbarbearia.com", password: "Admin@123", phone: "(13) 98859-2508", birthDate: "1990-01-01", role: "admin", createdAt: now },
    { id: demoId, fullName: "João Pereira", email: "cliente@mtbarbearia.com", password: "Cliente@123", phone: "(13) 98859-2508", birthDate: "1995-05-12", role: "customer", favoriteBarberId: "barber-lucas", favoriteServiceId: "svc-combo", createdAt: now }
  ];
  const workingHours = [1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `wh-${weekday}`,
    barberId: null,
    weekday,
    open: "09:00",
    close: weekday === 6 ? "18:00" : "20:00",
    active: true
  }));
  const pastDates = [-62, -48, -35, -22, -14, -6].map(addDaysIso);
  const customerHistory = pastDates.map((appointmentDate, index) => {
    const service = services[index % services.length];
    const barber = barbers[index % barbers.length];
    return {
      id: `hist-${index}`,
      customerId: demoId,
      serviceId: service.id,
      barberId: barber.id,
      serviceName: service.name,
      barberName: barber.name,
      appointmentDate,
      price: service.price,
      rating: index > 0 ? 5 : 4,
      createdAt: now
    };
  });
  const completedAppointments: Appointment[] = customerHistory.map((history, index) => ({
    id: `apt-done-${index}`,
    customerId: demoId,
    barberId: history.barberId,
    serviceId: history.serviceId,
    appointmentDate: history.appointmentDate,
    startTime: "15:00",
    endTime: addMinutes("15:00", services.find((service) => service.id === history.serviceId)?.durationMinutes ?? 40),
    price: history.price,
    status: "completed",
    createdAt: now
  }));
  const futureAppointment: Appointment = {
    id: "apt-demo-future",
    customerId: demoId,
    barberId: "barber-lucas",
    serviceId: "svc-combo",
    appointmentDate: nextBusinessDayIso(2),
    startTime: "14:30",
    endTime: "15:30",
    price: 70,
    status: "confirmed",
    notes: "Cliente prefere acabamento baixo.",
    createdAt: now
  };
  const payments: Payment[] = completedAppointments.map((appointment) => ({
    id: `pay-${appointment.id}`,
    appointmentId: appointment.id,
    customerId: appointment.customerId,
    amount: appointment.price,
    method: "dinheiro",
    status: "paid",
    paidAt: `${appointment.appointmentDate}T${appointment.endTime}:00`
  }));
  return {
    profiles,
    services,
    barbers,
    appointments: [...completedAppointments, futureAppointment],
    customerHistory,
    reviews: [
      ["Cliente Google", 5, "Meu pai cortou o cabelo com ele e gostou muito!"],
      ["Cliente Google", 5, "Parabéns pelo trampo irmão."],
      ["Mt Barbearia", 5, "Corte na régua, acabamento limpo e atendimento direto, do jeito que precisa ser."],
      ["Cliente da casa", 5, "Degradê bem feito e ambiente confortável na Areia Branca."],
      ["Cliente da casa", 5, "Volto sempre pelo capricho no corte e pela pontualidade."]
    ].map(([authorName, rating, comment], index) => ({ id: `rev-${index}`, authorName: authorName as string, rating: rating as number, comment: comment as string, createdAt: now })),
    workingHours,
    barberDaysOff: [{ id: "off-rafael", barberId: "barber-rafael", date: nextBusinessDayIso(5), reason: "Folga programada" }],
    payments
  };
}

export function readDb(): Database {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as Database;
}

export function writeDb(db: Database) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event("barber-db-updated"));
}

export function getSessionId() {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(value: string | null) {
  if (value) localStorage.setItem(SESSION_KEY, value);
  else localStorage.removeItem(SESSION_KEY);
}

export function signIn(email: string, password: string) {
  const user = readDb().profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase() && profile.password === password);
  if (!user) throw new Error("E-mail ou senha inválidos.");
  setSessionId(user.id);
  return user;
}

export function signUp(input: Omit<Profile, "id" | "role" | "createdAt" | "avatarUrl">) {
  const db = readDb();
  if (db.profiles.some((profile) => profile.email.toLowerCase() === input.email.toLowerCase())) throw new Error("Este e-mail já está cadastrado.");
  const profile: Profile = { ...input, id: id("user"), role: "customer", createdAt: new Date().toISOString() };
  db.profiles.push(profile);
  writeDb(db);
  setSessionId(profile.id);
  return profile;
}

export function updateProfile(profile: Profile) {
  const db = readDb();
  db.profiles = db.profiles.map((item) => (item.id === profile.id ? profile : item));
  writeDb(db);
}

export function createAppointment(appointment: Omit<Appointment, "id" | "createdAt">) {
  const db = readDb();
  const created = { ...appointment, id: id("apt"), createdAt: new Date().toISOString() };
  db.appointments.push(created);
  writeDb(db);
  return created;
}

export function setAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  const db = readDb();
  const appointment = db.appointments.find((item) => item.id === appointmentId);
  if (!appointment) return;
  appointment.status = status;
  if (status === "completed") {
    const service = db.services.find((item) => item.id === appointment.serviceId);
    const barber = db.barbers.find((item) => item.id === appointment.barberId);
    if (service && barber && !db.customerHistory.some((item) => item.id === `hist-${appointment.id}`)) {
      db.customerHistory.push({
        id: `hist-${appointment.id}`,
        customerId: appointment.customerId,
        serviceId: service.id,
        barberId: barber.id,
        serviceName: service.name,
        barberName: barber.name,
        appointmentDate: appointment.appointmentDate,
        price: appointment.price,
        rating: 5,
        createdAt: new Date().toISOString()
      });
      db.payments.push({ id: `pay-${appointment.id}`, appointmentId, customerId: appointment.customerId, amount: appointment.price, method: "dinheiro", status: "paid", paidAt: new Date().toISOString() });
    }
  }
  writeDb(db);
}

export function upsertService(service: Service) {
  const db = readDb();
  db.services = db.services.some((item) => item.id === service.id) ? db.services.map((item) => (item.id === service.id ? service : item)) : [...db.services, service];
  writeDb(db);
}

export function deleteService(serviceId: string) {
  const db = readDb();
  db.services = db.services.filter((item) => item.id !== serviceId);
  writeDb(db);
}

export function upsertBarber(barber: Barber) {
  const db = readDb();
  db.barbers = db.barbers.some((item) => item.id === barber.id) ? db.barbers.map((item) => (item.id === barber.id ? barber : item)) : [...db.barbers, barber];
  writeDb(db);
}

export function createBarberDraft(): Barber {
  return {
    id: id("barber"),
    name: "Novo barbeiro",
    specialties: ["Degradê"],
    rating: 5,
    appointmentsCount: 0,
    bio: "Profissional da Mt Barbearia.",
    active: true,
    createdAt: new Date().toISOString()
  };
}

export function createServiceDraft(sortOrder: number): Service {
  return {
    id: id("svc"),
    name: "Novo serviço",
    description: "Descrição do serviço.",
    price: 50,
    durationMinutes: 40,
    iconKey: "scissors",
    active: true,
    sortOrder
  };
}

export function deleteBarber(barberId: string) {
  const db = readDb();
  db.barbers = db.barbers.filter((item) => item.id !== barberId);
  writeDb(db);
}

export function updateWorkingHour(weekday: number, open: string, close: string, active: boolean) {
  const db = readDb();
  const row = db.workingHours.find((item) => item.weekday === weekday && item.barberId === null);
  if (row) Object.assign(row, { open, close, active });
  writeDb(db);
}

export function resetSeed() {
  localStorage.setItem(DB_KEY, JSON.stringify(seed()));
  setSessionId(null);
}

export { adminId, demoId, todayIso };
