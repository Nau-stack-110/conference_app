import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistique = () => {
  const barData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Nombre de participants',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#3498DB',
      },
    ],
  };

  const pieData = {
    labels: ['Tech', 'Business', 'Science', 'Arts', 'Autres'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#3498DB',
          '#2C3E50',
          '#34495E',
          '#2980B9',
          '#1ABC9C',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#2C3E50]">Statistiques</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Participants par mois</h3>
          <Bar data={barData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Types de conférences</h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Statistiques globales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#3498DB] text-white rounded-lg">
              <p className="text-sm">Total Conférences</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="p-4 bg-[#2C3E50] text-white rounded-lg">
              <p className="text-sm">Total Participants</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="p-4 bg-[#34495E] text-white rounded-lg">
              <p className="text-sm">Événements ce mois</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="p-4 bg-[#2980B9] text-white rounded-lg">
              <p className="text-sm">Taux de participation</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistique; 