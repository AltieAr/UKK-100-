import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vehicle = sequelize.define('Vehicle', {
  id_vehicle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  plate_number: { type: DataTypes.STRING(15), allowNull: false, unique: true },
  id_type: { type: DataTypes.INTEGER },
  color: { type: DataTypes.STRING(20) },
  // owner: { type: DataTypes.STRING(100) },
  // id_user: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE }
}, {
  tableName: 'vehicles',
  timestamps: false
});

export default Vehicle;