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
  appointments: Appointment[];
  status: "idle" | "loading" | "completed" | "failed";
}

const initialState: AppointmentsState = {
  appointments: [],
  status: "idle",
};

export const getAppointmentsOrderPatient = createAsyncThunk(
  "appointments/order-patient",
  async (info: { role: string; token: string; order: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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
  async (info: { role: string; token: string; order: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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
  async (info: { role: string; token: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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
  async (info: { role: string; token: string; status: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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
  async (info: { role: string; token: string; id: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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
  async (info: { role: string; token: string; id: string }) => {
    if (info.role === "super") {
      info.role = "admin";
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

export const AppointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
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
  },
});

export const { clearAppointments } = AppointmentsSlice.actions;
export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
export const selectStatus = (state: RootState) => state.appointments.status;
export default AppointmentsSlice.reducer;
