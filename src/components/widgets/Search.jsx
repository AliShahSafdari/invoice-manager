import React from 'react'
import {BiSearch} from 'react-icons/bi'
import { Input } from '../ui/input'
export default function Search({value, onChange, defaultValue, placeholder}) {
  return (
    <div className=' relative'>
        <BiSearch size={18} className=" absolute left-2 top-3 text-color-dark" />
        <Input type="text" placeholder={placeholder}
         className="pl-8"
         value={value}
         onChange={onChange}
         defaultValue={defaultValue}
          />
    </div>
  )
}
