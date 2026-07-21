import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ValhallaWheel from './components/ValhallaWheel'
import PlayerProfileOverlay from './components/PlayerProfileOverlay'
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
import AdminValhalla from './pages/AdminValhalla'
import './pages/Page.css'

function App() {
  const [showValhallaWheel, setShowValhallaWheel] = useState(() => new URLSearchParams(window.location.search).get('valhalla') === 'open')
  const [showPlayerProfile, setShowPlayerProfile] = useState(() => new URLSearchParams(window.location.search).get('profile') === 'setup')
  const [profileVersion, setProfileVersion] = useState(0)

  const closePlayerProfile = () => {
    setShowPlayerProfile(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('profile')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <>
      <RuneBackground />
      <Seo />
      <ScrollReveal />
      <Navbar key={`nav-${profileVersion}`} onOpenGifts={() => setShowValhallaWheel(true)} onOpenProfile={() => setShowPlayerProfile(true)} />
      {showValhallaWheel && <ValhallaWheel key={`wheel-${profileVersion}`} onClose={() => setShowValhallaWheel(false)} />}
      {showPlayerProfile && <PlayerProfileOverlay onClose={closePlayerProfile} onSaved={() => setProfileVersion((version) => version + 1)} />}
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
          <Route path="/admin/valhalla" element={<AdminValhalla />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
