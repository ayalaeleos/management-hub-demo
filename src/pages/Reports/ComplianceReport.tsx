import React from 'react';
import '../Sites/SitesPage.css';

export function ComplianceReport() {
  return (
    <main className="placeholder-page">
      <h1 className="placeholder-page__title">Compliance Report</h1>
      <p className="placeholder-page__subtitle">Track compliance workflows and regulatory requirements.</p>
      <div className="placeholder-page__coming-soon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#F0F3FF"/>
          <path d="M32 14L20 20v12c0 7.73 5.2 14.97 12 16.93C38.8 46.97 44 39.73 44 32V20L32 14z" stroke="#2d4ccd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".6"/>
          <path d="M26 32l4 4 8-8" stroke="#2d4ccd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".6"/>
        </svg>
        <p>Compliance report coming soon</p>
      </div>
    </main>
  );
}
