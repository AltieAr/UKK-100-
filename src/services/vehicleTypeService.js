import vehicleTypeRepository from "../repositories/vehicleTypeRepository.js";

class VehicleTypeService {
    async index() {
        return await vehicleTypeRepository.index();
    }

    async create(data) {
        const res = data.vehicle_type;
        if (!res) {
            throw new Error('vehicle type is required');
        }
        const existingVehicleType = await vehicleTypeRepository.findByName(res);
        if (existingVehicleType) {
            throw new Error('vehicle type already exists');
        }
        return await vehicleTypeRepository.create(data);
    }

    async findById(id) {
        return await vehicleTypeRepository.findById(id);
    }

    async update(id_type, data) {
        const existingVehicleType = await vehicleTypeRepository.findById(id_type);
        if (!existingVehicleType) {
            throw new Error('vehicle type not found');
        }
        const newVehicleTypeName = data.vehicle_type;
        if (!newVehicleTypeName) {
            throw new Error('vehicle type is required');
        }
        const vehicleTypeWithSameName = await vehicleTypeRepository.findByName(newVehicleTypeName);
        if (vehicleTypeWithSameName && vehicleTypeWithSameName.id_type !== id_type) {
            throw new Error('vehicle type already exists');
        }

        return await vehicleTypeRepository.update(id_type, data);
    }

    async delete(id) {
        return await vehicleTypeRepository.delete(id);
    }
}

export default new VehicleTypeService();