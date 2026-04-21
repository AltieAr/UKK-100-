import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './assets/logo.svg';
import BackGround01 from './assets/Background.svg';
import Background from './assets/bgpng.png';
import Dashboard01 from './assets/tabletdashboard.png';
import logo01 from './assets/Phijau.svg';
import logo02 from './assets/monitorr.svg';
import logo03 from './assets/petugaskelo.svg';  
import laptop from './assets/laptop.png';
import icon01 from './assets/icon4.svg';
import icon02 from './assets/icon5.svg';
import icon03 from './assets/icon6.svg';
import FooterGateImg from './assets/gateparkir.svg'; // Import gambar untuk dekorasi footer
import { Link } from 'react-router-dom';

function App() {
  // Warna brand dari desain
  const brandPink = '#f92c9f';
  const brandGreen = '#a8d25c';

  return (
    <div style={{ 
      backgroundImage: `url(${Background})`,
      // backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
    }}>
      {/* 1. NAVBAR */}
      <Navbar bg="white" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand href="#home">
            {/* Tempat aset Logo kamu */}
            <div style={{ width: '100px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 'bold', color: '#999' }}>
              <img src={Logo} alt="Logo" style={{ width: '130%', height: '130%' }} />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Tambahin mx-auto di sini biar menu utamanya ke dorong pas ke tengah */}
            <Nav className="mx-auto">
              <Nav.Link href="#home" className="fw-bold text-dark mx-2">Home</Nav.Link>
              <Nav.Link href="#features" className="fw-bold text-dark mx-2">Features</Nav.Link>
              <Nav.Link href="#about" className="fw-bold text-dark mx-2">About</Nav.Link>
            </Nav>

            {/* Tombol Login dipindah ke dalem sini, biar kalau di HP dia ikutan masuk ke menu hamburger */}
            <Button as={Link} to="/login" style={{ backgroundColor: brandPink, border: 'none', borderRadius: '8px', padding: '8px 30px', fontWeight: 'bold' }}>
              Login
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. HERO SECTION */}
      <Container className="mt-5 pt-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="fw-bold" style={{ fontSize: '3rem' }}>
              Solusi Mudah Kelola <br />
              <span style={{ color: brandPink }}>Parkir Efektif & Efisien</span>
            </h1>
            <p className="text-muted mt-3" style={{ fontSize: '1.1rem' }}>
              Kelola area parkir, tarif, dan transaksi dengan mudah dan cepat melalui satu aplikasi. Hemat waktu dan tingkatkan pendapatan parkir anda.
            </p>
            {/* <Button style={{ backgroundColor: brandPink, border: 'none', borderRadius: '8px', padding: '10px 40px', fontWeight: 'bold', marginTop: '10px' }}>
              Start
            </Button> */}
          </Col>
          <Col md={6} className="text-center mt-4 mt-md-0">
            {/* className="img-fluid" itu class dari Bootstrap biar gambarnya responsif */}
            <img src={Dashboard01} alt="Dashboard EcariBa" className="img-fluid" style={{ width: '100%', height: '350px' }}  />
          </Col>
        </Row>
      </Container>

      {/* 3. FEATURE CARDS (Melayang) */}
      <Container style={{ marginTop: '60px' }}>
        <div className="shadow-sm p-4 rounded-4 bg-white border">
          <Row>
            {[
              { title: 'Kelola Area Parkir', desc: 'Manajemen Area parkir dan slot parkir yang cepat dan simpel', icon: logo01 },
              { title: 'Monitoring transaksi', desc: 'Kelola transaksi parkir & tarif dengan mudah', icon: logo02 },
              { title: 'Kelola Petugas', desc: 'Kelola transaksi parkir & tarif dengan mudah', icon: logo03 }
            ].map((feature, idx) => (
              <Col md={4} key={idx} className="d-flex align-items-start mb-3 mb-md-0">
                {/* Tempat Icon */}
                <div className="me-3 mt-1 flex-shrink-0" style={{ width: '45px', height: '45px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
                  <img src={feature.icon} alt={feature.title} style={{ width: '45px', height: '45px' }} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{feature.title}</h6>
                  <p className="text-muted small mb-0">{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* 4. MIDDLE SECTION (All-In-One) */}
      <Container className="mt-5 pt-5 mb-5">
        <Row className="align-items-center">
          <Col md={5}>
            <h2 className="fw-bold mb-3">All-In-One Parkir Management</h2>
            <p className="text-muted">Fitur lengkap untuk Semua Kebutuhan Pengelolaan Parkir Anda</p>
            <ul className="list-unstyled mt-4">
              <li className="mb-2 text-muted">✅ Kelola Area parkir & Tarif dengan mudah</li>
              <li className="mb-2 text-muted">✅ Monitor transaksi Parkir & rata-rata pendapatan</li>
              <li className="mb-2 text-muted">✅ Kelola data petugas & kendaraan</li>
            </ul>
            {/* <Button style={{ backgroundColor: brandPink, border: 'none', borderRadius: '8px', padding: '10px 40px', fontWeight: 'bold', marginTop: '20px' }}>
              Start
            </Button> */}
          </Col>
          <Col md={7} className="text-center mt-4 mt-md-0">
             {/* Tempat aset gambar Laptop Dashboard */}
             <div style={{ width: '100%', height: '350px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={laptop} alt="Dashboard EcariBa" className="img-fluid" style={{ width: '70%', height: '100%' }} />
            </div>
          </Col>
        </Row>
      </Container>  

      {/* 5. MENGAPA MENGGUNAKAN SECTION */}
      <Container className="mt-5 pt-5 text-center">
        <h3 className="fw-bold">Mengapa Menggunakan <span style={{ color: brandGreen }}>EcariBa</span>?</h3>
        <p className="text-muted">Fitur Lengkap untuk Semua Kebutuhan Pengelolaan Parkir Anda</p>
        <Row className="mt-5">
          {[
            { title: 'Efisiensi Waktu', desc: 'Percepat proses masuk dan keluar kendaraan dengan sistem otomatis, memangkas antrean secara signifikan', icon: icon01 },
            { title: 'Pendapatan Optimal', desc: 'Pantau arus kas dan laporan keuangan secara real-time dan akurat untuk mencegah kebocoran dana', icon: icon02 },
            { title: 'Mudah & Praktis', desc: 'Antarmuka dashboard yang simpel memudahkan operator mengelola parkir tanpa perlu pelatihan rumit' ,icon: icon03 },
          ].map((item, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4 p-3 text-start">
                <Card.Body>
                  <Card.Title className="fw-bold">
                    <span style={{ color: brandGreen, marginRight: '10px' }}>
                      <img src={item.icon} alt={item.title} style={{ width: '30px', height: '30px' }} />
                    </span> {item.title}
                  </Card.Title>
                  <Card.Text className="text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                    {item.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* 6. CALL TO ACTION (CTA) FOOTER */}
      <div className="mt-5 text-center text-white py-5" style={{ 
        background: 'linear-gradient(to bottom, #C3E264, #A0B167)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Container>
          <h2 className="fw-bold mb-3">Kelola Parkir Anda dengan Mudah Sekarang</h2>
          <p className="mb-4" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            Mulai gunakan EcariBa dan rasakan kemudahan serta peningkatan pendapatan dari pengelolaan parkir yang efektif dan terstruktur
          </p>
          <Button as={Link} to="/login" style={{ backgroundColor: brandPink, border: 'none', borderRadius: '8px', padding: '12px 50px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Start
          </Button>
        </Container>
        <img 
          src={FooterGateImg} 
          alt="Footer Decoration" 
          style={{
            position: 'absolute', 
            bottom: '0',          
            right: '0',           
            width: '200px',       
            height: 'auto',       
            zIndex: 1             
          }} 
        />
      </div>

    </div>
  );
}

export default App;