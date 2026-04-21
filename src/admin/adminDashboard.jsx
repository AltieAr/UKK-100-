import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar, Spinner } from 'react-bootstrap';
import AdminLayout from '../layout/AdminLayout';

// Import Hook & Helper
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { formatTime, getStatusStyle } from '../utils/helpers';

function DashboardAdmin() {
  const brandGreen = '#A3E33F'; 
  const brandPink = '#f92c9f'; 

  const { transactions, stats, areas, isLoading } = useAdminDashboard();

  // --- LOGIC SEARCH & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Kita set 7 baris aja biar pas sama tinggi kolom kanan

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Filter data berdasarkan search
  const filteredTrx = transactions.filter(trx => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trx.id_transaction?.toString().includes(searchLower) ||
      trx.Vehicle?.plate_number?.toLowerCase().includes(searchLower)
    );
  });

  // Hitung slice data per halaman
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrx = filteredTrx.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrx.length / itemsPerPage);

  // --- LOGIC 3 KOTAK PAGINATION ---
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(3, totalPages);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  let pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <AdminLayout>
      <Container fluid className="px-4 py-4">
        
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Admin Dashboard</h4>
        </div>

        {/* --- KARTU STATISTIK ATAS --- */}
        <Row className="mb-4 g-3">
          <Col md={3}><Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100"><p className="fw-bold mb-1 small text-muted">Total area parkir</p><h2 className="fw-bold mb-0">{stats.totalArea}</h2></Card></Col>
          <Col md={3}><Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100"><p className="fw-bold mb-1 small text-muted">Total Lot Parkir</p><h2 className="fw-bold mb-0">{stats.totalLot}</h2></Card></Col>
          <Col md={3}><Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100"><p className="fw-bold mb-1 small text-muted">Total Jenis Kendaraan</p><h2 className="fw-bold mb-0">{stats.totalJenis}</h2></Card></Col>
          <Col md={3}><Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100"><p className="fw-bold mb-1 small text-muted">Total Petugas</p><h2 className="fw-bold mb-0">{stats.totalPetugas}</h2></Card></Col>
        </Row>

        <Row className="g-4">
          {/* KOLOM KIRI: TABEL TRANSAKSI */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-4 p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center w-100">
                  <span className="small me-2">Show</span>
                  <select className="form-select form-select-sm w-auto me-2 border-0 bg-light shadow-none"><option>7</option></select>
                  <span className="small me-3">entries</span>
                  <input 
                    type="search" 
                    placeholder="Search plate..." 
                    className="form-control form-control-sm w-50 border-0 bg-light shadow-none ms-auto" 
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <div className="flex-grow-1">
                <Table responsive hover className="align-middle border-bottom mb-0">
                  <thead>
                    <tr style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                      <th className="border-0 py-3">Tracking ID</th>
                      <th className="border-0 py-3">Plate Number</th>
                      <th className="border-0 py-3">Date (In / Out)</th>
                      <th className="border-0 py-3">Amount</th>
                      <th className="border-0 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.85rem' }}>
                    {isLoading ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted"><Spinner animation="border" size="sm"/></td></tr>
                    ) : currentTrx.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Data tidak ditemukan.</td></tr>
                    ) : (
                      currentTrx.map((trx, index) => {
                        const style = getStatusStyle(trx.status);
                        return (
                          <tr key={trx.id_transaction || index}>
                            <td className="text-muted">#{trx.id_transaction}</td>
                            <td className="fw-bold text-uppercase">{trx.Vehicle?.plate_number || '-'}</td>
                            <td className="text-muted small">
                              <span className="text-success">In:</span> {formatTime(trx.check_in)} <br/> 
                              <span className="text-danger">Out:</span> {trx.check_out ? formatTime(trx.check_out) : '-'}
                            </td>
                            <td className="fw-bold">Rp {Number(trx.total || 0).toLocaleString('id-ID')}</td>
                            <td className="text-center">
                              <span className="px-3 py-1 rounded-pill" style={{ fontSize: '0.7rem', backgroundColor: style.bg, color: style.text, fontWeight: '600' }}>
                                {trx.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
              </div>

              {/* --- CUSTOM PAGINATION ALA FIGMA --- */}
              {!isLoading && filteredTrx.length > 0 && (
                <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                  <span 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#ced4da' : '#6c757d', fontWeight: '500', marginRight: '10px', userSelect: 'none', fontSize: '0.9rem' }}
                  >
                    Previous
                  </span>

                  {pageNumbers.map(number => (
                    <div 
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: currentPage === number ? brandPink : '#e9ecef',
                        color: currentPage === number ? 'white' : '#6c757d',
                        fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', transition: '0.2s', fontSize: '0.85rem'
                      }}
                    >
                      {number}
                    </div>
                  ))}

                  <span 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#ced4da' : '#6c757d', fontWeight: '500', marginLeft: '10px', userSelect: 'none', fontSize: '0.9rem' }}
                  >
                    Next
                  </span>
                </div>
              )}
            </Card>
          </Col>

          {/* KOLOM KANAN: PROGRESS BAR */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-4">Parkiran</h5>
              {areas.map((area, index) => {
                const percentage = area.capacity > 0 ? Math.round((area.filled / area.capacity) * 100) : 0;
                const barColor = percentage > 85 ? brandPink : brandGreen;
                return (
                  <div className="mb-4" key={area.id_area || index}>
                    <div className="d-flex justify-content-between align-items-end mb-1">
                      <span className="fw-bold text-capitalize small">Lot {area.area_name} Terisi</span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{area.filled}/{area.capacity}</span>
                    </div>
                    <ProgressBar now={percentage} style={{ height: '12px', backgroundColor: '#e9ecef' }} className="rounded-pill">
                      <div style={{ width: `${percentage}%`, backgroundColor: barColor, borderRadius: '50rem' }}></div>
                    </ProgressBar>
                  </div>
                )
              })}
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
}

export default DashboardAdmin;