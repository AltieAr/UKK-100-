import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOwnerDashboard = () => {
  const [summary, setSummary] = useState({ total_pendapatan: 0, jumlah_kendaraan_keluar: 0 });
  const [realtimeArea, setRealtimeArea] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3030/api/owner/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data.data || {};
        
        setSummary(data.summary || { total_pendapatan: 0, jumlah_kendaraan_keluar: 0 });
        setRealtimeArea(data.realtime_area || []);
        setTransactions(data.detail_transaksi || []);

      } catch (error) {
        console.error("Gagal narik data dashboard owner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { summary, realtimeArea, transactions, isLoading };
};