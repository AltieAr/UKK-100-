import Vehicle from './Vehicle.js';
import VehicleType from './VehicleType.js';
import ParkArea from './ParkArea.js';
import User from './User.js';
import Transaction from './Transaction.js';
import Log from './Log.js';
import Fee from './Fee.js';

// Setup associations centrally in index.js to avoid repeated setup and alias collisions
Vehicle.belongsTo(VehicleType, { foreignKey: 'id_type', as: 'vehicle_type' });
VehicleType.hasMany(Vehicle, { foreignKey: 'id_type' });

Fee.belongsTo(VehicleType, { foreignKey: 'id_type', as: 'fee_vehicle_type' });
VehicleType.hasMany(Fee, { foreignKey: 'id_type', as: 'fees' });

// User & Log
Log.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Log, { foreignKey: 'id_user' });

// Transaction relations
Transaction.belongsTo(Vehicle, { foreignKey: 'id_vehicle' });
Vehicle.hasMany(Transaction, { foreignKey: 'id_vehicle' });

Transaction.belongsTo(ParkArea, { foreignKey: 'id_area' });
ParkArea.hasMany(Transaction, { foreignKey: 'id_area' });

Transaction.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Transaction, { foreignKey: 'id_user' });

Transaction.belongsTo(Fee, { foreignKey: 'id_fees' });
Fee.hasMany(Transaction, { foreignKey: 'id_fees' });

const models = {
  Vehicle,
  VehicleType,
  ParkArea,
  User,
  Transaction,
  Log,
  Fee
};

export {
  Vehicle,
  VehicleType,
  ParkArea,
  User,
  Transaction,
  Log,
  Fee
};

export default models;
