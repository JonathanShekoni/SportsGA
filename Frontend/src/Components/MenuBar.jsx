import React from 'react'
import Logo from '../Logo.png' 
import { useState,useEffect } from 'react'
import { useLocation,useNavigate} from 'react-router-dom';

const MenuBar = () => {

  const location = useLocation();
  const isComparisonRoute = location.pathname === '/comparison';
  const isProfileRoute = location.pathname === '/player';

  const [playerList, setPlayerList] = useState([])
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate()

  const [suggestions, setSuggestions] = useState([])


  useEffect(() => {
          const fetchplayers = async () => {
              const res = await fetch(`https://sportsga.onrender.com/players`)
              const data = await res.json()
              setPlayerList(data)
          }
  
          fetchplayers()
      }, [])

  const handleSuggestions = (typed) => {
        const updatedList = []
        
        if (typed === ''){
            setSuggestions([])
            return
        }
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].toLowerCase().includes(typed.toLowerCase())) {
                updatedList.push(playerList[i])
            }

        }
        setSuggestions(updatedList)
    }


  const HomeButton = () => {

    navigate(`/comparison`)
  }
    
  const SearchPlayer = (e) => {
    e.preventDefault()
    navigate(`/player?name=${searchTerm}`)
  }

  return (
    <nav className='w-full h-16  shadow-lg flex items-center justify-between px-6'>
        <div className = 'flex items-center gap-2'> 
            <button onClick = {HomeButton} className='text-lg  text-blue-400  font-bebas transition cursor-pointer hover:scale-110  '>SportsGA</button>
            <img src={Logo} alt="Logo" className="rounded-lg shadow-md w-8 h-8" />
        </div>

        {isComparisonRoute && (
          <div className='text-lg center font-bold'>Player Comparison</div>
        )}

        {isProfileRoute && (
          <div className='text-lg center font-bold'>Profile</div>
        )}

        <div className='relative'>
          <form onSubmit = {SearchPlayer}>
            <input
              type = 'text'
              className = ' w-40 text-center border border-blue-400 rounded-2xl px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
              placeholder='Player Search'
              value={searchTerm}
              onChange={(e) => { 
                setSearchTerm(e.target.value)
                handleSuggestions(e.target.value)
              }}

              
            />

            {suggestions.length > 0 && (
                        <div className='absolute w-full max-h-28 overflow-y-auto z-10'>
                            {suggestions.map((player) => (
                            <p 
                                onClick={() =>{
                                    setSearchTerm(player)
                                    setSuggestions([])
                                }} 
                                key ={player}
                                className='block w-full text-left hover:bg-blue-600 px-4 py-2 cursor-pointer'
                                >{player}
                            </p>
                        ))}
                        </div>
                    )}
          </form>
        </div>
    </nav>
  )
}

export default MenuBar