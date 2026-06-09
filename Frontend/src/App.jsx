import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayerComparison from "./Components/PlayerComparison"
import PlayerCard from "./Components/PlayerCard"
import MenuBar from "./Components/MenuBar"
import PlayerPage from "./Components/PlayerPage"


function App() {
  return (
    <BrowserRouter>
      <div className="w-full">
        <MenuBar />
        
        <Routes>
          <Route path="/" element={<PlayerComparison />} />
          <Route path="/player" element={<PlayerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App