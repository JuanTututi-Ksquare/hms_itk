export const validateDate = (date: string) => {
  const allowedDate = new Date();
  const inputDate = new Date(date);
  allowedDate.setFullYear(allowedDate.getFullYear() - 18);
  if (inputDate > allowedDate) {
    return "You must have at least 18 years old";
  }
};


export const validateDateSchedule = (date: Date) => {
  const today = new Date();
  const inputDate = new Date(date);
  if (inputDate < today) {
    return "Appointment date must be in the future"
  }
}