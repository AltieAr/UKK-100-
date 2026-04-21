import {Log, User} from '../models/index.js';
class LogService {
    async createlog(id_user, activity_name){
        try{
            await Log.create({
                id_user : id_user,
                activity : activity_name
            });
        }
        catch(err){
            console.error('Error creating log:', err.message);
        }
    }

    async getAllLogs(){
        return await Log.findAll({
            include:[{model: User, attributes: ['full_name','role']
            }],
            order:[['activity_time', 'DESC']]

        });
    }   
}


export default new LogService();