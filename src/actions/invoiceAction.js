"use server"

import { connectMongoDB } from "@/lib/mongodb";
import Invoice from "@/models/InvoiceModel";
import { revalidatePath } from "next/cache";
export const getErrorMessage = (error) => {
    let message;
    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);

    }
    else if (typeof error === "string") {
        message = error;

    }
    else {
        message = "Something went wrong";
    }
    return message;
}

export const createInvoice = async (formData) => {
    const { amount, customer, status } = formData;
    try {
        if (!amount || !customer || !status) {
            return {
                error: "Please fill all fields"
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
        return {
            error: getErrorMessage(error),
        }
    }
}

export const getInvoices = async (params) => {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        ...(params.search &&
        {
            $or: [
                { amount: { $regex: params.search, $options: "i" } },
                { status: { $regex: params.search, $options: "i" } },
                { "customer.name": { $regex: params.search, $options: "i" } },
                { "customer.email": { $regex: params.search, $options: "i" } },
            ]
        })
    }

    try {
        await connectMongoDB();
        const invoices = await Invoice.find(query)
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(query);
        const pageCount = Math.ceil(total / limit);

        return JSON.stringify({
            total,
            pageCount,
            data: invoices
        })

    } catch (error) {
        console.log(error);
        return {
            error: getErrorMessage(error),
        }
    }
}

export const deleteInvoice = async (id) => {
    try {
        await connectMongoDB();
        await Invoice.findByIdAndDelete(id)
        revalidatePath("/")
        return {
            message: "Invoice Deleted successfully",
        }
    } catch (error) {
        console.log(error);
        return {
            error: getErrorMessage(error),
        }
    }
}