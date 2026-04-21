// Helper buat ngerapihin format Jam & Tanggal
export const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  // Munculin tanggal, bulan, jam, menit
  return date.toLocaleString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Helper buat nentuin warna Status
export const getStatusStyle = (status) => {
  const s = String(status).toLowerCase();
  if (s === 'keluar' || s === 'delivered') return { bg: '#e6f4ea', text: '#34a853' }; // Hijau
  if (s === 'masuk' || s === 'process') return { bg: '#fef1e6', text: '#fbbc04' }; // Oranye
  return { bg: '#f8f9fa', text: '#000' }; // Abu-abu default
};