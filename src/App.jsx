import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/admin/Dashboard';
import Profile from './components/admin/Profile';
import Conferences from './components/admin/Conference';
import Participants from './components/admin/Participants';
import Statistiques from './components/admin/Statistique';
import Organisateur from './components/admin/Organisateur';

import Home from './components/client/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Header from './components/client/Header';
import ClientConferences from './components/client/Conferences'; 
import About from './components/client/About';
import Contact from './components/client/Contact';
import Footer from './components/client/Footer';
import PrivateRoute from './components/privatedRoute';
import AdminRoute from './components/adminRoute';
import MyTickets from './components/client/MyTickets';

const App = () => {
  return (
      <Routes>
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
        <Route path="/my-tickets" element={<> <Header/> <MyTickets/> </>}></Route>
        <Route path="/login" element={ <> <Header /> <Login /> </>} />
        <Route path="/register" element={ <> <Header /> <Register /> </>} />
        <Route path="/contact" element={
          <>
            <Header />
            <Contact />
            <Footer />
          </>
        } />

        <Route path="/admin" element={<PrivateRoute> <AdminRoute> <Dashboard /> </AdminRoute> </PrivateRoute>}>
          <Route index element={<Profile />} />
          <Route path="conferences" element={<Conferences />} />
          <Route path="participants" element={<Participants />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="organisateurs" element={<Organisateur />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
  );
};

export default App;




















