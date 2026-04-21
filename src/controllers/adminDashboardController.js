import adminDashboardService from '../services/adminDashboardService.js';

class AdminDashboardController {
    async getStats(req, res) {
        try {
            const stats = await adminDashboardService.getStats();
            
            res.status(200).json({
                message: 'Success pull admin stats',
                data: stats
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new AdminDashboardController();