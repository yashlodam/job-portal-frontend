import React from 'react'
import { Link } from 'react-router-dom'

function NavLinks() {

  const links = [
    {name:"Find Jobs", url:"find-jobs"},
    {name:"Find Talent", url:"find-talent"},
    {name:"Upload Job",url:"upload-job"},
    {name:"About Us",url:"about"}

  ]

  return (
    <div className='flex gap-5'>
      {
        links.map((link,index)=>
          <Link key={index}></Link>
        )
      }
    </div>
  )
}

export default NavLinks