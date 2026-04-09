import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { UsersPage } from './pages/Users/UsersPage';
import { SitesPage } from './pages/Sites/SitesPage';
import { LeadershipReport } from './pages/Reports/LeadershipReport';
import { ComplianceReport } from './pages/Reports/ComplianceReport';
import './styles/globals.css';
import './App.css';

const WorkflowsLanding = lazy(() => import('./pages/Workflows/WorkflowsLanding'));
const WorkflowComposer = lazy(() => import('./pages/Workflows/WorkflowComposer'));
const WorkflowDetail = lazy(() => import('./pages/Workflows/WorkflowDetail'));

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="app-main">
          <header className="app-header" />
          <div className="app-content">
            <Suspense fallback={<div style={{ padding: 32 }}>Loading…</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/sites" element={<SitesPage />} />
                <Route path="/leadership-report" element={<LeadershipReport />} />
                <Route path="/compliance-report" element={<ComplianceReport />} />
                <Route path="/workflows" element={<WorkflowsLanding />} />
                <Route path="/workflows/new" element={<WorkflowComposer />} />
                <Route path="/workflows/:id" element={<WorkflowDetail />} />
                <Route path="/workflows/:id/edit" element={<WorkflowComposer />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
