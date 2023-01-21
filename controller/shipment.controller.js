const db = require('../models/index.model');
const { mailFunc } = require('../middleware');
const { TRIP_STATUS, ROLES, TRACK_SHIPMENT_STATUS } = require('../enum');
const Shipment = db.shipment;
const ShipmentDetail = db.shipmentdetail;
const ShipmentInterested = db.interested;
const User = db.user;
const Driver = db.driver;
const Company = db.company;
const Interested = db.interested;
const AssignDriverShipment = db.assigndrivershipment;
const AssignShipment = db.assignshipment;
const TrackShipment = db.trackshipment;
//AssignDriverShipment

const Op = db.Sequelize.Op;

// Create and Save a new Shipment
exports.create = async (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  try {
    // Create a Shipment
    const shipment = {
      CompanyId: req.body.CompanyId,
      UserId: req.body.UserId,
      LoadCategory: req.body.LoadCategory,
      LoadType: req.body.LoadType,
      LoadWeight: req.body.LoadWeight ? req.body.LoadWeight : 0,
      LoadUnit: req.body.LoadUnit,
      Qty: req.body.Qty ? req.body.Qty : 0,
      Description: req.body.Description,
      PickUpLocation: req.body.PickUpLocation,
      DeliveryLocation: req.body.DeliveryLocation,
      PickUpCountry: req.body.PickUpCountry,
      PickUpRegion: req.body.PickUpRegion,
      PickUpCity: req.body.PickUpCity,

      PickUpLocation: req.body.PickUpLocation,
      DeliveryCountry: req.body.DeliveryCountry,
      DeliveryRegion: req.body.DeliveryRegion,
      DeliveryCity: req.body.DeliveryCity,

      DeliveryLocation: req.body.DeliveryLocation,

      ExpectedPickUpDate: req.body.ExpectedPickUpDate,
      ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,

      RequestForShipment: req.body.RequestForShipment,
      ShipmentRequestPrice: req.body.ShipmentRequestPrice,

      DeliveryContactName: req.body.DeliveryContactName,
      DeliveryContactPhone: req.body.DeliveryContactPhone,

      DeliveryEmail: req.body.DeliveryEmail,
      AssignedShipment: req.body.AssignedShipment,

      ShipmentRequestPrice: req.body.ShipmentRequestPrice,

      ShipmentDate: req.body.ShipmentDate,
      ShipmentDocs: req.body.ShipmentDocs,
      ShipmentStatus: req.body.ShipmentStatus,
    };
    console.log('request.body', req.body);
    // Save Shipment in the database

    const newShipment = await Shipment.create(shipment);

    if (newShipment) {
      const shipmentDetailArrayLength = req.body.vehicle.length;

      if (shipmentDetailArrayLength <= 0) {
      }

      await req.body.vehicle.map((vehicle, index) => {
        const shipmentDetail = {
          ShipmentId: newShipment.ShipmentId,
          VehicleType: vehicle.VehicleType,
          VIN: vehicle.VIN,
          VehicleMake: vehicle.VehicleMake,
          VehicleColor: vehicle.VehicleColor,
          VehicleModel: vehicle.VehicleModel,

          VehicleModelYear: vehicle.VehicleModelYear,
          // PurchaseYear: vehicle.VehicleType,
        };

        const newShipmentDetails = ShipmentDetail.create(shipmentDetail);
      });

      return res.status(200).send({
        message: 'Shipment was added successfully',
        data: newShipment,
      });
    }
  } catch (error) {
    console.log('error:', error.message);
    return res.status(500).send({
      message: error.message || 'Some error occurred while creating the Shipment.',
    });
  }
};

