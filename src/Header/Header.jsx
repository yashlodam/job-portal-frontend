import { Avatar } from '@mantine/core'
import { IconAsset, IconBell, IconSettings } from '@tabler/icons-react'
import React from 'react'

function Header() {
  return (
    <div className='w-full bg-black text-white px-6 flex h-28 justify-between items-center'>
        
        <div className='flex gap-3 items-center'>
            <IconAsset className='h-10 w-10' stroke={1.25} />
            <div className='text-3xl font-semibold'>
                iJobs
            </div>
        </div>
        <div className='flex gap-3'>
         <a href="">Find Jobs</a>
         <a href="">Find Talent</a>
         <a href="">Upload Job</a>
         <a href="">About us</a>
        </div>
        <div className='flex gap-6 items-center'>
           <IconBell stroke={2} />
           <div className='flex items-center'>
               <div>Marshal</div>
                <Avatar src="avatar.png" alt="it's me" />
               
           </div>
           <IconSettings stroke={2} />
        </div>

    </div>
  )
}

export default Header