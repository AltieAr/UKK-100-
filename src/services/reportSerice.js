import { Transaction, ParkArea, Vehicle, User } from "../models/index.js";
import {Op} from 'sequelize';

class ReportService {
    async getDashboardData(query) {
        const { startDate, endDate } = query;

        let dateFilter = {};
        if (startDate && endDate){
            const start = new Date(startDate);
            start.setHours(0,0,0,0);

            const end = new Date(endDate);
            end.setHours(23,59,59, 999);

            dateFilter = {
                check_out: {
                    [Op.between]: [start, end]
                }
            };
        }

        const totalpendapatan = await Transaction.sum('total',{where: {
            status: 'keluar',
            ...dateFilter
        }}) || 0;

        const totalTransaksi = await Transaction.count({where:{
            status: 'keluar',
            ...dateFilter
        }})

        const statusArea = await ParkArea.findAll({
            attributes: ['id_area', 'area_name', 'capacity', 'filled'],
        });

        const detailTransaksi = await Transaction.findAll({
            where: {
                status: 'keluar',
                ...dateFilter
            },
            include : [
                {model: Vehicle},
                {model: ParkArea},
                {model: User, attributes: ['id_user','full_name']}
            ],
            order: [['check_out', 'DESC']]
        });

        return {
            summary: {
                total_pendapatan: totalpendapatan,
                jumlah_kendaraan_keluar: totalTransaksi
            },
            realtime_area: statusArea,
            detail_transaksi: detailTransaksi
        };

    }
}

export default new ReportService();