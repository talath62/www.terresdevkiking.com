import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RuneBackground from './components/RuneBackground'
import Home from './pages/Home'
import Community from './pages/Community'
import Join from './pages/Join'
import Rules from './pages/Rules'
import Screenshots from './pages/Screenshots'
import FeaturesPage from './pages/Features'
import Events from './pages/Events'
import './pages/Page.css'

function App() {
  return (
    <>
      <RuneBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notre-communaute-viking-valheim" element={<Community />} />
          <Route path="/nous-rejoindre" element={<Join />} />
          <Route path="/regles-du-serveur-valheim" element={<Rules />} />
          <Route path="/captures-decran" element={<Screenshots />} />
          <Route path="/fonctionnalites-valheim-viking" element={<FeaturesPage />} />
          <Route path="/evenements-valheim-viking" element={<Events />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
