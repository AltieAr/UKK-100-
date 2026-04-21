  import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  // import './index.css'
  import App from './App.jsx';
  import Login from './login.jsx'; 
  import DashboardAdmin from './admin/adminDashboard.jsx'; // Import komponen dashboard admin
  import Petugas from './admin/petugas.jsx'; // Import komponen petugas admin
  import LotParkir from './admin/lotParkir.jsx';
  import TarifKendaraan from './admin/tarifkendaraan.jsx';
  import JenisKendaraan from './admin/jenisKendaraan.jsx';
  import History from './admin/history.jsx';
  import OperatorDashboard from './operator/operatorDashboard.jsx'; // Import komponen dashboard petugas
  import ParkirMasuk from './operator/checkIn.jsx'; // Import komponen check-in petugas
  import ParkirKeluar from './operator/checkOut.jsx'; // Import komponen check-out petugas
  import OwnerDashboard from './owner/ownerDashoard.jsx'; // Import komponen dashboard owner
  import OwnerHistory from './owner/ownerHistory.jsx';
  import 'bootstrap/dist/css/bootstrap.min.css';

  // Perbaikan: Import Routes dan Route yang bener
  import { BrowserRouter, Routes, Route } from 'react-router-dom';

  // Perbaikan: Langsung pakai createRoot
  createRoot(document.getElementById('root')).render(
    // Perbaikan: Langsung pakai StrictMode
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/petugas" element={<Petugas />} />
          <Route path="/admin/lot" element={<LotParkir />} />
          <Route path="/admin/tarif" element={<TarifKendaraan />} />
          <Route path="/admin/jenis" element={<JenisKendaraan />} />
          <Route path="/admin/history" element={<History />} />
          <Route path="/operator/dashboard" element={<OperatorDashboard />} />
          <Route path="/operator/masuk" element={<ParkirMasuk />} />
          <Route path="/operator/keluar" element={<ParkirKeluar />} /> 
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/history" element={<OwnerHistory />} />

        </Routes>
      </BrowserRouter>
    </StrictMode>
  );