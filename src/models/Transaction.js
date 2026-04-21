import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



  const Transaction = sequelize.define('Transaction', {id_transaction: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_vehicle: { type: DataTypes.INTEGER, allowNull: false },
    id_area: { type: DataTypes.INTEGER, allowNull: false },
    id_user: { type: DataTypes.INTEGER, allowNull: false },
    id_fees: { type: DataTypes.INTEGER },
    check_in: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    check_out: { type: DataTypes.DATE },
    duration: { type: DataTypes.INTEGER, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(10, 0), defaultValue: 0 },
    status: { type: DataTypes.ENUM('masuk', 'keluar'), defaultValue: 'masuk' }
  },{
    tableName: 'transactions',
    timestamps: false
  });
  
  export default Transaction;