import { Users } from "../models/Users.model"

export const ActivateUser = async (id_user: number) => {
    try {
        const activatedUser = await Users.update({
            is_deleted: false
        }, {
            where: {
                id: id_user
            }
        })
        if(activatedUser) {
            return ({success: "User activated succesfully"})
        }
    } catch (error) {
        return ({error: "Something went wrong! :("})
    }
}