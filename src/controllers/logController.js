import logService from "../services/logService.js";

class LogController{
    async index(req,res){
        try{
            const Logs = await logService.getAllLogs();
            res.status(200).json({
                message: 'succes',
                data: Logs
            })
        }
        catch(err){         
            res.status(500).json({
                message: err.message
            })
        }
    }
}
export default new LogController();