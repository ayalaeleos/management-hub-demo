import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { UsersPage } from './pages/Users/UsersPage';
import { SitesPage } from './pages/Sites/SitesPage';
import { LeadershipReport } from './pages/Reports/LeadershipReport';
import { ComplianceReport } from './pages/Reports/ComplianceReport';
import './styles/globals.css';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="app-main">
          <header className="app-header" />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/users" replace />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/sites" element={<SitesPage />} />
              <Route path="/leadership-report" element={<LeadershipReport />} />
              <Route path="/compliance-report" element={<ComplianceReport />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
