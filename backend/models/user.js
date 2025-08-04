// import '../config/env.js';
import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_CONNECT);

const newUserSchema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        password: String,
    },
    {
        strict: false
    }
)


const newUsers = mongoose.model("newUsers",newUserSchema);

export { newUsers };
