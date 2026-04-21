import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOwnerHistory = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3030/api/log/index', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Asumsi data array ada di response.data.data atau response.data
        const data = response.data.data || response.data || [];
        
        // Urutin dari yang paling baru (jaga-jaga kalo dari backend belum urut)
        const sortedData = data.sort((a, b) => new Date(b.activity_time) - new Date(a.activity_time));
        
        setLogs(sortedData);
      } catch (error) {
        console.error("Gagal menarik data log aktivitas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, isLoading };
};