import React from 'react'
import Logo from '../Logo.png' 
import { useLocation,useNavigate } from 'react-router-dom';
import PlayerPage from './PlayerPage';

const MenuBar = () => {

  const location = useLocation();
  const isTargetRoute = location.pathname === '/comparison';
  
  const [searchTerm, setSearchTerm] = React.useState('');

  

  return (
    <nav className='w-full h-16  shadow-lg flex items-center justify-between px-6'>
        <div className = 'flex items-center gap-2'> 
            <div className='text-lg  text-blue-400  font-bebas '>SportsGA</div>
            <img src={Logo} alt="Logo" className="rounded-lg shadow-md w-8 h-8" />
        </div>

        {isTargetRoute && (
          <div className='text-lg center font-bold'>Player Comparison</div>
        )}

        <div>
          <input
            type = 'text'
            className = ' w-40 text-center border-1 border-blue-400 rounded-2xl px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            placeholder='Player Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/*}
          <PlayerPage searchTerm={searchTerm} />
          */}
        </div>
    </nav>
  )
}

export default MenuBar