import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import AdminLayout from '../layout/AdminLayout'; 

// Import Hook & Helper
import { useAdminHistory } from '../hooks/useAdminHistory';
import { formatTime, getStatusStyle } from '../utils/helpers';

function History() {
  const brandPink = '#f92c9f';

  // Panggil Hook
  const { transactions, isLoading } = useAdminHistory();

  // State Filter & Pagination
  const [searchPlat, setSearchPlat] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nampilin 10 baris per halaman

  // LOGIC FILTERING
  useEffect(() => {
    let result = transactions;

    if (searchPlat) {
      result = result.filter(item => 
        item.Vehicle?.plate_number?.toLowerCase().includes(searchPlat.toLowerCase()) ||
        item.id_transaksi?.toString().includes(searchPlat)
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter(item => 
        item.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Balikin ke page 1 tiap kali filter berubah
  }, [searchPlat, filterStatus, transactions]);

  // LOGIC PAGINATION (Sliding Window 3 Kotak)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      <Container fluid className="px-4 py-3">
        <h4 className="fw-bold mb-4">History Transaksi</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          
          {/* --- BAGIAN FILTER & SEARCH --- */}
          <Row className="mb-4 align-items-end g-3">
            <Col md={4}>
              <Form.Label className="small fw-bold text-muted mb-1">Cari Plat / ID</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0">🔍</InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Ketik plat nomor..." 
                  className="bg-light border-0 shadow-none"
                  value={searchPlat}
                  onChange={(e) => setSearchPlat(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Label className="small fw-bold text-muted mb-1">Filter Status</Form.Label>
              <Form.Select 
                className="bg-light border-0 shadow-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">Semua Status</option>
                <option value="Masuk">Masuk (Parkir)</option>
                <option value="Keluar">Keluar (Selesai)</option>
                <option value="Canceled">Canceled</option>
              </Form.Select>
            </Col>
          </Row>

          {/* --- TABEL LOG TRANSAKSI --- */}
          <Table responsive hover className="align-middle border-bottom mb-4">
            <thead>
              <tr style={{ fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}>
                <th className="border-0 py-3">Tracking ID</th>
                <th className="border-0 py-3">Plat Nomor</th>
                <th className="border-0 py-3">Waktu Masuk</th>
                <th className="border-0 py-3">Waktu Keluar</th>
                <th className="border-0 py-3">Total Biaya</th>
                <th className="border-0 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted"><Spinner animation="border" size="sm"/> Memuat data...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-danger fw-bold">Data tidak ditemukan!</td></tr>
              ) : (
                currentData.map((row, index) => {
                  const style = getStatusStyle(row.status);
                  return (
                    <tr key={row.id_transaction || index}>
                      <td className="text-muted">#{row.id_transaction}</td>
                      <td className="fw-bold text-uppercase">{row.Vehicle?.plate_number || '-'}</td>
                      <td className="text-muted">{formatTime(row.check_in)}</td>
                      <td className="text-muted">{row.check_out ? formatTime(row.check_out) : '-'}</td>
                      <td className="fw-bold">Rp {Number(row.total || 0).toLocaleString('id-ID')}</td>
                      <td className="text-center">
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

          {/* --- CUSTOM PAGINATION FIGMA --- */}
          {/* --- CUSTOM PAGINATION FIGMA --- */}
          {!isLoading && filteredData.length > 0 && (
            <div className="d-flex flex-column align-items-center mt-4">
              
              {/* Tombol Navigasi Tengah */}
              <div className="d-flex align-items-center gap-2 mb-2">
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

              {/* Teks Info Data di Bawahnya */}
              {/* <span className="text-muted small">
                Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data
              </span> */}

            </div>
          )}
        </Card>
      </Container>
    </AdminLayout>
  );
}

export default History;