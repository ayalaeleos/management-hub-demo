import React, { useState, useSyncExternalStore } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DEMO_WORKFLOWS, DEMO_FLAGS, DATA_SOURCES, TRIGGER_TYPES, ACTION_TYPES, PRODUCT_CATEGORIES } from '../../data/mockData.js';
import { findWorkflow, findFlagsForWorkflow, subscribe, getCreatedWorkflows } from '../../data/workflowStore.js';
import { Icon, ProductLogo } from '../../components/Icons.jsx';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', bg: '#FEF2F2', color: '#DC2626', dot: '#DC2626' },
  high: { label: 'High', bg: '#FFF7ED', color: '#EA580C', dot: '#EA580C' },
  medium: { label: 'Medium', bg: '#FFFBEB', color: '#D97706', dot: '#D97706' },
  low: { label: 'Low', bg: '#F0FDF4', color: '#16A34A', dot: '#16A34A' },
};

const STATUS_CONFIG = {
  unreviewed: { label: 'Unreviewed', bg: '#FEF2F2', color: '#DC2626' },
  reviewed: { label: 'Reviewed', bg: '#F0FDF4', color: '#16A34A' },
  dismissed: { label: 'Dismissed', bg: '#F5F5F5', color: '#737373' },
  sent_to_clinician: { label: 'Sent to Clinician', bg: '#FAFAFA', color: '#171717', border: '#E5E5E5' },
};

