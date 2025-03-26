import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';
import UserList from './pages/UserList';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';

function App() {

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<SignupPage />} />
        <Route path="/addusers" element={<AddUser />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/login" element={<LoginPage />} />


      </Routes>
    </div>
  );
}

export default App;
