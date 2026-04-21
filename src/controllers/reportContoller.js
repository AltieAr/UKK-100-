import reportService from "../services/reportSerice.js";

class ReportController {
    async getDashboard(req,res){
        try{
            const result = await reportService.getDashboardData(req.query);
            res.status(200).json({
                message: 'Data dashboard berhasil diambil',
                data: result
            })
        }catch(err){
            res.status(500).json({
                error: err.message || 'Terjadi kesalahan saat mengambil data dashboard'
            })
        }
    }
}
export default new ReportController();