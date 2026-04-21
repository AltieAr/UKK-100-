import parkAreaRepository from '../repositories/parkArearepository.js'
import logService from './logService.js';

class ParkAreaService {
    async index() {
        return await parkAreaRepository.index();
    }

    async findById(id) {
        const area = await parkAreaRepository.find(id);
        if (!area) throw new Error('Area not found');
        return area;
    }

    async create(data, responder) {
        const { area_name, capacity } = data;

        // 1. Validasi dasar
        if (!area_name) throw new Error('Area name is required');
        if (!capacity || capacity <= 0) throw new Error('Capacity must be greater than 0');

        // 2. Kunci Payload (Abaikan kalau user iseng ngirim 'filled' dari Postman)
        const payload = {
            area_name,
            capacity,
            filled: 0 // Default selalu mulai dari 0
        };

        const deskripsi = `Admin created new parking area : ${area_name} `

        await logService.createlog(responder, deskripsi);
        return await parkAreaRepository.create(payload);
    }

    async update(id, data, responder) {
        const existingArea = await parkAreaRepository.find(id);
        if (!existingArea) throw new Error('Area not found');

        const { area_name, capacity } = data;

        
        if (capacity && capacity < existingArea.filled) {
            throw new Error(`Cannot reduce capacity below currently filled spots (${existingArea.filled})`);
        }

        // 4. Bikin payload bersih (tanpa filled)
        const payload = {};
        if (area_name) payload.area_name = area_name;
        if (capacity) payload.capacity = capacity;

        // Update ke database
        await parkAreaRepository.update(id, payload);

        const deskripsi = `Area ${existingArea.area_name} updated by admin`
        await logService.createlog(responder, deskripsi);
        // Return data terbarunya
        
        return await parkAreaRepository.find(id);
    }

    async delete(id) {
        const existingArea = await parkAreaRepository.find(id);
        if (!existingArea) throw new Error('Area not found');

        // 5. Validasi Hapus: Kalau masih ada yang parkir, area gak boleh digusur!
        if (existingArea.filled > 0) {
            throw new Error('Cannot delete area because there are vehicles currently parked');
        }

        return await parkAreaRepository.delete(id);
    }
}

export default new ParkAreaService();