// Retrieve all Shipments start the database.
exports.findAll = (req, res) => {
  const UserId = req.params.userId;
  // const id = req.params.companyId;
  var condition = UserId ? { UserId: UserId } : null;

  Shipment.findAll({
    where: condition,

    include: [
      {
        model: ShipmentDetail,
      },

      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: AssignDriverShipment,
      },
      {
        model: AssignShipment,
      },
      {
        model: ShipmentInterested,
      },

      {
        model: TrackShipment,
      },

      {
        model: User,
        attributes: ['FullName', 'Email', 'Phone'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// Find a single Shipment with an id
exports.findOne = (req, res) => {
  const id = req.params.shipmentId;

  Shipment.findOne({
    where: { ShipmentId: id },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: AssignDriverShipment,
      },
      {
        model: AssignShipment,
      },
      {
        model: ShipmentInterested,
      },
      {
        model: ShipmentDetail,
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Shipment with ShipmentId=' + id,
      });
    });
};

// Update a Shipment by the id in the request
exports.update = (req, res) => {
  const id = req.params.shipmentId;

  Shipment.update(req.body, {
    where: { ShipmentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Shipment was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Shipment with id=${id}. Maybe Shipment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log('id', id);
      console.log('err', err);
      res.status(500).send({
        message: 'Error updating Shipment with id=' + id,
      });
    });
};

// Delete a Shipment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.ShipmentId;

  Shipment.destroy({
    where: { ShipmentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Shipment was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Shipment with id=${id}. Maybe Shipment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Shipment with id=' + id,
      });
    });
};

// Delete all Shipments start the database.
exports.deleteAll = (req, res) => {
  Shipment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Shipments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Shipments.',
      });
    });
};

