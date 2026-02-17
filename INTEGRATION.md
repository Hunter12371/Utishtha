# Frontend Integration Guide

## Install Socket.io Client

```bash
npm install socket.io-client axios
```

## Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginAdmin = (credentials) => api.post('/auth/admin/login', credentials);
export const loginDriver = (phone) => api.post('/auth/driver/login', { phone });

// Drivers
export const getDrivers = () => api.get('/drivers');
export const getAvailableDrivers = () => api.get('/drivers/available');
export const updateDriverStatus = (id, status) => api.put(`/drivers/${id}/status`, { status });

// Requests
export const createRequest = (data) => api.post('/requests', data);
export const getRequests = () => api.get('/requests');
export const assignDriver = (requestId, driverId) => 
  api.put(`/requests/${requestId}/assign`, { driverId });
export const updateRequestStatus = (requestId, status) => 
  api.put(`/requests/${requestId}/status`, { status });
```

## Create Socket Service

Create `src/services/socket.js`:

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Driver functions
export const connectDriver = (driverId) => {
  const socket = getSocket();
  socket.emit('driverConnect', driverId);
};

export const updateDriverLocation = (driverId, location) => {
  const socket = getSocket();
  socket.emit('driverLocationUpdate', { driverId, location });
};

// Dispatcher functions
export const connectDispatcher = () => {
  const socket = getSocket();
  socket.emit('dispatcherConnect');
};

// Listen to events
export const onNewRequest = (callback) => {
  const socket = getSocket();
  socket.on('newRequest', callback);
};

export const onDriverLocationUpdate = (callback) => {
  const socket = getSocket();
  socket.on('driverLocationUpdated', callback);
};

export const onRequestAssignment = (callback) => {
  const socket = getSocket();
  socket.on('newRequestAssignment', callback);
};
```

## Usage Examples

### In DispatcherConsole.jsx:

```javascript
import { useEffect, useState } from 'react';
import { initSocket, connectDispatcher, onNewRequest, onDriverLocationUpdate } from '../services/socket';
import { getRequests, getDrivers } from '../services/api';

function DispatcherConsole() {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Initialize socket
    initSocket();
    connectDispatcher();

    // Load initial data
    loadData();

    // Listen for real-time updates
    onNewRequest((request) => {
      setRequests(prev => [request, ...prev]);
    });

    onDriverLocationUpdate(({ driverId, location }) => {
      setDrivers(prev => prev.map(d => 
        d._id === driverId ? { ...d, location } : d
      ));
    });
  }, []);

  const loadData = async () => {
    const [reqRes, driverRes] = await Promise.all([
      getRequests(),
      getDrivers()
    ]);
    setRequests(reqRes.data);
    setDrivers(driverRes.data);
  };

  // ... rest of component
}
```

### In DriverApp.jsx:

```javascript
import { useEffect } from 'react';
import { initSocket, connectDriver, updateDriverLocation, onRequestAssignment } from '../services/socket';

function DriverApp() {
  const driverId = localStorage.getItem('driverId');

  useEffect(() => {
    initSocket();
    connectDriver(driverId);

    // Send location every 5 seconds
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        updateDriverLocation(driverId, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }, 5000);

    // Listen for job assignments
    onRequestAssignment((request) => {
      // Show job offer modal
      console.log('New job:', request);
    });

    return () => clearInterval(interval);
  }, [driverId]);

  // ... rest of component
}
```

## Next Steps

1. Run `npm install socket.io-client axios` in the root directory
2. Create the service files above
3. Update your components to use the API and Socket services
4. Test the real-time features!

## Testing

You can seed the database with test data:
```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin` / `admin123`
- 3 sample drivers with phone numbers
