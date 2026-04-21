import React, { useState } from 'react';
import { Container, Card, Table, InputGroup, Form, Badge, Spinner } from 'react-bootstrap';
import OwnerLayout from '../layout/OwnerLayout'; 

import { useOwnerHistory } from '../hooks/useOwnerHistory';
import { formatTime } from '../utils/helpers';

function OwnerHistory() {
  const brandPink = '#f92c9f'; // Warna pink dari desain lu buat pagination aktif

  const { logs, isLoading } = useOwnerHistory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const getRoleBadge = (role) => {
    const r = String(role).toLowerCase();
    if (r === 'owner') return 'dark';     
    if (r === 'admin') return 'success';  
    if (r === 'operator') return 'info';  
    return 'secondary';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const userName = log.User?.full_name?.toLowerCase() || '';
    const activityInfo = log.activity?.toLowerCase() || '';
    
    return userName.includes(searchLower) || activityInfo.includes(searchLower);
  });

  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // --- LOGIC PAGINATION 3 KOTAK ---
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  // Kalo lagi di halaman pertama, paksain nampilin 1, 2, 3
  if (currentPage === 1) {
    endPage = Math.min(3, totalPages);
  } 
  // Kalo lagi di halaman mentok akhir, paksain nampilin 3 angka terakhir
  else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  let pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <OwnerLayout>
      <Container fluid className="px-4 py-4">
        
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Activity Logs (Riwayat Sistem)</h4>
          <p className="text-muted small">Pantau semua aktivitas pengguna, admin, dan operator di dalam sistem.</p>
        </div>

        <Card className="shadow-sm border-0 rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Daftar Aktivitas</h5>
            <InputGroup className="w-25 border rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-white border-0 text-muted">🔍</InputGroup.Text>
              <Form.Control type="text" placeholder="Cari nama atau aktivitas..." className="border-0 shadow-none" value={searchTerm} onChange={handleSearch}/>
            </InputGroup>
          </div>

          <Table responsive hover className="align-middle border-bottom mb-0">
            <thead>
              <tr style={{ fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}>
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
                    <Spinner animation="border" variant="secondary" size="sm" className="me-2" /> Memuat data log aktivitas...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">{searchTerm ? `Tidak ditemukan log untuk pencarian "${searchTerm}"` : 'Belum ada data log aktivitas.'}</td></tr>
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
              CUSTOM PAGINATION SESUAI FIGMA
              ========================================= */}
          {!isLoading && filteredLogs.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
              
              {/* Tombol Previous */}
              <span 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ 
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                  color: currentPage === 1 ? '#ced4da' : '#6c757d',
                  fontWeight: '500',
                  marginRight: '10px',
                  userSelect: 'none'
                }}
              >
                Previous
              </span>

              {/* Kotak-kotak Angka */}
              {pageNumbers.map(number => (
                <div 
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '8px',
                    backgroundColor: currentPage === number ? brandPink : '#e9ecef',
                    color: currentPage === number ? 'white' : '#6c757d',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: '0.2s'
                  }}
                >
                  {number}
                </div>
              ))}

              {/* Tombol Next */}
              <span 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{ 
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                  color: currentPage === totalPages ? '#ced4da' : '#6c757d',
                  fontWeight: '500',
                  marginLeft: '10px',
                  userSelect: 'none'
                }}
              >
                Next
              </span>

            </div>
          )}

        </Card>
      </Container>
    </OwnerLayout>
  );
}

export default OwnerHistory;