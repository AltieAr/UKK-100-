import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';


import AdminLayout from '../layout/AdminLayout'; 

function Petugas() {
  const brandPink = '#f92c9f';

  // --- STATE UTAMA ---
  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL FORM (CRUD) ---
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    NPWP: '', full_name: '', username: '', password: '', email: '', phone_number: '', role: 'operator'
  });

  // --- STATE MODAL DETAIL (READ-ONLY) ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ==========================================
  // 1. GET ALL DATA (Tabel Utama)
  // ==========================================
  const fetchOperators = async () => {
    try {
      const token = localStorage.getItem('token');
      // Pake route /user/index lu
      const response = await axios.get('http://localhost:3030/api/user/index', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const dataPetugas = response.data.data.filter(user => user.role === 'operator');
      setOperators(dataPetugas);
    } catch (error) {
      console.error("Gagal narik data petugas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  // ==========================================
  // 2. GET 1 DATA (Modal Detail)
  // ==========================================
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setIsDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Pake route /user/find/{id} lu
      const response = await axios.get(`http://localhost:3030/api/user/find/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedPetugas(response.data.data);
    } catch (error) {
      alert("Gagal mengambil detail petugas!");
      setShowDetailModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPetugas(null);
  };

  // ==========================================
  // 3. CREATE & UPDATE (Modal Form)
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const dataToSubmit = { ...formData };

      if (isEdit) {
        // Hapus role biar ga ditolak backend pas update
        delete dataToSubmit.role;
        // Kalo password dikosongin, hapus juga biar ga keupdate jadi string kosong
        if (!dataToSubmit.password) {
          delete dataToSubmit.password;
        }

        // Pake route /user/update/{editId} lu
        await axios.put(`http://localhost:3030/api/user/update/${editId}`, dataToSubmit, config);
        alert('Data petugas berhasil diupdate!');
      } else {
        // Pake route /user/create lu
        await axios.post('http://localhost:3030/api/user/create', dataToSubmit, config);
        alert('Petugas baru berhasil ditambahkan!');
      }

      handleCloseModal();
      fetchOperators();
    } catch (error) {
      alert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenModal = (petugas = null) => {
    if (petugas) {
      setIsEdit(true);
      setEditId(petugas.id_user);
      setFormData({
        NPWP: petugas.NPWP || '',
        full_name: petugas.full_name || '',
        username: petugas.username || '',
        password: '', // Selalu kosongin pas mau ngedit
        email: petugas.email || '',
        phone_number: petugas.phone_number || '',
        role: petugas.role || 'operator'
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({ NPWP: '', full_name: '', username: '', password: '', email: '', phone_number: '', role: 'operator' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ==========================================
  // 4. DELETE
  // ==========================================
  const handleDelete = async (id, nama) => {
    const isConfirm = window.confirm(`Yakin mau hapus petugas bernama ${nama}?`);
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem('token');
      // Asumsi route delete lu pake /user/delete/{id}
      await axios.delete(`http://localhost:3030/api/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOperators(); 
    } catch (error) {
      alert('Gagal menghapus data: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <AdminLayout>
      <Container fluid className="px-4 py-3">
        <h4 className="fw-bold mb-4">Operator</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          

          <Table responsive hover className="align-middle border-bottom mb-4">
            <thead>
              <tr style={{ fontSize: '0.9rem', borderBottom: '1px solid #dee2e6' }}>
                <th className="border-0 py-3 align-middle">ID</th>
                <th className="border-0 py-3 align-middle">Nama Lengkap</th>
                <th className="border-0 py-3 align-middle">Username</th>
                
       
                <th className="border-0 py-2 text-end align-middle">
                    <button 
                      onClick={() => handleOpenModal()} // <-- PANGGIL FUNGSI INI
                      className="btn btn-sm text-white fw-bold px-3 py-2 rounded-3" 
                      style={{ backgroundColor: '#f92c9f' }}
                    >
                      + Add Petugas
                    </button>
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Memuat data petugas...</td></tr>
              ) : operators.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data petugas.</td></tr>
              ) : (
                operators.map((op, index) => (
                  <tr key={op.id_user || index}>
                    <td className="text-muted">#{op.id_user}</td>
                    <td className="fw-bold">{op.full_name}</td>
                    <td>{op.username}</td>
                    <td className="text-end">
                      <Button onClick={() => handleOpenDetail(op.id_user)} variant="link" className="p-0 me-3 text-info text-decoration-none" title="Lihat Detail">
                        👁️
                      </Button>
                      <Button onClick={() => handleOpenModal(op)} variant="link" className="p-0 me-3 text-primary text-decoration-none" title="Edit">
                        📝
                      </Button>
                      <Button onClick={() => handleDelete(op.id_user, op.full_name)} variant="link" className="p-0 text-danger text-decoration-none" title="Delete">
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        {/* =========================================
            MODAL DETAIL (MANGGIL API /user/find/{id})
            ========================================= */}
        <Modal show={showDetailModal} onHide={handleCloseDetail} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Detail Data Petugas</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2">
            {isDetailLoading ? (
              <p className="text-center text-muted my-4">Menarik data dari server...</p>
            ) : selectedPetugas ? (
              <ListGroup variant="flush" style={{ fontSize: '0.9rem' }}>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">NAMA LENGKAP</div>
                    <div className="fw-bold fs-6">{selectedPetugas.full_name}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">USERNAME</div>
                    <div>{selectedPetugas.username}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">NPWP</div>
                    <div className="text-primary fw-bold">{selectedPetugas.NPWP}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">EMAIL</div>
                    <div>{selectedPetugas.email}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">NOMOR HP</div>
                    <div>{selectedPetugas.phone_number}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0">
                  <div className="ms-2 me-auto">
                    <div className="text-muted small fw-bold">ROLE</div>
                    <div><Badge bg="success" className="text-uppercase">{selectedPetugas.role}</Badge></div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <p className="text-center text-danger my-4">Data tidak ditemukan.</p>
            )}
            <div className="mt-4 text-end">
              <Button onClick={handleCloseDetail} className="fw-bold border-0 px-4 rounded-3" style={{ backgroundColor: brandPink }}>
                Tutup
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* =========================================
            MODAL FORM (CREATE / UPDATE)
            ========================================= */}
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold fs-5">
              {isEdit ? 'Edit Data Operator' : 'Tambah Operator Baru'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Row>
                {/* KOLOM KIRI */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Nama Lengkap</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      required className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">
                      Password {isEdit && <span className="text-danger fw-normal">(Kosongkan jika tdk diubah)</span>}
                    </Form.Label>
                    <Form.Control 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!isEdit} 
                      className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                </Col>

                {/* KOLOM KANAN */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">NPWP</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.NPWP}
                      onChange={(e) => setFormData({...formData, NPWP: e.target.value})}
                      required className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Nomor HP</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      required className="bg-light border-0 shadow-none"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4 text-end">
                <Button variant="light" onClick={handleCloseModal} className="me-2 fw-bold text-muted">Batal</Button>
                <Button type="submit" className="fw-bold border-0 px-4 text-white" style={{ backgroundColor: brandPink }}>
                  {isEdit ? 'Simpan Perubahan' : 'Tambah Operator'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </Container>
    </AdminLayout>
  );
}

export default Petugas;