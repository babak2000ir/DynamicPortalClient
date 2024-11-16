import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useGlobalStore } from './stores';
import SideBar from './components/NavBar/SideBar';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer';
import Main from './components/Main';

const App = () => {
  const {showSidebar, loadEntities, loadPages} = useGlobalStore();

  useEffect(() => {
    loadEntities();
    loadPages();
  }, []);

  return (
    <Router>
      <NavBar />
      <div className='flex flex-col lg:block'>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <>
              {showSidebar && <SideBar />}
              <div className={`w3-row mt-[51px] h-screen ${showSidebar ? 'main-wrapper' : ''}`}>
                <div className="w3-col m12 w3-grey w3-animate-left">
                  <Main />
                </div>
              </div>
            </>
          } />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
