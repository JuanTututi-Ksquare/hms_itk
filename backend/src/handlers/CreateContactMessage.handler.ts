import { Contact } from "../models/Contact.model";

export const CreateContactMessage = async (email: string, message: string) => {
  try {
    const createdMessage = await Contact.create({
      email,
      message,
    });
    if (createdMessage) {
      return { success: "Message created successfully!" };
    } else {
      return { error: "Something went wrong!" };
    }
  } catch (error) {
    return error;
  }
};
