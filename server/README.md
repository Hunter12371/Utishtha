# Utishta Backend Server

Node.js/Express backend with Socket.io for real-time emergency response coordination.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment:
Edit `.env` file with your MongoDB connection string.

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
npm run dev
```

## Default Credentials

- Admin: username: `admin`, password: `admin123`
- Drivers: Login with phone numbers (see seed.js)

## API Endpoints

### Authentication
- POST `/api/auth/admin/login` - Admin login
- POST `/api/auth/driver/login` - Driver login

### Drivers
- GET `/api/drivers` - Get all drivers
- GET `/api/drivers/available` - Get available drivers
- POST `/api/drivers` - Create new driver
- PUT `/api/drivers/:id/status` - Update driver status

### Requests
- POST `/api/requests` - Create emergency request
- GET `/api/requests` - Get all requests
- PUT `/api/requests/:id/assign` - Assign driver to request
- PUT `/api/requests/:id/status` - Update request status

## Socket.io Events

### Client → Server
- `driverConnect` - Driver connects with ID
- `driverLocationUpdate` - Driver sends location
- `dispatcherConnect` - Dispatcher joins room
- `trackRequest` - Patient tracks request

### Server → Client
- `newRequest` - New emergency request created
- `driverLocationUpdated` - Driver location changed
- `newRequestAssignment` - Driver assigned to request
- `requestStatusUpdate` - Request status changed
