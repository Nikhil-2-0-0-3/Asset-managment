import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/addUser';
import Users from './pages/users';
import UserList from './pages/UserList';
import DeviceList from './pages/deviceList';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';

function App() {

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<SignupPage />} />
       {/* // <Route path="/" element={<AddUser />} /> */}
        <Route path='/devices' element={<DeviceList/>} />
        <Route path='/users' element={<Users/>} />
        <Route path="/addusers" element={<AddUser />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/login" element={<LoginPage />} />


      </Routes>
    </div>
  );
}

export default App;
