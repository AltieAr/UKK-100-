import React, { useState, useEffect } from 'react';
import { Container, Card, Table, InputGroup, Form, Badge, Spinner, Row, Col, Button } from 'react-bootstrap';
import OwnerLayout from '../layout/OwnerLayout'; 

import { useOwnerHistory } from '../hooks/useOwnerHistory';
import { formatTime } from '../utils/helpers';

function OwnerHistory() {
  const brandPink = '#f92c9f';

  const { logs, isLoading } = useOwnerHistory();
  
  // --- STATE FILTER & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const getRoleBadge = (role) => {
    const r = String(role).toLowerCase();
    if (r === 'owner') return 'dark';     
    if (r === 'admin') return 'success';  
    if (r === 'operator') return 'info';  
    return 'secondary';
  };

  // Balikin ke page 1 tiap kali filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  // --- LOGIC FILTER (SEARCH + TANGGAL) ---
  const filteredLogs = logs.filter(log => {
    // 1. Filter Text (Search)
    const searchLower = searchTerm.toLowerCase();
    const userName = log.User?.full_name?.toLowerCase() || '';
    const activityInfo = log.activity?.toLowerCase() || '';
    const isMatchSearch = userName.includes(searchLower) || activityInfo.includes(searchLower);

    // 2. Filter Tanggal
    let isMatchDate = true;
    if (log.activity_time) {
      // Ambil tanggal doang (YYYY-MM-DD) dari "2026-04-20T02:17:31.109Z"
      const logDate = log.activity_time.substring(0, 10); 
      
      if (startDate && logDate < startDate) {
        isMatchDate = false;
      }
      if (endDate && logDate > endDate) {
        isMatchDate = false;
      }
    }

    return isMatchSearch && isMatchDate;
  });

  // --- LOGIC PAGINATION (3 Kotak) ---
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

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

  // --- FUNGSI RESET FILTER ---
  const resetFilter = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <OwnerLayout>
      <Container fluid className="px-4 py-4">
        
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Activity Logs (Riwayat Sistem)</h4>
          <p className="text-muted small">Pantau aktivitas berdasarkan rentang tanggal tertentu.</p>
        </div>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          
          {/* =========================================
              BARIS FILTER: SEARCH & DATE PICKER
              ========================================= */}
          <Row className="mb-4 align-items-end g-3">
            <Col md={4}>
              <Form.Label className="small fw-bold text-muted mb-1">Cari Data</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0 text-muted">🔍</InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Nama atau aktivitas..." 
                  className="bg-light border-0 shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Label className="small fw-bold text-muted mb-1">Dari Tanggal</Form.Label>
              <Form.Control 
                type="date" 
                className="bg-light border-0 shadow-none text-muted"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>
            
            <Col md={3}>
              <Form.Label className="small fw-bold text-muted mb-1">Sampai Tanggal</Form.Label>
              <Form.Control 
                type="date" 
                className="bg-light border-0 shadow-none text-muted"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>

            <Col md={2} className="text-md-end text-start">
              {(startDate || endDate || searchTerm) && (
                <Button 
                  variant="link" 
                  className="text-danger text-decoration-none small fw-bold p-0 pb-2"
                  onClick={resetFilter}
                >
                  Reset Filter
                </Button>
              )}
            </Col>
          </Row>

          {/* =========================================
              TABEL LOG AKTIVITAS
              ========================================= */}
          <Table responsive hover className="align-middle border-bottom mb-0">
            <thead>
              <tr style={{ fontSize: '0.9rem', borderBottom: '1px solid #dee2e6' }}>
                <th className="border-0 py-3">ID Log</th>
                <th className="border-0 py-3">Waktu Kejadian</th>
                <th className="border-0 py-3">Pengguna</th>
                <th className="border-0 py-3">Role</th>
                <th className="border-0 py-3 w-50">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <Spinner animation="border" variant="secondary" size="sm" className="me-2" /> 
                    Memuat data log aktivitas...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-danger fw-bold">
                    Tidak ditemukan data pada rentang waktu / pencarian tersebut.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr key={log.id_log || index}>
                    <td className="text-muted">#{log.id_log}</td>
                    <td className="fw-bold text-muted small">{formatTime(log.activity_time)}</td>
                    <td className="fw-bold text-capitalize">{log.User?.full_name || 'System / Unknown'}</td>
                    <td>
                      <Badge bg={getRoleBadge(log.User?.role)} className="px-3 py-2 rounded-pill text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {log.User?.role || '-'}
                      </Badge>
                    </td>
                    <td className="text-muted">{log.activity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          
          {/* =========================================
              PAGINATION CUSTOM 3 KOTAK
              ========================================= */}
          {!isLoading && filteredLogs.length > 0 && (
            <div className="d-flex flex-column align-items-center mt-4">
              
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

              <span className="text-muted small">
                Menampilkan {indexOfFirstLog + 1} - {Math.min(indexOfLastLog, filteredLogs.length)} dari {filteredLogs.length} data
              </span>

            </div>
          )}

        </Card>
      </Container>
    </OwnerLayout>
  );
}

export default OwnerHistory;