import { div } from 'framer-motion/client'
import React from 'react'
import TalentCard from './TalentCard'

function RecommendTalent() {
  return (
    <div>
        <div className='text-xl font-semibold mb-5'>Recommended Talent </div>
        <div className='flex flex-col flex-wrap gap-5'>
            {
                [1,2,3,4].map((item,index)=> index<4 &&<TalentCard/>)
            }
        </div>
    </div>
  )
}

export default RecommendTalent