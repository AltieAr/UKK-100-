import React, { useState } from 'react'; // Tambah useState
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap'; // Tambah Alert buat nampilin error
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './assets/Logo.svg';
import LoginFooterImg from './assets/loginfooter.svg';
import usn from './assets/@.svg';
import pass from './assets/lock-pass.svg';
import { Link, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import axios from 'axios'; // Wajib install: npm install axios

function Login() { // Nama komponen React biasakan diawali huruf besar
  const brandPink = '#f92c9f';
  // const brandGreen = '#a8d25c'; // Kalo ga dipake, bisa dihapus atau dicomment aja

  // --- STATE UNTUK LOGIC LOGIN ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Biar tombolnya disabled pas lagi loading
  
  const navigate = useNavigate();

  // --- FUNGSI HANDLE SUBMIT ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // http://localhost:3030/api/login
    // {
    // "username": "operator",
    // "password": "test123"
    // }

    try {
      // Tembak API Backend lu (Sesuaikan port-nya, misal backend lu jalan di port 5000)
      const response = await axios.post('http://localhost:3030/api/login', {
        username: username,
        password: password
      });

      // console.log("ISI BALASAN BACKEND: ", response.data);

      // // Kalo sukses, ambil token dan role
      const token = response.data.token;
      const role = response.data.userData.role; 

      // Simpen di localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect sesuai Role (Sesuai Flowchart!)
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'owner') {
        navigate('/owner/dashboard');
      } else if (role === 'operator') {
        navigate('/operator/dashboard');
      } else {
        setErrorMsg('Role tidak dikenali.');
      }

    } catch (error) {
      if (error.response) {
        // Error dari backend (misal password salah)
        setErrorMsg(error.response.data.message);
      } else {
        // Error server mati atau ga nyambung
        setErrorMsg('Gagal terhubung ke server. Pastikan backend menyala.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return ( 
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#d9d9d9' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="shadow-sm border-0 rounded-4" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '120px' }}>
              <Card.Body className="p-5" style={{ zIndex: 2 }}>
                
                <div className="text-center mb-4">
                  <Link to="/">
                    <img src={Logo} alt="Logo EcariBa" style={{ height: '70px' }} />
                  </Link>
                </div>

                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-1">Selamat Datang Kembali</h4>
                  <p className="small text-muted" style={{ fontSize: '0.85rem' }}>Masukan detail akun anda untuk melanjutkan.</p>
                </div>

                {/* --- TEMPAT NAMPILIN ERROR --- */}
                {errorMsg && (
                  <Alert variant="danger" className="text-center py-2" style={{ fontSize: '0.85rem' }}>
                    {errorMsg}
                  </Alert>
                )}

                {/* --- TAMBAHIN onSubmit DI FORM --- */}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                      USERNAME
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                        <img src={usn} alt="Username Icon" style={{ height: '16px', width: '16px' }} />
                      </InputGroup.Text>
                      {/* --- SAMBUNGIN KE STATE --- */}
                      <Form.Control 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-light border-start-0 shadow-none" 
                        style={{ borderRadius: '0 10px 10px 0' }}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                      PASSWORD
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                        <img src={pass} alt="Password Icon" style={{ height: '20px', width: '20px' }} />
                      </InputGroup.Text>
                      {/* --- SAMBUNGIN KE STATE --- */}
                      <Form.Control 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-light border-start-0 shadow-none" 
                        style={{ borderRadius: '0 10px 10px 0' }}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
                    <Form.Check 
                      type="checkbox" 
                      id="ingatSaya" 
                      label="Ingat saya" 
                      className="text-muted"
                    />
                    <a href="#" className="text-dark text-decoration-none">
                      Lupa Password?
                    </a>
                  </div>

                  {/* --- UBAH TOMBOL JADI TYPE SUBMIT --- */}
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-100 fw-bold" 
                    style={{ backgroundColor: brandPink, border: 'none', borderRadius: '10px', padding: '12px' }}
                  >
                    {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
                  </Button>
                </Form>
              </Card.Body>

              <img 
                src={LoginFooterImg} 
                alt="Gate Footer" 
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  zIndex: 1
                }} 
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login;