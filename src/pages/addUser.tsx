import React, { useRef, useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../../config'; 
import Chatbot from '../components/chatbot';  
import { useNavigate } from 'react-router-dom';



const AddUser = () => {
  const navigate = useNavigate();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeviceForm, setShowDeviceForm] = useState(false);

    // References for the forms
    const userFormRef = useRef<HTMLFormElement | null>(null);
    const deviceFormRef = useRef<HTMLFormElement | null>(null);

  // Function to generate a simple UID
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
      await set(deviceRef, {
        ...deviceData,
        deviceId: deviceId,
        addedAt: new Date().toISOString()
      });
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

  const handleDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const success = await addDeviceToDatabase(data);
    if (success) {
      setShowDeviceForm(false);
      form.reset();
    }
  };

  // ✅ Inline Styles
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

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#f44336"
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#333"
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
  };

  const submitButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#2196F3"
  };

  const navigateButtonStyle: React.CSSProperties = {
    padding: "12px 20px",
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "20px",
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    transition: "background 0.3s"
  };

  return (
    <div style={containerStyle}>
             <button 
        onClick={() => navigate('/users')} 
        style={navigateButtonStyle}
      >
        Go to User List
      </button>
        <button 
            onClick={() => navigate('/devices')} 
            style={navigateButtonStyle}
            >
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
        <form ref={deviceFormRef}  onSubmit={handleDeviceSubmit} style={formStyle}>
          <h3>Device Form</h3>
          <label style={labelStyle}>Device Name:</label>
          <input type="text" name="deviceName" required style={inputStyle} />
          
          <label style={labelStyle}>Serial Number:</label>
          <input type="text" name="serialNumber" required style={inputStyle} />
          
          <label style={labelStyle}>Specifications:</label>
          <input type="text" name="specification" required style={inputStyle} />

          <label style={labelStyle}>Adding Date:</label>
          <input type="date" name="addDate" required style={inputStyle} />

          <label style={labelStyle}>Decommission Date:</label>
          <input type="date" name="decommission" required style={inputStyle} />

          <label style={labelStyle}>Next Service Date:</label>
          <input type="date" name="serviceDate" required style={inputStyle} />

          <div style={{ display: "flex", }}>
            <button type="submit" style={submitButtonStyle}>Submit</button>
            <button type="button" onClick={() => setShowDeviceForm(false)} style={cancelButtonStyle}>Cancel</button>
          </div>
        </form>
      )}

      <Chatbot />

 
    </div>
  );
};

export default AddUser;
