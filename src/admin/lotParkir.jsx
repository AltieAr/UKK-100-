import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal, Badge, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout'; 

function LotParkir() {
  const brandPink = '#f92c9f';

  // --- STATE UTAMA ---
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL FORM (CRUD) ---
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    area_name: '',
    capacity: ''
  });

  // --- STATE MODAL DETAIL ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ==========================================
  // 1. GET ALL DATA
  // ==========================================
  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3030/api/area/index', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAreas(response.data.data || []);
    } catch (error) {
      console.error("Gagal narik data area:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // ==========================================
  // 2. GET 1 DATA (Detail)
  // ==========================================
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setIsDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3030/api/area/find/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedArea(response.data.data);
    } catch (error) {
      alert("Gagal mengambil detail area!");
      setShowDetailModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedArea(null);
  };

  // ==========================================
  // 3. CREATE & UPDATE
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        area_name: formData.area_name,
        capacity: parseInt(formData.capacity)
      };

      if (isEdit) {
        await axios.put(`http://localhost:3030/api/area/update/${editId}`, payload, config);
        alert('Lot Parkir berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3030/api/area/create', payload, config);
        alert('Lot Parkir baru berhasil ditambahkan!');
      }

      handleCloseModal();
      fetchAreas();
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenModal = (area = null) => {
    if (area) {
      setIsEdit(true);
      setEditId(area.id_area);
      setFormData({
        area_name: area.area_name || '',
        capacity: area.capacity || ''
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({ area_name: '', capacity: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ==========================================
  // 4. DELETE
  // ==========================================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin mau hapus lot ${name}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3030/api/area/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAreas(); 
    } catch (error) {
      alert('Gagal menghapus data!');
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'available') return { bg: '#e6f4ea', text: '#34a853', label: 'Available' };
    return { bg: '#fce8e6', text: '#ea4335', label: 'Unavailable' };
  };

  return (
    <AdminLayout>
      <Container fluid className="px-4 py-3">
        <h4 className="fw-bold mb-4">Parking Lot</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          <Table responsive hover className="align-middle border-bottom mb-4">
            <thead>
              <tr style={{ fontSize: '0.9rem', borderBottom: '1px solid #dee2e6' }}>
                <th className="border-0 py-3 align-middle">ID</th>
                <th className="border-0 py-3 align-middle">Nama Lot</th>
                
                {/* INI YANG BIKIN SEJAJAR: Tambahin text-center */}
                <th className="border-0 py-3 text-center align-middle">Status</th>
                
                {/* Tombol Add mepet kanan (text-end) */}
                <th className="border-0 py-2 text-end align-middle">
                  <button 
                    onClick={() => handleOpenModal()} 
                    className="btn btn-sm text-white fw-bold px-3 py-2 rounded-3" 
                    style={{ backgroundColor: brandPink }}
                  >
                    + Add Lot
                  </button>
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Memuat data...</td></tr>
              ) : areas.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data lot.</td></tr>
              ) : (
                areas.map((area) => {
                  const style = getStatusBadge(area.status || 'Available');
                  return (
                    <tr key={area.id_area}>
                      <td className="text-muted">#{area.id_area}</td>
                      <td className="fw-bold">{area.area_name}</td>
                      
                      {/* Badge Status di tengah (text-center) */}
                      <td className="text-center">
                        <span className="px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '0.75rem', backgroundColor: style.bg, color: style.text }}>
                          {style.label}
                        </span>
                      </td>
                      
                      {/* Ikon Aksi mepet kanan (text-end) biar sejajar sama tombol Add */}
                      <td className="text-end">
                        <Button onClick={() => handleOpenDetail(area.id_area)} variant="link" className="p-0 me-3 text-info text-decoration-none">👁️</Button>
                        <Button onClick={() => handleOpenModal(area)} variant="link" className="p-0 me-3 text-primary text-decoration-none">📝</Button>
                        <Button onClick={() => handleDelete(area.id_area, area.area_name)} variant="link" className="p-0 text-danger text-decoration-none">🗑️</Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </Card>

        {/* MODAL DETAIL */}
        <Modal show={showDetailModal} onHide={handleCloseDetail} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Detail Lot Parkir</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isDetailLoading ? (
              <p className="text-center my-3">Loading...</p>
            ) : selectedArea && (
              <ListGroup variant="flush" style={{ fontSize: '0.9rem' }}>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small">ID AREA</div>
                  <div className="fw-bold">#{selectedArea.id_area}</div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small">NAMA LOT</div>
                  <div className="fw-bold fs-6">{selectedArea.area_name}</div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small">KAPASITAS TOTAL</div>
                  <div className="fw-bold text-primary">{selectedArea.capacity} Unit</div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small">TERISI SAAT INI</div>
                  <div className="fw-bold text-danger">{selectedArea.filled || 0} Unit</div>
                </ListGroup.Item>
              </ListGroup>
            )}
            <div className="mt-4 text-end">
              <Button onClick={handleCloseDetail} className="fw-bold border-0 px-4 rounded-3" style={{ backgroundColor: brandPink }}>Tutup</Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* MODAL FORM */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold fs-5">{isEdit ? 'Edit Lot' : 'Tambah Lot Baru'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Nama Lot (Area)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.area_name}
                  onChange={(e) => setFormData({...formData, area_name: e.target.value})}
                  required className="bg-light border-0 shadow-none"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted">Kapasitas</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required className="bg-light border-0 shadow-none"
                />
              </Form.Group>
              <div className="text-end">
                <Button variant="light" onClick={handleCloseModal} className="me-2 fw-bold text-muted border-0">Batal</Button>
                <Button type="submit" className="fw-bold border-0 px-4 text-white" style={{ backgroundColor: brandPink }}>
                  {isEdit ? 'Simpan Perubahan' : 'Tambah Lot'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </Container>
    </AdminLayout>
  );
}

export default LotParkir;