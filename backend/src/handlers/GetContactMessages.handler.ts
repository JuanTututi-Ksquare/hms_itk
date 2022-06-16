import { Contact } from "../models/Contact.model"

export const GetContactMessages = async() => {
    try {
        const messages = await Contact.findAll()
        return messages;
    } catch (error) {
        return error;
    }
}