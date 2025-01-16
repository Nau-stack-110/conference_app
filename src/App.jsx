import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/admin/Dashboard';
import Profile from './components/admin/Profile';
import Conferences from './components/admin/Conference';
import Participants from './components/admin/Participants';
import Statistiques from './components/admin/Statistique';
import Organisateur from './components/admin/Organisateur';

import Home from './components/client/Home';
import Login from './components/client/Login';
import SignUp from './components/client/SignUp';
import Header from './components/client/Header';
import ClientConferences from './components/client/Conferences'; 
import About from './components/client/About';
import Contact from './components/client/Contact';
import Footer from './components/client/Footer';

const App = () => {
  return (
      <Routes>
        {/* Routes Client */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/conferences" element={
          <>
            <Header />
            <ClientConferences />
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Header />
            <About />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={
          <>
            <Header />
            <Contact />
            <Footer />
          </>
        } />

        {/* Routes Admin */}
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Profile />} />
          <Route path="conferences" element={<Conferences />} />
          <Route path="participants" element={<Participants />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="organisateurs" element={<Organisateur />} />
          {/* Redirection par défaut vers le profil */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
  );
};

export default App;




















