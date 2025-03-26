import React, { useRef, useState } from 'react';
import { ref, set,push } from 'firebase/database';
import { db } from '../../config';
import Chatbot from '../components/chatbot';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const deviceFormRef = useRef<HTMLFormElement | null>(null);
  const userFormRef = useRef<HTMLFormElement | null>(null);
  const generateUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  const addUserToDatabase = async (userData: any) => {
    try {
      const uid = generateUID();
      const userRef = ref(db, `users/${uid}`);
      await set(userRef, {
        ...userData,
        uid: uid,
        createdAt: new Date().toISOString()
      });
      console.log('User added successfully with ID: ', uid);
      return true;
    } catch (error) {
      console.error('Error adding user: ', error);
      return false;
    }
  };

  const addDeviceToDatabase = async (deviceData: any) => {
    try {
      const deviceId = generateUID();
      const deviceRef = ref(db, `devices/${deviceId}`);
      const assignedTo = deviceData.assignedTo;

      await set(deviceRef, {
        ...deviceData,
        deviceId: deviceId,
        addedAt: new Date().toISOString()
      });
      if (assignedTo) {
        const userDevicesRef = ref(db, `users/${assignedTo}/devices_assigned`);
        const newDeviceRef = push(userDevicesRef);
        await set(newDeviceRef, deviceId);
      }
      console.log('Device added successfully with ID: ', deviceId);
      if (deviceFormRef.current) {
        deviceFormRef.current.reset();
      }
      return true;
    } catch (error) {
      console.error('Error adding device: ', error);
      return false;
    }
  };

  const handleDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const success = await addDeviceToDatabase(data);
    if (success) {
      setShowDeviceForm(false);
    }
  };
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const success = await addUserToDatabase(data);
    if (success) {
      setShowUserForm(false);
      form.reset();
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 20px",
    margin: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s"
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "20px auto"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "4px"
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "10px"
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: "white"
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  };

  const submitButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#2196F3",
    flex: 1,
    marginRight: "10px"
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    flex: 1
  };

  const navigateButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#FF9800",
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    margin: "20px 0"
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate('/users')} style={navigateButtonStyle}>
        Go to User List
      </button>
      <button onClick={() => navigate('/devices')} style={navigateButtonStyle}>
        Go to Device List
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Manage Users & Devices</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button style={buttonStyle} onClick={() => setShowUserForm(true)}>Add User</button>
        <button style={buttonStyle} onClick={() => setShowDeviceForm(true)}>Add Device</button>
      </div>
      {showUserForm && (
        <form ref={userFormRef} onSubmit={handleUserSubmit} style={formStyle}>
          <h3>User Form</h3>
          <label style={labelStyle}>Name:</label>
          <input type="text" name="name" required style={inputStyle} />
          
          <label style={labelStyle}>Email:</label>
          <input type="email" name="email" required style={inputStyle} />

          <label style={labelStyle}>Department:</label>
          <input type="text" name="department" required style={inputStyle} />
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="submit" style={submitButtonStyle}>Submit</button>
            <button type="button" onClick={() => setShowUserForm(false)} style={cancelButtonStyle}>Cancel</button>
          </div>
        </form>
      )}

      {showDeviceForm && (
        <form ref={deviceFormRef} onSubmit={handleDeviceSubmit} style={formStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Add New Device</h3>
          
          <label style={labelStyle}>Device Name*</label>
          <input type="text" name="deviceName" required style={inputStyle} />
          
          <label style={labelStyle}>Device Type*</label>
          <input type="text" name="deviceType" required style={inputStyle} />
          
          <label style={labelStyle}>Serial Number*</label>
          <input type="text" name="serialNumber" required style={inputStyle} />
          
          <label style={labelStyle}>Status*</label>
          <select name="status" required style={selectStyle}>
            <option value="">Select Status</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          
          <label style={labelStyle}>Specifications</label>
          <textarea name="specification" rows={3} style={inputStyle} />
          
          <label style={labelStyle}>Purchase Date*</label>
          <input type="date" name="purchaseDate" required style={inputStyle} />
          
          <label style={labelStyle}>Last Maintenance Date</label>
          <input type="date" name="lastMaintenanceDate" style={inputStyle} />
          
          <label style={labelStyle}>Next Maintenance Date</label>
          <input type="date" name="nextMaintenanceDate" style={inputStyle} />
          
          <label style={labelStyle}>Retirement Date</label>
          <input type="date" name="retirementDate" style={inputStyle} />
          
          <label style={labelStyle}>Assigned To (User ID)</label>
          <input type="text" name="assignedTo" style={inputStyle} />
          
          <label style={labelStyle}>Location</label>
          <input type="text" name="location" style={inputStyle} />
          
          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle}>Submit</button>
            <button 
              type="button" 
              onClick={() => setShowDeviceForm(false)} 
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <Chatbot />
    </div>
  );
};

export default AddUser;