import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [stats, setStats] = useState({ totalArea: 0, totalLot: 0, totalJenis: 0, totalPetugas: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Narik semua API sekaligus biar cepet
        // Pastiin URL API ini sesuai sama punya lu ya cuy!
        const [resTrx, resArea, resType, resUser] = await Promise.all([
          axios.get('http://localhost:3030/api/transaction/all', config).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:3030/api/area/index', config).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:3030/api/vehicle-type/index', config).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:3030/api/user/index', config).catch(() => ({ data: { data: [] } }))
        ]);

        const trxData = resTrx.data?.data || [];
        const areaData = resArea.data?.data || [];
        const typeData = resType.data?.data || [];
        const userData = resUser.data?.data || [];

        // 1. Set Transaksi
        setTransactions(trxData.sort((a, b) => new Date(b.check_in) - new Date(a.check_in)));
        
        // 2. Set Area (Buat Progress Bar di kanan)
        setAreas(areaData);

        // 3. Hitung Stats buat 4 Kartu di atas
        const totalKapasitasLot = areaData.reduce((sum, area) => sum + (area.capacity || 0), 0);
        // Ngitung user yang role-nya operator (petugas parkir)
        const totalPetugas = userData.filter(u => u.role === 'operator').length || userData.length;

        setStats({
          totalArea: areaData.length,
          totalLot: totalKapasitasLot, 
          totalJenis: typeData.length,
          totalPetugas: totalPetugas
        });

      } catch (error) {
        console.error("Gagal load admin dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return { transactions, stats, areas, isLoading };
};