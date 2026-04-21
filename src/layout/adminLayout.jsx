import React, { useEffect, useState } from 'react';
import { Nav, Button, InputGroup, Form, Badge, Collapse, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Pastiin path aset lu bener ya!
import Logo from '../assets/Logo.svg'; 
import SidebarBG from '../assets/sidebar/SidebarBG.svg';
import GateSidebar from '../assets/sidebar/GateSidebar.svg';
import LogoutIcon from '../assets/sidebar/Logout.svg';
import HistoryIcon from '../assets/sidebar/icon/admin/HistoryIcon.svg';
import DashboardIcon from '../assets/sidebar/icon/admin/DashboardIcon.svg';
import OperatorIcon from '../assets/sidebar/icon/admin/OperatorIcon.svg';
import ParkiranIcon from '../assets/sidebar/icon/admin/ParkiranIcon.svg';

function AdminLayout({ children }) {
  const brandPink = '#f92c9f';
  const brandGreen = '#A3E33F'; 
  const bgColor = '#d9d9d9';
  
  const navigate = useNavigate();
  const location = useLocation(); 
  const [showLogout, setShowLogout] = useState(false);

  const handleLanjutLogout = () => {

    localStorage.removeItem('token'); 
    localStorage.clear(); 
    
    setShowLogout(false);
    navigate('/'); 
  };

  
  const checkActive = (path) => {
    return location.pathname === path;
  };

  const isParkiranActive = checkActive('/admin/parkiran') || checkActive('/admin/lot') || checkActive('/admin/tarif') || checkActive('/admin/jenis');

  // --- 2. STATE DROPDOWN ---
  const [openParkiran, setOpenParkiran] = useState(isParkiranActive);

  // --- 3. LOGIC AUTH ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: bgColor }}>
      
      {/* --- SIDEBAR --- */}
      <div style={{ width: '250px', backgroundColor: brandGreen, display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative', overflow: 'hidden' }}>
        
        {/* --- GAMBAR BACKGROUND ORNAMEN --- */}
        <img src={SidebarBG} alt="Ornamen" style={{ position: 'absolute', top: '100px', left: 0, width: '100%', zIndex: 0, opacity: 0.8 }} />

        {/* LOGO */}
        <div className="bg-white p-3 d-flex justify-content-center align-items-center" style={{ height: '80px', position: 'relative', zIndex: 2 }}>
          <img src={Logo} alt="Logo" style={{ height: '50px' }} />
        </div>

        {/* MENU */}
        <div className="p-3 mt-3" style={{ flex: 1, position: 'relative', zIndex: 2 }}>
          <Nav className="flex-column">
            
            <Nav.Link 
              as={Link} 
              to="/admin/dashboard" 
              className="fw-bold mb-2 rounded-3 d-flex align-items-center" 
              style={checkActive('/admin/dashboard') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#2c4004', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={DashboardIcon} alt="Dashboard" width="22" className="me-2" /></span> Dashboard
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/admin/petugas" 
              className="fw-bold mb-2 d-flex align-items-center rounded-3" 
              style={checkActive('/admin/petugas') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#2c4004', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={OperatorIcon} alt="Operator" width="22" className="me-2" /></span> Petugas
            </Nav.Link>

            <div 
              onClick={() => setOpenParkiran(!openParkiran)}
              aria-controls="parkiran-collapse"
              aria-expanded={openParkiran}
              className="fw-bold mb-2 rounded-3 d-flex align-items-center justify-content-between" 
              style={{ 
                cursor: 'pointer', 
                ...(isParkiranActive ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#2c4004', padding: '12px 20px' }) 
              }}
            >
              <div>
                <span className="me-2"><img src={ParkiranIcon} alt="Parkiran" width="22" className="me-2" /></span> Parkiran
              </div>
              <span style={{ fontSize: '0.8rem', transition: 'transform 0.3s', transform: openParkiran ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </div>
            
            {/* SUB MENU DENGAN EFEK COLLAPSE */}
            <Collapse in={openParkiran}>
              <div id="parkiran-collapse">
                <div className="ps-5 d-flex flex-column mb-2 mt-2" style={{ fontSize: '0.9rem' }}>
                  <Link to="/admin/lot" className="text-decoration-none fw-bold mb-3" style={{ color: checkActive('/admin/lot') ? 'white' : '#2c4004' }}>Lot Parkir</Link>
                  <Link to="/admin/tarif" className="text-decoration-none fw-bold mb-3" style={{ color: checkActive('/admin/tarif') ? 'white' : '#2c4004' }}>Tarif Kendaraan</Link>
                  <Link to="/admin/jenis" className="text-decoration-none fw-bold mb-3" style={{ color: checkActive('/admin/jenis') ? 'white' : '#2c4004' }}>Jenis Kendaraan</Link>
                </div>
              </div>
            </Collapse>
            {/* ========================================= */}

            <Nav.Link 
              as={Link} 
              to="/admin/history" 
              className="fw-bold mb-2 d-flex align-items-center rounded-3" 
              style={checkActive('/admin/history') ? { backgroundColor: 'white', color: 'black', padding: '12px 20px' } : { color: '#2c4004', padding: '12px 20px' }}
            >
              <span className="me-2"><img src={HistoryIcon} alt="history" width="22" className="me-2" /></span> History
            </Nav.Link>

          </Nav>
        </div>

    
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          
          <img src={GateSidebar} alt="Gate" style={{ width: '85%', marginBottom: '10px' }} />

          <div style={{ width: '100%', height: '1px', backgroundColor: '#5B5B5B', marginBottom: '15px' }}></div>
          <Nav.Link onClick={() => setShowLogout(true)} className="fw-bold mt-auto d-flex align-items-center">
            <img src={LogoutIcon} alt="logout" width="22" className="me-2" />
            LogOut
          </Nav.Link>
        </div>
      </div>

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
          {/* <h5 className="fw-bold mb-2">Yakin mau keluar sistem?</h5> */}
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

export default AdminLayout;