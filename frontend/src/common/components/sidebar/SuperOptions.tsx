import React from 'react'
import SidebarButton from './SidebarButton'

type Props = {}

function SuperOptions({}: Props) {
  return (
    <div>
      <SidebarButton image="home" text="Dashboard" url="/dashboard"/>
      <SidebarButton image="stamped" text="Add Doctor" url="/users/new-doctor"/>
      <SidebarButton image="copy" text="Appointments" url="/appointments"/>
      <SidebarButton image="users" text="Users" url="/users"/>
      <SidebarButton image="log-out" text="Log out" url="/"/>
    </div>
  )
}

export default SuperOptions