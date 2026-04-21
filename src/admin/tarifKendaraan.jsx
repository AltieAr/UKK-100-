import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import AdminLayout from '../layout/adminLayout'; 

function TarifKendaraan() {
  const brandPink = '#f92c9f';

  // --- STATE UTAMA ---
  const [fees, setFees] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL FORM (CRUD) ---
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    id_type: '', 
    fees_per_hour: ''
  });

  // --- STATE MODAL DETAIL ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ==========================================
  // 1. FETCH SEMUA DATA
  // ==========================================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Tembak API Fee Index (Buat isi Tabel)
      const resFee = await axios.get('http://localhost:3030/api/fee/index', config);
      setFees(resFee.data.data || []);

      // Tembak API Vehicle Type Index (Buat pilihan di Dropdown Form Modal)
      const resType = await axios.get('http://localhost:3030/api/vehicle-type/index', config);
      const types = resType.data.data || [];
      setVehicleTypes(types);

      if (types.length > 0 && !formData.id_type) {
        setFormData(prev => ({ ...prev, id_type: types[0].id_type }));
      }

    } catch (error) {
      console.error("Gagal narik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 2. GET 1 DATA (/fee/find/{id})
  // ==========================================
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setIsDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3030/api/fee/find/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedFee(response.data.data);
    } catch (error) {
      alert("Gagal mengambil detail!");
      setShowDetailModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedFee(null);
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
        id_type: parseInt(formData.id_type),
        fees_per_hour: parseFloat(formData.fees_per_hour)
      };

      if (isEdit) {
        await axios.put(`http://localhost:3030/api/fee/update/${editId}`, payload, config);
        alert('Data Tarif berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3030/api/fee/create', payload, config);
        alert('Tarif baru berhasil ditambahkan!');
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenModal = (fee = null) => {
    if (fee) {
      setIsEdit(true);
      // PAKE id_fees SESUAI JSON LU
      setEditId(fee.id_fees);
      setFormData({
        id_type: fee.id_type,
        fees_per_hour: fee.fees_per_hour
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({ 
        id_type: vehicleTypes.length > 0 ? vehicleTypes[0].id_type : '', 
        fees_per_hour: '' 
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ==========================================
  // 4. DELETE
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin mau hapus tarif ini?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3030/api/fee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
    } catch (error) {
      alert('Gagal menghapus data!');
    }
  };

  return (
    <AdminLayout>
      <Container fluid className="px-4 py-3">
        <h4 className="fw-bold mb-4 text-uppercase">Fees</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4">
         

          <Table responsive hover className="align-middle border-bottom mb-4">
            <thead>
              <tr style={{ fontSize: '0.9rem', borderBottom: '1px solid #dee2e6' }}>
                <th className="border-0 py-3 align-middle">ID</th>
                <th className="border-0 py-3 align-middle">Nama Lot</th>
                <th className="border-0 py-3 align-middle">Tarif / jam</th>
                

                <th className="border-0 py-2 text-end align-middle">
                  <button 
                    onClick={() => handleOpenModal()} // <--- TAMBAHIN INI CUY!
                    className="btn btn-sm text-white fw-bold px-3 py-2 rounded-3" 
                    style={{ backgroundColor: '#f92c9f' }}
                  >
                    + Add Fee
                  </button>
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Memuat data tarif...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data tarif.</td></tr>
              ) : (
                fees.map((f, i) => (
                  // PAKE id_fees SESUAI JSON LU
                  <tr key={f.id_fees || i}>
                    <td className="text-muted">#{f.id_fees}</td>
                    
                    {/* INI KUNCI NYA: Manggil dari relasi fee_vehicle_type.vehicle_type */}
                    <td className="fw-bold text-uppercase">
                      {f.fee_vehicle_type ? f.fee_vehicle_type.vehicle_type : 'N/A'}
                    </td>
                    
                    <td className="fw-bold text-success">Rp {Number(f.fees_per_hour).toLocaleString('id-ID')}</td>
                    <td className="text-end">
                      <Button onClick={() => handleOpenDetail(f.id_fees)} variant="link" className="p-0 me-3 text-info text-decoration-none">👁️</Button>
                      <Button onClick={() => handleOpenModal(f)} variant="link" className="p-0 me-3 text-primary text-decoration-none">📝</Button>
                      <Button onClick={() => handleDelete(f.id_fees)} variant="link" className="p-0 text-danger text-decoration-none">🗑️</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        {/* MODAL DETAIL */}
        <Modal show={showDetailModal} onHide={handleCloseDetail} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Detail Tarif</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isDetailLoading ? (
              <p className="text-center my-3">Loading...</p>
            ) : selectedFee && (
              <ListGroup variant="flush" style={{ fontSize: '0.9rem' }}>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small fw-bold">ID FEE</div>
                  <div className="fw-bold">#{selectedFee.id_fees}</div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small fw-bold">TIPE KENDARAAN</div>
                  <div className="fw-bold fs-6 text-uppercase">
                    {selectedFee.fee_vehicle_type ? selectedFee.fee_vehicle_type.vehicle_type : 'N/A'}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="text-muted small fw-bold">TARIF / JAM</div>
                  <div className="fw-bold text-success fs-5">Rp {Number(selectedFee.fees_per_hour).toLocaleString('id-ID')}</div>
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
            <Modal.Title className="fw-bold fs-5">{isEdit ? 'Edit Tarif' : 'Tambah Tarif Baru'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Tipe Kendaraan</Form.Label>
                <Form.Select 
                  value={formData.id_type}
                  onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                  required className="bg-light border-0 shadow-none text-uppercase"
                >
                  {/* ASUMSI KOLOM DI TABEL VEHICLE TYPE LU NAMANYA vehicle_type JUGA */}
                  {vehicleTypes.map((type) => (
                    <option key={type.id_type} value={type.id_type}>
                      {type.vehicle_type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted">Tarif Per Jam (Rp)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.fees_per_hour}
                  onChange={(e) => setFormData({...formData, fees_per_hour: e.target.value})}
                  required className="bg-light border-0 shadow-none"
                  placeholder="Contoh: 4000"
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

export default TarifKendaraan;