export default function WorkflowDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  useSyncExternalStore(subscribe, getCreatedWorkflows);

  const workflow = DEMO_WORKFLOWS.find((w) => w.id === id) || findWorkflow(id) || DEMO_WORKFLOWS[0];
  const isCreatedWorkflow = !!findWorkflow(id);
  const productCategory = PRODUCT_CATEGORIES.find(c => c.id === workflow.category);

  const initialFlags = isCreatedWorkflow
    ? findFlagsForWorkflow(id)
    : DEMO_FLAGS.filter((f) => f.workflowId === workflow.id);

  const [localFlags, setLocalFlags] = useState(initialFlags);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('unreviewed');
  const [tab, setTab] = useState('flags');

  const filteredFlags = localFlags.filter((f) => {
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    return true;
  });

  const handleAction = (flagId, action) => {
    setLocalFlags(prev => prev.map(f => f.id === flagId ? { ...f, status: action } : f));
    setSelectedFlag(null);
  };

  const unreviewedCount = localFlags.filter(f => f.status === 'unreviewed').length;
  const triggerMeta = TRIGGER_TYPES.find(t => t.id === workflow.trigger?.type);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 pt-6 pb-5 border-b border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate('/workflows')}
            className="text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors flex items-center gap-1"
          >
            <Icon name="arrow-left" className="w-3.5 h-3.5" />
            Workflows
          </button>
          <Icon name="chevron-right" className="w-3.5 h-3.5 text-[#A3A3A3]" />
          <span className="text-sm font-medium text-[#171717]">{workflow.name}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_0_2px_rgba(16,185,129,0.2)]" />
            <h1 className="text-xl font-semibold text-[#171717] tracking-tight">
              {workflow.name}
            </h1>
            {productCategory && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5]">
                <ProductLogo logo={productCategory.logo} icon={productCategory.icon} size={14} />
                {productCategory.name}
              </span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] uppercase tracking-widest">
              Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/workflows/${id}/edit`)}
              className="btn-secondary px-3.5 py-1.5 rounded-lg text-sm font-medium"
            >
              Edit
            </button>
            <button className="btn-secondary px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#737373]">
              Pause
            </button>
          </div>
        </div>

        {/* Trigger, Sources, Actions pipeline */}
        <div className="flex items-center gap-2 flex-wrap">
          {triggerMeta && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAFAFA] border border-dashed border-[#A3A3A3] text-[#404040]">
              <Icon name={triggerMeta.icon} className="w-3.5 h-3.5 text-[#737373]" />
              {workflow.trigger.label || triggerMeta.label}
            </span>
          )}
          <Icon name="arrow-right" className="w-3 h-3 text-[#D4D4D4]" />
          {workflow.dataSources.map((dsId) => {
            const ds = DATA_SOURCES.find((d) => d.id === dsId);
            return ds ? (
              <span key={dsId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAFAFA] border border-[#E5E5E5] text-[#404040]">
                <Icon name={ds.icon} className="w-3.5 h-3.5 text-[#737373]" />
                {ds.label}
              </span>
            ) : null;
          })}
          <Icon name="arrow-right" className="w-3 h-3 text-[#D4D4D4]" />
          <span className="text-xs text-[#A3A3A3] font-medium">{workflow.stepsCount} steps</span>
          <Icon name="arrow-right" className="w-3 h-3 text-[#D4D4D4]" />
          {workflow.actions?.map((action, i) => {
            const actionMeta = ACTION_TYPES.find(a => a.id === action.type);
            return actionMeta ? (
              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#171717] text-white">
                <Icon name={actionMeta.icon} className="w-3.5 h-3.5" />
                {actionMeta.label}
              </span>
            ) : null;
          })}
          <div className="w-px h-4 bg-[#E5E5E5] mx-1" />
          <span className="text-xs text-[#737373]">Last run: {workflow.lastRun}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-8 py-5 grid grid-cols-5 gap-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
        <MetricCard label="Notes Scanned" value={workflow.stats.scanned.toLocaleString()} />
        <MetricCard label="Flagged" value={workflow.stats.flagged.toLocaleString()} subValue={`${workflow.stats.flagRate}%`} color="#F59E0B" />
        <MetricCard label="Critical" value={workflow.stats.critical.toString()} color="#DC2626" />
        <MetricCard label="Pass Rate" value={`${(100 - workflow.stats.flagRate).toFixed(1)}%`} color="#10B981" />
        <MetricCard label="Avg. Review Time" value="4.2 hrs" />
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-[#E5E5E5] bg-white">
        <div className="flex gap-8">
          {[
            { id: 'flags', label: 'Triage Inbox', count: unreviewedCount },
            { id: 'analytics', label: 'Analytics' },
            { id: 'config', label: 'Configuration' },
            { id: 'history', label: 'History' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative py-3.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'text-[#171717]' : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <span className="flex items-center gap-2">
                {t.label}
                {t.count != null && t.count > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    tab === t.id ? 'bg-[#171717] text-white' : 'bg-[#F5F5F5] text-[#737373]'
                  }`}>
                    {t.count}
                  </span>
                )}
              </span>
              {tab === t.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#171717] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {tab === 'flags' && (
          <div className="flex h-full">
            <div className={`${selectedFlag ? 'w-[480px]' : 'flex-1'} border-r border-[#E5E5E5] overflow-y-auto transition-all bg-white flex flex-col`}>
              <div className="px-6 py-3 flex items-center gap-3 border-b border-[#E5E5E5] sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-xs font-medium text-[#171717] outline-none focus:border-[#171717] shadow-sm"
                >
                  <option value="unreviewed">Unreviewed Queue</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="dismissed">Dismissed</option>
                  <option value="sent_to_clinician">Sent to Clinician</option>
                  <option value="all">All Flags</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-xs font-medium text-[#171717] outline-none focus:border-[#171717] shadow-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <span className="text-xs text-[#737373] ml-auto font-medium">{filteredFlags.length} items</span>
              </div>
              <div className="divide-y divide-[#E5E5E5] flex-1">
                {filteredFlags.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mb-4">
                      <Icon name="check-circle" className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <p className="text-[15px] font-semibold text-[#171717]">Inbox Zero</p>
                    <p className="text-sm text-[#737373] mt-1">No flags matching these filters.</p>
                  </div>
                ) : (
                  filteredFlags.map((flag) => (
                    <FlagListItem
                      key={flag.id}
                      flag={flag}
                      selected={selectedFlag?.id === flag.id}
                      onClick={() => setSelectedFlag(flag)}
                    />
                  ))
                )}
              </div>
            </div>

            {selectedFlag && (
              <FlagDetailPanel flag={selectedFlag} onClose={() => setSelectedFlag(null)} onAction={handleAction} />
            )}
          </div>
        )}

        {tab === 'analytics' && <AnalyticsTab workflow={workflow} />}

        {tab === 'config' && <ConfigurationTab workflow={workflow} navigate={navigate} id={id} />}

        {tab === 'history' && (
          <div className="p-8 max-w-3xl mx-auto">
            <div className="space-y-5">
              <ConversationEntry role="user" text={`I want to check that progress notes are aligned with treatment plans — services, goals, and clinical problems.`} />
              <ConversationEntry role="assistant" text={`I've set up a Golden Thread workflow pulling from Progress Notes, Treatment Plans, and Service Codes. I'll check therapeutic services match, goal/objective linkage, and clinical problem alignment.`} />
              <ConversationEntry role="user" text="Include individual and group notes. Route flags to supervisors, and send email alerts for critical severity." />
              <ConversationEntry role="assistant" text="Done. Scanning Individual Progress Notes and Group Therapy Notes. Flags route to direct supervisors. Critical items also trigger an email alert. Estimated throughput: ~1,200 notes/day." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfigurationTab({ workflow, navigate, id }) {
  const triggerMeta = TRIGGER_TYPES.find(t => t.id === workflow.trigger?.type);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto max-h-full">
      <div className="grid grid-cols-2 gap-6">
        {/* Trigger */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="zap" className="w-4 h-4 text-[#737373]" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">Trigger</h3>
          </div>
          {triggerMeta && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-dashed border-[#A3A3A3] flex items-center justify-center">
                <Icon name={triggerMeta.icon} className="w-5 h-5 text-[#171717]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#171717]">{workflow.trigger.label || triggerMeta.label}</p>
                <p className="text-xs text-[#737373] mt-0.5">{triggerMeta.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="flag" className="w-4 h-4 text-[#737373]" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">Actions</h3>
          </div>
          <div className="space-y-3">
            {workflow.actions?.map((action, i) => {
              const actionMeta = ACTION_TYPES.find(a => a.id === action.type);
              return actionMeta ? (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center">
                    <Icon name={actionMeta.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">{actionMeta.label}</p>
                    <p className="text-xs text-[#737373] mt-0.5">{actionMeta.description}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="layers" className="w-4 h-4 text-[#737373]" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">Data Sources</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {workflow.dataSources.map((dsId) => {
            const ds = DATA_SOURCES.find((d) => d.id === dsId);
            return ds ? (
              <div key={dsId} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center">
                  <Icon name={ds.icon} className="w-4 h-4 text-[#171717]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#171717]">{ds.label}</p>
                  <p className="text-[11px] text-[#737373]">{ds.description}</p>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-white border border-[#E5E5E5] flex items-center justify-center">
          <Icon name="layers" className="w-7 h-7 text-[#A3A3A3]" strokeWidth={1} />
        </div>
        <p className="text-[15px] font-semibold text-[#171717] mb-1.5">Visual Pipeline</p>
        <p className="text-sm text-[#737373] mb-5">View and edit the workflow canvas in the editor.</p>
        <button
          onClick={() => navigate(`/workflows/${id}/edit`)}
          className="btn-primary px-5 py-2 rounded-lg text-sm font-medium"
        >
          Open in Editor
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, color = '#171717' }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-1.5">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-semibold tracking-tight" style={{ color }}>{value}</p>
        {subValue && <p className="text-sm font-medium text-[#737373]">{subValue}</p>}
      </div>
    </div>
  );
}

function FlagListItem({ flag, selected, onClick }) {
  const severity = SEVERITY_CONFIG[flag.severity];
  const status = STATUS_CONFIG[flag.status];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 transition-all ${selected ? 'bg-[#FAFAFA]' : 'bg-white hover:bg-[#FAFAFA]'}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: severity.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <p className="text-[14px] font-semibold text-[#171717] truncate">{flag.clientName}</p>
            <span className="text-[11px] font-medium text-[#A3A3A3] shrink-0">
              {flag.noteDate}
            </span>
          </div>
          <p className="text-sm text-[#404040] line-clamp-2 leading-relaxed mb-2.5">{flag.finding}</p>
          <div className="flex items-center gap-3">
            {flag.status !== 'unreviewed' && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ background: status.bg, color: status.color, border: status.border ? `1px solid ${status.border}` : 'none' }}>
                {status.label}
              </span>
            )}
            <span className="text-xs text-[#737373] font-medium">{flag.clinician}</span>
            <div className="w-1 h-1 rounded-full bg-[#E5E5E5]" />
            <span className="text-xs text-[#A3A3A3] font-medium">{Math.round(flag.confidence * 100)}%</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function FlagDetailPanel({ flag, onClose, onAction }) {
  const severity = SEVERITY_CONFIG[flag.severity];

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAFA]">
      <div className="px-8 py-5 border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md z-10 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-[#171717] tracking-tight mb-0.5">{flag.clientName}</h3>
          <p className="text-sm text-[#737373] font-medium">{flag.clinician} <span className="text-[#E5E5E5] mx-1.5">|</span> {flag.noteType} <span className="text-[#E5E5E5] mx-1.5">|</span> {flag.noteDate}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center text-[#A3A3A3] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors">
          <Icon name="x" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-3xl">
        <div className="rounded-xl border p-5 bg-white shadow-sm" style={{ borderColor: severity.color + '30' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm shrink-0" style={{ background: severity.color }}>
              <Icon name="brain" className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: severity.color }}>
              AI Finding
            </span>
            <div className="w-1 h-1 rounded-full bg-[#E5E5E5]" />
            <span className="text-xs font-medium text-[#737373]">{Math.round(flag.confidence * 100)}% confidence</span>
          </div>
          <p className="text-[14px] text-[#171717] leading-relaxed font-medium">{flag.finding}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {flag.dataSources.map((dsId) => {
            const ds = DATA_SOURCES.find((d) => d.id === dsId);
            return ds ? (
              <span key={dsId} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-[#E5E5E5] text-[#404040] shadow-sm">
                <Icon name={ds.icon} className="w-3.5 h-3.5 text-[#737373]" />
                {ds.label}
              </span>
            ) : null;
          })}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2.5 flex items-center gap-2">
            <Icon name="file-text" className="w-3.5 h-3.5" /> Note Content
          </p>
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-[13px] leading-relaxed text-[#404040] shadow-sm">
            "{flag.noteExcerpt}"
          </div>
        </div>

        {flag.audioExcerpt && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2.5 flex items-center gap-2">
              <Icon name="file-text" className="w-3.5 h-3.5" /> Referenced Document
            </p>
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-[13px] leading-relaxed text-[#404040] shadow-sm">
              "{flag.audioExcerpt}"
            </div>
          </div>
        )}

        {flag.eligibilityNote && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2.5 flex items-center gap-2">
              <Icon name="shield" className="w-3.5 h-3.5" /> Treatment Plan Reference
            </p>
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-[13px] leading-relaxed text-[#404040] shadow-sm">
              {flag.eligibilityNote}
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-3.5 border-t border-[#E5E5E5] bg-white flex gap-2.5 shrink-0">
        <button
          onClick={() => onAction(flag.id, 'reviewed')}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#171717] text-white hover:bg-[#262626] transition-all"
        >
          Mark Reviewed
        </button>
        <button
          onClick={() => onAction(flag.id, 'dismissed')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white border border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAFA] transition-all"
        >
          Dismiss
        </button>
        <button
          onClick={() => onAction(flag.id, 'sent_to_clinician')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white border border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAFA] transition-all"
        >
          Send to Clinician
        </button>
      </div>
    </div>
  );
}

function AnalyticsTab({ workflow }) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, flags: Math.floor(Math.random() * 60 + 30), scanned: Math.floor(Math.random() * 2000 + 1500) };
  });
  const maxFlags = Math.max(...days.map((d) => d.flags));

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-full max-w-5xl mx-auto">
      <div>
        <h3 className="text-[15px] font-semibold text-[#171717] mb-4">Flags Over Time (14 days)</h3>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full rounded-t-md transition-all bg-[#E5E5E5] group-hover:bg-[#171717]"
                  style={{ height: `${(d.flags / maxFlags) * 100}%`, minHeight: 4 }}
                  title={`${d.flags} flags`}
                />
                <span className="text-[10px] font-medium text-[#A3A3A3]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-[#171717] mb-4">Flags by Clinician</h3>
        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5]">
                <th className="px-6 py-3.5 text-left font-semibold text-xs uppercase tracking-widest text-[#A3A3A3]">Clinician</th>
                <th className="px-6 py-3.5 text-right font-semibold text-xs uppercase tracking-widest text-[#A3A3A3]">Flags</th>
                <th className="px-6 py-3.5 text-right font-semibold text-xs uppercase tracking-widest text-[#A3A3A3]">Rate</th>
                <th className="px-6 py-3.5 text-right font-semibold text-xs uppercase tracking-widest text-[#A3A3A3]">Critical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {[
                { name: 'Kevin Lee', flags: 18, rate: '3.2%', critical: 4 },
                { name: 'James Wilson', flags: 14, rate: '2.8%', critical: 2 },
                { name: 'Anthony Brown', flags: 11, rate: '2.1%', critical: 3 },
                { name: 'Emily Chen', flags: 8, rate: '1.5%', critical: 1 },
                { name: 'Rachel Torres', flags: 5, rate: '0.9%', critical: 0 },
              ].map((c) => (
                <tr key={c.name} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#171717]">{c.name}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-[#171717]">{c.flags}</td>
                  <td className="px-6 py-3.5 text-right text-[#737373]">{c.rate}</td>
                  <td className="px-6 py-3.5 text-right font-semibold" style={{ color: c.critical > 0 ? '#DC2626' : '#737373' }}>{c.critical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-[#171717] mb-4">Processing Step Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: 'Medical Necessity Check', total: 36847, flagged: 312, pct: '0.85%' },
            { step: 'Required Fields Check', total: 36847, flagged: 198, pct: '0.54%' },
            { step: 'Auth Expiry Filter', total: 4521, flagged: 162, pct: '3.58%' },
          ].map((s) => (
            <div key={s.step} className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-3">{s.step}</p>
              <p className="text-2xl font-semibold text-[#171717] tracking-tight">{s.flagged}</p>
              <p className="text-sm font-medium text-[#737373] mt-1">{s.pct} of {s.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversationEntry({ role, text }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] max-w-xl bg-[#171717] text-white leading-relaxed">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] shrink-0">
        <Icon name="brain" className="w-3.5 h-3.5" />
      </div>
      <div className="text-[13px] px-4 py-2.5 rounded-2xl bg-white border border-[#E5E5E5] text-[#171717] leading-relaxed max-w-2xl">
        {text}
      </div>
    </div>
  );
}
