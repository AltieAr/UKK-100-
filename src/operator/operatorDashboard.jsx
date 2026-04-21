import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OperatorLayout from '../layout/OperatorLayout'; 
import CalendarIcon from '../assets/sidebar/icon/operator/CalendarIcon.svg';

// 1. IMPORT HOOK DAN HELPER YANG UDAH KITA BIKIN
import { useOperatorDashboard } from '../hooks/useOperatorDashboard';
import { formatTime, getStatusStyle } from '../utils/helpers';

function OperatorDashboard() {
  const brandCyan = '#0dcaf0';
  const brandPink = '#f92c9f';
  const brandGreen = '#A3E33F';

  // 2. PANGGIL HOOK-NYA (Satu baris doang gantiin puluhan baris Axios tadi!)
  const { transactions, stats, isLoading } = useOperatorDashboard();

  return (
    <OperatorLayout>
      <Container fluid className="px-4 py-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Dashboard Operator</h4>
            <p className="text-muted small mb-0">Ringkasan aktivitas parkir hari ini.</p>
          </div>
          <div className="fw-bold text-muted bg-white px-3 py-2 rounded-3 shadow-sm border">
            <img src={CalendarIcon} alt="calendar" width="22" className="me-2" /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* --- KARTU STATISTIK --- */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: `5px solid ${brandCyan}` }}>
              <Card.Body className="p-4">
                <p className="text-muted fw-bold small mb-1">KENDARAAN PARKIR (SAAT INI)</p>
                <h3 className="fw-bold mb-0">{stats.parkedNow} <span className="fs-6 text-muted fw-normal">Unit</span></h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: `5px solid ${brandPink}` }}>
              <Card.Body className="p-4">
                <p className="text-muted fw-bold small mb-1">KENDARAAN MASUK (HARI INI)</p>
                <h3 className="fw-bold mb-0">{stats.enteredToday} <span className="fs-6 text-muted fw-normal">Unit</span></h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: `5px solid ${brandGreen}` }}>
              <Card.Body className="p-4">
                <p className="text-muted fw-bold small mb-1">PENDAPATAN (HARI INI)</p>
                <h3 className="fw-bold mb-0 text-success">
                  <span className="fs-6 text-muted fw-normal">Rp</span> {stats.revenueToday.toLocaleString('id-ID')}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- TOMBOL QUICK ACTION --- */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Link to="/operator/masuk" className="text-decoration-none">
              <Card className="border-0 shadow-sm rounded-4 text-center p-3 button-hover" style={{ backgroundColor: '#e6f4ea' }}>
                <Card.Body><h4 className="fw-bold mb-0" style={{ color: '#2c4004' }}>CHECK IN</h4></Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="/operator/keluar" className="text-decoration-none">
              <Card className="border-0 shadow-sm rounded-4 text-center p-3 button-hover" style={{ backgroundColor: '#fce8e6' }}>
                <Card.Body><h4 className="fw-bold mb-0" style={{ color: '#ea4335' }}>CHECK OUT</h4></Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* --- TABEL TRANSAKSI TERBARU --- */}
        <Card className="shadow-sm border-0 rounded-4 p-4">
          <h5 className="fw-bold mb-4">Transaksi Terbaru Hari Ini</h5>
          <Table responsive hover className="align-middle border-bottom mb-0">
            <thead>
              <tr style={{ fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}>
                <th className="border-0 py-3">Tracking ID</th>
                <th className="border-0 py-3">Plat Nomor</th>
                {/* 3. NAMA HEADER UDAH DIGANTI JADI WAKTU TRANSAKSI */}
                <th className="border-0 py-3">Waktu Transaksi</th>
                <th className="border-0 py-3">Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Memuat data...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada transaksi.</td></tr>
              ) : (
                transactions.slice(0, 5).map((row, index) => {
                  const style = getStatusStyle(row.status);
                  return (
                    <tr key={row.id_transaction || index}>
                      <td className="text-muted">#{row.id_transaction}</td>
                      <td className="fw-bold text-uppercase fs-6">{row.Vehicle?.plate_number || '-'}</td>
                      
                      {/* 4. INI YANG LU BINGUNG: NAMPILIN IN SAMA OUT BARENGAN */}
                      <td className="text-muted small">
                        <span className="fw-bold text-success">In:</span> {formatTime(row.check_in)} <br/>
                        <span className="fw-bold text-danger">Out:</span> {row.check_out ? formatTime(row.check_out) : '-'}
                      </td>

                      <td>
                        <span className="px-3 py-1 rounded-pill fw-bold text-capitalize" 
                              style={{ fontSize: '0.75rem', backgroundColor: style.bg, color: style.text }}>
                          {row.status || 'Process'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </Card>

      </Container>
    </OperatorLayout>
  );
}

export default OperatorDashboard;