import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './components/ui/PrivateRoute';
import ScrollToTop from './components/ui/ScrollToTop';

import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PasswordReset from './pages/Auth/PasswordReset';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import GoogleCallback from './pages/Auth/GoogleCallback';
import ProfilePage from './pages/Profile/ProfilePage';
import EditProfile from './pages/Profile/EditProfile';
import InvoiceHistory from './pages/Profile/InvoiceHistory';
import BuildingsList from './pages/Buildings/BuildingsList';
import AddBuilding from './pages/Buildings/AddBuilding';
import BuildingDetails from './pages/Buildings/BuildingDetails';
import ResidentRequests from './pages/Buildings/ResidentRequests';
import PackagesList from './pages/Packages/PackagesList';
import AddPackage from './pages/Packages/AddPackage';
import EditPackage from './pages/Packages/EditPackage';
import PackageDetails from './pages/Packages/PackageDetails';
import Wallet from './pages/Payments/Wallet';
import TopUp from './pages/Payments/TopUp';
import TransactionHistory from './pages/Payments/TransactionHistory';
import PayInvoice from './pages/Payments/PayInvoice';
import AddRequest from './pages/Maintenance/AddRequest';
import RequestList from './pages/Maintenance/RequestList';
import TechnicianView from './pages/Maintenance/TechnicianView';
import Notifications from './pages/Notifications/Notifications';
import Residents from './pages/Residents/Residents';
import ResidentDetail from './pages/Residents/ResidentDetail';
import Settings from './pages/Settings/Settings';
import AddProperty from './pages/AddProperty/AddProperty';

export default function RoutesConfig(){
  return (
    <GoogleOAuthProvider clientId="337224757321-cj3fqn0m12mvir3l4m38cef9jmvlga2k.apps.googleusercontent.com">
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/profile/invoices" element={<PrivateRoute><InvoiceHistory /></PrivateRoute>} />
        <Route path="/buildings" element={<PrivateRoute><BuildingsList /></PrivateRoute>} />
        <Route path="/buildings/add" element={<PrivateRoute><AddBuilding /></PrivateRoute>} />
        <Route path="/buildings/:id" element={<PrivateRoute><BuildingDetails /></PrivateRoute>} />
        <Route path="/buildings/:id/requests" element={<PrivateRoute><ResidentRequests /></PrivateRoute>} />
        <Route path="/packages" element={<PrivateRoute><PackagesList /></PrivateRoute>} />
        <Route path="/packages/add" element={<PrivateRoute><AddPackage /></PrivateRoute>} />
        <Route path="/packages/:id/edit" element={<PrivateRoute><EditPackage /></PrivateRoute>} />
        <Route path="/packages/:id" element={<PrivateRoute><PackageDetails /></PrivateRoute>} />
        <Route path="/payments/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
        {/* Operational routes removed - moved to mobile app */}
        <Route path="/maintenance/requests" element={<PrivateRoute><RequestList /></PrivateRoute>} />
        <Route path="/maintenance/technician" element={<PrivateRoute><TechnicianView /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/residents" element={<PrivateRoute><Residents /></PrivateRoute>} />
        <Route path="/buildings/:buildingId/residents/:residentId" element={<PrivateRoute><ResidentDetail /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/add-property" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
    