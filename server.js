require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
var uuid = require('uuid');
const bcrypt = require('bcryptjs');

//cors
const cors = require('cors');
app.use(cors());

//const server = http.createServer(app);

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./models/index.model');
const { subscribe } = require('./models/index.model');
const Role = db.role;
const User = db.user;
const UserRole = db.userrole;
const Company = db.company;
const Subscription = db.subscribe;
const UserSubscription = db.usersubscription;
//db.sequelize.sync();
//force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// db.sequelize.sync({ alter: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   // initial();
// });

// app.use(
//   session({
//     secret: 's3cr3t',
//     resave: true,
//     saveUninitialized: true,
//   }),
// );
// app.use(passport.initialize());
// app.use(passport.session());
// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TowTruckMove api.' });
});
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to TowTruckMove api.' });
});
app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));
app.use('/pics', express.static('pics'));
app.use('/docs', express.static('docs'));

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
//require('./routes/carrier.routes')(app);
require('./routes/park.routes')(app);
require('./routes/driver.routes')(app);
require('./routes/vehicle.routes')(app);
require('./routes/shipment.routes')(app);
require('./routes/trip.routes')(app);
require('./routes/order.routes')(app);
require('./routes/payment.routes')(app);
require('./routes/subscription.routes')(app);
require('./routes/upload.routes')(app);

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// set port, listen for requests
//const PORT = process.env.PORT || 8080;

// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const users = [];
const server = http.createServer(app);

//const server = app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));

//const io = new Server(httpServer, { cors: { origin: "*" } });

const io = socketio(server, { cors: { origin: '*' } });

//const io = new Server(httpServer, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };

    const existUser = users.find((x) => x.name === updatedUser.name);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    // const admin = users.find((x) => x.name === 'Admin' && x.online);
    // if (admin) {
    //   io.to(admin.socketId).emit('updateUser', updatedUser);
    // }
    // if (updatedUser.name === 'Admin') {
    //   io.to(updatedUser.socketId).emit('listUsers', users);
    // }
  });

  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      const onlineUser = users.find((x) => x.online);
      if (onlineUser) {
        io.to(onlineUser.socketId).emit('updateUser', user);
      }
    }
  });
  socket.on('onUserSelected', (user) => {
    const userOnline = users.find((x) => x.online);
    if (userOnline) {
      const existUser = users.find((x) => x.name === user.name);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });
  socket.on('onMessage', (message) => {
    const user = users.find((x) => x.name === message.to && x.online);
    if (user) {
      io.to(user.socketId).emit('message', message);
      user.messages.push(message);
    } else {
      io.to(socket.id).emit('message', {
        from: 'System',
        to: 'Admin',
        body: 'User Is Not Online',
      });
    }
  });
});
server.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
function initial() {
  const { v1: uuidv1, v4: uuidv4 } = require('uuid');
  encryptedPassword = bcrypt.hashSync('Web@2022', 8);
  initialUserId = uuidv4();
  shipperRoleId = uuidv4();
  carrierRoleId = uuidv4();
  adminRoleId = uuidv4();
  auditorRoleId = uuidv4();
  driverRoleId = uuidv4();
  brokerRoleId = uuidv4();
  usersubscribeId = uuidv4();

  let startDate = new Date();

  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  Company.create({
    //  CompanyId: 1,
    CompanyName: 'Global Load Dispatch',
    ContactEmail: 'admin@loaddispatch.com.ng',
    ContactPhone: '08057886381',
    CompanyType: 'admin',
    Address: 'Lagos',
    City: 'LG',
    Country: 'NG',
  });

  Role.create({
    RoleId: shipperRoleId,
    Name: 'shipper',
  });

  Role.create({
    RoleId: driverRoleId,
    Name: 'driver',
  });

  Role.create({
    RoleId: carrierRoleId,
    Name: 'carrier',
  });
  Role.create({
    RoleId: brokerRoleId,
    Name: 'broker',
  });
  Role.create({
    RoleId: adminRoleId,
    Name: 'admin',
  });

  Role.create({
    RoleId: auditorRoleId,
    Name: 'auditor',
  });

  User.create({
    UserId: initialUserId,
    FullName: 'Gabriel Ehima',
    Email: 'admin@loaddispatch.com.ng',
    Phone: '08057886381',
    UserName: 'admin@loaddispatch.com.ng',
    Password: encryptedPassword,
    Address: 'Lagos',
    City: 'LG',
    Country: 'NG',
    IsActivated: false,
    CompanyId: 1,
  });

  UserRole.create({
    UserId: initialUserId,
    RoleId: adminRoleId,
  });

  Subscription.create({
    // SubscribeId: 1,
    SubscriptionType: 'free Trial',
    SubscriptionName: 'Free 30 Day Trial',
    Amount: 0.0,
    Description: 'Basic ',
    Active: true,
    Duration: 30,
  });

  UserSubscription.create({
    // UserSubscriptionId: 1,
    SubscribeId: 1,
    SubscriptionName: 'Free 30 Day Trial',
    UserId: initialUserId,
    Active: true,
    StartDate: startDate,
    EndDate: endDate,
  });
}
