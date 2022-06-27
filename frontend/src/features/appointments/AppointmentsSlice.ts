import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Appointment {
  id: number;
  date: string;
  id_patient: number;
  id_doctor: number;
  patientName: string;
  doctorName: string;
  status: boolean;
}

export interface AppointmentsState {
  appointments: {
    appointments: Appointment[];
    count: number;
    filters?: {
      id_patient?: number;
      id_doctor?: number;
      status?: boolean;
      orderByPatient?: "ASC" | "DESC";
      orderByDoctor?: "ASC" | "DESC";
      orderByDate?: "ASC" | "DESC";
    };
  };
  status: "idle" | "loading" | "completed" | "failed";
}

const initialState: AppointmentsState = {
  appointments: { appointments: [], count: 0 },
  status: "idle",
};

export const getAppointmentsOrderPatient = createAsyncThunk(
  "appointments/order-patient",
  async (info: {
    role: string;
    token: string;
    order: string;
    page?: number;
  }) => {
    if (info.role === "super") {
      info.role = "admin";
    }
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({
            order: `patient+${info.order}`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }
    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments?` +
        new URLSearchParams({ order: `patient+${info.order}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getAppointmentsOrderDoctor = createAsyncThunk(
  "appointments/order-doctor",
  async (info: {
    role: string;
    token: string;
    order: string;
    page?: number;
  }) => {
    if (info.role === "super") {
      info.role = "admin";
    }

    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({
            order: `doctor+${info.order}`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }

    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments?` +
        new URLSearchParams({ order: `doctor+${info.order}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getAppointments = createAsyncThunk(
  "appointments/get",
  async (info: { role: string; token: string; page?: number }) => {
    if (info.role === "super") {
      info.role = "admin";
    }

    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({ page: `${info.page}` }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = response.json();
      return data;
    }

    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getAppointmentsByStatus = createAsyncThunk(
  "appointments/status",
  async (info: {
    role: string;
    token: string;
    status: string;
    page?: number;
  }) => {
    if (info.role === "super") {
      info.role = "admin";
    }

    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({
            status: `${info.status}`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = response.json();
      return data;
    }

    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments?` +
        new URLSearchParams({ status: `${info.status}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getAppointmentsByDoctor = createAsyncThunk(
  "appointments/doctor",
  async (info: { role: string; token: string; id: string; page?: number }) => {
    if (info.role === "super") {
      info.role = "admin";
    }

    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({ doctor: `${info.id}`, page: `${info.page}` }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }

    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments?` +
        new URLSearchParams({ doctor: `${info.id}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getAppointmentsByPatient = createAsyncThunk(
  "appointments/patient",
  async (info: { role: string; token: string; id: string; page?: number }) => {
    if (info.role === "super") {
      info.role = "admin";
    }
    // If we want to search by Patient ID and use pagination
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/${info.role}/appointments?` +
          new URLSearchParams({ patient: `${info.id}`, page: `${info.page}` }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }

    const response = await fetch(
      `http://localhost:3001/${info.role}/appointments?` +
        new URLSearchParams({ patient: `${info.id}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getDoctorOrderPatient = createAsyncThunk(
  "appointments/doctor-patient",
  async (info: { token: string; order: string; page?: number }) => {
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/doctor/appointments?` +
          new URLSearchParams({
            order: `patient+${info.order}`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }
    const response = await fetch(
      `http://localhost:3001/doctor/appointments?` +
        new URLSearchParams({ order: `patient+${info.order}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getDoctorOrderDate = createAsyncThunk(
  "appointments/doctor-date",
  async (info: { token: string; order: string; page?: number }) => {
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/doctor/appointments?` +
          new URLSearchParams({
            order: `date+${info.order}`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }
    const response = await fetch(
      `http://localhost:3001/doctor/appointments?` +
        new URLSearchParams({ order: `date+${info.order}` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getDoctorFilterDate = createAsyncThunk(
  "appointments/doctor-filter-date",
  async (info: { token: string; date: string; page?: number }) => {
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/doctor/appointments?` +
          new URLSearchParams({
            date: `${info.date}+DESC`,
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }
    const response = await fetch(
      `http://localhost:3001/doctor/appointments?` +
        new URLSearchParams({ date: `${info.date}+DESC` }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const AppointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = { appointments: [], count: 0, filters: undefined };
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAppointments.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointments.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointments.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getAppointmentsOrderPatient.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointmentsOrderPatient.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointmentsOrderPatient.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getAppointmentsOrderDoctor.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointmentsOrderDoctor.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointmentsOrderDoctor.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getAppointmentsByStatus.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointmentsByStatus.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointmentsByStatus.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getAppointmentsByDoctor.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointmentsByDoctor.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointmentsByDoctor.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getAppointmentsByPatient.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAppointmentsByPatient.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getAppointmentsByPatient.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getDoctorOrderPatient.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getDoctorOrderPatient.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getDoctorOrderPatient.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getDoctorOrderDate.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getDoctorOrderDate.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getDoctorOrderDate.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });

    builder.addCase(getDoctorFilterDate.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getDoctorFilterDate.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getDoctorFilterDate.fulfilled, (state, action) => {
      state.status = "completed";
      state.appointments = action.payload;
    });
  },
});

export const { clearAppointments } = AppointmentsSlice.actions;
export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
export const selectStatus = (state: RootState) => state.appointments.status;
export default AppointmentsSlice.reducer;
