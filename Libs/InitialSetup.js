//Imports models
import Role from "../Models/Role.js";


//Exporting fuctions creatings setup
export const createRoles = async()=>{
    try {
        const count = await Role.estimatedDocumentCount()
        if(count>0) return;

        // Creating roles the users
        const values = await Promise.all([
            new Role({ role: "user"}).save(),
            new Role({ role: "moderator"}).save(),
            new Role({ role: "admin"}).save()
        ])
        console.log(values)
        console.log("Roles created success!")
    } catch (error) {
        console.log(error)
    }
}