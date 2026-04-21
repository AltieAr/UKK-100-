import userServices from "../services/userService.js";

class UserControllers {
    async create(req, res) {
        try {
            const responder = req.user.id;
            const data = req.body;
            const result = await userServices.create(data, responder);
            res.json({
                message: "success",
                data: result
            });
        }
        catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async index(req, res) {
        try{
            const result = await userServices.indexOpe();
            res.json({
                message: "success",
                data: result
            });
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async indexAll(req,res){
        try{
             const result = await userServices.findAll();
             
             res.status(200).json({
                message: "succes",
                data: result
             })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async findById(req,res){
        try {
            const id = req.params.id;
            const result = await userServices.findById(id);

            if(!result){
                throw new Error("cant find this user");
            }

            if(result.role !== 'operator'){
                throw new Error("unauthorized");
            }

            res.status(200).json({
                message: "success",
                data: result
            });
        }
        catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async delete(req, res) {
        try{ 
            const responder = req.user.id;
            console.log("responder id:", responder); // Cek ID user yang melakukan delete
            const result =  await userServices.delete(req.params.id, responder);
            res.json({
                message: "success",
                data: result
            });
        } catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async update(req, res) {
        try{
            const id = req.params.id;
            const {role, ...data} = req.body;

            if (role) {
                throw new Error("Role cannot be updated");
            }

            const check = await userServices.findById(id);
            const roleisoperator = check.role === 'operator';
            if (!roleisoperator) {
                throw new Error("Only operators can be updated");
            }

            const responder = req.user.id;
            const result = await userServices.update(id, data, responder);
            res.json({
                message: "success",
                data: result
            });
        }
       catch(err){
            // Bongkar pesan error bawaan Sequelize
            if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                const errorMessages = err.errors.map(e => e.message);
                return res.status(400).json({
                    message: "Validation error",
                    detail: errorMessages // Nah, di sini nanti kelihatan jelas yang error NPWP, email, atau username-nya
                });
            }
            
            res.status(500).json({
                message: err.message
            });
        }
        

    }


}

export default new UserControllers();