import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';




const Log = sequelize.define('Log', {
  id_log: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_user: { type: DataTypes.INTEGER },
  activity: { type: DataTypes.STRING(100) },
  activity_time: { type: DataTypes.DATE }
}, {
  tableName: 'logs',
  timestamps: false
});

export default Log;