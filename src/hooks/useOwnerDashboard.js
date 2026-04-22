import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOwnerDashboard = () => {
  const [summary, setSummary] = useState({ total_pendapatan: 0, jumlah_kendaraan_keluar: 0 });
  const [realtimeArea, setRealtimeArea] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE BUAT FILTER TANGGAL ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // 1. Fetch Data dari API
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
        
        const trxData = data.detail_transaksi || [];
        setTransactions(trxData);
        setFilteredTransactions(trxData); // Awalnya tampilkan semua
      } catch (error) {
        console.error("Gagal narik data dashboard owner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 2. Logic Filter Otomatis pas Tanggal Diubah
  useEffect(() => {
    if (transactions.length > 0) {
      let result = transactions;

      if (startDate || endDate) {
        result = transactions.filter(trx => {
          let isMatchDate = true;
          if (trx.check_in) {
            const trxDate = new Date(trx.check_in).toISOString().split('T')[0];
            if (startDate && trxDate < startDate) isMatchDate = false;
            if (endDate && trxDate > endDate) isMatchDate = false;
          }
          return isMatchDate;
        });
      }
      setFilteredTransactions(result);
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, startDate, endDate]);

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // Lempar semua state & fungsi ke file UI
  return { 
    summary, 
    realtimeArea, 
    filteredTransactions, // Kita cuma ngirim data yang udah difilter
    isLoading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilter
  };
};