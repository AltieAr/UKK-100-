import bcrypt from "bcrypt";
import userRepositories from "../repositories/userRepository.js";
import jwt from 'jsonwebtoken';
import logService from "./logService.js";
    // import dotenv from 'dotenv';

    // dotenv.config();

class AuthService{
    async login(username, password) {
        const user = await userRepositories.findbyUsername(username);

        if (!user){
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password); 

        if(!isMatch){
            throw new Error("Invalid password");
        }

        const payload = {
            id : user.id_user,
            role : user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });
        
        const deskripsi = user.role === 'admin' ? 'Admin berhasil login' : 'Petugas berhasil login';
        await logService.createlog(user.id_user, deskripsi);

        return  {
            token,
            userData: {
                id: user.id_user,
                full_name: user.full_name,
                role : user.role
            }
        };
    }
}

export default new AuthService();