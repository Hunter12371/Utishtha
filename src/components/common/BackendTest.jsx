import { useState, useEffect } from 'react';
import { initSocket, connectDispatcher, onNewRequest, onDriverLocationUpdate } from '../../services/socket';
import { getDrivers, getRequests, createRequest } from '../../services/api';

export default function BackendTest() {
  const [drivers, setDrivers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize socket
    const socket = initSocket();
    connectDispatcher();

    socket.on('connect', () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));

    // Listen for real-time updates
    const unsubNewRequest = onNewRequest((request) => {
      console.log('New request received:', request);
      setRequests(prev => [request, ...prev]);
    });

    const unsubDriverLocation = onDriverLocationUpdate(({ driverId, location }) => {
      console.log('Driver location updated:', driverId, location);
      setDrivers(prev => prev.map(d => 
        d._id === driverId ? { ...d, location } : d
      ));
    });

    loadData();

    return () => {
      unsubNewRequest();
      unsubDriverLocation();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [driversRes, requestsRes] = await Promise.all([
        getDrivers(),
        getRequests()
      ]);
      setDrivers(driversRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestRequest = async () => {
    try {
      await createRequest({
        patientName: 'Test Patient',
        patientPhone: '+919999999999',
        location: {
          lat: 28.6139 + Math.random() * 0.1,
          lng: 77.2090 + Math.random() * 0.1,
          address: 'Test Location'
        },
        priority: 'high'
      });
      await loadData();
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Integration Test</h1>

        {/* Status */}
        <div className="mb-8 p-4 bg-slate-900 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${socketStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Socket: {socketStatus}</span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
            <button
              onClick={handleCreateTestRequest}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Create Test Request
            </button>
          </div>
        </div>

        {/* Drivers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Drivers ({drivers.length})</h2>
          <div className="grid gap-4">
            {drivers.map(driver => (
              <div key={driver._id} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{driver.name}</h3>
                    <p className="text-sm text-slate-400">{driver.phone}</p>
                    <p className="text-sm text-slate-400">{driver.licensePlate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-sm ${
                      driver.status === 'available' ? 'bg-green-600' :
                      driver.status === 'busy' ? 'bg-yellow-600' : 'bg-slate-600'
                    }`}>
                      {driver.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-2">
                      {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Requests ({requests.length})</h2>
          <div className="grid gap-4">
            {requests.map(request => (
              <div key={request._id} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{request.patientName}</h3>
                    <p className="text-sm text-slate-400">{request.patientPhone}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-sm ${
                      request.status === 'pending' ? 'bg-yellow-600' :
                      request.status === 'assigned' ? 'bg-blue-600' :
                      request.status === 'picked_up' ? 'bg-purple-600' :
                      request.status === 'completed' ? 'bg-green-600' : 'bg-slate-600'
                    }`}>
                      {request.status}
                    </span>
                    <p className={`text-xs mt-2 ${
                      request.priority === 'critical' ? 'text-red-400' :
                      request.priority === 'high' ? 'text-orange-400' : 'text-slate-400'
                    }`}>
                      Priority: {request.priority}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
