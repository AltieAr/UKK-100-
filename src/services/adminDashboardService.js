// Pastiin nama model lu sesuai sama yang di index.js models lu ya
import { ParkArea, Fee, User } from '../models/index.js'; 

class AdminDashboardService {
    async getStats() {
        // 1. Hitung total area parkir
        const totalArea = await ParkArea.count();

        // 2. Hitung total lot (jumlahin semua kapasitas dari tiap area)
        // Dikasih || 0 biar kalau tabel kosong nggak error null
        const totalLot = await ParkArea.sum('capacity') || 0; 

        // 3. Hitung total jenis kendaraan (bisa dari tabel Fee)
        const totalJenis = await Fee.count(); 

        // 4. Hitung total petugas (Operator)
        const totalPetugas = await User.count({
            where: {
                role: 'operator' // Sesuaikan kalau di DB lu nulisnya 'petugas'
            }
        });

        // Balikin dalam satu paket JSON yang rapi
        return {
            totalArea,
            totalLot,
            totalJenis,
            totalPetugas
        };
    }
}

export default new AdminDashboardService();