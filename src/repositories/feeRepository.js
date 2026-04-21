import { where } from 'sequelize';
import { Fee, VehicleType } from '../models/index.js';

class FeeRepository {
    async create(data) {
        return await Fee.create(data);
    }

    async index() {
        return await Fee.findAll({ include: [{ model: VehicleType, as: 'fee_vehicle_type' }] });
    }

    async findById(id) {
        return await Fee.findByPk(id, { include: [{ model: VehicleType, as: 'fee_vehicle_type' }]});
    }

    async findOne(id) {
        return await Fee.findOne({ where: { id_type: id }, include: [{ model: VehicleType, as: 'fee_vehicle_type' }] });
    }

    async update(id, data) {
        return await Fee.update(data, {where: {id_fees: id}});
    }

    async delete(id){
        return await Fee.destroy({where: {id_fees: id}});
    }
}

export default new FeeRepository();