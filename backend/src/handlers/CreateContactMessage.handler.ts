import { Contact } from "../models/Contact.model"

export const CreateContactMessage = async (email: string, message: string) => {
    try {
        const createdMessage = await Contact.create({
            // you can use just "email"
            email: email,
            // you can use just "message"
            message: message
        })
        if (createdMessage) {
            return {success: "Message created succesfully!"} // Please return the ID that your front is going to use
        } else {
            return {error: "Something went wrong!"}
        }
    } catch (error) {
        return error;
    }
}