// find all insured Shipment
exports.findAllShipmentsByStatus = (req, res) => {
  const status = req.params.shipmentStatus;
  const shipmentId = req.params.shipmentId;
  var condition = shipmentId
    ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
    : { ShipmentStatus: status };

  Shipment.findAll({
    where: {
      condition,
    },
    include: [
      {
        model: ShipmentDetail,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsAssigned = (req, res) => {
  const status = req.params.shipmentStatus;
  const assignedshipment = req.params.assignedshipment;
  const shipmentId = req.params.shipmentId;
  var condition = shipmentId
    ? { [Op.and]: [{ ShipmentId: shipmentId }, { AssignedShipment: assignedshipment }] }
    : { ShipmentStatus: status };

  // Shipment.findAll({ where: condition },
  Shipment.findAll({
    where: {
      condition,
    },
    include: [
      {
        model: ShipmentDetail,
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// find all  Shipment by date
exports.findAllShipmentsByDeliveryDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      DeliveryDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    include: [
      {
        model: ShipmentDetail,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsByPickUpDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      PickUpDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    include: [
      {
        model: ShipmentDetail,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsByRecordDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    include: [
      {
        model: ShipmentDetail,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// Create and Save a new Shipment
exports.create1 = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Shipment
  const shipment = {
    UserId: req.body.UserId,
    LoadCategory: req.body.LoadCategory,
    LoadType: req.body.LoadType,
    LoadWeight: req.body.LoadWeight,
    LoadUnit: req.body.LoadUnit,
    Qty: req.body.Qty,
    Description: req.body.Description,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryLocation: req.body.DeliveryLocation,
    PickUpCountry: req.body.PickUpCountry,
    PickUpRegion: req.body.PickUpRegion,
    PickUpCity: req.body.PickUpCity,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryCountry: req.body.DeliveryCountry,
    DeliveryRegion: req.body.DeliveryRegion,
    DeliveryCity: req.body.DeliveryCity,
    DeliveryLocation: req.body.DeliveryLocation,
    ExpectedPickUpDate: req.body.ExpectedPickUpDate,
    ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,
    RequestForShipment: req.body.RequestForShipment,
    ShipmentRequestPrice: req.body.ShipmentRequestPrice,
    DeliveryContactName: req.body.DeliveryContactName,
    DeliveryContactPhone: req.body.DeliveryContactPhone,
    DeliveryEmail: req.body.DeliveryEmail,
    AssignedShipment: req.body.AssignedShipment,
    ShipmentDate: req.body.ShipmentDate,
    ShipmentDocs: req.body.ShipmentDocs,
    ShipmentStatus: req.body.ShipmentStatus,
  };

  // Save Shipment in the database
  Shipment.create(shipment)
    .then((data) => {
      res.status(200).send({
        message: 'Shipment was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log('error:', err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Shipment.',
      });
    });
};

exports.showInterest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    const InterestedResult = await Interested.findOne({
      where: { ShipmentId: ShipmentId, CompanyId: CompanyId, UserId: UserId },
    });

    const company = await Company.findOne({ where: { CompanyId: CompanyId } });

    const shipmentUser = await Shipment.findOne({
      where: { ShipmentId: req.body.ShipmentId },
      include: [
        {
          model: User,
          attributes: ['FullName', 'Email'],
        },
      ],
    });

    if (InterestedResult === null) {
      // create new interest
      const newRecord = await Interested.create({
        ShipmentId: ShipmentId,
        UserId: UserId,
        CompanyId: CompanyId,
        IsInterested: true,
        InterestDate: new Date(),
      });

      const trackShipment = await TrackShipment.create({
        ShipmentId: ShipmentId,
        UserId: UserId,
        CompanyId: CompanyId,
        //  AssignShipmentId: IsAssignedShipment.AssignShipmentId ? IsAssignedShipment.AssignShipmentId : null,
        StartBy: UserId,
        StartByRole: ROLES.find((item) => item.value === 'carrier').value,
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Interested').value,
        StartActionDate: new Date(),
        EndBy: UserId,
        EndByRole: ROLES.find((item) => item.value === 'carrier').value,
        EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Interested').value,
        EndActionDate: new Date(),
      });
      const interestedUser = await User.findOne({ where: { UserId: req.body.UserId } });

      const url = process.env.ADMIN_URL + `/company/review-company-action/?companyId=${CompanyId}&readOnly=true`;

      //Send mail to Shipment Owner
      const msgShipment = `You have an interest from  ${interestedUser.FullName} for Load Boarding Services.Kindly click the button below to check  the profile`;

      await mailFunc.sendEmail({
        template: 'interest',
        subject: 'Request for LoadBoarding Services',
        toEmail: shipmentUser.User.Email,
        msg: {
          name: shipmentUser.User.FullName,
          msg: msgShipment,
          url: url,
        },
      });

      //Send Mail to interested carrier
      const msgCarrier = `Your interest in shipment with ref:${req.body.ShipmentId} for Load Boarding Services has been sent.We wish you best luck going further in the process.`;

      await mailFunc.sendEmail({
        template: 'interest',
        subject: 'Request for LoadBoarding Services',
        toEmail: interestedUser.Email,
        msg: {
          name: interestedUser.FullName,
          msg: msgCarrier,
          //  url: url,
        },
      });

      res.status(200).send({
        message: 'Shown Interest',
        data: newRecord,
      });
    } else {
      //Restore Interest in Shipment
      const IsInterestedResult = await Interested.findOne({
        where: { ShipmentId: ShipmentId, CompanyId: CompanyId, UserId: UserId, IsInterested: false },
      });

      const IsAssignedShipment = await AssignShipment.findOne({
        where: { ShipmentId: ShipmentId, CompanyId: CompanyId },
      });

      if (IsInterestedResult) {
        const updatedInterestTrue = await Interested.update(
          { IsInterested: true },
          { where: { ShipmentId: ShipmentId, UserId: UserId, CompanyId: CompanyId } },
        );

        const trackShipment = await TrackShipment.create({
          ShipmentId: ShipmentId,
          UserId: UserId,
          CompanyId: CompanyId,
          //  AssignShipmentId: IsAssignedShipment.AssignShipmentId ? IsAssignedShipment.AssignShipmentId : null,
          StartBy: UserId,
          StartByRole: ROLES.find((item) => item.value === 'carrier').value,
          StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'RestoredInterest').value,
          StartActionDate: new Date(),
          EndBy: UserId,
          EndByRole: ROLES.find((item) => item.value === 'carrier').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'RestoredInterest').value,
          EndActionDate: new Date(),
        });

        res.status(200).send({
          message: 'Restored Interest',
          data: updatedInterestTrue,
        });

        // **********************************
      } else {
        //check if carrier is already assigned shipment

        const IsAssignedShipment = await AssignShipment.findOne({
          where: { ShipmentId: ShipmentId, CompanyId: CompanyId },
        });

        if (IsAssignedShipment) {
          const updateShipment = await Shipment.update(
            {
              AssignedShipment: false,
              ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'NotAssigned').value,
              AssignedCarrier: 0,
            },

            { where: { ShipmentId: ShipmentId } },
          );

          IsAssignedShipment.IsAssigned = false;
          IsAssignedShipment.save();
          //Send Mail to Shipper

          const msgShipper = ` Interest for  Shipment with ref:${req.body.ShipmentId} from ${company.CompanyName} for Load Boarding Services has been withdrawn.Your shipment is now open for interest.`;

          await mailFunc.sendEmail({
            template: 'interest',
            subject: 'Request for LoadBoarding Services',
            toEmail: shipmentUser.User.Email,
            msg: {
              name: shipmentUser.User.FullName,
              msg: msgShipper,
              //  url: url,
            },
          });
        }

        const updatedInterestFalse = await Interested.update(
          { IsInterested: false },
          { where: { ShipmentId: ShipmentId, UserId: UserId, CompanyId: CompanyId } },
        );

        const trackShipment = await TrackShipment.create({
          ShipmentId: ShipmentId,
          UserId: UserId,
          CompanyId: CompanyId,
          //  AssignShipmentId: IsAssignedShipment.AssignShipmentId ? IsAssignedShipment.AssignShipmentId : null,
          StartBy: UserId,
          StartByRole: ROLES.find((item) => item.value === 'carrier').value,
          StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'NotInterested').value,
          StartActionDate: new Date(),
          EndBy: UserId,
          EndByRole: ROLES.find((item) => item.value === 'carrier').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'NotInterested').value,
          EndActionDate: new Date(),
        });

        res.status(200).send({
          message: 'Withdrawn Interest',
          data: updatedInterestFalse,
        });
      }
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignCompanyShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if interest is placed by company
    const IsInterested = await Interested.findOne({
      where: { ShipmentId: ShipmentId, CompanyId: CompanyId, IsInterested: true },
    });

    if (!IsInterested) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `No interest placed on Shipment with ref ${ShipmentId} from ${company.CompanyName}`,
      });
    }

    // check if shipment was assigned to company
    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true },
    });
    if (IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has been officially assigned to ${company.CompanyName}`,
      });
    }

    const newAssignment = await AssignShipment.create({
      ShipmentId: ShipmentId,
      CompanyId: CompanyId,
      UserId: UserId,
      AssignedTo: CompanyId,
      IsAssigned: true,
      IsContractSigned: false,
      IsContractAccepted: false,
      ShipmentInterestId: IsInterested.ShipmentInterestId,
      AssignedDate: new Date(),
    });

    const updateShipment = await Shipment.update(
      {
        AssignedShipment: true,
        ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'Assigned').value,
        AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    const trackShipment = await TrackShipment.create({
      ShipmentId: ShipmentId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignShipmentId: newAssignment.AssignShipmentId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'shipper').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Assigned').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'shipper').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Assigned').value,
      EndActionDate: new Date(),
    });

    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const user = await User.findOne({ where: { UserId: req.body.UserId } });

    const companyCarrier = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `You have assigned Shipment with Ref No  ${ShipmentId} for Load Boarding Services to Company ${companyCarrier.CompanyName}.Kindly check the details    `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = `Congratulations! You have been assigned shipment with ref:${ShipmentId} for Load Boarding Services .Find Attached an agreement for you to sign.Kindly check the details `;
    const urlCarrier =
      process.env.ADMIN_URL +
      `/user/user-contract/?shipmentId=${ShipmentId}&userId=${UserId}&companyId=${CompanyId}&action=sign`;
    await mailFunc.sendEmail({
      template: 'shipment',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: companyCarrier.ContactEmail,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        urlShipmentInfo: url,
        urlShipmentContract: urlCarrier,
      },
      filename: 'shipper_carrier_agreement.pdf',
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been assigned to Company ${companyCarrier.CompanyName} `,
      // data: newAssignment,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignDriverShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const DriverId = req.body.DriverId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId },
    });
    if (IsAssignedShipment === null) {
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned`,
      });
    }
    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, DriverId: DriverId },
    });

    if (IsAssignedDriverShipment) {
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has been assigned already`,
      });
    }

    const driver = await Driver.findOne({ where: { DriverId: req.body.DriverId } });

    const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

    const shipperUser = await User.findOne({ where: { UserId: shipment.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    // AssignedTo Driver Field is populated with the Driver  UserId (Foriegn Key)  not the DriverId from Driver Entity

    const newRecord = await AssignDriverShipment.create({
      ShipmentId: ShipmentId,
      CompanyId: CompanyId,
      UserId: UserId,
      DriverId: DriverId,
      IsAssigned: true,
      AssignedDate: new Date(),
      AssignedToDriver: driver.UserId,
    });

    const trackShipment = await TrackShipment.create({
      ShipmentId: ShipmentId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignShipmentId: IsAssignedShipment?.AssignShipmentId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'carrier').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'AssignedDriverShipment').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'carrier').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'AssignedDriverShipment').value,
      EndActionDate: new Date(),
    });

    const url =
      process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&driverId=${DriverId}&review=true`;

    //Send mail to Carrier
    const msgShipment = `You have an assigned Shipment with Ref No  ${ShipmentId} for Load Boarding Services to driver ${driver.DriverName}.Kindly check the details  <a href=${url}>here</a>  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgShipment,
        url: url,
      },
    });

    //Send mail to Shipper
    const msgShipper = ` Shipment with Ref No  ${ShipmentId} for Load Boarding Services has been assigned  to driver ${driver.DriverName} of Company -${company.CompanyName}.Kindly check the details  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: shipperUser.Email,
      msg: {
        name: shipperUser.FullName,
        msg: msgShipper,
        url: url,
      },
    });

    //Send Mail to Driver assigned shipment
    const msgCarrier = `Congratulations! You have been assigned shipment with ref:${ShipmentId} for Load Boarding Services .Kindly check the details  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: driver.Email,
      msg: {
        name: driver.DriverName,
        msg: msgCarrier,
        url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been assigned to Driver ${driver.DriverName} `,
      data: newRecord,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.dispatchShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true },
    });
    if (!IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateShipment = await Shipment.update(
      {
        ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'Dispatched').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    const trackShipment = await TrackShipment.create({
      ShipmentId: ShipmentId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignShipmentId: IsAssignedShipment.AssignShipmentId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'driver').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Dispatched').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'driver').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Dispatched').value,
      EndActionDate: new Date(),
    });
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

    const user = await User.findOne({ where: { UserId: shipment.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `Your Shipment with Ref No  ${ShipmentId} for Load Boarding Services to Company ${company.CompanyName} has been dispatched successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been dispatched .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been dispatched .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Assignment for LoadBoarding Services',
      toEmail: IsAssignedDriverShipment.Driver.Email,
      msg: {
        name: IsAssignedDriverShipment.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been assigned to Company ${company.CompanyName} `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.pickedUpShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;
  const Role = req.body.Role;
  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true },
    });
    if (!IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateShipment = await Shipment.update(
      {
        ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'PickedUp').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

    const user = await User.findOne({ where: { UserId: shipment.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const trackShipmentResult = await TrackShipment.findOne({
      where: {
        ShipmentId: ShipmentId,
        StartByRole: 'shipper',
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,
      },
    });

    if (trackShipmentResult) {
      const trackShipmentUpdate = await TrackShipment.update(
        {
          EndBy: Role === 'driver' ? IsAssignedDriverShipment.DriverId : UserId,
          EndByRole:
            Role === 'driver'
              ? ROLES.find((item) => item.value === 'driver').value
              : ROLES.find((item) => item.value === 'shipper').value,

          EndAction: Role === 'driver' && TRACK_SHIPMENT_STATUS.find((item) => item.value === 'ConfirmPickedUp').value,
          EndActionDate: new Date(),
          // AssignedCarrier: CompanyId,
        },

        {
          where: {
            ShipmentId: ShipmentId,
            StartByRole: 'shipper',
            StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,
          },
        },
      );

      return res.status(200).send({
        message: `Shipment with Ref ${ShipmentId} has been Confirmed Picked Up by Driver  `,
      });
    }

    const trackShipment = await TrackShipment.create({
      ShipmentId: ShipmentId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignShipmentId: IsAssignedShipment.AssignShipmentId,
      StartBy: Role === 'driver' ? IsAssignedDriverShipment.DriverId : UserId,
      StartByRole:
        Role === 'driver'
          ? ROLES.find((item) => item.value === 'driver').value
          : ROLES.find((item) => item.value === 'shipper').value,

      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,

      StartActionDate: new Date(),
    });
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `Your Shipment with Ref No  ${ShipmentId} for Load Boarding Services to Company ${company.CompanyName} has been picked up successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'track',
      subject: 'Shipment Picked Up',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        url: url,
        urlTrack: urltrack,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been picked up .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Picked Up ',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been picked up .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Picked Up ',
      toEmail: IsAssignedDriverShipment.Driver.Email,
      msg: {
        name: IsAssignedDriverShipment.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been picked Up by ${user.FullName} for Shipper  `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.deliveredShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;
  const Role = req.body.Role;
  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true },
    });
    if (!IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateShipment = await Shipment.update(
      {
        ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'Delivered').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

    const user = await User.findOne({ where: { UserId: shipment.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const trackShipmentResult = await TrackShipment.findOne({
      where: {
        ShipmentId: ShipmentId,
        StartByRole: 'driver',
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
      },
    });

    if (trackShipmentResult) {
      const trackShipmentUpdate = await TrackShipment.update(
        {
          EndBy: Role === UserId,
          EndByRole: ROLES.find((item) => item.value === 'shipper').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'ConfirmDelivered').value,
          EndActionDate: new Date(),
          // AssignedCarrier: CompanyId,
        },

        {
          where: {
            ShipmentId: ShipmentId,
            StartByRole: 'driver',
            StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
          },
        },
      );
      if (trackShipmentUpdate) {
        return res.status(200).send({
          message: `Shipment with Ref ${ShipmentId} has been Confirmed Delivered by Shipper  `,
        });
      }
    }

    const trackShipment = await TrackShipment.create({
      ShipmentId: ShipmentId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignShipmentId: IsAssignedShipment.AssignShipmentId,
      StartBy: IsAssignedDriverShipment.DriverId,
      StartByRole: ROLES.find((item) => item.value === 'driver').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
      StartActionDate: new Date(),
    });
    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;
    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `Your Shipment with Ref No-${ShipmentId} for Load Boarding Services from Company ${company.CompanyName} has been delivered successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'track',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        url: url,
        urlTrack: urltrack,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been delivered .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Delivery for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been delivered .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Shipment Delivery for LoadBoarding Services',
      toEmail: IsAssignedDriverShipment.Driver.Email,
      msg: {
        name: IsAssignedDriverShipment.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been delivered `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.cancelShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true },
    });
    if (!IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateShipment = await Shipment.update(
      {
        ShipmentStatus: TRIP_STATUS.find((item) => item.value === 'Cancelled').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    const assignedShipment = await AssignShipment.update(
      {
        IsAssigned: false,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId, IsAssigned: true } },
    );
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

    const user = await User.findOne({ where: { UserId: shipment.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `Your Shipment with Ref No  ${ShipmentId} for Load Boarding Services from Company ${company.CompanyName} has been cancelled successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Cancelled Shipment ',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been cancelled by shipper .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: `Cancelled Shipment ref:${ShipmentId}`,
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` Shipment with ref:${ShipmentId} for Load Boarding Services has been cancelled .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: `Cancelled Shipment ref:${ShipmentId}`,
      toEmail: IsAssignedDriverShipment.Driver.Email,
      msg: {
        name: IsAssignedDriverShipment.Driver.FullName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been cancelled `,
      data: newAssignment,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.archiveShipment = async (req, res) => {
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const shipmentArchived = await Shipment.findOne({
      where: { ShipmentId: ShipmentId, IsArchived: true },
    });
    if (shipmentArchived) {
      await Shipment.update(
        {
          IsArchived: false,
          // AssignedCarrier: CompanyId,
        },

        { where: { ShipmentId: ShipmentId } },
      );

      return res.status(200).send({
        message: `Shipment record with ref ${ShipmentId} is removed from the archived list`,
      });
    }

    const updateShipment = await Shipment.update(
      {
        IsArchived: true,
        // AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    if (updateShipment) {
      return res.status(200).send({
        message: `Shipment record with ref ${ShipmentId} is added to the archived list`,
      });
    }
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.sendRemindEmail = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  try {
    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId, IsAssigned: true, CompanyId: CompanyId, IsContractSigned: false },
    });
    if (IsAssignedShipment) {
      const companyCarrier = await Company.findOne({ where: { CompanyId: CompanyId } });

      const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

      const companyShipper = await Company.findOne({ where: { CompanyId: shipment.CompanyId } });

      const companyUser = await User.findOne({ where: { CompanyId: CompanyId }, order: [['createdAt', 'ASC']] });

      //Send Mail to Carrier
      const msgCarrier = `Our Company (${companyShipper.CompanyName}) are waiting to get from you the signed copy of the dispatch agreement.Just in case you missed it,find attached the agreement for your perusal and action. `;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'Shipment Assignment for LoadBoarding Services',
        toEmail: companyCarrier.ContactEmail,
        msg: {
          name: companyUser.FullName,
          msg: msgCarrier,
          // url: url,
        },
        filename: 'shipper_carrier_agreement.pdf',
      });

      res.status(200).send({
        message: `Sent Reminder Email  to ${companyCarrier.CompanyName} `,
      });
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.contractSigned = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;
  const Role = req.body.Role;

  try {
    const IsAssignedShipment = await AssignShipment.findOne({
      where: {
        ShipmentId: ShipmentId,
        IsAssigned: true,
        CompanyId: CompanyId,
      },
    });
    if (!IsAssignedShipment) {
      return res.status(200).send({
        message: `No Assignment has been confirmed as done.kindly contact administrator for help`,
      });
    }
    if (IsAssignedShipment) {
      if (Role === 'carrier' && IsAssignedShipment.IsContractSigned === true) {
        return res.status(200).send({
          message: `Contract has been signed already.`,
        });
      }

      if (Role === 'shipper' && IsAssignedShipment.IsContractConfirmed === true) {
        return res.status(200).send({
          message: `Contract has been confirmed already.`,
        });
      }

      const companyCarrier = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });

      const shipment = await Shipment.findOne({ where: { ShipmentId: ShipmentId } });

      const user = await User.findOne({ where: { UserId: shipment.UserId } });

      const companyUser = await User.findOne({
        where: { CompanyId: IsAssignedShipment.CompanyId },
        order: [['createdAt', 'ASC']],
      });

      const companyShipper = await Company.findOne({ where: { CompanyId: user.CompanyId } });

      //Update AssignShipment Table

      const updateVar = Role === 'carrier' ? { IsContractSigned: true } : { IsContractConfirmed: true };
      console.log('updatevar', updateVar);
      const assignShipment = await AssignShipment.update(
        updateVar,

        { where: { ShipmentId: ShipmentId, IsAssigned: true, CompanyId: CompanyId } },
      );

      if (assignShipment.IsContractConfirmed === true) {
        //Send Mail to Carrier
        const msgCarrier = `Company (${companyShipper.CompanyName}) has recieved your copy of the agreement, and thus officially look to complete all documentation processes. `;

        await mailFunc.sendEmail({
          template: 'generic',
          subject: 'Shipment Assignment for LoadBoarding Services',
          toEmail: companyCarrier.ContactEmail ? companyCarrier.ContactEmail : companyUser.Email,
          msg: {
            name: companyUser.FullName,
            msg: msgCarrier,
            // url: url,
            //filename: 'shipper_carrier_agreement.pdf',
          },
        });
      }
      res.status(200).send({
        message: `Contract signed between ${companyCarrier.CompanyName} and ${companyShipper.CompanyName}`,
      });
    }
  } catch (error) {
    console.log(`err.message`, error);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.contractAccepted = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  try {
    const IsAssignedShipment = await AssignShipment.findOne({
      where: {
        ShipmentId: ShipmentId,
        IsAssigned: true,
        CompanyId: CompanyId,
        IsContractSigned: true,
        IsContractAccepted: false,
      },
    });
    if (IsAssignedShipment) {
      const companyCarrier = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });

      const user = await User.findOne({ where: { UserId: UserId } });

      const companyUser = await User.findOne({
        where: { CompanyId: IsAssignedShipment.CompanyId },
        order: [['createdAt', 'ASC']],
      });

      const companyShipper = await Company.findOne({ where: { CompanyId: user.CompanyId } });

      const assignShipment = await AssignShipment.update(
        {
          IsContractAccepted: true,

          // AssignedCarrier: CompanyId,
        },

        { where: { ShipmentId: ShipmentId, IsAssigned: true, CompanyId: CompanyId, IsContractSigned: true } },
      );

      //Send Mail to Carrier
      const msgCarrier = `Company (${companyShipper.CompanyName}) has accepted the agreement, and thus officially given the nod for your service to commence.Good luck and success in your execution. `;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'Shipment Assignment for LoadBoarding Services',
        toEmail: companyCarrier.ContactEmail ? companyCarrier.ContactEmail : companyUser.Email,
        msg: {
          name: companyUser.FullName,
          msg: msgCarrier,
          // url: url,
          //filename: 'shipper_carrier_agreement.pdf',
        },
      });

      res.status(200).send({
        message: `Contract accepted between ${companyCarrier.CompanyName} and ${companyShipper.CompanyName}`,
      });
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.findAllShipmentsInterest = (req, res) => {
  // const status = req.params.shipmentStatus;
  // const shipmentId = req.params.shipmentId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Shipment,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsInterestByShipmentId = (req, res) => {
  // const status = req.params.shipmentStatus;
  const shipmentId = req.params.shipmentId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true, ShipmentId: shipmentId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Shipment,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};
exports.findAllShipmentsInterestByCompany = (req, res) => {
  // const status = req.params.shipmentStatus;
  const companyId = req.params.companyId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true, CompanyId: companyId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Shipment,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsInterestByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Interested.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllAssignShipment = (req, res) => {
  AssignShipment.findAll({
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Shipment,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllAssignDriverShipment = (req, res) => {
  AssignDriverShipment.findAll({
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Driver,
      },
      {
        model: Shipment,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};


exports.findAssignDriverShipment = (req, res) => {

  const shipmentId = req.params.shipmentId;

  AssignDriverShipment.findOne({
    where: { ShipmentId: shipmentId },
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Driver,
      },
      {
        model: Shipment,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};