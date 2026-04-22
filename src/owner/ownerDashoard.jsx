import React from 'react';
import { Container, Row, Col, Card, Table, ProgressBar, Badge, Spinner, Form, Button } from 'react-bootstrap';
import OwnerLayout from '../layout/OwnerLayout'; 
import CalendarIcon from '../assets/sidebar/icon/owner/CalOwnIcon.svg';

// IMPORT HOOK & HELPER
import { useOwnerDashboard } from '../hooks/useOwnerDashboard';
import { formatTime, getStatusStyle } from '../utils/helpers';

function OwnerDashboard() {
  const brandPink = '#f92c9f';
  const brandGreen = '#A3E33F';

  // PANGGIL HOOK-NYA (Semua logic ditarik dari sini)
  const { 
    summary, 
    realtimeArea, 
    filteredTransactions, 
    isLoading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilter
  } = useOwnerDashboard();

  return (
    <OwnerLayout>
      <Container fluid className="px-4 py-4">
        
        {/* --- HEADER DASHBOARD --- */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1">Owner Dashboard</h4>
            <p className="text-muted small">Ringkasan performa dan pendapatan E-CariBa Parking.</p>
          </div>
          <div className="fw-bold text-muted bg-white px-3 py-2 rounded-3 shadow-sm border">
            <img src={CalendarIcon} alt="calendar" width="22" className="me-2" /> 
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* --- SUMMARY KARTU --- */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: `5px solid ${brandGreen}` }}>
              <Card.Body className="d-flex justify-content-between align-items-center p-4">
                <div>
                  <p className="text-muted fw-bold small mb-1">TOTAL PENDAPATAN (KESELURUHAN)</p>
                  <h2 className="fw-bold mb-0 text-success">
                    <span className="fs-5 text-muted fw-normal">Rp</span> {Number(summary.total_pendapatan || 0).toLocaleString('id-ID')}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: `5px solid ${brandPink}` }}>
              <Card.Body className="d-flex justify-content-between align-items-center p-4">
                <div>
                  <p className="text-muted fw-bold small mb-1">KENDARAAN SELESAI (KELUAR)</p>
                  <h2 className="fw-bold mb-0">
                    {summary.jumlah_kendaraan_keluar || 0} <span className="fs-6 text-muted fw-normal">Unit</span>
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- REAL-TIME AREA --- */}
        <h5 className="fw-bold mb-3">Status Lot Parkir (Real-time)</h5>
        <Row className="mb-4 g-3">
          {isLoading ? (
            <div className="ps-3"><Spinner animation="border" variant="secondary" size="sm"/> Memuat area...</div>
          ) : realtimeArea.length === 0 ? (
            <p className="text-muted ps-3">Belum ada data area.</p>
          ) : (
            realtimeArea.map((area, index) => {
              const percentage = area.capacity > 0 ? Math.round((area.filled / area.capacity) * 100) : 0;
              let progressVariant = percentage > 85 ? 'danger' : percentage > 50 ? 'warning' : 'success';

              return (
                <Col md={4} key={area.id_area || index}>
                  <Card className="border-0 shadow-sm rounded-4 h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-uppercase fs-5">{area.area_name}</span>
                        <Badge bg={percentage >= 100 ? 'danger' : 'success'} pill>
                          {percentage >= 100 ? 'FULL' : 'AVAILABLE'}
                        </Badge>
                      </div>
                      <ProgressBar now={percentage} variant={progressVariant} style={{ height: '8px' }} className="mb-2 rounded-pill"/>
                      <div className="d-flex justify-content-between text-muted small fw-bold">
                        <span>Terisi: {area.filled}</span>
                        <span>Kapasitas: {area.capacity}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })
          )}
        </Row>

        {/* --- TABEL DETAIL DENGAN FILTER TANGGAL --- */}
        <Card className="shadow-sm border-0 rounded-4 p-4 mt-2">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h5 className="fw-bold mb-0">Detail Transaksi Terbaru</h5>
            
            <div className="d-flex align-items-center gap-3">
              <div>
                <Form.Label className="small fw-bold text-muted mb-1">Dari Tanggal</Form.Label>
                <Form.Control 
                  type="date" 
                  size="sm"
                  className="bg-light border-0 shadow-none text-muted"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Form.Label className="small fw-bold text-muted mb-1">Sampai Tanggal</Form.Label>
                <Form.Control 
                  type="date" 
                  size="sm"
                  className="bg-light border-0 shadow-none text-muted"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {(startDate || endDate) && (
                <Button 
                  onClick={resetFilter}
                  className="fw-bold px-3 py-1 rounded-pill border-0 text-white mt-4"
                 
                  style={{ 
                    backgroundColor: brandPink, 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.5px',
                    transition: '0.2s' 
                  }}
                
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                 Reset Filter
                </Button>
              )}
            </div>
          </div>

          <Table responsive hover className="align-middle border-bottom mb-0">
            <thead>
              <tr style={{ fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}>
                <th className="border-0 py-3">ID</th>
                <th className="border-0 py-3">Plat Nomor</th>
                <th className="border-0 py-3">Lot Area</th>
                <th className="border-0 py-3">Waktu Transaksi</th>
                <th className="border-0 py-3">Operator</th>
                <th className="border-0 py-3 text-end">Total Biaya</th>
                <th className="border-0 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Memuat data transaksi...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-danger fw-bold">
                    {startDate || endDate ? "Tidak ada transaksi di rentang tanggal tersebut." : "Belum ada transaksi."}
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 10).map((trx, index) => {
                  const style = getStatusStyle(trx.status);
                  return (
                    <tr key={trx.id_transaction || index}>
                      <td className="text-muted">#{trx.id_transaction}</td>
                      <td className="fw-bold text-uppercase">{trx.Vehicle?.plate_number || '-'}</td>
                      <td>{trx.ParkArea?.area_name || '-'}</td>
                      
                      <td className="text-muted small">
                        <span className="fw-bold text-success">In:</span> {formatTime(trx.check_in)} <br/> 
                        <span className="fw-bold text-danger">Out:</span> {trx.check_out ? formatTime(trx.check_out) : '-'}
                      </td>

                      <td className="text-muted text-capitalize">{trx.User?.full_name || '-'}</td>
                      <td className="fw-bold text-success text-end">Rp {Number(trx.total || 0).toLocaleString('id-ID')}</td>
                      <td className="text-center">
                        <span className="px-3 py-1 rounded-pill fw-bold text-capitalize" style={{ fontSize: '0.75rem', backgroundColor: style.bg, color: style.text }}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
          
          {!isLoading && filteredTransactions.length > 0 && (
             <div className="text-end mt-3 text-muted small">
               Menampilkan {Math.min(10, filteredTransactions.length)} dari {filteredTransactions.length} transaksi.
             </div>
          )}

        </Card>

      </Container>
    </OwnerLayout>
  );
}

export default OwnerDashboard;