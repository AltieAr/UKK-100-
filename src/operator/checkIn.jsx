import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import OperatorLayout from '../layout/OperatorLayout';
import CheckInIcon from '../assets/sidebar/icon/operator/CheckInIcon.svg';

function ParkirMasuk() {
  const brandCyan = '#0dcaf0';
  const [areas, setAreas] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    plate_number: '',
    id_area: '',
    id_type: ''
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resArea, resType] = await Promise.all([
          axios.get('http://localhost:3030/api/area/index', config),
          axios.get('http://localhost:3030/api/vehicle-type/index', config)
        ]);

        const areaData = resArea.data.data || [];
        const typeData = resType.data.data || [];

        // console.log("Area Data:", areaData);
        // console.log("Vehicle Type Data:", typeData);

        setAreas(areaData);
        setVehicleTypes(typeData);

        // Langsung set default value di sini biar dropdown ada isinya
        setFormData(prev => ({
          ...prev,
          id_area: areaData.length > 0 ? areaData[0].id_area : '',
          id_type: typeData.length > 0 ? typeData[0].id_type : ''
        }));

      } catch (error) {
        console.error("Gagal narik data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const idUser = localStorage.getItem('id_user') || 2; 

      const payload = {
        plate_number: formData.plate_number.toUpperCase(),
        id_area: parseInt(formData.id_area),
        id_type: parseInt(formData.id_type),
        id_user: parseInt(idUser)
      };

      // Pake rute checkin sesuai asumsi
      await axios.post('http://localhost:3030/api/transaction/checkin', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Sukses! Kendaraan ${payload.plate_number} berhasil parkir.`);
      setFormData(prev => ({ ...prev, plate_number: '' }));
    } catch (error) {
      alert('Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <OperatorLayout>
      <Container fluid className="px-4 py-4 d-flex justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0 rounded-4 p-4 mt-4">
            <div className="text-center mb-4">
              <div className="fs-1 mb-2"><img src={CheckInIcon} alt="Check-in" width="40" className="me-2" /></div>
              <h4 className="fw-bold mb-1">Check-In Kendaraan</h4>
            </div>

            {isLoading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted small">Plat Nomor</Form.Label>
                  <Form.Control 
                    type="text" size="lg" placeholder="B 1234 XYZ"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                    required className="bg-light border-0 shadow-none text-uppercase fw-bold"
                  />
                </Form.Group>

                <Row className="mb-4 g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold text-muted small">Tipe Kendaraan</Form.Label>
                      <Form.Select 
                        value={formData.id_type}
                        onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                        className="bg-light border-0 shadow-none"
                      >
                        {vehicleTypes.map(t => (
                          <option key={t.id_type} value={t.id_type}>{t.vehicle_type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold text-muted small">Pilih Lot/Area</Form.Label>
                      <Form.Select 
                        value={formData.id_area}
                        onChange={(e) => setFormData({...formData, id_area: e.target.value})}
                        className="bg-light border-0 shadow-none"
                      >
                        {areas.map(a => (
                          <option key={a.id_area} value={a.id_area}>{a.area_name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" size="lg" className="w-100 fw-bold border-0 text-dark" style={{ backgroundColor: brandCyan }}>
                  Simpan Transaksi
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Container>
    </OperatorLayout>
  );
}

export default ParkirMasuk;