export type Role = "customer" | "admin";
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  avatarUrl?: string;
  role: Role;
  favoriteBarberId?: string;
  favoriteServiceId?: string;
  createdAt: string;
};

export type Barber = {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  appointmentsCount: number;
  bio: string;
  active: boolean;
  createdAt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  iconKey: string;
  active: boolean;
  sortOrder: number;
};

export type Appointment = {
  id: string;
  customerId: string;
  barberId: string | null;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
};

export type CustomerHistory = {
  id: string;
  customerId: string;
  serviceId: string;
  barberId: string;
  serviceName: string;
  barberName: string;
  appointmentDate: string;
  price: number;
  rating?: number;
  createdAt: string;
};

export type Review = {
  id: string;
  customerId?: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type WorkingHour = {
  id: string;
  barberId: string | null;
  weekday: number;
  open: string;
  close: string;
  active: boolean;
};

export type DayOff = {
  id: string;
  barberId: string;
  date: string;
  reason: string;
};

export type Payment = {
  id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  method: string;
  status: "paid" | "pending";
  paidAt?: string;
};

export type Database = {
  profiles: Profile[];
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  customerHistory: CustomerHistory[];
  reviews: Review[];
  workingHours: WorkingHour[];
  barberDaysOff: DayOff[];
  payments: Payment[];
};
