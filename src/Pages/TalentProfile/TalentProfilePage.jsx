import { Button, Divider } from '@mantine/core'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Profile from './Profile'

function TalentProfilePage() {
  return (
    <div className="min-h-[90vh] font-['poppins']">

      {/* <Divider size={"xs"} mx={"md"}/> */}
      <Link to = "/find-talent" className='my-4 inline-block'>
      <Button leftSection={<IconArrowNarrowLeft stroke={2} size={20} />}>Back</Button>
      </Link>
      <Divider size={"xs"}/>
      <div>
        <Profile/>
      </div>
    </div>
  )
}

export default TalentProfilePage