export type Role = "patient" | "doctor" | "admin";
export type Pagination = { page: number; limit: number };
export type firebaseUser = { first_name: string,  last_name: string, email: string, password: string, role: Role}
export type AdminFilters = {
  id_patient?: number;
  id_doctor?: number;
  status?: boolean;
  orderByPatient?: "ASC" | "DESC";
  orderByDoctor?: "ASC" | "DESC";
};
export type UserFilters = {
  is_deleted?: boolean;
}
export type DoctorFilters = {
  id_patient?: number;
  date?: string;
  dateOrder?: "ASC" | "DESC";
  orderByPatient?: "ASC" | "DESC";
  orderByDate?: "ASC" | "DESC";
};
export type Appointment = {
  id: number,
  id_doctor: number,
  id_patient: number,
  date: Date,
  status: boolean,
  createdAt?: string,
  updatedAt?: string
}