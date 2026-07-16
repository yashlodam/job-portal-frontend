import { MantineProvider, Slider } from '@mantine/core';
import React from 'react'
import '@mantine/core/styles.css';
import Home from './Pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <MantineProvider>
       <BrowserRouter>
       <Routes>
        <Route path="*" element={<Home/>}/>
       </Routes>
       </BrowserRouter>
    </MantineProvider>
  )
}

export default App