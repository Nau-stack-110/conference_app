import { MdEventSeat } from "react-icons/md"; 
import {  Pie } from 'react-chartjs-2';
import { 
  FiUsers, 
  FiBookmark,
} from 'react-icons/fi';
import axios from 'axios';
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
import { useState, useEffect } from 'react';

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
  const [stats, setstats] = useState([]); 
  const [conferences, setConferences] = useState([]);

  const getConferences =  async () =>{
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/conferences/");
      setConferences(response.data);
    } catch (e) {
      console.error("Erreur lors du chargement des conferences:", e);
    }
  }
  // const barData = {
  //   labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
  //   datasets: [
  //     {
  //       label: 'Nombre de participants',
  //       data: [65, 59, 80, 81, 56, 55],
  //       backgroundColor: '#3498DB',
  //     },
  //   ],
  // };
  const categories = ['Technologies', 'Education', 'Business', 'Science', 'Cultures', 'Arts', 'Autres'];
  
  const categoryData = categories.map((cat)=> ({
    cat, count:conferences.filter((conf)=> conf.category === cat).length,
  }));
  console.log(categoryData);

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categoryData.map((item)=> item.count),
        backgroundColor: [
          '#3498DB',
          '#bb7924',
          '#34495E',
          '#63c73c',
          '#1ABC9C',
          '#6d2f2f',
          '#c73cb0'
        ],
      },
    ],
  };

  const statsa = [
    { title: 'Utilisateurs', value: `${stats.users}`, icon: FiUsers, color:'bg-[#34495E]' },
    { title: 'Conferences', value: `${stats.conferences}`, icon: MdEventSeat, color:'bg-[#3498DB]' },
    { title: 'Registrations', value: `${stats.registrations}`, icon: FiBookmark, color:'bg-[#2C3E50]' },
    {title:'Taux de participation', value:'87%', color:'bg-[#2980B9]'}
  ];

  const getStats = async () =>{
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stats/");
      setstats(response.data);
    } catch (e) {
      console.error("Erreur lors du chargement des statistiques:", e);
    }
  }

  useEffect(() => {
    getStats();
    getConferences();
  }, []);
  

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#2C3E50]">Statistiques</h2>
      
      <div className="grid gap-6 md:grid-cols-2">

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Statistiques globales</h3>
            <div className="grid grid-cols-2 gap-4">
            {statsa.map((stat, index) => {
            return (
              <div key={index} className={`p-4 ${stat.color} text-white rounded-lg`}>
                <p className="text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            )
            })}
            </div>
          </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Types de conférences</h3>
          <Pie data={pieData} />
        </div>

          {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Participants par mois</h3>
          <Bar data={barData} />
        </div> */}

      </div>
    </div>
  );
};

export default Statistique; 