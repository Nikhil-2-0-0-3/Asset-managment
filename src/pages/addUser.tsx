import React, { useState } from 'react'

function AddUser() {
    const [showUserForm, setShowUserForm] = useState(false);
    const [showDeviceForm, setShowDeviceForm] = useState(false);
  
  return (
    <div>
       <button onClick={() => setShowUserForm(true)}>Add User</button>
      <button onClick={() => setShowDeviceForm(true)}>Add Device</button>

      {showUserForm && (
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          console.log('User form submitted'); 
          setShowUserForm(false); 
        }}>
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
           Department
            <input type="text" name="department" required />
          </label>
          <br />
         
          <button 
            type="submit" 
            onClick={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget.closest('form') as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              console.log(data);
            }}
          >
            Submit
          </button>
        </form>
      )}

      {showDeviceForm && (
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          console.log('Device form submitted'); 
          setShowDeviceForm(false); 
        }}>
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
            <input type="text" name="addDate" required />
          </label>
          <br />
          
          <label>
            Decommision Date:
            <input type="text" name="decommission" required />
          </label>
          <br />
          <label>
            Next Service Date:
            <input type="text" name="serviceDate" required />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default AddUser
