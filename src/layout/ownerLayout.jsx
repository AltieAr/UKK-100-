import React, { useEffect, useState } from 'react';
import { Nav, Button, InputGroup, Form, Badge, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Pastiin path aset lu bener ya!
import Logo from '../assets/Logo.svg'; 
import SidebarBG from '../assets/sidebar/SidebarBG.svg';
import GateSidebar from '../assets/sidebar/GateSidebar.svg';
import LogoutIcon from '../assets/sidebar/icon/owner/LogoutOwn.svg';
import DashboardIcon from '../assets/sidebar/icon/owner/DashOwnIcon.svg';
import HistoryIcon from '../assets/sidebar/icon/owner/HistoryOwnIcon.svg';

function OwnerLayout({ children }) {
  const brandPurple = '#8e44ad'; 
  const bgColor = '#d9d9d9';
  
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const checkActive = (path) => {
    return location.pathname === path;
  };

  // --- LOGIC AUTH KHUSUS OWNER ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Kalau bukan owner, tendang balik ke login!
    if (!token || role !== 'owner') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  }, [navigate]);

  const handleLanjutLogout = () => {

    localStorage.removeItem('token'); 
    localStorage.clear();
    

    setShowLogout(false);
    navigate('/'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: bgColor }}>
      
      {/* --- SIDEBAR OWNER --- */}
      <div style={{ width: '250px', backgroundColor: brandPurple, display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative', overflow: 'hidden' }}>
        
        <img src={SidebarBG} alt="Ornamen" style={{ position: 'absolute', top: '100px', left: 0, width: '100%', zIndex: 0, opacity: 0.8 }} />

        <div className="bg-white p-3 d-flex justify-content-center align-items-center" style={{ height: '80px', position: 'relative', zIndex: 2 }}>
          <img src={Logo} alt="Logo" style={{ height: '50px' }} />
        </div>

        <div className="p-3 mt-3" style={{ flex: 1, position: 'relative', zIndex: 2 }}>
          <Nav className="flex-column">
            
            {/* MENU DASHBOARD OWNER */}
            <Nav.Link 
              as={Link} 
              to="/owner/dashboard" 
              className="fw-bold mb-2 rounded-3 d-flex align-items-center" 
              style={checkActive('/owner/dashboard') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: 'white', padding: '12px 20px', opacity: 0.8 }}
            >
              <span className="me-2"><img src={DashboardIcon} alt="dashboard" width="22" className="me-2" /></span> Dashboard
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/owner/history" 
              className="fw-bold mb-2 rounded-3 d-flex align-items-center" 
              style={checkActive('/owner/history') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: 'white', padding: '12px 20px', opacity: 0.8 }}
            >
              <span className="me-2"><img src={HistoryIcon} alt="history" width="22" className="me-2" /></span> History Logs
            </Nav.Link>

            {/* Kalo lu nanti mau nambahin Laporan khusus owner, tinggal tambahin di sini */}
            
          </Nav>
        </div>

        {/* --- AREA BAWAH --- */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <img src={GateSidebar} alt="Gate" style={{ width: '85%', marginBottom: '10px' }} />
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(223, 220, 220, 0.3)', marginBottom: '15px' }}></div>
          <div 
                      onClick={() => setShowLogout(true)} 
                      className="nav-link fw-bold mt-auto d-flex align-items-center" 
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={LogoutIcon} alt="logout" width="22" className="me-2" />
                      LogOut
                    </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children} 
        </div>

      </div>
      <Modal show={showLogout} onHide={() => setShowLogout(false)} centered>
              <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Konfirmasi Keluar</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center pt-2 pb-4 px-4">
      
                <p className="text-muted small mb-4">Sesi Anda akan diakhiri. Pastikan semua pekerjaan atau transaksi sudah disimpan.</p>
                
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="light" className="w-50 fw-bold border" onClick={() => setShowLogout(false)}>
                    Batal
                  </Button>
                  <Button variant="danger" className="w-50 fw-bold border-0" onClick={handleLanjutLogout}>
                    Ya, Keluar
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
    </div>
  );
}

export default OwnerLayout;