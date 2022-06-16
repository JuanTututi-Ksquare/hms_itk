export const validateDate = (date: string) => {
  const today = new Date();
  const inputDate = new Date(date);
  today.setFullYear(today.getFullYear() - 15);
  if (inputDate > today) {
    return "You must have at least 15 years old";
  }
};