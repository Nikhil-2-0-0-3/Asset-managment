import { off, onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../config';

interface User {
  uid: string;
  name: string;
  email: string;
  department: string;
  createdAt?: string | number;
  devices_assigned?: Record<string, any>;
}

interface AssignedDevice {
  deviceId: string;
  assignedDate: string;
  returnDate: string;
  [key: string]: any;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [showAssignedDevices, setShowAssignedDevices] = useState<string | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    timePeriod: '',
    deviceId: ''
  });

  useEffect(() => {
    const usersRef = ref(db, 'users');

    const fetchUsers = () => {
      try {
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const usersArray = Object.keys(data).map((key) => ({
              uid: key,
              ...data[key]
            }));
            setUsers(usersArray);
          } else {
            setUsers([]);
          }
          setLoading(false);
        }, (error) => {
          console.error('Firebase error:', error);
          setError('Failed to fetch users');
          setLoading(false);
        });
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      off(usersRef);
    };
  }, []);

  const handleAssignDevice = async (userId: string, deviceId: string) => {
    try {
      const updates = {};
      const assignmentPath = `users/${userId}/devices_assigned/${deviceId}`;
      
      updates[assignmentPath] = {
        deviceId,
        assignedDate: new Date().toISOString(),
        returnDate: assignmentData.timePeriod
      };

      updates[`devices/${deviceId}/assignedTo`] = userId;
      updates[`devices/${deviceId}/status`] = 'Assigned';

      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error('Error assigning device:', error);
      setError('Failed to assign device');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    
    if (!assignmentData.deviceId) {
      setError('Device ID is required');
      return;
    }

    if (!assignmentData.timePeriod) {
      setError('Time period is required');
      return;
    }

    const success = await handleAssignDevice(userId, assignmentData.deviceId);
    if (success) {
      setShowForm(null);
      setAssignmentData({ timePeriod: '', deviceId: '' });
    }
  };

  const handleAssignedClick = (userId: string) => {
    setShowAssignedDevices(userId === showAssignedDevices ? null : userId);
  };

  // All style declarations remain exactly the same
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse" as const,
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

  const rowHoverStyle = {
    backgroundColor: "#f1f1f1"
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "4px"
  };

  const assignedButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#FF9800" // Orange color for assigned devices button
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "120px"
  };

  const assignedDevicesStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    marginTop: "5px"
  };

  const deviceItemStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between"
  };

  const handleAssignClick = (userId: string) => {
    setShowForm(userId === showForm ? null : userId);
    setAssignmentData({ timePeriod: '', deviceId: '' });
  };

  const formatDate = (timestamp: string | number | undefined) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp * 1000);
    }

    return date.toLocaleString();
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Management</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>UID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <React.Fragment key={user.uid}>
              <tr style={index % 2 === 0 ? rowHoverStyle : {}}>
                <td style={tdStyle}>{user.uid}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.department}</td>
                <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                <td style={tdStyle}>
                  <button
                    style={buttonStyle}
                    onClick={() => handleAssignClick(user.uid)}
                  >
                    Assign
                  </button>
                  <button
                    style={assignedButtonStyle}
                    onClick={() => handleAssignedClick(user.uid)}
                  >
                    Assigned
                  </button>
                </td>
              </tr>
              {showForm === user.uid && (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
                    <form onSubmit={(e) => handleSubmit(e, user.uid)} style={formStyle}>
                      <input
                        type="date"
                        value={assignmentData.timePeriod}
                        onChange={(e) => setAssignmentData({ ...assignmentData, timePeriod: e.target.value })}
                        placeholder="Time Period"
                        style={inputStyle}
                        required
                      />
                      <input
                        type="text"
                        value={assignmentData.deviceId}
                        onChange={(e) => setAssignmentData({ ...assignmentData, deviceId: e.target.value })}
                        placeholder="Device ID"
                        style={inputStyle}
                        required
                      />
                      <button type="submit" style={{ ...buttonStyle, backgroundColor: "#2196F3" }}>
                        Submit
                      </button>
                    </form>
                  </td>
                </tr>
              )}
              {showAssignedDevices === user.uid && user.devices_assigned && (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
                    <div style={assignedDevicesStyle}>
                      <h4>Assigned Devices</h4>
                      {Object.entries(user.devices_assigned).length > 0 ? (
                        Object.entries(user.devices_assigned).map(([deviceId, deviceData]) => (
                          <div key={deviceId} style={deviceItemStyle}>
                            <div>
                              <strong>Device ID:</strong> {deviceId}<br />
                              <strong>Assigned Date:</strong> {formatDate(deviceData.assignedDate)}<br />
                              <strong>Return Date:</strong> {formatDate(deviceData.returnDate)}
                            </div>
                            <button 
                              style={{ ...buttonStyle, backgroundColor: "#f44336", padding: "4px 8px" }}
                              onClick={() => {
                                // Add unassign functionality here if needed
                              }}
                            >
                              Unassign
                            </button>
                          </div>
                        ))
                      ) : (
                        <div>No devices assigned</div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;