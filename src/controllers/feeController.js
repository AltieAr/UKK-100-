import feeService from "../services/feeService.js";

class FeeController {
    async index(req, res) {
        try {
            const result = await feeService.index();
            res.json({ message: 'success', data: result });
        } catch (err) {
            if (err.message === 'id_type is required' || err.message === 'vehicle type not found') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async create(req, res) {
        try {
            const result = await feeService.create(req.body);

            res.json({ 
                message: 'success', 
                data: result 
            });
            
        } catch (err) {
            if (err.message === 'id_type is required' || err.message === 'vehicle type not found') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            // console.log(id,'jir');
            const result = await feeService.findById(id);
            if (result) {
                res.json({ 
                    message: 'success', 
                    data: result 
                });
            } else {
                res.status(404).json({
                     message: 'data not found' 
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const responder = req.user.id;
            // console.log("data :",req.params);
            const result = await feeService.update(req.params.id, req.body, responder);
            res.json({ message: 'success', data: result });
        } catch (err) {
            if (err.message === 'id_type is required' || err.message === 'vehicle type not found') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await feeService.delete(req.params.id);
            res.json({ message: 'success', data: result });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new FeeController();