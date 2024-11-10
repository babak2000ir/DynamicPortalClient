import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useGlobalStore } from './stores';
import { setUserAuthToken } from './helpers';
import SideBar from './components/NavBar/SideBar';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer';
import Main from './components/Main';
import LoginForm from './components/Form/Login';
import RegistrationForm from './components/Form/Registration';

if (localStorage.token) {
  setUserAuthToken(localStorage.token);
}

const App = () => {
  const showSidebar = useGlobalStore(state => state.showSidebar);
  const loadEntitiesAndTables = useGlobalStore(state => state.loadEntitiesAndTables);
  //const authenticated = useGlobalStore(state => state.authenticated);
  //const loadUser = useGlobalStore(state => state.loadUser);
  const authenticated = true;

  useEffect(() => {
    //loadUser();
    if (authenticated) loadEntitiesAndTables();
  }, [authenticated]);
  

  return (
    <Router>
      <NavBar />
      <div className='flex flex-col lg:block'>
        <Routes>
          <Route path="/" element={!authenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!authenticated ? <LoginForm /> : <Navigate to="/dashboard" />} />
          <Route path="/setPassword" element={!authenticated ? <RegistrationForm /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            authenticated ? (
              <>
                <SideBar />
                <div className={`w3-row mt-[51px] h-screen ${showSidebar ? 'main-wrapper' : ''}`}>
                  <div className="w3-col m12 w3-grey w3-animate-left">
                    <Main />
                  </div>
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
