import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import useAuth from "./useAuth";
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, handleLogout } = useAuth();
  const [userInfo, setuserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decoded = jwtDecode(token);
        setuserInfo(decoded);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, []);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/conferences', label: 'Conférences' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-gradient-to-r from-[#2C3E50] to-[#3498DB] shadow-xl' : 'bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className={`text-2xl font-bold ${isScrolled ? 'text-white' : 'text-[#2C3E50]'}`}>
              <span className="bg-[#3498DB] text-white px-2 py-1 rounded">Conf</span>érence4Tous
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    location.pathname === item.path 
                      ? 'bg-[#3498DB] text-white' 
                      : isScrolled 
                        ? 'text-white hover:bg-white/20' 
                        : 'text-[#2C3E50] hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-2">
              <motion.div
                initial={false}
                animate={showAuthModal ? "open" : "closed"}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(!showAuthModal)}
                  className={`flex items-center space-x-2 ${
                    isScrolled ? 'text-white' : 'text-[#2C3E50]'
                  }`}
                >
                  <FaUser className="text-xl" />
                  {isAuthenticated && userInfo && (
                    <span className="hidden sm:block">{userInfo.username}</span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showAuthModal && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                    >
                      {isAuthenticated ? (
                        <>
                          <motion.div
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => {
                              navigate('/my-tickets');
                              setShowAuthModal(false);
                            }}
                          >
                            Mes tickets
                          </motion.div>
                          <motion.div
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => {
                              handleLogout();
                              setShowAuthModal(false);
                            }}
                          >
                            Déconnexion
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => {
                              navigate('/login');
                              setShowAuthModal(false);
                            }}
                          >
                            Se connecter
                          </motion.div>
                          <motion.div
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => {
                              navigate('/register');
                              setShowAuthModal(false);
                            }}
                          >
                            S&apos;inscrire
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Bouton Menu Mobile */}
            <button
              className="md:hidden text-[#2C3E50]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-20 z-40 bg-white shadow-lg md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-[#2C3E50] py-2 hover:text-[#3498DB] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="border-gray-200" />
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate('/my-tickets');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-[#3498DB] border-2 border-[#3498DB] rounded-lg hover:bg-[#3498DB] hover:text-white transition-colors"
                  >
                    Mes tickets
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
