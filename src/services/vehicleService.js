import vehicleRepository from "../repositories/vehicleRepository.js";
import vehicleTypeRepository from "../repositories/vehicleTypeRepository.js";

class VehicleService {
    
    async index() {
        return await vehicleRepository.index();
    }

    async create(data) {
    
        const res = data.id_type;
        const licensePlate = data.plate_number;
        const vehicleType = await vehicleTypeRepository.findById(res);
        if (!vehicleType) {
            throw new Error('Vehicle type not found');
        }
        const check = await vehicleRepository.findOne(res);
        if (check) {
            throw new Error('Vehicle type already exists');
        }

        const existingVehicle = await vehicleRepository.findByLicensePlate(licensePlate);
        if (existingVehicle) {
            throw new Error('Vehicle with this license plate already exists');
        }

        return await vehicleRepository.create(data);
    }

    async findById(id) {
        return await vehicleRepository.findById(id);
    }

    async update(id, data) {
        const res = id;
        const licensePlate = data.plate_number;
        const check = await vehicleRepository.findOne(res);
        const vehicleType = await vehicleTypeRepository.findById(res);
        const existingVehicle = await vehicleRepository.findByLicensePlate(licensePlate);
        if (!vehicleType) {
            throw new Error('Vehicle not found');
        }
        // if (check) {
        //     throw new Error('Vehicle type already exists');
        // }
        if (existingVehicle) {
            throw new Error('Vehicle with this license plate already exists');
        }

        const up = {
                plate_number: data.plate_number,
                id_type : res,
                color : data.color,
                owner : data.owner 
        }

        return await vehicleRepository.update(id, up);
    }

    async delete(id) {
        return await vehicleRepository.delete(id);
    }

}

export default new VehicleService();