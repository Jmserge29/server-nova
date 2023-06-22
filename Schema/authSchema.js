import {z} from 'zod'


export const registerSchema = z.object({
    username: z.string({
        required_error: "The username is required"
    }),
    email: z.string({
        required_error: "The email is required"
    }).email({
        message: "Invalid Email"
    }),
    password: z.string({
        required_error: "The password is required"
    }).min(6, {
        message: "The password must be at least 6 characters"
    })
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "The email is required"
    }).email({
        message: "The email envalid"
    }),
    password: z.string({
        required_error: "The password is required"
    }).min(6, {
        message: "The password must be at least 6 characters"
    }),
})