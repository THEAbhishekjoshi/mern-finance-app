import { z } from "zod";

const userSchema = z.object({
    fullname: z.string("Name should have letters only"),
    // email: z.email("Inavlid email format").transform((val) => val.toLowerCase()) //this converts email to lowercase
    email: z.email("Inavlid email format"),
    password: z.string("Password should have letters and numbers only")
    .min(6, "Password should be at least 6 characters long")
    .regex(/[0-9]/,"Password should contain at least one number")
    .regex(/[A-Z]/,"Password should contain at least one uppercase letter")
    //.regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");
})

async function validateUserInput(req,res,next) {
    const result = userSchema.safeParse(req.body);

    if(!result.success){
        const flattend = z.flattenError(result.error);
        return res.status(400).json({
            message: "Validation failed",
            errors: flattend
        });
    }
    next()
}
export default validateUserInput;