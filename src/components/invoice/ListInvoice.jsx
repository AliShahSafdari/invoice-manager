import React from 'react'
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
import { format, formatDate } from 'date-fns'
import { Badge } from "@/components/ui/badge"

export default function ListInvoice({ total, pageNumber, invoices: data }) {
  return (
    <div>
      <div className=' flex-between border-b-[1px] border-gray-400 pb-3'>
        <p>{total} invoices</p>
        <Search />
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
                <Badge variant={inv?.status === 'paid' ? "default" : "destructive"}>
                  {inv?.status}
                </Badge>
              </TableCell>
              <TableCell>Edite</TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
