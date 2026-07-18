import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'

function JobDescPage() {
  return (
    <div  className='min-h-[90vh] p-4'>
        <Link className='my-5 inline-block' to="/find-jobs">
        <Button color='' leftSection={<IconArrowLeft size={20}/>} variant='light'>
        Back
        </Button>

        </Link>

        <div className='flex gap-5'>

        </div>

    </div>
  )
}

export default JobDescPage