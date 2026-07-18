import { Badge, Tabs } from '@mantine/core'
import React from 'react'
import JobDetail from '../Pages/JobDetail'

function PostedJobDesc() {
  return (
    <div className='mt-5 w-3/4 px-5'>
        <div className='text-2xl font-semibold flex items-center'>Software Engineer
            <Badge variant='light' ml="sm" size='sm' color=''>Badge</Badge>
        </div>
        <div className='font-medium mb-5'>New York, United States</div>
        <div>
            <Tabs autoContrast variant='pills' defaultValue="overview">
                  <Tabs.List>
                    <Tabs.Tab value="overview" >
                      OverView
                    </Tabs.Tab>
                    <Tabs.Tab value="applicants" >
                      Applicants
                    </Tabs.Tab>
                    <Tabs.Tab value="invited" >
                      Invited
                    </Tabs.Tab>
                    
                  </Tabs.List>
            
                  <Tabs.Panel value="overview">
                    <JobDetail/>
                    
                  </Tabs.Panel>
            
                  <Tabs.Panel value="applicants">
                
                  </Tabs.Panel>

                  <Tabs.Panel value="invited">
                
                  </Tabs.Panel>
            
                 
                </Tabs>
        </div>
    </div>
  )
}

export default PostedJobDesc