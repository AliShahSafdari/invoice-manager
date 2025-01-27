"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState, forwardRef} from "react"
import { FaTrashAlt } from "react-icons/fa"
import { Input } from "../ui/input";

const DeleteModal = forwardRef (({title, desc, pass,onClick})=> {
    const [keyword, setKeyword] = useState("");

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <FaTrashAlt size={22} color={"red"} className="cursor-pointer"/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{desc}</AlertDialogDescription>
                    <p> To Delete: Type <b>{pass}</b> in the input filed</p>
                    <Input
                    className=" border-red-600"
                    placeholder="keyword"
                    value={keyword}
                    onChange={(e)=> setKeyword(e.target.value)}/>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {keyword === pass &&(
                        <AlertDialogAction onClick={onClick}>Delete</AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
});

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
