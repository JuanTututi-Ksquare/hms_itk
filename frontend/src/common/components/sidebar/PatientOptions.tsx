import React from "react";
import SidebarButton from "./SidebarButton";

function PatientOptions() {
  return (
    <div>
      <SidebarButton image="home" text="Dashboard" url="/dashboard"/>
      <SidebarButton image="add" text="New appointment" url="/appointments/new"/>
      <SidebarButton image="copy" text="History" url="/appointments/"/>
      <SidebarButton image="log-out" text="Log out" url="/"/>
    </div>
  );
}

export default PatientOptions;
