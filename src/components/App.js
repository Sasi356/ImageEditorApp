import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import MainApp from './MainApp'
import OpenImage from './OpenImage'


function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainApp/>}></Route>
                <Route path='Open' element={<OpenImage/>}></Route>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App