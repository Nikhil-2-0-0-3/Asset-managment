import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';
import UserList from './pages/UserList';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path="/userlist" element={<UserList />} />

      </Routes>
    </div>
  );
}

export default App;
