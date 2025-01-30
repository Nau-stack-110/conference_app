import { motion } from 'framer-motion';
import { FaLightbulb, FaHandshake, FaGraduationCap, FaUsers } from 'react-icons/fa';

const About = () => {
  const missions = [
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Promouvoir l'innovation et le partage de connaissances à Madagascar"
    },
    {
      icon: <FaHandshake />,
      title: "Collaboration",
      description: "Faciliter les rencontres entre professionnels et experts malgaches"
    },
    {
      icon: <FaGraduationCap />,
      title: "Formation",
      description: "Contribuer au développement des compétences locales"
    },
    {
      icon: <FaUsers />,
      title: "Communauté",
      description: "Créer une communauté dynamique d'apprenants et de professionnels"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Section Hero */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            À Propos de Conference4Tous
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            La première plateforme de conférences dédiée au développement 
            professionnel et culturel à Madagascar
          </motion.p>
        </div>
      </div>

      {/* Section Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missions.map((mission, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="text-4xl text-[#3498DB] mb-4 flex justify-center">
                  {mission.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 