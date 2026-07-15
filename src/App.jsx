import { MantineProvider } from '@mantine/core';
import React from 'react'
import '@mantine/core/styles.css';


function App() {
  return (
    <MantineProvider>
      <div className='text-2xl bg-amber-400'>
        HI Hello
      </div>
    </MantineProvider>
  )
}

export default App