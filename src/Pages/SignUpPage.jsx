import { Divider } from '@mantine/core'
import { Sparkles } from 'lucide-react'
import React from 'react'

function SignUpPage() {
  return (

    <div className="relative">
      {/* Mesh gradient background layer — absolute so it stays within Home only */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient" />

      {/* Ambient glow orbs — absolute (not fixed) so they don't bleed into other pages */}
      <div className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-[600px] w-[600px] rounded-full bg-violet/4 blur-[200px]" />

      {/* Subtle dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
       <div className='min-h-[90vh]'>
        <Divider size="xs" mx="md"/>
        <div className='w-[100vw] h-[100vh]'>
            <div className='w-1/2 h-full rounded-r-[200px]'>
            
            <div className='flex gap-1 items-center'>
                 <Sparkles className="text-white" size={16} strokeWidth={2.5} />
                 <div className='text-3xl font-semibold'>Velora</div>

            </div>

            </div>

        </div>
    </div>
      </div>
   
  )
}

export default SignUpPage