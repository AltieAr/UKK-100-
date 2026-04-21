import vehicleTypeModel from '../models/VehicleType.js';

class VehicleTypeRepository {
    async create(data) {
        return await vehicleTypeModel.create(data);
    }

    async index() {
        return await vehicleTypeModel.findAll();
    }

    async findById(id) {
        return await vehicleTypeModel.findByPk(id);
    }

    async findByName(name) {
        return await vehicleTypeModel.findOne({ where: { vehicle_type: name } });
    }

    async update(id, data) {
        return await vehicleTypeModel.update(data, {where: {id_type: id}});
    }

    async delete(id) {
        return await vehicleTypeModel.destroy({where: {id_type: id}});
    }
}

export default new VehicleTypeRepository();