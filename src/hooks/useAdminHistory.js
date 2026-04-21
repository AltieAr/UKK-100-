import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAdminHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3030/api/transaction/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data.data || [];
        const sortedData = data.sort((a, b) => new Date(b.check_in) - new Date(a.check_in));
        
        setTransactions(sortedData);
      } catch (error) {
        console.error("Gagal narik data history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { transactions, isLoading };
};