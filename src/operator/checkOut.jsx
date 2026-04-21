import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import OperatorLayout from '../layout/OperatorLayout';

function ParkirKeluar() {
  const brandPink = '#f92c9f';
  const brandGreen = '#A3E33F';

  const [activeList, setActiveList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State Konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [durationInfo, setDurationInfo] = useState({ hours: 0, minutes: 0 });

  // State Struk
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const fetchActive = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3030/api/transaction/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveList(res.data.data || []);
    } catch (error) {
      console.error("Gagal load data aktif:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  // --- LOGIC: BUKA MODAL KONFIRMASI & HITUNG DURASI SEMENTARA ---
  const handleOpenConfirm = (item) => {
    const checkInTime = new Date(item.check_in);
    const now = new Date();
    const diffMs = now - checkInTime; // Selisih dalam milidetik

    // Konversi ke Jam dan Menit
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setDurationInfo({ hours: diffHrs, minutes: diffMins });
    setSelectedVehicle(item);
    setShowConfirm(true); // Munculin pop-up konfirmasi dulu!
  };

  // --- LOGIC: EKSEKUSI CHECKOUT BENERAN KE BACKEND ---
  const processCheckOut = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3030/api/transaction/checkout', 
        { plate_number: selectedVehicle.Vehicle.plate_number },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 1. Tutup modal konfirmasi
      setShowConfirm(false); 
      // 2. Munculin Struk Asli dari Backend
      setReceiptData(response.data.data);
      setShowReceipt(true); 
      // 3. Refresh list parkiran
      fetchActive(); 
    } catch (error) {
      alert('Gagal Checkout: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <OperatorLayout>
      <Container fluid className="px-4 py-4">
        <h4 className="fw-bold mb-4">Kendaraan Sedang Parkir</h4>
        
        <Card className="shadow-sm border-0 rounded-4 p-4">
          {isLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
          ) : activeList.length === 0 ? (
            <div className="text-center py-5 text-muted">Tidak ada kendaraan di area parkir.</div>
          ) : (
            <Table responsive hover className="align-middle border-bottom">
              <thead>
                <tr className="text-muted small" style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="border-0 py-3">Tracking ID</th>
                  <th className="border-0 py-3">Plat Nomor</th>
                  <th className="border-0 py-3">Area</th>
                  <th className="border-0 py-3">Waktu Masuk</th>
                  <th className="border-0 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activeList.map((item) => (
                  <tr key={item.id_transaction}>
                    <td className="text-muted">#{item.id_transaction}</td>
                    <td className="fw-bold text-uppercase">{item.Vehicle?.plate_number}</td>
                    <td><span className="badge bg-light text-dark border">{item.ParkArea?.area_name}</span></td>
                    <td className="small text-muted">{new Date(item.check_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</td>
                    <td className="text-center">
                      <Button 
                        size="sm" 
                        className="fw-bold rounded-3 px-3 border-0 text-white"
                        style={{ backgroundColor: brandPink }}
                        onClick={() => handleOpenConfirm(item)} // Jangan langsung tembak API, buka pop-up dulu
                      >
                        Check-Out
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>

      {/* =========================================
          MODAL 1: KONFIRMASI SEBELUM CHECKOUT
          ========================================= */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Konfirmasi Pembayaran</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4 pt-3">
          {selectedVehicle && (
            <div className="bg-light p-3 rounded-3 mb-4">
              <p className="text-muted small mb-1">Plat Nomor</p>
              <h3 className="fw-bold text-uppercase mb-3">{selectedVehicle.Vehicle?.plate_number}</h3>
              
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Waktu Masuk:</span>
                <span className="fw-bold">{new Date(selectedVehicle.check_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Lama Parkir (Estimasi):</span>
                <span className="fw-bold text-danger">{durationInfo.hours} Jam {durationInfo.minutes} Menit</span>
              </div>
            </div>
          )}
          <p className="small text-muted text-center mb-4">Apakah pelanggan sudah siap melakukan pembayaran? Harga pasti akan dihitung oleh sistem setelah konfirmasi.</p>
          
          <div className="d-flex gap-2">
            <Button variant="light" className="w-50 fw-bold border" onClick={() => setShowConfirm(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button className="w-50 fw-bold border-0 text-dark" style={{ backgroundColor: brandGreen }} onClick={processCheckOut} disabled={isProcessing}>
              {isProcessing ? <Spinner size="sm" /> : 'Ya, Bayar & Checkout'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* =========================================
          MODAL 2: STRUK (MUNCUL KALO SUKSES)
          ========================================= */}
      <Modal show={showReceipt} onHide={() => setShowReceipt(false)} centered>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div className="fs-1 mb-2">✅</div>
            <h5 className="fw-bold">PEMBAYARAN BERHASIL</h5>
            <p className="text-muted small">Transaksi #{receiptData?.id_transaction}</p>
          </div>

          {receiptData && (
            <div className="small bg-light p-3 rounded-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Plat Nomor:</span><span className="fw-bold text-uppercase">{receiptData.plate_number || selectedVehicle?.Vehicle?.plate_number}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Durasi:</span><span className="fw-bold">{receiptData.duration} Jam</span>
              </div>
              <hr style={{ borderStyle: 'dashed' }} />
              <div className="d-flex justify-content-between fs-5 fw-bold text-success mt-2">
                <span>TOTAL:</span><span>Rp {Number(receiptData.total).toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}
          <Button variant="dark" className="w-100 mt-4 fw-bold rounded-3 py-2" onClick={() => setShowReceipt(false)}>TUTUP STRUK</Button>
        </Modal.Body>
      </Modal>

    </OperatorLayout>
  );
}

export default ParkirKeluar;  