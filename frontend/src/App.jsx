import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ValhallaWheel from './components/ValhallaWheel'
import Footer from './components/Footer'
import RuneBackground from './components/RuneBackground'
import ScrollReveal from './components/ScrollReveal'
import Seo from './components/Seo'
import Home from './pages/Home'
import Community from './pages/Community'
import Join from './pages/Join'
import Rules from './pages/Rules'
import Screenshots from './pages/Screenshots'
import FeaturesPage from './pages/Features'
import Events from './pages/Events'
import Videos from './pages/Videos'
import './pages/Page.css'

function App() {
  const [showValhallaWheel, setShowValhallaWheel] = useState(() => new URLSearchParams(window.location.search).get('valhalla') === 'open')

  return (
    <>
      <RuneBackground />
      <Seo />
      <ScrollReveal />
      <Navbar onOpenGifts={() => setShowValhallaWheel(true)} />
      {showValhallaWheel && <ValhallaWheel onClose={() => setShowValhallaWheel(false)} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notre-communaute-viking-valheim" element={<Community />} />
          <Route path="/nous-rejoindre" element={<Join />} />
          <Route path="/regles-du-serveur-valheim" element={<Rules />} />
          <Route path="/captures-decran" element={<Screenshots />} />
          <Route path="/fonctionnalites-valheim-viking" element={<FeaturesPage />} />
          <Route path="/evenements-valheim-viking" element={<Events />} />
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
