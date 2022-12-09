import './App.css';
import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation.jsx';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
function App() {
  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route element={<GuestRoutes/>}>
          <Route path="/" exact element={<Home/>} />
          <Route path="/authenticate" element={<Authenticate/>}/>
        </Route>
        <Route element={<ProtectedRoutes/>}>
          <Route path="/rooms" exact element={<Rooms/>} />
    
        </Route>
        <Route element={<SemiProtectedRoutes/>}>
          <Route path="/activate" element={<Activate/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

const GuestRoutes = () => {
  let auth = {'token':false}
  return(
      auth.token ? <Navigate to="/rooms"/> : <Outlet/>
  )
}

const SemiProtectedRoutes = () => {
  let auth = {'token':false}
  return(
      auth.token ? <Navigate to="/rooms"/> : <Outlet/>
  )
}

const ProtectedRoutes = () => {
  let auth = {'token':false}
  return(
      auth.token ?  <Outlet/>:<Navigate to="/authenticate"/>//activated check also
  )
}
export default App;
