import React from 'react'
import Logo from '../Logo.png' 

const MenuBar = () => {
  return (
    <nav className='w-full h-16  shadow-lg flex items-center justify-between px-6'>
        <div className = 'flex items-center gap-2'> 
            <div className='text-lg  text-blue-400  font-bebas '>SportsGA</div>
            <img src={Logo} alt="Logo" className="rounded-lg shadow-md w-8 h-8" />
        </div>


        <div className='text-lg center font-bold'>Player Comparison</div>

        <div>
          <input
            type = 'text'
            className = 'w-24 px-5'
            placeholder='Search'
          />
        </div>
    </nav>
  )
}

export default MenuBar