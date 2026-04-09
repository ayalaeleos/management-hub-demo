import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_WORKFLOWS, DATA_SOURCES, TRIGGER_TYPES, ACTION_TYPES, WORKFLOW_TEMPLATES, PRODUCT_CATEGORIES } from '../../data/mockData.js';
import { subscribe, getCreatedWorkflows } from '../../data/workflowStore.js';
import { Icon, ProductLogo } from '../../components/WorkflowIcons.jsx';

export default function WorkflowsLanding() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const createdWorkflows = useSyncExternalStore(subscribe, getCreatedWorkflows);

  const allWorkflows = [...createdWorkflows, ...DEMO_WORKFLOWS];
  const filteredWorkflows = allWorkflows.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeWorkflows = filteredWorkflows.filter((w) => w.status === 'active');
  const draftWorkflows = filteredWorkflows.filter((w) => w.status === 'draft');

  const handleSelectTemplate = (template) => {
    setShowNewModal(false);
    navigate('/workflows/new', { state: { template } });
  };

  const handleBlankCanvas = () => {
    setShowNewModal(false);
    navigate('/workflows/new');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-[#171717] tracking-tight">
            Workflows
          </h1>
          <p className="text-sm mt-1.5 text-[#737373] max-w-xl">
            Automated pipelines that continuously monitor your data and flag what matters.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm"
        >
          <Icon name="plus" className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {showNewModal && (
        <NewWorkflowModal
          onClose={() => setShowNewModal(false)}
          onSelectTemplate={handleSelectTemplate}
          onBlankCanvas={handleBlankCanvas}
        />
      )}

      <div className="relative mb-8 max-w-md">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]">
          <Icon name="search" className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all placeholder:text-[#A3A3A3] shadow-sm"
        />
      </div>

      {activeWorkflows.length > 0 && (
        <div className="space-y-3 mb-10">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-3">Active</h3>
          {activeWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} onClick={() => navigate(`/workflows/${workflow.id}`)} />
          ))}
        </div>
      )}

      {draftWorkflows.length > 0 && (
        <div className="space-y-3 mb-10">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-3">Drafts</h3>
          {draftWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} onClick={() => navigate(`/workflows/${workflow.id}/edit`)} />
          ))}
        </div>
      )}

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#E5E5E5] rounded-xl bg-[#FAFAFA]">
          <p className="text-sm text-[#737373]">No workflows found matching "{search}"</p>
        </div>
      )}

      <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-4">Upcoming Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpcomingDataCard
            icon="activity"
            title="Session Audio Transcripts"
            description="Real-time session audio analysis — compare what was discussed to what was documented."
            productId="cds"
          />
          <UpcomingDataCard
            icon="bar-chart"
            title="Structured Assessment Scores"
            description="PHQ-9, GAD-7, and other standardized outcome measures with historical trend data."
            productId="cds"
          />
          <UpcomingDataCard
            icon="credit-card"
            title="Historical Claim Denials"
            description="Past 835 remittance data and denial reason codes for predictive denial prevention."
            productId="rcm"
          />
          <UpcomingDataCard
            icon="users"
            title="Payer Fee Schedules"
            description="Real-time payer-specific coding rules, modifier requirements, and unit limits."
            productId="rcm"
          />
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ workflow, onClick }) {
  const passRate = 100 - workflow.stats.flagRate;
  const trigger = workflow.trigger;
  const triggerMeta = TRIGGER_TYPES.find(t => t.id === trigger?.type);
  const productCategory = PRODUCT_CATEGORIES.find(c => c.id === workflow.category);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E5E5E5] rounded-xl p-5 hover:border-[#D4D4D4] hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="mt-1.5 shrink-0">
            {workflow.status === 'active' ? (
              <div className="w-2.5 h-2.5 rounded-full bg-[#2e7d32] shadow-[0_0_0_2px_rgba(46,125,50,0.2)]" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-[#A3A3A3]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-0.5">
              <h3 className="font-semibold text-[15px] text-[#171717] truncate">
                {workflow.name}
              </h3>
              {productCategory && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] shrink-0">
                  <ProductLogo logo={productCategory.logo} icon={productCategory.icon} size={14} />
                  {productCategory.name}
                </span>
              )}
            </div>
            <p className="text-sm text-[#737373] truncate mb-3">{workflow.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex -space-x-1.5">
                {workflow.dataSources.map((dsId) => {
                  const ds = DATA_SOURCES.find((d) => d.id === dsId);
                  return ds ? (
                    <div
                      key={dsId}
                      className="w-6 h-6 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center relative z-10 hover:z-20 transition-transform hover:scale-110"
                      title={ds.label}
                    >
                      <Icon name={ds.icon} className="w-3 h-3 text-[#737373]" />
                    </div>
                  ) : null;
                })}
              </div>

              <div className="w-px h-4 bg-[#E5E5E5] mx-1" />

              {triggerMeta && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-[#404040]">
                  <Icon name={triggerMeta.icon} className="w-3 h-3 text-[#737373]" />
                  {trigger.label || triggerMeta.label}
                </span>
              )}

              {workflow.actions && workflow.actions.length > 0 && (
                <>
                  <Icon name="arrow-right" className="w-3 h-3 text-[#D4D4D4]" />
                  {workflow.actions.map((action, i) => {
                    const actionMeta = ACTION_TYPES.find(a => a.id === action.type);
                    return actionMeta ? (
                      <span key={i} className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#2d4ccd] text-white">
                        <Icon name={actionMeta.icon} className="w-3 h-3" />
                        {actionMeta.label}
                      </span>
                    ) : null;
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {workflow.status === 'active' && (
          <div className="flex items-center gap-6 shrink-0 md:pl-6 md:border-l border-[#E5E5E5]">
            <div className="text-right">
              <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider mb-0.5">Scanned</p>
              <p className="text-[15px] font-semibold text-[#171717]">{workflow.stats.scanned.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider mb-0.5">Flagged</p>
              <div className="flex items-baseline gap-1.5 justify-end">
                <p className="text-[15px] font-semibold" style={{ color: '#e65100' }}>{workflow.stats.flagged.toLocaleString()}</p>
                <p className="text-[11px] font-medium text-[#737373]">({workflow.stats.flagRate}%)</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider mb-0.5">Pass Rate</p>
              <p className="text-[15px] font-semibold" style={{ color: '#2e7d32' }}>{passRate.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingDataCard({ icon, title, description, productId }) {
  const product = PRODUCT_CATEGORIES.find(c => c.id === productId);
  return (
    <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-5 flex items-start gap-4 hover:border-[#D4D4D4] transition-colors relative">
      <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] shadow-sm shrink-0">
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] text-[#171717] truncate">{title}</h3>
          {product && (
            <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] shrink-0 whitespace-nowrap">
              <ProductLogo logo={product.logo} icon={product.icon} size={14} />
              {product.name}
            </span>
          )}
        </div>
        <p className="text-sm text-[#737373] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function NewWorkflowModal({ onClose, onSelectTemplate, onBlankCanvas }) {
  const [activeTab, setActiveTab] = useState('compliance');
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const activeCategory = PRODUCT_CATEGORIES.find(c => c.id === activeTab);
  const templatesForTab = WORKFLOW_TEMPLATES.filter(t => t.category === activeTab);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in"
      style={{ animation: 'fadeIn 150ms ease-out' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{ animation: 'scaleIn 200ms ease-out' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-lg font-semibold text-[#171717] tracking-tight">Create New Workflow</h2>
            <p className="text-sm text-[#737373] mt-0.5">Choose a template to get started, or begin from scratch.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#171717] hover:bg-[#F5F5F5] transition-all">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-0">
          <button
            onClick={onBlankCanvas}
            className="w-full text-left p-4 rounded-xl border border-dashed border-[#D4D4D4] hover:border-[#171717] bg-[#FAFAFA] hover:bg-white transition-all group mb-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center text-[#A3A3A3] group-hover:text-[#171717] transition-colors shadow-sm">
                <Icon name="plus" className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717]">Blank Canvas</span>
                <p className="text-xs text-[#737373] mt-0.5">Describe your rule from scratch using the AI assistant.</p>
              </div>
            </div>
          </button>

          <div className="flex gap-3">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-6 px-4 rounded-xl font-bold transition-all border ${
                  activeTab === cat.id
                    ? 'bg-white text-[#171717] border-[#E5E5E5] shadow-sm'
                    : 'bg-[#F5F5F5] text-[#A3A3A3] border-transparent hover:bg-[#EFEFEF]'
                }`}
              >
                <ProductLogo logo={cat.logo} icon={cat.icon} size={28} className={activeTab === cat.id ? '' : 'opacity-50 grayscale'} />
                <span className="text-[15px] leading-tight text-left max-w-[80px]">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeCategory?.comingSoon && (
            <div className="flex items-center gap-2 mb-4 px-3.5 py-2.5 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5]">
              <Icon name="clock" className="w-4 h-4 text-[#A3A3A3] shrink-0" />
              <p className="text-xs text-[#737373]">
                <span className="font-semibold text-[#404040]">{activeCategory.name}</span> workflows are coming soon. Here's a preview of what's planned.
              </p>
            </div>
          )}

          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-3">
            {activeCategory?.description}
          </p>

          <div className="space-y-2">
            {templatesForTab.map(template => {
              const sources = template.dataSources
                .map(dsId => DATA_SOURCES.find(d => d.id === dsId))
                .filter(Boolean);
              const disabled = activeCategory?.comingSoon;

              return (
                <div
                  key={template.id}
                  onClick={disabled ? undefined : () => onSelectTemplate(template)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    disabled
                      ? 'border-[#E5E5E5] bg-[#FAFAFA] opacity-60 cursor-default'
                      : 'border-[#E5E5E5] hover:border-[#171717] bg-white hover:shadow-md cursor-pointer group'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      disabled
                        ? 'bg-[#F5F5F5] border-[#E5E5E5] text-[#A3A3A3]'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#737373] group-hover:text-[#171717]'
                    }`}>
                      <Icon name={template.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold ${disabled ? 'text-[#737373]' : 'text-[#171717]'}`}>{template.name}</span>
                        {template.appliesTo && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] whitespace-nowrap">{template.appliesTo}</span>
                        )}
                        {disabled && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#E5E5E5] text-[#A3A3A3] leading-none">Coming Soon</span>
                        )}
                      </div>
                      <p className="text-xs text-[#737373] leading-relaxed mb-2.5">{template.description}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {sources.map(ds => (
                          <span key={ds.id} className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5]">
                            <Icon name={ds.icon} className="w-2.5 h-2.5" />
                            {ds.label}
                          </span>
                        ))}
                        <span className="text-[10px] text-[#A3A3A3] ml-1">
                          {template.steps.length} steps
                        </span>
                      </div>
                    </div>
                    {!disabled && (
                      <Icon name="arrow-right" className="w-4 h-4 text-[#D4D4D4] group-hover:text-[#171717] transition-colors shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
