import User from '../models/User.js';

class UserRepositories {
    async create(data) {
        return await User.create(data);
    }
    
    async findOpe() {
        return await User.findAll({where: {role: 'operator'}});
    }

    async findAll(){
        return await User.findAll();
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async update(id, data) {
        return await User.update(data, {where: {id_user: id}});
    }

    async delete(id) {
        return await User.destroy({where: {id_user: id}});
    }

    async findbyUsername(username) {
        return await User.findOne({where: {username: username}});
    }

    async findbyNpwp(npwp) {
        return await User.findOne({where: {NPWP: npwp}});
    }

    async findbyEmail(email) {
        return await User.findOne({where: {email: email}});
    }

}

export default new UserRepositories();