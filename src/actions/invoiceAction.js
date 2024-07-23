"use server"

import { connectMongoDB } from "@/lib/mongodb";
import Invoice from "@/models/InvoiceModel";
import { revalidatePath } from "next/cache";
export const getErrorMessage = (error) =>{
    let message;
    if(error instanceof Error){
        message = error.message;
    }else if(error&& typeof error==="object"&&"message" in error){
        message = String(error.message);

    }
    else if(typeof error==="string"){
        message = error;

    }
    else{
        message = "Something went wrong";
    }
    return message;
}

export const createInvoice = async (formData) =>{
    const {amount, customer, status} = formData;
    try {
        if(!amount|| !customer|| !status){
                return{
                    error:  "Please fill all fields"
                }
        }
        await connectMongoDB();
        await Invoice.create({
            customer,
            amount,
            status
        })
        revalidatePath("/")
        return {
            message: "Invoice Created successfully",
        }
    } catch (error) {
        console.log(error);
        return{
            error:getErrorMessage(error),
        }
    }
}