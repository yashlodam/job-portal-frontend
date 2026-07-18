import { Badge } from '@mantine/core'
import React from 'react'

function PostedJobDesc() {
  return (
    <div className='mt-5 w-3/4 px-5'>
        <div className='text-2xl font-semibold flex items-center'>Software Engineer
            <Badge variant='light' ml="sm" size='sm' color=''>Badge</Badge>
        </div>
        <div className='font-medium mb-5'>New York, United States</div>
        <div>
            
        </div>
    </div>
  )
}

export default PostedJobDesc