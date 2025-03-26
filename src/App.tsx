import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';
import Users from './pages/users';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path='/devices' element={<h1>Devices</h1>} />
        <Route path='/users' element={<Users></Users>} />

      </Routes>
    </div>
  );
}

export default App;
