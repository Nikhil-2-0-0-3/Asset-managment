import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';
import Users from './pages/users';
import UserList from './pages/UserList';
import DeviceList from './pages/deviceList';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path='/devices' element={<DeviceList/>} />
        <Route path='/users' element={<Users/>} />
        <Route path="/userlist" element={<UserList />} />

      </Routes>
    </div>
  );
}

export default App;
