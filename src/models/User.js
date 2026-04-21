import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Jangan lupa .js nya cuy

const User = sequelize.define('User', {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  NPWP: { type: DataTypes.STRING(16), allowNull: false, unique: true },
  full_name: { type: DataTypes.STRING(50), allowNull: false },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING(13), allowNull: true, unique: true },
  role: { type: DataTypes.ENUM('admin', 'operator', 'owner'), allowNull: false }
}, {
  tableName: 'users',
  timestamps: false
});


export default User;
