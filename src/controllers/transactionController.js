import transactionService from '../services/transactionService.js'

class TransactionController{
    async checkIn(req, res) {
        try {
            const responder = req.user.id;
            const result = await transactionService.CheckIn(req.body, responder);
            res.status(201).json({ message: 'check in success', data: result });
        } catch (err) {
            if (
                err.message.includes('required') || 
                err.message.includes('penuh') || 
                err.message.includes('masih ada di dalam') ||
                err.message === 'Area not found'
            ) {
                return res.status(400).json({ message: err.message });
            }
            
            // Error server / database
            res.status(500).json({ message: err.message });
        } 
    }

    async checkOut(req, res) {
        try {
            const responder = req.user.id;
            const result = await transactionService.checkOut(req.body, responder);

            res.status(200).json({ 
                message: 'Check-Out sukses! Silakan cetak struk.', 
                data: result 
            });
        }catch (err) {
            if (
                err.message.includes('required') || 
                err.message.includes('tidak terdaftar') || 
                err.message.includes('aktif') ||
                err.message.includes('belum disetting')
            ) {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async getActiveTransactions(req, res) {
        try {
            const result = await transactionService.getActiveTransactions();
            res.status(200).json({ message: 'Transaksi aktif berhasil diambil', data: result });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTransactionHistory(req, res) {
        try {
            const result = await transactionService.getTransactionHistory();
            res.status(200).json({ message: 'Riwayat transaksi berhasil diambil', data: result });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getAllTransactions(req, res) {
        try {
            const result = await transactionService.getAllTransactions();
            res.status(200).json({ message: 'Semua transaksi berhasil diambil', data: result });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new TransactionController();