import React, { useState, useMemo } from 'react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Switch } from '../../components/Switch/Switch';
import { EditSitePanel } from '../../components/EditSitePanel/EditSitePanel';
import { SearchIcon, DownloadIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/icons';
import { MOCK_SITES, Site } from '../../data/sites';
import './SitesPage.css';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

type SortField = 'name' | 'timezone' | 'userCount' | 'active';
type SortDir = 'asc' | 'desc';

export function SitesPage() {
  const [sites, setSites] = useState<Site[]>(MOCK_SITES);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return sites.filter(s => {
      if (!showInactive && !s.active) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.timezone.toLowerCase().includes(q);
      }
      return true;
    });
  }, [sites, search, showInactive]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'timezone') cmp = a.timezone.localeCompare(b.timezone);
      else if (sortField === 'userCount') cmp = a.userCount - b.userCount;
      else if (sortField === 'active') cmp = Number(b.active) - Number(a.active);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalRows = sorted.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pageRows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const activeSiteCount = useMemo(() => sites.filter(s => s.active).length, [sites]);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const allPageSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.id));
  const somePageSelected = pageRows.some(r => selected.has(r.id)) && !allPageSelected;

  function handleSelectAll(checked: boolean) {
    setSelected(prev => {
      const next = new Set(prev);
      pageRows.forEach(r => checked ? next.add(r.id) : next.delete(r.id));
      return next;
    });
  }

  function handleSelectRow(id: number, checked: boolean) {
    setSelected(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  function handleRowsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(0);
  }

  function handleSaveSite(updated: Site) {
    setSites(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingSite(null);
  }

  function handleDownload() {
    const headers = ['Site Name', 'Timezone', 'User Count', 'Status'];
    const rows = sorted.map(s => [s.name, s.timezone, String(s.userCount), s.active ? 'Active' : 'Inactive']);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sites.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const start = totalRows === 0 ? 0 : page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalRows);

  return (
    <main className="sites-page">
      <h1 className="sites-page__title">Sites</h1>

      {/* Toolbar */}
      <div className="sites-page__toolbar">
        <div className="sites-page__toolbar-left">
          <span className="sites-page__count">{activeSiteCount} Sites</span>
          <Switch
            checked={showInactive}
            onChange={setShowInactive}
            label="Show inactive sites"
          />
        </div>
        <Button
          variant="primary"
          icon={<PlusIcon size={20} color="white" />}
          onClick={() => {}}
        >
          Add Site
        </Button>
      </div>

      {/* Table card */}
      <div className="sites-table-card">
        {/* Action bar */}
        <div className="table-action-bar">
          <Input
            className="table-action-bar__search"
            placeholder="Search sites..."
            value={search}
            onChange={handleSearch}
            prefixIcon={<SearchIcon size={20} color="var(--color-text-secondary)" />}
          />
          <div className="table-action-bar__actions">
            <button className="table-action-bar__btn" onClick={handleDownload} title="Download CSV">
              <DownloadIcon size={20} color="var(--color-text-secondary)" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-scroll">
          <table className="data-table sites-data-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={somePageSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="col-site-name">
                  <button className="sort-btn" onClick={() => handleSort('name')}>
                    Site Name
                  </button>
                </th>
                <th className="col-timezone">
                  <button className="sort-btn" onClick={() => handleSort('timezone')}>
                    Timezone
                  </button>
                </th>
                <th className="col-user-count">
                  <button className="sort-btn" onClick={() => handleSort('userCount')}>
                    User Count
                  </button>
                </th>
                <th className="col-status">
                  <button className="sort-btn" onClick={() => handleSort('active')}>
                    Status
                  </button>
                </th>
                <th className="col-actions" />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">
                      <p className="table-empty__title">No sites found</p>
                      <p>Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map(site => (
                  <tr
                    key={site.id}
                    className={selected.has(site.id) ? 'row--selected' : ''}
                    onClick={() => setEditingSite(site)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="col-checkbox" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(site.id)}
                        onChange={checked => handleSelectRow(site.id, checked)}
                      />
                    </td>
                    <td><span className="cell-text">{site.name}</span></td>
                    <td><span className="cell-text">{site.timezone}</span></td>
                    <td><span className="cell-text">{site.userCount}</span></td>
                    <td>
                      <span className={`site-status-chip site-status-chip--${site.active ? 'active' : 'inactive'}`}>
                        {site.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="col-actions" onClick={e => e.stopPropagation()}>
                      <button className="sites-more-btn" aria-label="More options">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="3" r="1.25" fill="currentColor" />
                          <circle cx="8" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="8" cy="13" r="1.25" fill="currentColor" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-pagination">
          <div className="pagination__rows-per-page">
            <span className="pagination__label">Rows per page:</span>
            <select className="pagination__select" value={rowsPerPage} onChange={handleRowsPerPage}>
              {ROWS_PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="pagination__right">
            <span className="pagination__info">
              {totalRows === 0 ? '0' : `${start}–${end}`} of {totalRows}
            </span>
            <div className="pagination__nav">
              <button
                className="pagination__nav-btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                aria-label="Previous page"
              >
                <ChevronLeftIcon size={16} />
              </button>
              <button
                className="pagination__nav-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                aria-label="Next page"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditSitePanel
        site={editingSite}
        onClose={() => setEditingSite(null)}
        onSave={handleSaveSite}
      />
    </main>
  );
}
