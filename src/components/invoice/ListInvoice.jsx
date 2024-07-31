"use client"
import React, { useEffect, useRef, useState } from 'react'
import Search from '../widgets/Search'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css'
import Link from 'next/link'
import { FaEdit } from "react-icons/fa"
import { RiMailSendLine } from "react-icons/ri"
import DeleteModal from '../widgets/DeleteModal'
import { deleteInvoice } from '@/actions/invoiceAction'
import { toast } from 'react-toastify'
import { sendEmail } from '@/actions/emailAction'


export default function ListInvoice({ total, pageNumber, invoices: data }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef(1);

  const [search, setSearch] = useState("");

  const debouncedHandleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", 1);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);

  },
    500
  );

  useEffect(() => {
    debouncedHandleSearch()
  }, [search])

  useEffect(() => {
    if (total > 0) {
      setPageCount(pageNumber)
    }
  }, [pageNumber, total]);

  function handlePageClick(e) {
    const params = new URLSearchParams(searchParams.toString());

    if (currentPage.current) {
      params.set("page", e.selected + 1);
    }
    currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  }
  async function onDelete(id) {
    const res = await deleteInvoice(id);
    if (res?.error) {
      toast.error(res?.error);
    }
    if (res?.message) {
      toast.success(res?.message);
    }
  }
  async function sendThisInvoice(inv) {
    console.log("Sending Email")
    console.log(inv)
    const res = await sendEmail({
      subject:"Invoice from AliShah Safdari",
      // message:"This is an invoice",
      email: inv?.customer?.email,
      data:{
        name: inv?.customer?.name,
        amount: inv?.amount,
      }

    })
    console.log(res)
    if (res?.error) {
      toast.error(res?.error);
    }
    if (res?.message) {
      toast.success(res?.message);
    }
  }

  return (
    <div>
      <div className=' flex-between border-b-[1px] border-gray-400 pb-3'>
        <p>{total} invoices</p>
        <Search
          placeholder={"Search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">s/n</TableHead>
            <TableHead>Customers</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((inv, index) => (
            <TableRow key={inv._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>

              <TableCell>
                <div className='flex-start space-x-2'>
                  <span>
                    <Avatar>
                      <AvatarImage src={inv?.customer?.image} alt="image" />
                      <AvatarFallback>{inv?.customer?.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </span>
                  <span>
                    {inv?.customer?.name}
                  </span>

                </div>
              </TableCell>

              <TableCell> {inv?.customer?.email}</TableCell>

              <TableCell> {inv?.amount}</TableCell>

              <TableCell> {format(new Date(inv?.createdAt), "MMM dd,yyyy")}</TableCell>

              <TableCell>
                <Badge variant={inv?.status === 'Paid' ? "default" : "destructive"}>
                  {inv?.status}
                </Badge>
              </TableCell>

              <TableCell className="flex space-x-3">
                <>
                  <span>
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Send Email</span>}>
                    <RiMailSendLine
                        size={24}
                        color={"purple"}
                        className="course-pointer"
                      onClick={()=>sendThisInvoice(inv)}
                      />
                    </Tooltip>
                  </span>

                  <span>
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Edit</span>}>
                      <Link href={`/?id=${inv?._id}`}>
                        <FaEdit
                          size={24}
                          color={"green"}
                          className="course-pointer" />
                      </Link>
                    </Tooltip>
                  </span>

                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Delete</span>}>
                        <DeleteModal
                          title={"Delete Invoice"}
                          desc={"Are you sure you want to delete this invoice?"}
                          pass={"delete"}
                          onClick={() => { onDelete(inv?._id) }}
                        />
                    </Tooltip>
                  
                </>
              </TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={null}

          marginPagesDisplayed={2}
          containerClassName='pagination'
          pageLinkClassName='page-num'
          previousLinkClassName='page-num'
          nextLinkClassName='page-num'
          activeLinkClassName='activePage'
        />
      )
      }
    </div>
  )
}
