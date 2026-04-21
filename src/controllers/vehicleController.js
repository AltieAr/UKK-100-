import VehicleService from "../services/VehicleService.js";    

class VehicleController {
    async index(req, res) {
        try {
            const result = await VehicleService.index();
            res.json({
                message: "success",
                data: result
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async create(req, res) {
        try {
            const result = await VehicleService.create(req.body);
            res.json({
                message: "success",
                data: result
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async findById(req, res) {
        try {
            const result = await VehicleService.findById(req.params.id);
            if (result) {
                res.json({
                    message: "success",
                    data: result
                });
            } else {
                res.status(404).json({ error: "Vehicle not found" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const result = await VehicleService.update(req.params.id, req.body);
            res.json({
                message: "success",
                data: result
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await VehicleService.delete(req.params.id);
            res.json({
                message: "success",
                data: result
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}


export default new VehicleController();