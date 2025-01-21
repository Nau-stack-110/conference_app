export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatTime = (timeString) => {
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  return new Date(`${timeString}`).toLocaleTimeString('fr-FR', options);
}; 