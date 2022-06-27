import { Pagination } from "../config/CustomTypes";
import { Contact } from "../models/Contact.model";

export const GetContactMessages = async (pagination: Pagination) => {
  const pageNumber = pagination["page"] <= 0 ? 1 : pagination["page"];
  const limit = pagination["limit"];
  const offset = (pageNumber - 1) * limit;

  try {
    let count = 0;
    const totalMessages = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });
    count = totalMessages.length;
    
    const messages = await Contact.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    return {messages, count};
  } catch (error) {
    return error;
  }
};
