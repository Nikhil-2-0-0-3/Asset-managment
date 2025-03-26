import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AddUser />} />
      </Routes>
    </div>
  );
}

export default App;
