module.exports = (sequelize, DataTypes) => {
  const ShipmentInterested = sequelize.define('ShipmentsInterested', {
    ShipmentInterestId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // ShipmentId: { type: DataTypes.STRING },

    IsInterested: { type: DataTypes.BOOLEAN },
    InterestDate: { type: DataTypes.DATEONLY },
    ServiceCost: { type: DataTypes.DECIMAL(10, 2) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },

    // DriverId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Driver,
    //     key: 'DriverId'
    //   }
    // },

    // ShipmentId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Shipment,
    //     key: 'ShipmentId'
    //   }
    // },
  });

  return ShipmentInterested;
};
