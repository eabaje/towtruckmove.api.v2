const { authJwt } = require('../middleware');
const controller = require('../controller/shipment.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/shipment/findOne/:shipmentId', controller.findOne);

  app.get('/api/shipment/findAll/:userId', controller.findAll);

  app.get('/api/shipment/findAll', controller.findAll);

  app.get('/api/shipment/findAllAssignShipment', controller.findAllAssignShipment);

  app.get('/api/shipment/findAllAssignDriverShipment', controller.findAllAssignDriverShipment);

  app.get('/api/shipment/findAllShipmentsByStatus/:shipmentStatus/:shipmentid', controller.findAllShipmentsByStatus);

  app.get(
    '/api/shipment/findAllShipmentsByDeliveryDate/:startDate/:endDate',
    controller.findAllShipmentsByDeliveryDate,
  );
  // [authJwt.verifyToken],
  app.get('/api/shipment/findAllShipmentsByPickUpDate/:startDate/:endDate', controller.findAllShipmentsByPickUpDate);

  app.get('/api/shipment/findAllShipmentsByRecordDate/:startDate/:endDate', controller.findAllShipmentsByRecordDate);

  app.get('/api/shipment/findAllShipmentsAssigned/:shipmentId/:assignedshipment', controller.findAllShipmentsAssigned);

  app.get('/api/shipment/findAllShipmentsInterest', controller.findAllShipmentsInterest);

  app.get(
    '/api/shipment/findAllShipmentsInterestByShipmentId/:shipmentId',
    controller.findAllShipmentsInterestByShipmentId,
  );

  app.get('/api/shipment/findAllShipmentsInterestByCompany/:companyId', controller.findAllShipmentsInterestByCompany);

  app.get('/api/shipment/findAssignDriverShipment/:shipmentId', controller.findAssignDriverShipment);

  app.post('/api/shipment/assignCompanyShipment', controller.assignCompanyShipment);

  app.post('/api/shipment/assignDriverShipment', controller.assignDriverShipment);

  app.post('/api/shipment/showInterest', controller.showInterest);

  app.post('/api/shipment/dispatchShipment', controller.dispatchShipment);

  app.post('/api/shipment/pickedUpShipment', controller.pickedUpShipment);

  app.post('/api/shipment/deliveredShipment', controller.deliveredShipment);

  app.post('/api/shipment/cancelShipment', controller.cancelShipment);

  app.post('/api/shipment/archiveShipment', controller.archiveShipment);

  app.post('/api/shipment/sendRemindEmail', controller.sendRemindEmail);

  app.post('/api/shipment/contractSigned', controller.contractSigned);

  app.post('/api/shipment/contractAccepted', controller.contractAccepted);

  app.post('/api/shipment/create', controller.create);

  app.put('/api/shipment/update/:shipmentId', controller.update);

  app.delete('/api/shipment/delete/:shipmentId', controller.delete);

  app.delete('/api/shipment/deleteAll', controller.deleteAll);
};
