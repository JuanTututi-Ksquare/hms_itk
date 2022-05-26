# ITK Health Management System by Juan Pablo TA

A health management system is used to improve the organization structure and performance for the patients and medical staff daily tasks.

## Getting started
### Clone the repo
```console
git clone https://github.com/JuanTututi-Ksquare/hms_itk
```

### Install Node Dependencies

It is necessary to install all the node dependencies
```console
npm install
```

Also it is necesary to install Typescript either as a global dependency on your system or as a dev dependency on the project

#### Global installation
```console
npm install -g typescript
```

#### Install as a dev dependency
```console
npm install --save-dev typescript
```

### Starting the API Service

#### Compile the files
It is necessary to compile the files with Typescript. Enter the following command on your terminal to automatically compile all the files within the /src folder
```console
tsc
```

#### Run the server
Now that Typescript has compiled all the files, our server is ready to be launched. Enter the following command in your terminal to start the development server
```console
npm start
```

or

```
npm run start
```

The server will be initialized in a development enviroment were it can track the changes made on /src folder and automatically compile them to your local /dist folder.


## Endpoints
All the available endpoints can be found inside a Insomnia Collection, this collection can be found inside the repository files with the name: "Insomnia_2022-05-26.json". It can be imported using Insomnia or Postman.


## Data Modelling

In order to create this management system we need to define and model the data that is going to be used.

V2: Since the authentication module is now being managed by firebase there have been some changes in the general structure of Data Modelling.

### Roles

Every user will be assigned to a role when it's created, this model will help us to know what's the role of each user and the permissions that will be granted as a member of that role. For this particular scenario we'll be using three different roles: Patient, Doctor and Admin.

V2: This data model will now be managed by Firebase Account API, but the general structure remains the same

#### Role: Patient
The role of Patient will only have permission to create new appointments and consult previous appointments. 

#### Role: Doctor
The role of Doctor will have the permission to see it's active appointments and previous appointments. 

#### Role: Admin
The Admin role will have permissions to see all Patient and Doctor users, alongside all the appointments. Also he will be able to add new Doctor users and see the messages sent via the contact module.

```ts
type Role = "Patient" | "Doctor" | "Admin";
```

The role of the user will be assigned when it's created using Firebase;

### Users

Since this management system is going to be accesed by many users, we need to define a model to store not only the credentials for the user but also it's role in the system.

This model will extend the 'Role' model to know the role of each user in the system.

V2: Some of the properties used for this model will now be managed by Firebase Account API.

#### Firebase
```ts
interface User {
  uid: number;
  displayName: string;
  email: string;
  password: string;
  role: Role;
}
```

#### HMS_ITK REST API
#### Table - users
```ts
interface User{
  id: number; // References UID from Firebase
  first_name: string;
  last_name: string;
  birthdate: Date;
  is_deleted: boolean; // This property will help us to handle soft-deletes
}
```

### Patients

The Patients model will help us to store the personal information of each Patient user, this model will extend the properties of the 'User' model to get their credentials and basic info.

#### Table - patients
```ts
interface Patient {
  id: number; // PK AUTO_INCREMENTABLE
  id_user: number; //References id on table Users
  curp: string;
  nss?: string; // This property is optional and being evaluated for inclusion
}
```

### Doctors

This model will hold the personal information of each Doctor user, and it will allow the Admin users to consult their personal information, including availability and status, also this data will be useful to avoid showing Doctor users who are currently unavalible to the Patient users who are looking to book an appointment. Just like the previous interface, this will extend the 'User' model. 

#### Table - doctors
```ts
interface Doctor{
    id: number; // PK AUTO_INCREMENTABLE - DB
    id_user: number; //References id on table Users
    license_id: string; // This is a made up 10 long chars code to represent the doctors license
    id_area: enum Area; //
    availability: boolean; // (True - Not on vacation / False - On vacation or Day Off)
    status: boolean; // (True - Currently working in hospital / False - No longer working in hospital)
}
```

#### Table - area
```ts
interface Area {
  id_area: number; // PK AUTO_INCREMENTABLE
  area: string; // Name of the area  
}
```

#### ENUM - area
Predefined values for table area.

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

#### Table - admins
```ts
interface Admin extends User {
    id: number; // PK AUTO_INCREMENTABLE - DB
    id_user: // Refernces id on Users table
}
```

### Appointments

This model will be used to store all the information about the appointments, such as the Patient user requesting it, the Doctor user that will attend the appointment. Appointments can be created by Patient users and Doctor users.

#### Table - appointments
```ts
interface Appointment{
    id: number; // PK AUTO_INCREMENTABLE - DB
    id_doctor: number;
    id_patient: number;
    date: Date; // This will be the date of the appointment including date and time
    status: boolean; // (True - The appointment is still active / False - The appointment was completed or canceled)
}
```

### Contact

The contact model will help us to handle all the messages sent via the Contact module.

#### Table - contact
```ts
interface Contact {
  id: number; // PK AUTO_INCREMENTABLE - DB
  email: string;
  message: string; 
}
```
