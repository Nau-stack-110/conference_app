import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import useAuth from "./useAuth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, handleLogout } = useAuth();


  useEffect(() => {
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
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-2xl font-bold text-[#2C3E50]">
              Conference4Tous
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[#2C3E50] hover:text-[#3498DB] transition-colors ${
                    location.pathname === item.path ? 'font-semibold text-[#3498DB]' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Menu Auth Desktop */}
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
                  className="px-4 py-2 text-[#3498DB] hover:text-[#2980B9]"
                >
                  <FaUser className="inline-block mr-2" />
                  {isAuthenticated ? 'Bonjour, ' : 'Compte'}
                </motion.button>

                <AnimatePresence>
                  {showAuthModal && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="text-[#3498DB] hover:text-[#2980B9]"
                >
                  Déconnexion
                </button>
              )}
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
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-[#3498DB] border-2 border-[#3498DB] rounded-lg hover:bg-[#3498DB] hover:text-white transition-colors"
                >
                  {isAuthenticated ? 'Déconnexion' : 'Se connecter'}
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors"
                  >
                    S&apos;inscrire
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
