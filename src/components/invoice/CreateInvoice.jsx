"use client"
import React, { useEffect, useState } from 'react'
import ActionModal from '../widgets/ActionModal'
import { Button } from '../ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { SelectGroup, SelectLabel } from '@radix-ui/react-select'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LoadingButton } from '../widgets/Loader'
import { useRouter, useSearchParams } from 'next/navigation'
import { createInvoice, getInvoice, updateInvoice } from '@/actions/invoiceAction'
import { toast } from 'react-toastify'


const customers = [
    {
        id: 1,
        name: "Ali Sirat",
        image: "https://static.vecteezy.com/system/user/avatar/3104171/medium_ME.jpg",
        email: "ali@gmail.com"
    },
    {
        id: 2,
        name: "Sirat",
        image: "https://static.vecteezy.com/system/user/avatar/3104171/medium_ME.jpg",
        email: "sirat45@gmail.com"
    },
    {
        id: 3,
        name: "Ali",
        image: "https://thumb.ac-illust.com/82/822138b952128153341ff647f7117670_t.jpeg",
        email: "asirat56@gmail.com"
    },
    {
        id: 4,
        name: "Shah",
        image: "https://static.vecteezy.com/system/user/avatar/3104171/medium_ME.jpg",
        email: "alishah@gmail.com"
    }
]

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name is required.",
    }),
    status: z.string().min(2, {
        message: "Status is required.",
    }),
    amount: z.string().min(2, {
        message: "Amount is required.",
    }),
})

export default function CreateInvoice() {
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: "",
            status: "Unpaid",
        },
    })

    const isLoading = form.formState.isSubmitting;
    async function onSubmit(values) {
        const { name, amount, status } = values
        const customer = customers.find((c) => c.name === name);
        const formData = {
            amount,
            customer,
            status,
            id: id ? id : ""
        };
        if (id) {
            // updated
            const res = await updateInvoice(formData);
            if (res?.error) {
                toast.error(res?.error);
            }
            if (res?.message) {
                toast.success(res?.message);
            }
            form.reset();
            setOpen(false);
        } else {
            const res = await createInvoice(formData);
            if (res?.error) {
                toast.error(res?.error);
            }
            if (res?.message) {
                toast.success(res?.message);
            }
            form.reset();
            setOpen(false);
        }
    }

    useEffect(() => {

        const fetchInvoice = async () => {
            const res = await getInvoice(id);
            const inv = JSON.parse(res);

            form.setValue("name", inv?.customer?.name);
            form.setValue("amount", inv?.amount);
            form.setValue("status", inv?.status);
        }
        if (id) {
            setOpen(true);
            fetchInvoice();
        }

    }, [id, form]);

    useEffect(() => {
        if (!open) {
            router.replace("/");
        }
    }, [open, router]);

    return (
        <div>
            <ActionModal
                title={id ? "Update Invoice" : "Create Invoice"}
                desc={id ? "Update invoice" : "Create a new invoice"} 
                trigger={
                    <Button className=" text-white space-x-1">
                        <span>Create Invoice</span>
                        <span className='text-lg'>+</span>
                    </Button>
                }
                open={open}
                setOpen={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a customer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Customer</SelectLabel>
                                                {
                                                    customers?.map((item) => {
                                                        const { name } = item;
                                                        return (
                                                            <SelectItem key={item.id} value={name}>{name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Amount" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Unpaid" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Unpaid
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Paid" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Paid
                                                </FormLabel>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isLoading ? (
                            <LoadingButton btnText={"Loading"} btnClass={"w-full"}
                                btnVariant={"outline"} />
                        ) : (
                            <Button className=" w-full" type="submit">
                                {id ? "Update Invoice" : "Create Invoice"}
                            </Button>
                        )}

                    </form>
                </Form>
            </ActionModal>
        </div>
    )
}
