import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../config';

interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  serialNumber: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Retired';
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  assignedTo?: string;
  location?: string;
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    
    const fetchDevices = () => {
      try {
        onValue(devicesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const devicesArray = Object.keys(data).map((key) => ({
              deviceId: key,
              ...data[key]
            }));
            setDevices(devicesArray);
          } else {
            setDevices([]);
          }
          setLoading(false);
        });
      } catch (err) {
        setError('Failed to fetch devices');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDevices();

    return () => {
      off(devicesRef);
    };
  }, []);

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: "#4285f4",
    color: "white",
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    position: "sticky",
    top: 0
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left"
  };

  const trStyle: React.CSSProperties = {
    transition: "background-color 0.2s"
  };

  const trHoverStyle: React.CSSProperties = {
    backgroundColor: "#f1f1f1",
    cursor: "pointer"
  };

  const statusStyle = (status: string): React.CSSProperties => ({
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    backgroundColor: 
      status === 'Active' ? "#4CAF50" :
      status === 'Inactive' ? "#f44336" :
      status === 'Maintenance' ? "#FF9800" :
      "#9E9E9E" // Retired
  });

  const loadingStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "20px"
  };

  const errorStyle: React.CSSProperties = {
    color: "#f44336",
    textAlign: "center",
    padding: "20px"
  };

  if (loading) {
    return <div style={loadingStyle}>Loading devices...</div>;
  }

  if (error) {
    return <div style={errorStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Device Inventory</h2>
      
      {devices.length === 0 ? (
        <p style={{ textAlign: "center" }}>No devices found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Device ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Serial Number</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Purchase Date</th>
                <th style={thStyle}>Next Maintenance</th>
                <th style={thStyle}>Assigned To</th>
                <th style={thStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr 
                  key={device.deviceId} 
                  style={trStyle}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor || ''}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={tdStyle}>{device.deviceId}</td>
                  <td style={tdStyle}>{device.deviceName}</td>
                  <td style={tdStyle}>{device.deviceType}</td>
                  <td style={tdStyle}>{device.serialNumber}</td>
                  <td style={tdStyle}>
                    <span style={statusStyle(device.status)}>
                      {device.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {device.purchaseDate ? new Date(device.purchaseDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={tdStyle}>
                    {device.nextMaintenanceDate ? new Date(device.nextMaintenanceDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={tdStyle}>{device.assignedTo || 'Unassigned'}</td>
                  <td style={tdStyle}>{device.location || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeviceList;