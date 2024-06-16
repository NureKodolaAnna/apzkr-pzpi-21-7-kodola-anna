import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './ProtectedRoute';
import CreateMedicalRecord from './components/CreateMedicalRecord/CreateMedicalRecord';
import MedicalRecordList from './components/MedicalRecordList/MedicalRecordList';
import EditMedicalRecord from './components/EditMedicalRecord/EditMedicalRecord';
import CreateSchedule from './components/CreateSchedule/CreateSchedule';
import ScheduleList from './components/ScheduleList/ScheduleList';
import EditSchedule from './components/EditSchedule/EditSchedule';
import CreateAppointment from './components/CreateAppointment/CreateAppointment';
import AppointmentHistory from './components/AppointmentHistory/AppointmentHistory';
import DoctorAppointments from './components/DoctorAppointment/DoctorAppointments';
import UserList from './components/UserList/UserList';
import EditUser from './components/EditUser/EditUser';
import PaymentPage from './components/PaymentPage/PaymentPage';
import QrReaderComponent from './components/QrReaderComponent/QrReaderComponent';
import PatientRecords from './components/PatientRecords/PatientRecords';
import CreateClinic from './components/CreateClinic/CreateClinic';
import ClinicList from './components/ClinicList/ClinicList';
import EditClinic from './components/EditClinic/EditClinic';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="content">
                    <Routes>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/create-schedule" element={<ProtectedRoute role="admin"><CreateSchedule/></ProtectedRoute>}/>
                        <Route path="/view-schedules" element={<ProtectedRoute roles={['admin', 'doctor']}><ScheduleList /></ProtectedRoute>} />
                        <Route path="/edit-schedule/:id" element={<ProtectedRoute role="admin"><EditSchedule /></ProtectedRoute>} />
                        <Route path="/create-medical-record" element={<ProtectedRoute role="doctor"><CreateMedicalRecord /></ProtectedRoute>} />
                        <Route path="/edit-medical-record/:id" element={<ProtectedRoute role="doctor"><EditMedicalRecord /></ProtectedRoute>} />
                        <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordList /></ProtectedRoute>} />
                        <Route path="/create-appointment" element={<ProtectedRoute role="patient"><CreateAppointment/></ProtectedRoute>}/>
                        <Route path="/appointment-history" element={<ProtectedRoute role="patient"><AppointmentHistory/></ProtectedRoute>}/>
                        <Route path="/pay/:appointmentId" element={<ProtectedRoute role="patient"><PaymentPage /></ProtectedRoute>} />
                        <Route path="/doctor-appointments" element={<ProtectedRoute role="doctor"><DoctorAppointments /></ProtectedRoute>} />
                        <Route path="/user-list" element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />
                        <Route path="/edit-user/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
                        <Route path="/create-clinic" element={<ProtectedRoute role="admin"><CreateClinic /></ProtectedRoute>} />
                        <Route path="/clinics" element={<ProtectedRoute role="admin"><ClinicList /></ProtectedRoute>}/>
                        <Route path="/clinics/edit/:id" element={<ProtectedRoute role="admin"><EditClinic /></ProtectedRoute>} />
                        <Route path="/scan-qr" element={<QrReaderComponent />} />
                        <Route path="/patient-record/:patient_id" element={<PatientRecords />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
);
}

export default App;
