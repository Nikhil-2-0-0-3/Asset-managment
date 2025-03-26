import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import {db} from '../../config' // Make sure this path matches your Firebase config file

function AddUser() {
    const [showUserForm, setShowUserForm] = useState(false);
    const [showDeviceForm, setShowDeviceForm] = useState(false);

    // Function to generate a simple UID (you might want to use a more robust solution in production)
    const generateUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // Function to add user to Realtime Database
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

    // Function to add device to Realtime Database
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
            return true;
        } catch (error) {
            console.error('Error adding device: ', error);
            return false;
        }
    };

    // Handle user form submission
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

    // Handle device form submission
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

    return (
        <div>
            <button onClick={() => setShowUserForm(true)}>Add User</button>
            <button onClick={() => setShowDeviceForm(true)}>Add Device</button>

            {showUserForm && (
                <form onSubmit={handleUserSubmit}>
                    <h3>User Form</h3>
                    <label>
                        Name:
                        <input type="text" name="name" required />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input type="email" name="email" required />
                    </label>
                    <br />
                    <label>
                        Department:
                        <input type="text" name="department" required />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowUserForm(false)}>Cancel</button>
                </form>
            )}

            {showDeviceForm && (
                <form onSubmit={handleDeviceSubmit}>
                    <h3>Device Form</h3>
                    <label>
                        Device Name:
                        <input type="text" name="deviceName" required />
                    </label>
                    <br />
                    <label>
                        Serial Number:
                        <input type="text" name="serialNumber" required />
                    </label>
                    <br />
                    <label>
                        Specifications:
                        <input type="text" name="specification" required />
                    </label>
                    <br />
                    <label>
                        Adding date:
                        <input type="date" name="addDate" required />
                    </label>
                    <br />
                    <label>
                        Decommission Date:
                        <input type="date" name="decommission" required />
                    </label>
                    <br />
                    <label>
                        Next Service Date:
                        <input type="date" name="serviceDate" required />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowDeviceForm(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
}

export default AddUser;