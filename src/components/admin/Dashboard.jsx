import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaUsers, FaChartBar, FaUserTie, FaSignOutAlt, FaBars } from 'react-icons/fa';
import AdminAvatar from '../../assets/react.svg';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/admin', icon: <FaUser />, label: 'Profile' },
    { path: '/admin/conferences', icon: <FaCalendarAlt />, label: 'Conférences' },
    { path: '/admin/participants', icon: <FaUsers />, label: 'Participants' },
    { path: '/admin/statistiques', icon: <FaChartBar />, label: 'Statistiques' },
    { path: '/admin/organisateurs', icon: <FaUserTie />, label: 'Organisateurs' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#2C3E50] text-white rounded-lg"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={isMobile ? { x: -250 } : false}
          animate={{ 
            width: isCollapsed ? '80px' : '250px',
            x: isMobile && isCollapsed ? -250 : 0 
          }}
          className={`bg-[#2C3E50] text-white h-screen fixed md:relative z-40
            ${isMobile && isCollapsed ? 'hidden' : 'block'}`}
        >
          {/* Profile Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-white"
              >
                <img
                  src={AdminAvatar}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {!isCollapsed && (
                <div className="text-center">
                  <h2 className="font-semibold">Admin User</h2>
                  <p className="text-sm text-gray-300">Administrateur</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#3498DB] text-white'
                    : 'text-gray-300 hover:bg-[#34495E]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="ml-4">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 w-full p-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white w-full"
            >
              <FaSignOutAlt />
              {!isCollapsed && <span className="ml-4">Déconnexion</span>}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;