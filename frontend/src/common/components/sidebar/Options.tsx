import React from "react";
import { patientOptions, superOptions, doctorOptions, adminOptions } from "../../helpers/SidebarLayouts";
import SidebarButton from "./SidebarButton";

interface Props {
  layout: string;
}

function Options({ layout }: Props) {
  let optionsLayout: any[] = [];
  switch (layout) {
    case "patient":
      optionsLayout = patientOptions;
      break;
    case "super":
      optionsLayout = superOptions;
      break;
    case "admin":
      optionsLayout = adminOptions;
      break;
    case "doctor":
      optionsLayout = doctorOptions;
      break;
  }

  const options = optionsLayout.map((option, index) => {
    return (
      <SidebarButton key={index} image={option.image} text={option.text} url={option.url} />
    );
  });
  
  return <div>{options}</div>;
}

export default Options;
