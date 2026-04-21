import { Transaction, Vehicle, ParkArea, Fee} from '../models/index.js'
import logService from './logService.js';

class TransactionService{
    async CheckIn(data, responder){

        const {
            plate_number,
            id_area,
            id_user,
            id_type
        } = data;

        if (!plate_number) throw new Error('Plate number is required');
        if (!id_area) throw new Error('Area ID is required');
        if (!id_user) throw new Error('User ID is required');

        const area = await ParkArea.findByPk(id_area);
        if (!area) throw new Error('Area not found');
        if (area.filled >= area.capacity) {
            throw new Error('Area parkir sudah penuh!');
        }

        let vehicle = await Vehicle.findOne({ where: { plate_number: plate_number } });


        if (!vehicle) {
            if (!id_type) throw new Error('Kendaraan baru terdeteksi! id_type wajib diisi');
            vehicle = await Vehicle.create({ plate_number, id_type });
        } else {
            const isParked = await Transaction.findOne({
                where: { 
                    id_vehicle: vehicle.id_vehicle, 
                    status: 'masuk' 
                }
            });
            if (isParked) throw new Error('Kendaraan ini masih ada di dalam area parkir!');
        }

        await area.update({ filled: area.filled + 1 });

        const newTransaction = await Transaction.create({
            id_vehicle: vehicle.id_vehicle, // Ambil id dari hasil pencarian/pembuatan di atas
            id_area: id_area,
            id_user: id_user,
            status: 'masuk'
            // check_in otomatis pakai CURRENT_TIMESTAMP dari database lu
        });

        const deskripsi = `Operator check-in vehicle with plate number : ${plate_number} to area ${area.area_name}`

        await logService.createlog(responder, deskripsi);
        return newTransaction;
    }

    async checkOut(data, responder) {
        const { plate_number } = data;

        if (!plate_number) throw new Error('Plate number is required');

        const vehicle = await Vehicle.findOne({ where: { plate_number: plate_number } });
        if (!vehicle) throw new Error('Kendaraan tidak terdaftar');

        const transaction = await Transaction.findOne({
            where: { 
                id_vehicle: vehicle.id_vehicle, 
                status: 'masuk' 
            }
        });
        if (!transaction) throw new Error('Tidak ada transaksi aktif untuk kendaraan ini');

        const checkInTime = new Date(transaction.check_in);
        const checkOutTime = new Date();

        const diffInMs = checkOutTime - checkInTime;
        const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));

        const duration = diffInHours > 0 ? diffInHours : 1;

        const fee = await Fee.findOne({ where: { id_type: vehicle.id_type } });
        if (!fee) throw new Error('Tarif untuk tipe kendaraan ini belum disetting oleh Admin!');

        const total_price = duration * fee.fees_per_hour;

        await transaction.update({
            check_out: checkOutTime,
            duration: duration,
            total: total_price,
            id_fees: fee.id_fees,
            status: 'keluar'
        });

        const area = await ParkArea.findByPk(transaction.id_area);
        if (area && area.filled > 0) {
            await area.update({ filled: area.filled - 1 });
        }

        const deskripsi = `Operator check-out vehicle with pllate number : ${plate_number} from area ${area.area_name}`
        await logService.createlog(responder, deskripsi)
        return transaction;
    }

    async getActiveTransactions() {
        const transactions = await Transaction.findAll({
            where: { status: 'masuk' },
            include: [
                { model: Vehicle, attributes: ['plate_number'] },
                { model: ParkArea, attributes: ['area_name'] },
                { model: Fee, attributes: ['fees_per_hour'] }
            ],
            order: [['check_in', 'DESC']]
        });
        return transactions;
    }

    async getTransactionHistory() {
        const transactions = await Transaction.findAll({
            where: { status: 'keluar' },
            include: [
                { model: Vehicle, attributes: ['plate_number'] },
                { model: ParkArea, attributes: ['area_name'] },
                { model: Fee, attributes: ['fees_per_hour'] }
            ],
            order: [['check_out', 'DESC']]
        });
        return transactions;
    }

    async getAllTransactions() {
        const transactions = await Transaction.findAll({
            include: [
                { model: Vehicle, attributes: ['plate_number'] },
                { model: ParkArea, attributes: ['area_name'] },
                { model: Fee, attributes: ['fees_per_hour'] }
            ],
            order: [['check_in', 'DESC']]
        });
        return transactions;
    }

}

export default new TransactionService();