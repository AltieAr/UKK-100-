import { Vehicle, VehicleType } from '../models/index.js';

class VehicleRepository {
    async create(data) {
        return await Vehicle.create(data);
    }

    async index() {
        return await Vehicle.findAll({ include: [{ model: VehicleType, as: 'vehicle_type' }] });
    }

    async findById(id){
        return await Vehicle.findByPk(id, { include: [{ model: VehicleType, as: 'vehicle_type' }] });
    }

    async update(id, data){
        return await Vehicle.update(data, {where: {id_vehicle: id}});
    }

    async findOne(id){
        return await Vehicle.findOne({ where: { id_type: id } });
    }

    async findByLicensePlate(license_plate) {
        return await Vehicle.findOne({ where: { plate_number: license_plate } });
    }

    async delete(id){
        return await Vehicle.destroy({where: {id_vehicle: id}});
    }
}

export default new VehicleRepository();