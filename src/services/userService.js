import { where } from "sequelize";
import userRepository from "../repositories/userRepository.js";
import bcrypt from 'bcrypt';
import logService from "./logService.js";


class UserService {
    async create(data, responder) {
        const validations = [
            { field: 'NPWP', method: 'findbyNpwp', error: 'NPWP already exists' },
            { field: 'username', method: 'findbyUsername', error: 'Username already exists' },
            { field: 'email', method: 'findbyEmail', error: 'Email already exists' }
        ];

        for (const { field, method, error } of validations) {
            const existing = await userRepository[method](data[field]);
            if (existing) {
                throw new Error(error);
            }
        }

        if (!data.password) {
            throw new Error('Password is required');
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);


        const payloadFinal = {
            ...data,         
            password: hashedPassword,
            role: 'operator'
        };

        const deskripsi = 'Admin succesfully created an operator';
        await logService.createlog(responder, deskripsi);

        return await userRepository.create(payloadFinal);
    }

    async indexOpe(){
        return await userRepository.findOpe();
    }

    async findbynpwp(npwp) {
        return await userRepository.findbyNpwp(npwp);
    }

    async findAll(){
        return await userRepository.findAll()
    }

    async findbyUsername(username) {
        return await userRepository.findbyUsername(username);
    }

    async findbyEmail(email) {
        return await userRepository.findbyEmail(email);
    }

    async delete(id, responder) {
        
        const isadmin = await userRepository.findById(id);
        if(isadmin.role === 'admin'){
            throw new Error("You can't delete an admin");
        }

        const deskripsi = 'Admin succesfully deleted an operator';
        await logService.createlog(responder, deskripsi);
        return await userRepository.delete(id);
    }

    async findById(id){

        return await userRepository.findById(id);
    }

    async update(id, data, responder) {

        const isadmin = await userRepository.findById(id);
        if(isadmin.role === 'admin'){
            throw new Error("You can't update an admin");
        }

        const deskripsi = 'Admin succesfully updated an operator';
        await logService.createlog(responder, deskripsi);


        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
        return await userRepository.update(id, data);
    }


}

export default new UserService();