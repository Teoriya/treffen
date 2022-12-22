import './App.css';
import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation.jsx';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';

function App() {

  const {loading} = useLoadingWithRefresh()
  return (
    loading ? <div>Loading...</div>:

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
  const {auth} = useSelector(state => state.auth)

  return(
      auth ? <Navigate to="/rooms"/> : <Outlet/>
  )
}

const SemiProtectedRoutes = () => {
  const {auth,user} = useSelector(state => state.auth)
  return(
      auth && user.activated ? <Navigate to="/rooms"/> : (auth?<Outlet/>:<Navigate to="/authenticate"/>)
  )
}

const ProtectedRoutes = () => {
  const data = useSelector(state => state.auth)
  console.log(data)
  const {auth,user} = data
  return(
    auth && user.activated ?  <Outlet/>:(auth?<Navigate to="/activate"/>:<Navigate to="/authenticate"/>)//activated check also
  )
}
export default App;
