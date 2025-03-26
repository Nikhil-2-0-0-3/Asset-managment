import React, { useState } from 'react';

// Define the Device interface
interface Device {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  status: 'Active' | 'Inactive';
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Laptop", type: "Electronics", serialNumber: "ABC123", status: "Active" },
    { id: 2, name: "Printer", type: "Office Equipment", serialNumber: "PRT456", status: "Inactive" },
    { id: 3, name: "Router", type: "Networking", serialNumber: "RT789", status: "Active" }
  ]);

  const containerStyle: React.CSSProperties = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1000px",
    margin: "0 auto"
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: "#f2f2f2",
    color: "#333",
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left"
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left"
  };

  const rowHoverStyle: React.CSSProperties = {
    backgroundColor: "#f1f1f1"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Device List</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Serial Number</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={device.id} style={index % 2 === 0 ? rowHoverStyle : {}}>
              <td style={tdStyle}>{device.id}</td>
              <td style={tdStyle}>{device.name}</td>
              <td style={tdStyle}>{device.type}</td>
              <td style={tdStyle}>{device.serialNumber}</td>
              <td style={tdStyle}>{device.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
