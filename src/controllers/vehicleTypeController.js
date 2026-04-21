import vehicleTypeService from "../services/vehicleTypeService.js";

class VehicleTypeControllers {
    async index(req, res) {
        try{
            const result = await vehicleTypeService.index();
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

    async create(req, res) {
        try{
            const result = await vehicleTypeService.create(req.body);
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

    async findById(req, res) {
        try{
            const result = await vehicleTypeService.findById(req.params.id);    
            if(result){
                res.json({
                    message: "success",
                    data: result
                });
            }else{
                res.status(404).json({
                    message: "data not found"
                });
            }
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    async update(req, res) {
        try{
            const result = await vehicleTypeService.update(req.params.id, req.body);
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

    async delete(req, res) {
        try{
            const result = await vehicleTypeService.delete(req.params.id);
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
}

export default new VehicleTypeControllers();