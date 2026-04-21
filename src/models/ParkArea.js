import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ParkArea = sequelize.define('ParkArea', {
  id_area: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  area_name: { type: DataTypes.STRING(50), allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  filled: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'parkArea',
  timestamps: false
});

export default ParkArea;