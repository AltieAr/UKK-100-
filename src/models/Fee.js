import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



const Fee = sequelize.define('Fee', {
    id_fees: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_type: { type: DataTypes.INTEGER },
    fees_per_hour: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},{
    tableName: 'fees',
    timestamps: false,
    underscored: true
});

export default Fee;
