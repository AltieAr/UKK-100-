import parkAreaService from '../services/parkAreaService.js'

class ParkAreaController {
    async index(req, res) {
        try {
            const result = await parkAreaService.index();
            res.status(200).json({ message: 'success', data: result });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async findById(req, res) {
        try {
            const result = await parkAreaService.findById(req.params.id);
            res.status(200).json({ message: 'success', data: result });
        } catch (err) {
            if (err.message === 'Area not found') return res.status(404).json({ message: err.message });
            res.status(500).json({ message: err.message });
        }
    }

    async create(req, res) {
        try {   
            const responder = req.user.id
            const result = await parkAreaService.create(req.body, responder);
            res.status(201).json({ message: 'success', data: result });
        } catch (err) {
            if (err.message.includes('required') || err.message.includes('greater than')) {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const responder = req.user.id;
            const result = await parkAreaService.update(req.params.id, req.body, responder);
            res.status(200).json({ message: 'success', data: result });
        } catch (err) {
            if (err.message === 'Area not found') return res.status(404).json({ message: err.message });
            if (err.message.includes('Cannot reduce capacity')) return res.status(400).json({ message: err.message });
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            await parkAreaService.delete(req.params.id);
            res.status(200).json({ message: 'successfully deleted' });
        } catch (err) {
            if (err.message === 'Area not found') return res.status(404).json({ message: err.message });
            if (err.message.includes('Cannot delete area')) return res.status(400).json({ message: err.message });
            res.status(500).json({ message: err.message });
        }
    }
}

export default new ParkAreaController();