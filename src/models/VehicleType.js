import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VehicleType = sequelize.define('VehicleType', {
    id_type: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vehicle_type: { type: DataTypes.STRING(50), allowNull: false }
},{
    tableName: 'vehicle_types',
    timestamps: false
});
export default VehicleType;