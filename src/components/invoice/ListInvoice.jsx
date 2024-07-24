import React from 'react'

export default function ListInvoice({total, pageNumber, invoices:data}) {
  return (
    <div>
      <div className=' flex-between border-b-[1px] border-gray-400 pb-3'>
        <p>{total} invoices</p>
        <p>search</p>
      </div>
      <div className='table'></div>
    </div>
  )
}
