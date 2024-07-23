import mongoose from "mongoose";

export const connectMongoDB = async () =>{
    try {
        console.log("Mongodb is connected")
        await mongoose.connect(process.env.MONGODB_URI1);
        return true 
    } catch (error) {
        console.log("Connection Error",error);
        process.exit(1);
    }
}