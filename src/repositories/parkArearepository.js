import ParkArea from "../models/ParkArea.js";

class parkAreaRepository{
    async index(){
        return await ParkArea.findAll({
            attributes: ['id_area', 'area_name', 'capacity', 'filled'],
            order: [['id_area', 'DESC']]
        })
    }

    async find(id){
        return await ParkArea.findByPk(id)
    }

    async create(data){
        return await ParkArea.create(data)
    }

    async update(id,data){
        return await ParkArea.update(data, {where:{id_area : id}})
    }

    async delete(id){
        return await ParkArea.destroy({where: {id_area : id}})
    }
}

export default new parkAreaRepository();