import { Divider } from '@mantine/core'
import React from 'react'
import PostedJob from '../PostedJob/PostedJob'

function PostedJobPage() {
  return (
    <div className='min-h-[90vh] px-4'>
        <Divider size="xs"/>
        <div className='flex gap-6 justify-between'>
            <PostedJob/>
        </div>
    </div>
  )
}

export default PostedJobPage