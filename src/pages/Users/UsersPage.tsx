import React, { useState, useMemo } from 'react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Switch } from '../../components/Switch/Switch';
import { AddUserModal } from '../../components/AddUserModal/AddUserModal';
import { EditUserPanel } from '../../components/EditUserPanel/EditUserPanel';
import { SearchIcon, DownloadIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/icons';
import { MOCK_USERS, User } from '../../data/users';
import './UsersPage.css';

type SortField = 'name' | 'profession' | 'site' | 'program' | 'supervisor' | 'lastLogin' | 'roles';
type SortDir = 'asc' | 'desc';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  function handleAddUser(form: { fullName: string; roles: string[]; email: string; phone: string; profession: string; site: string; program: string }) {
    const newUser: User = {
      id: Date.now(),
      name: form.fullName,
      email: form.email,
      profession: form.profession,
      site: form.site,
      program: form.program,
      supervisor: null,
      lastLogin: '—',
      roles: form.roles,
      active: true,
    };
    setUsers(prev => [...prev, newUser]);
    setAddUserOpen(false);
  }

  function handleSaveUser(updated: User) {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setEditingUser(null);
  }

  // Filter
  const filtered = useMemo(() => {
    return users.filter(u => {
      if (!showInactive && !u.active) return false;
      if (search) {
        const q = search.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, search, showInactive]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = '', bv = '';
      if (sortField === 'name') { av = a.name; bv = b.name; }
      else if (sortField === 'profession') { av = a.profession; bv = b.profession; }
      else if (sortField === 'site') { av = a.site; bv = b.site; }
      else if (sortField === 'program') { av = a.program; bv = b.program; }
      else if (sortField === 'supervisor') { av = a.supervisor ?? ''; bv = b.supervisor ?? ''; }
      else if (sortField === 'lastLogin') { av = a.lastLogin; bv = b.lastLogin; }
      else if (sortField === 'roles') { av = a.roles.join(','); bv = b.roles.join(','); }
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  // Paginate
  const totalRows = sorted.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pageRows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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

  function handleDownload() {
    const headers = ['Name', 'Email', 'Profession', 'Site', 'Program', 'Supervisor', 'Last Login', 'Roles'];
    const rows = sorted.map(u => [u.name, u.email, u.profession, u.site, u.program, u.supervisor ?? '—', u.lastLogin, u.roles.join(', ')]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDownIcon size={12} color="var(--color-text-secondary)" />;
    return sortDir === 'asc'
      ? <ChevronUpIcon size={12} color="var(--color-primary-main)" />
      : <ChevronDownIcon size={12} color="var(--color-primary-main)" />;
  }

  const activeSiteCount = useMemo(() => {
    const sites = new Set(users.filter(u => u.active).map(u => u.site));
    return sites.size;
  }, []);

  const start = totalRows === 0 ? 0 : page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalRows);

  return (
    <main className="users-page">
      <h1 className="users-page__title">Users</h1>

      {/* Toolbar */}
      <div className="users-page__toolbar">
        <div className="users-page__toolbar-left">
          <span className="users-page__sites-count">{activeSiteCount} Sites</span>
          <Switch
            checked={showInactive}
            onChange={setShowInactive}
            label="Show inactive users"
          />
        </div>
        <Button
          variant="primary"
          icon={<PlusIcon size={20} color="white" />}
          onClick={() => setAddUserOpen(true)}
        >
          Add User
        </Button>
      </div>

      {/* Table card */}
      <div className="users-table-card">
        {/* Action bar */}
        <div className="table-action-bar">
          <Input
            className="table-action-bar__search"
            placeholder="Search by name or email..."
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
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={somePageSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="col-name">
                  <button className="sort-btn" onClick={() => handleSort('name')}>
                    Full name <SortIcon field="name" />
                  </button>
                </th>
                <th className="col-profession">
                  <button className="sort-btn" onClick={() => handleSort('profession')}>
                    Profession <SortIcon field="profession" />
                  </button>
                </th>
                <th className="col-site">
                  <button className="sort-btn" onClick={() => handleSort('site')}>
                    Site <SortIcon field="site" />
                  </button>
                </th>
                <th className="col-program">
                  <button className="sort-btn" onClick={() => handleSort('program')}>
                    Program <SortIcon field="program" />
                  </button>
                </th>
                <th className="col-supervisor">
                  <button className="sort-btn" onClick={() => handleSort('supervisor')}>
                    Supervisor <SortIcon field="supervisor" />
                  </button>
                </th>
                <th className="col-last-login">
                  <button className="sort-btn" onClick={() => handleSort('lastLogin')}>
                    Last login <SortIcon field="lastLogin" />
                  </button>
                </th>
                <th className="col-role">
                  <button className="sort-btn" onClick={() => handleSort('roles')}>
                    Role <SortIcon field="roles" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="table-empty">
                      <p className="table-empty__title">No users found</p>
                      <p>Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map(user => (
                  <tr
                    key={user.id}
                    className={selected.has(user.id) ? 'row--selected' : ''}
                    onClick={() => setEditingUser(user)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="col-checkbox" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(user.id)}
                        onChange={checked => handleSelectRow(user.id, checked)}
                      />
                    </td>
                    <td>
                      <div className="cell-name__primary">{user.name}</div>
                      <div className="cell-name__secondary">{user.email}</div>
                    </td>
                    <td><span className="cell-text">{user.profession}</span></td>
                    <td><span className="cell-text">{user.site}</span></td>
                    <td><span className="cell-text">{user.program}</span></td>
                    <td>
                      <span className={`cell-text ${!user.supervisor ? 'cell-dash' : ''}`}>
                        {user.supervisor ?? '—'}
                      </span>
                    </td>
                    <td><span className="cell-text">{user.lastLogin}</span></td>
                    <td style={{ overflow: 'visible' }}>
                      <div className="cell-roles">
                        {user.roles.map(role => (
                          <span
                            key={role}
                            className={`role-badge role-badge--${role.toLowerCase()}`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
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

      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSave={handleAddUser}
      />

      <EditUserPanel
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />
    </main>
  );
}
