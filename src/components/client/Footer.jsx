import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#2C3E50] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Conference4Tous</h3>
            <p className="text-gray-300">
              Votre plateforme de conférences à Madagascar, dédiée au partage de connaissances 
              et au développement professionnel.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/conferences" className="text-gray-300 hover:text-white">
                  Conférences
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Gara, Antsirabe</li>
              <li>+261 38 55 532 76</li>
              <li>zah@conf4tous.mg</li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            © {new Date().getFullYear()} Conf4Tous. Fait avec{' '}
            <FaHeart className="inline-block text-red-500" /> à Madagascar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 