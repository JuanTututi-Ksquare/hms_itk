import { Contact } from "../models/Contact.model"

export const GetContactMessages = async() => {
    try {
        const messages = await Contact.findAll()
        if(messages.length) {
            return messages;
        } else {
            return {info: "No results were found!"} // you must return an empty array
        }
    } catch (error) {
        return error;
    }
}