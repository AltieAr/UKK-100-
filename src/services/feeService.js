import feeRepository from "../repositories/feeRepository.js";
import vehicleTypeRepository from "../repositories/vehicleTypeRepository.js";
import logService from "./logService.js";

class FeeService {
    async index() {
        return await feeRepository.index();
    }  

    async create(data) {
        const res = data.id_type;
        const test = data.fees_per_hour;
        const vehicleType = await feeRepository.findOne(res);

        // console.log(vehicleType,'jir');
        // console.log(res,'jir');

        if (!test || test < 999) {
            throw new Error('fees per hour must be greater than 999');
        }
        if (!res) {
            throw new Error('id type is required');
        }
        if (vehicleType){
            throw new Error('vehicle type already exists');
        } 

        return await feeRepository.create(data);
    }

    async findById(id) {
        return await feeRepository.findById(id);
    }

    async findOne(id) {
        return await feeRepository.findOne(id);
    }

    async update(id, data, responder) {

        const test = data.fees_per_hour;
        const existingFee = await feeRepository.findById(id);
        if (!existingFee) {
            throw new Error('fee not found'); 
        }

        if (!test || test <= 999) { 
            throw new Error('fees per hour must be greater than 999');
        }

        const deskripsi = `Admin successfully updated fee for vehicle type ID : ${existingFee.id_type}, new fee: ${test}`;
        await logService.createlog(responder, deskripsi);
        const updatePayload = {
            fees_per_hour: test
        };
        return await feeRepository.update(id, updatePayload);
    }

    async delete(id) {
        return await feeRepository.delete(id);
    }

}

export default new FeeService();