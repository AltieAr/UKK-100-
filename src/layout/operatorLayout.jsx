import React, { useEffect, useState } from 'react';
import { Nav, Button, InputGroup, Form, Badge, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Aset (bisa disesuaikan kalau desain petugas beda)
import Logo from '../assets/Logo.svg'; 
import SidebarBG from '../assets/sidebar/SidebarBG.svg';
import GateSidebar from '../assets/sidebar/GateSidebar.svg';
import LogoutIcon from '../assets/sidebar/Logout.svg';
import DashboardIcon from '../assets/sidebar/icon/operator/DashOpIcon.svg';
import CalendarIcon from '../assets/sidebar/icon/operator/CalendarIcon.svg';
import CheckInIcon from '../assets/sidebar/icon/operator/CheckInIcon.svg';
import CheckOutIcon from '../assets/sidebar/icon/operator/CheckOutIcon.svg';

function OperatorLayout({ children }) {
  // Warnanya gua bedain dikit (misal Biru/Cyan) biar lu gampang bedain lagi login sbg siapa.
  // Kalo di Figma lu warnanya tetep Ijo, ganti aja jadi '#A3E33F' lagi.
  const brandGreen = '#0dcaf0'; 
  const bgColor = '#d9d9d9';
  
  const navigate = useNavigate();
  const location = useLocation(); 

  const [showLogout, setShowLogout] = useState(false);

  const checkActive = (path) => location.pathname === path;

  // --- LOGIC AUTH KHUSUS PETUGAS ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Kalau ga ada token atau role-nya BUKAN operator, tendang ke login!
    if (!token || role !== 'operator') {
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
      
      {/* --- SIDEBAR PETUGAS --- */}
      <div style={{ width: '250px', backgroundColor: brandGreen, display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative', overflow: 'hidden' }}>
        
        <img src={SidebarBG} alt="Ornamen" style={{ position: 'absolute', top: '100px', left: 0, width: '100%', zIndex: 0, opacity: 0.8 }} />

        <div className="bg-white p-3 d-flex justify-content-center align-items-center" style={{ height: '80px', position: 'relative', zIndex: 2 }}>
          <img src={Logo} alt="Logo" style={{ height: '50px' }} />
        </div>

        <div className="p-3 mt-3" style={{ flex: 1, position: 'relative', zIndex: 2 }}>
          <Nav className="flex-column">
                
            {/* MENU DASHBOARD PETUGAS */}
            <Nav.Link 
              as={Link} 
              to="/operator/dashboard" 
              className="fw-bold mb-2 rounded-3 d-flex align-items-center" 
              style={checkActive('/operator/dashboard') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#055160', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={DashboardIcon} alt="Dashboard" width="22" className="me-2" /></span> Dashboard
            </Nav.Link>

            {/* MENU KENDARAAN MASUK (CHECK-IN) */}
            <Nav.Link 
              as={Link} 
              to="/operator/masuk" 
              className="fw-bold mb-2 d-flex align-items-center rounded-3" 
              style={checkActive('/operator/masuk') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#055160', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={CheckInIcon} alt="Check-in" width="22" className="me-2" /></span> Parkir Masuk
            </Nav.Link>

            {/* MENU KENDARAAN KELUAR (CHECK-OUT) */}
            <Nav.Link 
              as={Link} 
              to="/operator/keluar" 
              className="fw-bold mb-2 d-flex align-items-center rounded-3" 
              style={checkActive('/operator/keluar') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#055160', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={CheckOutIcon} alt="Check-out" width="22" className="me-2" /></span> Parkir Keluar
            </Nav.Link>

          </Nav>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <img src={GateSidebar} alt="Gate" style={{ width: '85%', marginBottom: '10px' }} />
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '15px' }}></div>
     
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

      {/* =========================================
          MODAL KONFIRMASI LOGOUT
          ========================================= */}
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

export default OperatorLayout;