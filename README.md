# ITK Health Management System by Juan Pablo TA

A health management system is used to improve the organization structure and performance for the patients and medical staff daily tasks.

## Data Modelling

In order to create this management system we need to define and model the data that is going to be used.

### Roles

Every user will be assigned to a role when it's created, this model will help us to know what's the role of each user. For this particular scenario we'll be using three different roles: Patient, Doctor and Admin.

```ts
interface Role {
  id_role: number; // PK AUTO_INCREMENTABLE - SQL
  role: string; // (patient/doctor/admin)
}
```

### Users

Since this management system is going to be accesed by many users, we need to define a model to store not only the credentials for the user but also it's role in the system.

This model will extend the 'Role' model to know the role of each user in the system.

```ts
interface User extends Role {
  id_user: number; // PK AUTO_INCREMENTABLE
  email: string; // UNIQUE
  password: string;
}
```

### Patients

The Patients model will help us to store the personal information of each user, this model will extend the properties of the 'User' model to get their credentials.

```ts
interface Patient extends User {
  id_patient: number; // PK AUTO_INCREMENTABLE - DB
  first_name: string;
  last_name: string;
  birthdate: Date;
  curp: string;
  nss?: string; // This property is optional and being evaluated for inclusion
}
```

### Doctors

This model will hold the personal information of each Doctor user, and it will allow the Admin users to consult their personal information, including availability and status. Just like the previous interface, this will extend the 'User' model.

```ts
interface Doctor extends User{
    id_doctor: number; // PK AUTO_INCREMENTABLE - DB
    first_name: string;
    last_name: string;
    birthdate: Date;
    license_id: string;
    specialty: string;
    area: string;
    availability: string; // (Available - Not on vacation / Unavailable - On vacation or Day Off)
    status: string; // (Active - Currently working in hospital / Inactive - No longer working in hospital)
}
```

### Admin

This model will help us to store the personal information of each member of the administrative staff on the system, they will be able to see Patient and Doctor users, they will also be able to add new Doctor users and see the messages sent via the contact module.

```ts
interface Admin extends User {
    id_admin: number; // PK AUTO_INCREMENTABLE - DB
    first_name: string;
    last_name: string;
    bithdate: Date;
}
```

### Appointments

This model will be used to store all the information about the appointments, such as the Patient user requesting it, the Doctor user that will attend the appointment and the type of appointment that will be held.

```ts
interface Appointment extends Patient, Doctor{
    id_appointment: number; // PK AUTO_INCREMENTABLE - DB
    date: Date;
    type: string; //(The options for this property are yet to be defined)
}
```