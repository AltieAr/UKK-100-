import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOperatorDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ parkedNow: 0, enteredToday: 0, revenueToday: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3030/api/transaction/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allData = response.data.data || [];
        const sortedData = allData.sort((a, b) => new Date(b.check_in) - new Date(a.check_in));
        
        setTransactions(sortedData);

        // Hitung stats harian
        const today = new Date().toLocaleDateString('id-ID');
        let parked = 0, entered = 0, revenue = 0;

        allData.forEach(item => {
          const itemCheckInDate = new Date(item.check_in).toLocaleDateString('id-ID');
          const itemCheckOutDate = item.check_out ? new Date(item.check_out).toLocaleDateString('id-ID') : null;

          if (item.status?.toLowerCase() === 'masuk' || item.status?.toLowerCase() === 'process') parked++;
          if (itemCheckInDate === today) entered++;
          if (itemCheckOutDate === today && (item.status?.toLowerCase() === 'keluar' || item.status?.toLowerCase() === 'delivered')) {
            revenue += Number(item.total || 0);
          }
        });

        setStats({ parkedNow: parked, enteredToday: entered, revenueToday: revenue });
      } catch (error) {
        console.error("Gagal narik data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Balikin datanya biar bisa dipake di file HTML/JSX
  return { transactions, stats, isLoading };
};