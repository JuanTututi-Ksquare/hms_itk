import { Contact } from "../models/Contact.model"

export const CreateContactMessage = async (email: string, message: string) => {
    try {
        const createdMessage = await Contact.create({
            email: email,
            message: message
        })
        if (createdMessage) {
            return {success: "Message created succesfully!"}
        } else {
            return {error: "Something went wrong!"}
        }
    } catch (error) {
        return error;
    }
}