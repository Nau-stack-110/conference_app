import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaQrcode, FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaDownload, FaFilePdf, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import io from "../../assets/Linux.png"

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/my-tickets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tickets:', error);
        navigate('/login');
      }
    };

    fetchTickets();
  }, [navigate]);

  const downloadQRCode = (qrcodeUrl, conferenceTitle) => {
    const link = document.createElement('a');
    link.href = qrcodeUrl;
    link.download = `qrcode-${conferenceTitle.replace(/ /g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = async (ticket) => {
    const doc = new jsPDF();
    const primaryColor = '#3498DB';
    const logoUrl = io;

    try {
      Swal.fire({
        title: 'Génération du PDF...',
        html: '<div class="pdf-generating-spinner"></div>',
        showConfirmButton: false,
        allowOutsideClick: false
      });

      // Chargement fiable des images
      const loadPromises = [
        loadImage(ticket.qrcode_url).catch(() => null),
        loadImage(logoUrl).catch(() => null)
      ];

      const [qrCodeImg, logoImg] = await Promise.all(loadPromises);

      Swal.close();

      // Vérification de la présence du QR code
      if (!qrCodeImg) {
        throw new Error('Impossible de charger le QR code');
      }

      // En-tête avec logo
      if (logoImg) {
        doc.addImage(logoImg, 'PNG', 15, 10, 40, 40, undefined, 'FAST');
      }
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text("Conf4Tous", logoImg ? 50 : 15, 25);

      // Ligne de séparation
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, 40, 195, 40);

      // Contenu principal centré
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text(`Ticket d'accès`, 105, 60, { align: 'center' });
      
      // Cercle décoratif
      doc.setFillColor(primaryColor);
      doc.circle(105, 70, 3, 'F');

      // Détails de la conférence
      doc.setFontSize(14);
      doc.text("Détails du ticket :", 15, 90);
      doc.setFont('helvetica', 'bold');
      doc.text(ticket.conference_title, 15, 100);
      
      doc.setFont('helvetica', 'normal');
      const formattedDate = new Date(ticket.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date: ${formattedDate}`, 15, 110);
      doc.text(`Lieu: ${ticket.lieu}`, 15, 120);

      // Section QR code améliorée
      const qrCodeSize = 100;
      const pageWidth = doc.internal.pageSize.getWidth();
      const qrCodeX = (pageWidth - qrCodeSize) / 2;
      const qrCodeY = 130;

      // Dessin du QR code avec contour
      doc.setDrawColor(40);
      doc.setLineWidth(0.5);
      doc.roundedRect(qrCodeX - 5, qrCodeY - 5, qrCodeSize + 10, qrCodeSize + 10, 5, 5, 'S');
      
      if (qrCodeImg.width >= 300) { 
        doc.addImage(qrCodeImg, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize, undefined, 'SLOW');
      } else {
        doc.addImage(qrCodeImg, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      }

      // Pied de page
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Ce ticket est valable uniquement pour la date indiquée", 105, 280, { align: 'center' });
      doc.text("En cas de problème, contactez zah@conf4tous.com", 105, 285, { align: 'center' });

      doc.save(`ticket-${ticket.conference_title}.pdf`);

    } catch (error) {
      Swal.close();
      Swal.fire(
        'Erreur', 
        error.message || 'Échec de la génération du PDF', 
        'error'
      );
    }
  };

  // Version simplifiée du chargement d'image
  const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Échec du chargement de l\'image'));
    img.src = url;
    
    setTimeout(() => {
      if (!img.complete) reject(new Error('Délai dépassé pour le chargement'));
    }, 5000);
  });

  return (
    <div className="min-h-screen pt-10 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-10 text-center text-[#2C3E50]"
        >
          <FaTicketAlt className="inline-block mr-2" />
          Mes Tickets d&apos;accès
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mx-auto mb-8 max-w-2xl w-full"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm flex items-start">
            <div className="relative">
              <FaInfoCircle className="text-blue-500 text-xl mr-3 flex-shrink-0" />
              {/* Ajouter le badge animé ici */}
            </div>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Information importante</p>
              <p className="text-blue-700 text-sm">
                🕒 Merci d'arriver 30 minutes avant le début de la conférence pour la validation de votre ticket.<br />
                🎟️ Votre ponctualité assure un processus d'entrée fluide et sécurisé !
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              transition: { 
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1.5
              }
            }}
            className="absolute -top-2 -right-2"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#3498DB] p-3 rounded-lg">
                      <FaQrcode className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{ticket.conference_title}</h3>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2" />
                      <span>{new Date(ticket.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{ticket.lieu}</span>
                    </div>
                  </div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative bg-gradient-to-r from-[#3498DB] to-[#2C3E50] p-4 rounded-xl"
                  >
                    <img 
                      src={ticket.qrcode_url} 
                      alt="QR Code" 
                      className="w-full h-64 object-contain mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                      <button
                        onClick={() => downloadQRCode(ticket.qrcode_url, ticket.conference_title)}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <FaDownload className="text-2xl text-[#3498DB]" />
                      </button>
                    </div>
                  </motion.div>

                  <div className="mt-4 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generatePDF(ticket)}
                      className="bg-[#3498DB] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2980B9]"
                    >
                      <FaFilePdf className="text-lg" />
                      Télécharger PDF
                    </motion.button>
                  </div>

                  <p className="mt-2 text-sm text-center text-gray-500">
                    Présentez ce QR code à l&apos;entrée de l&apos;événement
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-20"
          >
            <p className="text-xl text-gray-500 mb-4">Aucun ticket disponible</p>
            <button
              onClick={() => navigate('/conferences')}
              className="bg-[#3498DB] text-white px-6 py-2 rounded-lg hover:bg-[#2980B9] transition-colors"
            >
              Voir les conférences
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
