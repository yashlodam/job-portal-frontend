import { MantineProvider, Slider } from '@mantine/core';
import React from 'react'
import '@mantine/core/styles.css';
import Home from './Pages/Home';


function App() {
  return (
    <MantineProvider>
      <Home/>
    </MantineProvider>
  )
}

export default App