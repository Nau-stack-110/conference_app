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

      {/* Section Objectifs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Objectifs</h2>
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg">
                Notre plateforme vise à démocratiser l&apos;accès aux connaissances et à 
                l&apos;expertise à Madagascar. Nous croyons en la force du partage et de 
                l&apos;apprentissage collectif pour développer notre pays.
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>Faciliter l&apos;organisation et la participation aux conférences</li>
                <li>Promouvoir le talent et l&apos;expertise locale</li>
                <li>Encourager les échanges entre professionnels</li>
                <li>Contribuer au développement des compétences</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Impact */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Notre Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-[#3498DB] mb-2">1000+</div>
              <p className="text-gray-600">Participants formés</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-[#3498DB] mb-2">50+</div>
              <p className="text-gray-600">Conférences organisées</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-[#3498DB] mb-2">20+</div>
              <p className="text-gray-600">Villes couvertes</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 