import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout'; // Pastiin kapitalnya bener (AdminLayout)

function JenisKendaraan() {
  const brandPink = '#f92c9f';

  // --- STATE UTAMA ---
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL FORM (CRUD) ---
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    vehicle_type: '' 
  });

  // --- STATE MODAL DETAIL ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ==========================================
  // 1. GET ALL DATA
  // ==========================================
  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get('http://localhost:3030/api/vehicle-type/index', config);
      setTypes(response.data.data || []);
    } catch (error) {
      console.error("Gagal narik data jenis kendaraan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // ==========================================
  // 2. GET 1 DATA (Detail)
  // ==========================================
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setIsDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3030/api/vehicle-type/find/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedType(response.data.data);
    } catch (error) {
      alert("Gagal mengambil detail jenis kendaraan!");
      setShowDetailModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedType(null);
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
        vehicle_type: formData.vehicle_type
      };

      if (isEdit) {
        await axios.put(`http://localhost:3030/api/vehicle-type/update/${editId}`, payload, config);
        alert('Data Jenis Kendaraan berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3030/api/vehicle-type/create', payload, config);
        alert('Jenis Kendaraan baru berhasil ditambahkan!');
      }

      handleCloseModal();
      fetchTypes();
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenModal = (type = null) => {
    if (type) {
      setIsEdit(true);
      setEditId(type.id_type); 
      setFormData({
        vehicle_type: type.vehicle_type || ''
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({ vehicle_type: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ==========================================
  // 4. DELETE
  // ==========================================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin mau hapus jenis kendaraan ${name}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3030/api/vehicle-type/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTypes(); 
    } catch (error) {
      alert('Gagal menghapus data!');
    }
  };

  return (
    <AdminLayout>
      <Container fluid className="px-4 py-3">
        <h4 className="fw-bold mb-4">Vehicle Type</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          <Table responsive hover className="align-middle border-bottom mb-4">
            <thead>
              <tr style={{ fontSize: '0.9rem', borderBottom: '1px solid #dee2e6' }}>
                <th className="border-0 py-3 align-middle">ID</th>
                {/* Ganti Nama Lengkap jadi Type Kendaraan, Hapus Username */}
                <th className="border-0 py-3 align-middle">Type Kendaraan</th>
                
                {/* Tombol Add Mepet Kanan */}
                <th className="border-0 py-2 text-end align-middle">
                  <button 
                    onClick={() => handleOpenModal()} 
                    className="btn btn-sm text-white fw-bold px-3 py-2 rounded-3" 
                    style={{ backgroundColor: brandPink }}
                  >
                    + Add Type
                  </button>
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="3" className="text-center py-4 text-muted">Memuat data...</td></tr>
              ) : types.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-4 text-muted">Belum ada data jenis kendaraan.</td></tr>
              ) : (
                types.map((t, index) => {
                  const typeId = t.id_type || index;
                  return (
                    <tr key={typeId}>
                      <td className="text-muted">#{typeId}</td>
                      <td className="fw-bold text-uppercase">{t.vehicle_type}</td>
                      
                      {/* Ikon Aksi Mepet Kanan biar sejajar sama tombol pink */}
                      <td className="text-end">
                        <Button onClick={() => handleOpenDetail(typeId)} variant="link" className="p-0 me-3 text-info text-decoration-none">👁️</Button>
                        <Button onClick={() => handleOpenModal(t)} variant="link" className="p-0 me-3 text-primary text-decoration-none">📝</Button>
                        <Button onClick={() => handleDelete(typeId, t.vehicle_type)} variant="link" className="p-0 text-danger text-decoration-none">🗑️</Button>
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
            <Modal.Title className="fw-bold fs-5">Detail Tipe Kendaraan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isDetailLoading ? (
              <p className="text-center my-3">Loading...</p>
            ) : selectedType && (
              <ListGroup variant="flush" style={{ fontSize: '0.9rem' }}>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small fw-bold">ID TIPE</div>
                  <div className="fw-bold">#{selectedType.id_type}</div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small fw-bold">NAMA TIPE KENDARAAN</div>
                  <div className="fw-bold fs-6 text-uppercase">{selectedType.vehicle_type}</div>
                </ListGroup.Item>
              </ListGroup>
            )}
            <div className="mt-4 text-end">
              <Button onClick={handleCloseDetail} className="fw-bold border-0 px-4 rounded-3 text-white" style={{ backgroundColor: brandPink }}>Tutup</Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* MODAL FORM */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold fs-5">{isEdit ? 'Edit Tipe Kendaraan' : 'Tambah Tipe Baru'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted">Nama Tipe Kendaraan</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Misal: Car, Bike, Truck"
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                  required className="bg-light border-0 shadow-none text-uppercase"
                />
              </Form.Group>
              <div className="text-end">
                <Button variant="light" onClick={handleCloseModal} className="me-2 fw-bold text-muted border-0">Batal</Button>
                <Button type="submit" className="fw-bold border-0 px-4 text-white" style={{ backgroundColor: brandPink }}>
                  {isEdit ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </Container>
    </AdminLayout>
  );
}

export default JenisKendaraan;