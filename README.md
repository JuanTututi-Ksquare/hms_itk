# ITK Health Management System by Juan Pablo TA

A health management system is used to improve the organization structure and performance for the patients and medical staff daily tasks.

## Data Modelling

In order to create this management system we need to define and model the data that is going to be used.

### Roles

Every user will be assigned to a role when it's created, this model will help us to know what's the role of each user and the permissions that will be granted as a member of that role. For this particular scenario we'll be using three different roles: Patient, Doctor and Admin. 

#### Role: Patient
The role of Patient will only have permission to create new appointments and consult previous appointments. 

#### Role: Doctor
The role of Doctor will have the permission to see it's active appointments and previous appointments. 

#### Role: Admin
The Admin role will have permissions to see all Patient and Doctor users, alongside all the appointments. Also he will be able to add new Doctor users and see the messages sent via the contact module.

```ts
interface Role {
  id_role: number; // PK AUTO_INCREMENTABLE - SQL
  role: enum Role; // (Patient/Doctor/Admin)
}
```

```ts
enum Role {
  Patient = "PATIENT",
  Doctor = "DOCTOR",
  Admin = "ADMIN"
}
```

### Users

Since this management system is going to be accesed by many users, we need to define a model to store not only the credentials for the user but also it's role in the system.

This model will extend the 'Role' model to know the role of each user in the system.

```ts
interface User extends Role {
  id_user: number; // PK AUTO_INCREMENTABLE
  first_name: string;
  last_name: string;
  birthdate: Date;
  email: string; // UNIQUE
  password: string;
  is_deleted: boolean; // This property will help us to handle soft-deletes
}
```

### Patients

The Patients model will help us to store the personal information of each Patient user, this model will extend the properties of the 'User' model to get their credentials and basic info.

```ts
interface Patient extends User {
  id_patient: number; // PK AUTO_INCREMENTABLE - DB
  curp: string;
  nss?: string; // This property is optional and being evaluated for inclusion
}
```

### Doctors

This model will hold the personal information of each Doctor user, and it will allow the Admin users to consult their personal information, including availability and status, also this data will be useful to avoid showing Doctor users who are currently unavalible to the Patient users who are looking to book an appointment. Just like the previous interface, this will extend the 'User' model. 

```ts
interface Doctor extends User{
    id_doctor: number; // PK AUTO_INCREMENTABLE - DB
    license_id: string;
    area: enum Area; 
    availability: boolean; // (True - Not on vacation / False - On vacation or Day Off)
    status: boolean; // (True - Currently working in hospital / False - No longer working in hospital)
}
```

### ENUM - Area
```ts
enum Area {
  Dermatology = "DERMATOLOGY",
  InternalMedicine = "INTERNAL MEDICINE",
  FamiliarMedicine = "FAMILIAR MEDICINE",
  Pediatry = "PEDIATRY",
  Gynecology = "GYNECOLOGY",
  PreventiveMedicine = "PREVENTIVE MEDICINE",
  Dentistry = "DENTISTRY",
  Radiology = "RADIOLOGY",
  Cardiology = "CARDIOLOGY"  
}
```

### Admin

This model will help us to store the personal information of each member of the administrative staff on the system, they will be able to see Patient and Doctor users, they will also be able to add new Doctor users and see the messages sent via the contact module.

This model will also extend the User model to include the credentials for each Admin user.

```ts
interface Admin extends User {
    id_admin: number; // PK AUTO_INCREMENTABLE - DB
}
```

### Appointments

This model will be used to store all the information about the appointments, such as the Patient user requesting it, the Doctor user that will attend the appointment. Appointments can be created by Patient users and Doctor users.

```ts
interface Appointment{
    id_appointment: number; // PK AUTO_INCREMENTABLE - DB
    id_doctor: number;
    id_patient: number;
    date: Date; // This will be the date of the appointment including date and time
    status: boolean; // (True - The appointment is still active / False - The appointment was completed or canceled)
}
```

### Contact

The contact model will help us to handle all the messages sent via the Contact module.

```ts
interface Contact {
  id_contact: number; // PK AUTO_INCREMENTABLE - DB
  email: string;
  message: string; 
}
```
