export type Role = "patient" | "doctor" | "admin";
// What do you think about adding here the default values? Like you did in the filters
export type Pagination = { page: number; limit: number };
export type AdminFilters = {
  id_patient?: number;
  id_doctor?: number;
  status?: boolean;
  orderByPatient?: "ASC" | "DESC";
  orderByDoctor?: "ASC" | "DESC";
};
export type DoctorFilters = {
  id_patient?: number;
  date?: string;
  dateOrder?: "ASC" | "DESC";
  orderByPatient?: "ASC" | "DESC";
  orderByDate?: "ASC" | "DESC";
};
