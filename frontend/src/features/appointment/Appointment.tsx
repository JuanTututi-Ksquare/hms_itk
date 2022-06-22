import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const Appointment = (props: Props) => {
    const {id} = useParams();
  return (
    <div>Appointment {id}</div>
  )
}

export default Appointment