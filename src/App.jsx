import React from 'react'
import Budget from './Budget'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <div>
      <Budget/>
      <ToastContainer />
      
    </div>
  )
}

export default App
