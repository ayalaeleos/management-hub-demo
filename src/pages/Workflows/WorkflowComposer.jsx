import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  DATA_SOURCES,
  WORKFLOW_TEMPLATES,
  PROCESSING_STEPS,
  OUTPUT_ACTIONS,
  TRIGGER_TYPES,
  ACTION_TYPES,
  EXAMPLE_PREVIEWS,
  PRODUCT_CATEGORIES,
} from '../../data/mockData.js';
import { addWorkflow } from '../../data/workflowStore.js';
import { Icon, ProductLogo } from '../../components/WorkflowIcons.jsx';

const NODE_TYPES = {
  trigger: TriggerNode,
  dataSource: DataSourceNode,
  processing: ProcessingNode,
  output: OutputNode,
  action: ActionNode,
};

const EDGE_DEFAULTS = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#A3A3A3', strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#A3A3A3' },
};

export default function WorkflowComposer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const hasInitialized = useRef(false);

  const [workflowName, setWorkflowName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [phase, setPhase] = useState('welcome');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [collectedConfig, setCollectedConfig] = useState({});

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, ...EDGE_DEFAULTS }, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (hasInitialized.current) return;
    const passedTemplate = location.state?.template;
    if (passedTemplate) {
      hasInitialized.current = true;
      const fullTemplate = WORKFLOW_TEMPLATES.find(t => t.id === passedTemplate.id) || passedTemplate;
      setTimeout(() => handleTemplateSelect(fullTemplate), 100);
    }
  }, [location.state]);

  const simulateAIResponse = useCallback((content, extras = {}, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content, ...extras }]);
      setIsTyping(false);
    }, delay);
  }, []);

  const activateWorkflow = useCallback(() => {
    const newId = `wf-${Date.now()}`;
    const triggerType = collectedConfig.trigger || selectedTemplate?.defaultTrigger || 'realtime';
    const triggerMeta = TRIGGER_TYPES.find((t) => t.id === triggerType) || TRIGGER_TYPES[0];
    const actionIds = collectedConfig.actions || selectedTemplate?.defaultActions || ['flag_route'];
    const dsIds = selectedTemplate
      ? selectedTemplate.dataSources
      : nodes.filter((n) => n.type === 'dataSource').map((n) => n.data.id);
    const stepCount = nodes.filter((n) => n.type === 'processing').length;

    const sampleFlags = generateSampleFlags(newId, dsIds, workflowName);
    const criticalCount = sampleFlags.filter((f) => f.severity === 'critical').length;

    const workflow = {
      id: newId,
      name: workflowName || 'Custom Workflow',
      description: `Automated workflow created from ${selectedTemplate ? selectedTemplate.name + ' template' : 'blank canvas'}.`,
      category: selectedTemplate?.category || 'compliance',
      status: 'active',
      dataSources: dsIds,
      trigger: { type: triggerType, label: triggerMeta.label },
      actions: actionIds.map((aId) => {
        const meta = ACTION_TYPES.find((a) => a.id === aId);
        return { type: aId, label: meta?.label || aId, config: {} };
      }),
      stepsCount: stepCount || 2,
      lastRun: 'Just now',
      stats: { scanned: 1240, flagged: sampleFlags.length, flagRate: 1.1, critical: criticalCount },
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: 'You',
    };
    addWorkflow(workflow, sampleFlags);
    navigate(`/workflows/${newId}`);
  }, [workflowName, collectedConfig, selectedTemplate, nodes, navigate]);

  const handleTestWorkflow = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      simulateAIResponse(
        `Simulation complete. I ran this workflow against the last 30 days of data. It would have scanned **1,240 notes** and flagged **14 issues** (1.1% flag rate). The breakdown: 3 critical, 5 high, 4 medium, 2 low.`,
        {},
        0
      );
    }, 1500);
  };

  const buildCanvasFromTemplate = useCallback((template, triggerType, actionTypes) => {
    const sources = template.dataSources.map((dsId) => DATA_SOURCES.find((d) => d.id === dsId)).filter(Boolean);
    const trigger = TRIGGER_TYPES.find(t => t.id === (triggerType || template.defaultTrigger)) || TRIGGER_TYPES[0];
    const actions = (actionTypes || template.defaultActions || ['flag_route']).map(aId => ACTION_TYPES.find(a => a.id === aId)).filter(Boolean);
    const newNodes = [];
    const newEdges = [];
    let y = 40;

    newNodes.push({
      id: 'trigger',
      type: 'trigger',
      position: { x: -160, y: y + ((sources.length - 1) * 120) / 2 - 20 },
      data: { ...trigger },
    });

    sources.forEach((ds, i) => {
      newNodes.push({
        id: `ds-${ds.id}`,
        type: 'dataSource',
        position: { x: 50, y: y + i * 120 },
        data: { ...ds },
      });
      newEdges.push({
        id: `e-trigger-${ds.id}`,
        source: 'trigger',
        target: `ds-${ds.id}`,
        ...EDGE_DEFAULTS,
      });
    });

    const totalSourcesHeight = (sources.length - 1) * 120;
    const centerY = y + totalSourcesHeight / 2;

    const processingSteps = template.steps.filter(s => !['flag_route', 'alert', 'dashboard', 'task', 'report'].includes(s.type));

    processingSteps.forEach((step, i) => {
      const meta = PROCESSING_STEPS.find((p) => p.id === step.type);
      if (!meta) return;
      const nodeId = `step-${i}`;
      newNodes.push({
        id: nodeId,
        type: 'processing',
        position: { x: 290 + i * 220, y: centerY - 30 },
        data: { ...meta, label: step.label, config: step.config },
      });

      if (i === 0) {
        sources.forEach((ds) => {
          newEdges.push({
            id: `e-${ds.id}-${nodeId}`,
            source: `ds-${ds.id}`,
            target: nodeId,
            ...EDGE_DEFAULTS,
          });
        });
      } else {
        newEdges.push({
          id: `e-step-${i - 1}-${nodeId}`,
          source: `step-${i - 1}`,
          target: nodeId,
          ...EDGE_DEFAULTS,
        });
      }
    });

    const lastProcessingId = processingSteps.length > 0 ? `step-${processingSteps.length - 1}` : sources.length > 0 ? `ds-${sources[0].id}` : 'trigger';
    const actionStartX = 290 + processingSteps.length * 220;

    actions.forEach((action, i) => {
      const nodeId = `action-${i}`;
      newNodes.push({
        id: nodeId,
        type: 'action',
        position: { x: actionStartX, y: centerY - 30 + i * 100 - ((actions.length - 1) * 50) },
        data: { ...action },
      });
      newEdges.push({
        id: `e-${lastProcessingId}-${nodeId}`,
        source: lastProcessingId,
        target: nodeId,
        ...EDGE_DEFAULTS,
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplate(template);
    setWorkflowName(template.name);
    setPhase('rule_definition');
    setCollectedConfig({});

    setMessages([
      { role: 'user', content: `I want to set up a ${template.name.toLowerCase()} workflow.` },
    ]);

    buildCanvasFromTemplate(template);

    const sources = template.dataSources.map((dsId) => DATA_SOURCES.find((d) => d.id === dsId)).filter(Boolean);
    const sourceNames = sources.map((s) => `**${s.label}**`).join(' and ');

    if (template.rules && template.rules.length > 0) {
      simulateAIResponse(
        `I've set up a **${template.name}** workflow pulling from ${sourceNames}. Here are the rules I'll apply — toggle any you'd like to include or exclude:`,
        {
          structured: {
            type: 'checkbox',
            question: `Rules for ${template.name}`,
            options: template.rules.map(r => ({
              id: r.id,
              label: r.label,
              description: r.description,
              checked: r.enabled !== false,
              badge: r.appliesTo,
              priority: r.priority,
            })),
            answered: false,
          },
        },
        600,
      );
    } else {
      simulateAIResponse(
        `I've set up a **${template.name}** workflow pulling from ${sourceNames}. Let me know if you'd like to adjust anything.`,
        {},
        600,
      );
    }
  }, [buildCanvasFromTemplate, simulateAIResponse]);

  const handleBlankCanvas = useCallback(() => {
    setPhase('building');
    setWorkflowName('Untitled Workflow');
    setCollectedConfig({});
    setMessages([
      { role: 'user', content: 'I want to start from a blank canvas.' },
    ]);
    simulateAIResponse(
      `I've opened a blank canvas for you. Describe what you want to automate — for example, "flag notes that are missing medical necessity statements" or "alert supervisors when documentation is overdue."`,
      {},
      600
    );
  }, [simulateAIResponse]);

  const handleStructuredResponse = useCallback((questionType, value) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.structured) {
        last.structured = { ...last.structured, selected: value, answered: true };
      }
      return updated;
    });

    if (phase === 'rule_definition') {
      const selectedRules = Array.isArray(value) ? value : [value];
      setCollectedConfig(prev => ({ ...prev, rules: selectedRules }));
      setPhase('scope_definition');
      simulateAIResponse(
        `${selectedRules.length} rule${selectedRules.length > 1 ? 's' : ''} enabled. Now — which note types should these rules apply to?`,
        {
          structured: {
            type: 'checkbox',
            question: 'Select note types to include:',
            options: [
              { id: 'individual', label: 'Individual Progress Notes', checked: true },
              { id: 'group', label: 'Group Therapy Notes', checked: true },
              { id: 'intake', label: 'Intake/Assessment', checked: false },
              { id: 'treatment_plan_note', label: 'Treatment Plan Updates', checked: false },
            ],
            answered: false,
          },
        },
        700,
      );
    } else if (phase === 'example_preview_confirm') {
      const approved = value === 'yes';
      if (approved) {
        setPhase('trigger_config');
        simulateAIResponse(
          'The rule looks right. Now let\'s configure **when** this workflow should run:',
          {
            structured: {
              type: 'radio',
              question: 'When should this workflow trigger?',
              options: TRIGGER_TYPES.map(t => ({
                id: t.id,
                label: t.label,
                description: t.description,
              })),
              selected: null,
            },
          },
          700,
        );
      } else {
        setPhase('rule_refinement');
        simulateAIResponse(
          'No problem — let me know what should be different. For example:\n\n• Should the threshold be higher or lower?\n• Should I ignore certain note types or clinician groups?\n• Should I look for a different pattern?',
          {},
          700,
        );
      }
    } else if (phase === 'trigger_config') {
      setCollectedConfig(prev => ({ ...prev, trigger: value }));
      const trigger = TRIGGER_TYPES.find(t => t.id === value);
      if (selectedTemplate) {
        buildCanvasFromTemplate(selectedTemplate, value);
      }
      setPhase('action_config');
      simulateAIResponse(
        `Set to **${trigger?.label}**. Now, what should happen when an issue is found?`,
        {
          structured: {
            type: 'checkbox',
            question: 'Select one or more actions:',
            options: ACTION_TYPES.map(a => ({
              id: a.id,
              label: a.label,
              description: a.description,
              checked: selectedTemplate?.defaultActions?.includes(a.id) || false,
            })),
            answered: false,
          },
        },
        700,
      );
    } else if (phase === 'action_config') {
      const selectedActions = Array.isArray(value) ? value : [value];
      setCollectedConfig(prev => ({ ...prev, actions: selectedActions }));
      if (selectedTemplate) {
        buildCanvasFromTemplate(selectedTemplate, collectedConfig.trigger, selectedActions);
      }
      const hasRouting = selectedActions.includes('flag_route') || selectedActions.includes('task');
      if (hasRouting) {
        setPhase('routing');
        simulateAIResponse(
          'Who should flagged items be routed to?',
          {
            structured: {
              type: 'radio',
              question: 'Route flagged items to:',
              options: [
                { id: 'supervisor', label: 'Direct supervisor', description: 'Route each flag to the clinician\'s assigned supervisor' },
                { id: 'workflow_owner', label: 'Workflow owner (you)', description: 'All flags come to your review queue' },
                { id: 'round_robin', label: 'QA team round-robin', description: 'Distribute evenly among QA reviewers' },
              ],
              selected: null,
            },
          },
          700,
        );
      } else {
        showFinalConfirmation(selectedActions);
      }
    } else if (phase === 'routing') {
      setCollectedConfig(prev => ({ ...prev, routing: value }));
      showFinalConfirmation(collectedConfig.actions);
    }
  }, [phase, simulateAIResponse, selectedTemplate, collectedConfig, buildCanvasFromTemplate]);

  const showFinalConfirmation = useCallback((actions) => {
    const triggerLabel = TRIGGER_TYPES.find(t => t.id === collectedConfig.trigger)?.label || 'Real-time';
    const actionLabels = (actions || collectedConfig.actions || []).map(aId => ACTION_TYPES.find(a => a.id === aId)?.label).filter(Boolean);
    const routeLabel = collectedConfig.routing
      ? { supervisor: 'Direct Supervisor', workflow_owner: 'Workflow Owner', round_robin: 'QA Team (Round-robin)' }[collectedConfig.routing] || collectedConfig.routing
      : null;

    const ruleCount = collectedConfig.rules?.length || selectedTemplate?.rules?.length || 0;
    const ruleNames = (collectedConfig.rules || []).map(rId => {
      const rule = selectedTemplate?.rules?.find(r => r.id === rId);
      return rule?.label;
    }).filter(Boolean);

    setPhase('complete');
    simulateAIResponse(
      'Your workflow is configured and ready to go:',
      {
        type: 'confirmation',
        summary: {
          name: workflowName || 'Custom Workflow',
          sources: selectedTemplate?.dataSources.map((dsId) => DATA_SOURCES.find((d) => d.id === dsId)?.label).filter(Boolean) || [],
          rules: ruleNames.length > 0 ? ruleNames : null,
          ruleCount,
          trigger: triggerLabel,
          actions: actionLabels,
          routing: routeLabel,
          scope: 'All BH, SUD clinicians',
          estimatedVolume: '~1,200 notes/day',
        },
      },
      800,
    );
  }, [collectedConfig, workflowName, selectedTemplate, simulateAIResponse]);

  const handleCheckboxToggle = useCallback((optionId) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 && msg.structured?.type === 'checkbox'
          ? {
              ...msg,
              structured: {
                ...msg.structured,
                options: msg.structured.options.map((o) =>
                  o.id === optionId ? { ...o, checked: !o.checked } : o
                ),
              },
            }
          : msg
      )
    );
  }, []);

  const handleConfirmCheckbox = useCallback(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.structured) {
      lastMsg.structured.answered = true;
      setMessages([...messages]);
      const selectedIds = lastMsg.structured.options.filter((o) => o.checked).map((o) => o.id);

      if (phase === 'rule_definition') {
        handleStructuredResponse('checkbox', selectedIds);
      } else if (phase === 'scope_definition') {
        setCollectedConfig(prev => ({ ...prev, noteTypes: selectedIds }));
        const templateId = selectedTemplate?.id;
        const example = EXAMPLE_PREVIEWS[templateId];
        if (example) {
          setPhase('example_preview');
          simulateAIResponse(
            `Based on your rules and scope, here's an example of what this workflow would flag. Does this look like the kind of issue you want to catch?`,
            { examplePreview: example },
            900,
          );
        } else {
          setPhase('trigger_config');
          simulateAIResponse(
            'Now let\'s configure **when** this workflow should run:',
            {
              structured: {
                type: 'radio',
                question: 'When should this workflow trigger?',
                options: TRIGGER_TYPES.map(t => ({
                  id: t.id,
                  label: t.label,
                  description: t.description,
                })),
                selected: null,
              },
            },
            700,
          );
        }
      } else if (phase === 'action_config') {
        handleStructuredResponse('checkbox', selectedIds);
      }
    }
  }, [messages, phase, selectedTemplate, simulateAIResponse, handleStructuredResponse]);

  const handleExampleApproval = useCallback((approved) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.examplePreview) {
        last.exampleConfirmed = approved;
      }
      return [...updated];
    });

    if (approved) {
      setMessages((prev) => [...prev, { role: 'user', content: 'Yes, this is exactly the kind of issue I want to catch.' }]);
      setPhase('trigger_config');
      const defaultTrigger = selectedTemplate?.defaultTrigger;
      simulateAIResponse(
        'The rule is confirmed. Now let\'s configure **when** this workflow should run:',
        {
          structured: {
            type: 'radio',
            question: 'When should this workflow trigger?',
            options: TRIGGER_TYPES.map(t => ({
              id: t.id,
              label: t.label,
              description: t.description,
            })),
            selected: null,
          },
        },
        700,
      );
    } else {
      setMessages((prev) => [...prev, { role: 'user', content: 'Not quite — I want to adjust the rule.' }]);
      setPhase('rule_refinement');
      simulateAIResponse(
        'No problem — tell me what should be different. For example:\n\n- Should a specific rule be more or less sensitive?\n- Should certain clinician groups, programs, or sites be excluded?\n- Is there a condition or threshold that needs to change?',
        {},
        700,
      );
    }
  }, [simulateAIResponse]);

  const handleUserMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    if (phase === 'welcome') {
      setPhase('building');
      setWorkflowName(text.slice(0, 60));
      setCollectedConfig({});

      const mentionsNotes = /note|documentation|document|progress/i.test(text);
      const mentionsTxPlan = /treatment plan|plan|goals|objective/i.test(text);
      const mentionsService = /service code|cpt|billing|code/i.test(text);
      const mentionsAuth = /auth|authorization|units|elig/i.test(text);
      const mentionsAssess = /assessment|phq|gad|outcome/i.test(text);
      const mentionsPrev = /copy|paste|duplicate|previous|similar/i.test(text);

      const detectedSources = [];
      if (mentionsNotes) detectedSources.push('progress_notes');
      if (mentionsTxPlan) detectedSources.push('treatment_plan');
      if (mentionsService) detectedSources.push('service_codes');
      if (mentionsAuth) detectedSources.push('auth_records');
      if (mentionsAssess) detectedSources.push('assessments');
      if (mentionsPrev) detectedSources.push('previous_notes');
      if (detectedSources.length === 0) detectedSources.push('progress_notes', 'treatment_plan');

      const sources = detectedSources.map((dsId) => DATA_SOURCES.find((d) => d.id === dsId)).filter(Boolean);
      const sourceNames = sources.map((s) => `**${s.label}**`).join(', ');

      const trigger = TRIGGER_TYPES[0];
      const newNodes = [];
      const newEdges = [];

      newNodes.push({
        id: 'trigger',
        type: 'trigger',
        position: { x: -160, y: 40 + ((sources.length - 1) * 120) / 2 - 20 },
        data: { ...trigger },
      });

      sources.forEach((ds, i) => {
        newNodes.push({
          id: `ds-${ds.id}`,
          type: 'dataSource',
          position: { x: 50, y: 40 + i * 120 },
          data: { ...ds },
        });
        newEdges.push({
          id: `e-trigger-${ds.id}`,
          source: 'trigger',
          target: `ds-${ds.id}`,
          ...EDGE_DEFAULTS,
        });
      });

      const centerY = 40 + ((sources.length - 1) * 120) / 2;
      const processingSteps = [
        { type: 'check', label: 'Analyze content' },
        { type: 'filter', label: 'Apply criteria' },
      ];

      processingSteps.forEach((step, i) => {
        const meta = PROCESSING_STEPS.find((p) => p.id === step.type);
        const nodeId = `step-${i}`;
        newNodes.push({
          id: nodeId,
          type: 'processing',
          position: { x: 290 + i * 220, y: centerY - 30 },
          data: { ...meta, label: step.label },
        });
        if (i === 0) {
          sources.forEach((ds) => {
            newEdges.push({
              id: `e-${ds.id}-${nodeId}`,
              source: `ds-${ds.id}`,
              target: nodeId,
              ...EDGE_DEFAULTS,
            });
          });
        } else {
          newEdges.push({
            id: `e-step-${i - 1}-${nodeId}`,
            source: `step-${i - 1}`,
            target: nodeId,
            ...EDGE_DEFAULTS,
          });
        }
      });

      const flagAction = ACTION_TYPES[0];
      newNodes.push({
        id: 'action-0',
        type: 'action',
        position: { x: 290 + processingSteps.length * 220, y: centerY - 30 },
        data: { ...flagAction },
      });
      newEdges.push({
        id: `e-step-${processingSteps.length - 1}-action-0`,
        source: `step-${processingSteps.length - 1}`,
        target: 'action-0',
        ...EDGE_DEFAULTS,
      });

      setNodes(newNodes);
      setEdges(newEdges);

      const mentionsGoldenThread = /golden thread|treatment plan|plan alignment|goal|objective/i.test(text);
      const mentionsIntervention = /intervention|service code|cpt|scope|action.*oriented/i.test(text);
      const mentionsProgress = /progress|regression|no change|stagnation/i.test(text);
      const mentionsCopyPaste = /copy|paste|duplicate|similar|identical/i.test(text);
      const mentionsAuthRule = /auth|utilization|units|expir|denial|claim/i.test(text);
      const mentionsSafety = /safety|risk|crisis|suicid|harm|mandated/i.test(text);

      let inferredRules = [];
      if (mentionsGoldenThread) {
        inferredRules = [
          { id: 'therapeutic_services_match', label: 'Therapeutic Services Match', description: 'Does the service type in the progress note appear in the treatment plan?', checked: true },
          { id: 'goal_objective_linkage', label: 'Goal/Objective Linkage', description: 'Does the note reference a specific treatment plan objective linked to session interventions?', checked: true },
          { id: 'clinical_problem_alignment', label: 'Clinical Problem Alignment', description: 'Are the clinical problems discussed connected to those in the treatment plan?', checked: true },
        ];
      } else if (mentionsIntervention) {
        inferredRules = [
          { id: 'action_oriented', label: 'Action-Oriented', description: 'Does the intervention represent a specific clinical action taken by the provider?', checked: true },
          { id: 'scope_aligned', label: 'Scope-Aligned', description: 'Does the intervention align with the service code of the session?', checked: true },
          { id: 'clinical_relevance', label: 'Clinical Relevance', description: 'Does the intervention address a documented symptom, barrier, or clinical problem?', checked: true },
          { id: 'client_response', label: "Client's Response", description: "Does the note include the client's emotional, verbal, or behavioral response?", checked: true },
        ];
      } else if (mentionsProgress) {
        inferredRules = [
          { id: 'identified_progress_statement', label: 'Identified Progress Statement', description: "Explicit statement indicating the client's progress status and directionality.", checked: true },
          { id: 'progress_related_to_treatment', label: 'Progress Related to Treatment', description: "Does the progress statement reflect the client's movement in therapy?", checked: true },
          { id: 'regression_explanation', label: 'Explanation for Regression / No Change', description: 'If regression or no change, is a reason or contributing factor provided?', checked: true },
        ];
      } else if (mentionsCopyPaste) {
        inferredRules = [
          { id: 'copy_paste_check', label: 'Duplicate Content Detection', description: 'Does the note have less than 95% similarity to a previous note by the same provider?', checked: true },
          { id: 'empty_note_check', label: 'Minimum Content Check', description: 'Does the note contain more than 10 words?', checked: true },
        ];
      } else if (mentionsAuthRule) {
        inferredRules = [
          { id: 'auth_expiration', label: 'Authorization Expiration Check', description: 'Is the authorization expiring within 30 days?', checked: true },
          { id: 'remaining_units', label: 'Remaining Units Check', description: 'Does the client have sufficient authorized units?', checked: true },
          { id: 'reauth_documentation', label: 'Re-auth Documentation Sufficiency', description: 'Is documentation sufficient to support a re-auth request?', checked: true },
        ];
      } else if (mentionsSafety) {
        inferredRules = [
          { id: 'safety_concern', label: 'Safety Concern Detection', description: 'Are there mentions of suicidal ideation, self-harm, or safety risks?', checked: true },
          { id: 'crisis_indicator', label: 'Crisis Indicator Flagging', description: 'Do clinical indicators suggest elevated risk or need for crisis intervention?', checked: true },
          { id: 'mandated_reporting', label: 'Mandated Reporting Triggers', description: 'Are there statements that may trigger mandated reporting obligations?', checked: true },
        ];
      }

      if (inferredRules.length > 0) {
        simulateAIResponse(
          `I can build that. I'll pull from ${sourceNames}. Based on what you described, here are the rules I'd apply — adjust as needed:`,
          {
            structured: {
              type: 'checkbox',
              question: 'Proposed rules',
              options: inferredRules,
              answered: false,
            },
          },
          1200,
        );
        setPhase('rule_definition');
      } else {
        simulateAIResponse(
          `I can build that. I'll pull from ${sourceNames}. Tell me more about the specific rule — what exactly should I check, compare, or flag?`,
          {},
          1200,
        );
      }
    } else if (phase === 'rule_refinement') {
      const templateId = selectedTemplate?.id;
      const example = EXAMPLE_PREVIEWS[templateId];
      if (example) {
        setPhase('example_preview');
        simulateAIResponse(
          `I've adjusted the rules based on your feedback. Here's an updated example of what the workflow would flag — does this look right now?`,
          { examplePreview: example },
          1000,
        );
      } else {
        setPhase('trigger_config');
        simulateAIResponse(
          `Got it — I've updated the rules. Let's configure **when** this should run:`,
          {
            structured: {
              type: 'radio',
              question: 'When should this workflow trigger?',
              options: TRIGGER_TYPES.map(t => ({
                id: t.id,
                label: t.label,
                description: t.description,
              })),
              selected: null,
            },
          },
          1000,
        );
      }
    } else {
      simulateAIResponse(
        `Got it — I've updated the workflow based on your input. The canvas reflects the changes.`,
        {},
        800,
      );
    }
  }, [inputValue, phase, simulateAIResponse, setNodes, setEdges]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#FAFAFA' }}>
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workflows')}
            className="flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-5 bg-[#E5E5E5]" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Untitled Workflow"
            className="text-[15px] font-semibold bg-transparent border-none outline-none text-[#171717] placeholder:text-[#A3A3A3] w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestWorkflow}
            className="btn-secondary px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
            disabled={isSimulating || nodes.length === 0}
          >
            {isSimulating ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E5E5E5] border-t-[#2d4ccd] animate-spin" />
            ) : (
              <Icon name="play" className="w-3.5 h-3.5" />
            )}
            Test
          </button>
          <button className="btn-secondary px-3.5 py-1.5 rounded-lg text-sm font-medium">
            Save Draft
          </button>
          <button
            className="btn-primary px-4 py-1.5 rounded-lg text-sm font-medium"
            onClick={activateWorkflow}
          >
            Activate
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Chat panel */}
        <div style={{ width: 440, flexShrink: 0, borderRight: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column', background: 'white', zIndex: 10, height: '100%', overflow: 'hidden' }}>
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 scroll-smooth">
            {phase === 'welcome' && messages.length === 0 && (
              <WelcomeState onTemplateSelect={handleTemplateSelect} onBlankCanvas={handleBlankCanvas} />
            )}

            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                message={msg}
                onStructuredResponse={handleStructuredResponse}
                onCheckboxToggle={handleCheckboxToggle}
                onConfirmCheckbox={handleConfirmCheckbox}
                onActivate={activateWorkflow}
                onKeepRefining={() => setPhase('rule_refinement')}
                onExampleApproval={handleExampleApproval}
              />
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 mb-5 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center text-[#171717] shrink-0">
                  <Icon name="brain" className="w-3.5 h-3.5" />
                </div>
                <div className="flex gap-1.5 py-2.5 px-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-[#E5E5E5] bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
                placeholder={phase === 'welcome' ? 'Describe what you want to automate...' : 'Refine or ask a question...'}
                className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-sm outline-none focus:border-[#2d4ccd] transition-all placeholder:text-[#A3A3A3] text-[#171717]"
              />
              <button
                onClick={handleUserMessage}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2d4ccd] text-white hover:bg-[#293d87] transition-colors shrink-0 disabled:opacity-30"
                disabled={!inputValue.trim()}
              >
                <Icon name="arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-[#FAFAFA]">
          {nodes.length === 0 ? (
            <CanvasEmptyState />
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={NODE_TYPES}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#E5E5E5" gap={24} size={1.5} />
              <Controls
                showInteractive={false}
                style={{ borderRadius: 8, border: '1px solid #E5E5E5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: 'white' }}
              />
            </ReactFlow>
          )}

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl border border-[#E5E5E5] p-3 shadow-sm w-56">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2">Data Sources</p>
            <div className="grid grid-cols-3 gap-1.5">
              {DATA_SOURCES.map((ds) => (
                <button
                  key={ds.id}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[#FAFAFA] border border-transparent hover:border-[#E5E5E5] transition-all text-center group"
                  title={ds.description}
                  onClick={() => {
                    const existingNode = nodes.find((n) => n.id === `ds-${ds.id}`);
                    if (existingNode) return;
                    setNodes((prev) => [
                      ...prev,
                      {
                        id: `ds-${ds.id}`,
                        type: 'dataSource',
                        position: { x: 50, y: prev.filter((n) => n.type === 'dataSource').length * 120 + 40 },
                        data: { ...ds },
                      },
                    ]);
                    simulateAIResponse(
                      `Added **${ds.label}** as a data source. How should this feed into the workflow?`,
                    );
                  }}
                >
                  <Icon name={ds.icon} className="w-4 h-4 text-[#737373] group-hover:text-[#171717] transition-colors" />
                  <span className="text-[9px] font-medium leading-tight text-[#737373] group-hover:text-[#171717]">{ds.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedNode && (
            <NodeConfigPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeState({ onTemplateSelect, onBlankCanvas }) {
  const categories = PRODUCT_CATEGORIES.map(c => ({ id: c.id, label: c.name, icon: c.icon, logo: c.logo }));

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-7 h-7 rounded-full bg-[#2d4ccd] flex items-center justify-center text-white shrink-0">
          <Icon name="brain" className="w-3.5 h-3.5" />
        </div>
        <div className="pt-0.5">
          <p className="text-[15px] font-semibold text-[#171717] mb-1">What would you like to automate?</p>
          <p className="text-sm text-[#737373] leading-relaxed">
            Describe your rule, or pick a template to start.
          </p>
        </div>
      </div>

      <div className="ml-10 space-y-2">
        <button
          onClick={onBlankCanvas}
          className="w-full text-left p-3.5 rounded-xl border border-[#E5E5E5] hover:border-[#171717] bg-white transition-all group"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <Icon name="plus" className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#171717] transition-colors" />
            <span className="text-sm font-semibold text-[#171717]">Blank Canvas</span>
          </div>
          <p className="text-xs text-[#737373] ml-6 leading-relaxed">Describe your rule from scratch.</p>
        </button>

        {categories.map(cat => {
          const templates = WORKFLOW_TEMPLATES.filter(t => t.category === cat.id);
          if (templates.length === 0) return null;
          return (
            <div key={cat.id}>
              <div className="py-1.5 flex items-center gap-1.5">
                <ProductLogo logo={cat.logo} icon={cat.icon} size={16} className="opacity-50" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3]">{cat.label}</p>
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="w-full text-left p-3.5 rounded-xl border border-[#E5E5E5] hover:border-[#171717] bg-white transition-all group mb-1.5"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <Icon name={template.icon} className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#171717] transition-colors" />
                    <span className="text-sm font-semibold text-[#171717]">{template.name}</span>
                    {template.appliesTo && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] whitespace-nowrap ml-auto">{template.appliesTo}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373] ml-6 leading-relaxed">{template.description}</p>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatMessage({ message, onStructuredResponse, onCheckboxToggle, onConfirmCheckbox, onActivate, onKeepRefining, onExampleApproval }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-5">
        <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] max-w-[85%] bg-[#2d4ccd] text-white leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] shrink-0">
        <Icon name="brain" className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-[13px] text-[#171717] leading-relaxed">
          <FormattedText text={message.content} />
        </div>

        {message.examplePreview && message.exampleConfirmed == null && (
          <ExamplePreviewCard
            example={message.examplePreview}
            onApprove={() => onExampleApproval(true)}
            onReject={() => onExampleApproval(false)}
          />
        )}

        {message.examplePreview && message.exampleConfirmed != null && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#2e7d32' }}>
            <Icon name="check-circle" className="w-3.5 h-3.5" />
            {message.exampleConfirmed ? 'Rule confirmed' : 'Rule adjusted'}
          </div>
        )}

        {message.structured && !message.structured.answered && (
          <div className="mt-3">
            {message.structured.type === 'radio' && (
              <RadioPrompt
                question={message.structured.question}
                options={message.structured.options}
                selected={message.structured.selected}
                onSelect={(id) => onStructuredResponse('radio', id)}
              />
            )}
            {message.structured.type === 'checkbox' && (
              <CheckboxPrompt
                question={message.structured.question}
                options={message.structured.options}
                onToggle={onCheckboxToggle}
                onConfirm={onConfirmCheckbox}
              />
            )}
          </div>
        )}

        {message.structured?.answered && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#2e7d32' }}>
            <Icon name="check-circle" className="w-3.5 h-3.5" />
            Answered
          </div>
        )}

        {message.type === 'confirmation' && message.summary && (
          <ConfirmationCard
            summary={message.summary}
            onActivate={onActivate}
            onKeepRefining={onKeepRefining}
          />
        )}
      </div>
    </div>
  );
}

function ExamplePreviewCard({ example, onApprove, onReject }) {
  const severityColors = {
    'Critical': { bg: '#ffebee', color: '#c62828', dot: '#c62828' },
    'High': { bg: '#fff3e0', color: '#e65100', dot: '#e65100' },
    'Medium': { bg: '#fff3e0', color: '#e65100', dot: '#e65100' },
    'Low': { bg: '#e8f5e9', color: '#2e7d32', dot: '#2e7d32' },
  };
  const sev = severityColors[example.severity] || severityColors['Medium'];

  return (
    <div className="mt-4 border border-[#E5E5E5] rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between" style={{ background: 'rgba(45,76,205,0.06)' }}>
        <div className="flex items-center gap-2">
          <Icon name="eye" className="w-3.5 h-3.5 text-[#737373]" />
          <span className="text-xs font-semibold text-[#404040] uppercase tracking-wider">Example Flag Preview</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sev.bg, color: sev.color }}>
          {example.severity}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4 text-xs text-[#737373]">
          <span><strong className="text-[#171717]">{example.client}</strong></span>
          <span>{example.clinician}</span>
          <span>{example.noteDate}</span>
          <span>{example.noteType}</span>
        </div>

        <div className="rounded-lg p-3 border-l-2" style={{ borderColor: sev.color, background: sev.bg + '40' }}>
          <p className="text-[13px] text-[#171717] leading-relaxed font-medium">{example.finding}</p>
        </div>

        {example.ruleTriggered && (
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <Icon name="zap" className="w-3 h-3" />
            <span>Rule: <strong className="text-[#404040]">{example.ruleTriggered}</strong></span>
          </div>
        )}

        <div className="rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-1.5">Note Excerpt</p>
          <p className="text-xs text-[#404040] leading-relaxed italic">"{example.noteExcerpt}"</p>
        </div>

        {example.audioExcerpt && (
          <div className="rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-1.5">Additional Source</p>
            <p className="text-xs text-[#404040] leading-relaxed italic">"{example.audioExcerpt}"</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-[#737373] pt-1">
          <span>Confidence: <strong className="text-[#171717]">{example.confidence}</strong></span>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[#E5E5E5] bg-[#FAFAFA]">
        <p className="text-xs text-[#737373] mb-3">Is this the kind of issue you want to catch?</p>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#2d4ccd] text-white hover:bg-[#293d87] transition-colors flex items-center justify-center gap-1.5"
          >
            <Icon name="thumbs-up" className="w-3 h-3" />
            Yes, this is right
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] text-[#404040] hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Icon name="thumbs-down" className="w-3 h-3" />
            Adjust the rule
          </button>
        </div>
      </div>
    </div>
  );
}

function FormattedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-[#171717]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function RadioPrompt({ question, options, selected, onSelect }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2.5">{question}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full text-left p-2.5 rounded-lg border transition-all ${
              selected === opt.id ? 'border-[#2d4ccd] bg-white shadow-sm' : 'border-transparent bg-white hover:border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selected === opt.id ? 'border-[#2d4ccd]' : 'border-[#A3A3A3]'
                }`}
              >
                {selected === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#2d4ccd]" />}
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#171717]">{opt.label}</p>
                {opt.description && <p className="text-[11px] text-[#737373] mt-0.5">{opt.description}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxPrompt({ question, options, onToggle, onConfirm }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] mb-2.5">{question}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={`w-full text-left p-2.5 rounded-lg border transition-all ${
              opt.checked ? 'border-[#2d4ccd] bg-white shadow-sm' : 'border-transparent bg-white hover:border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                  opt.checked ? 'border-[#2d4ccd] bg-[#2d4ccd]' : 'border-[#A3A3A3] bg-white'
                }`}
              >
                {opt.checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#171717]">{opt.label}</span>
                  {opt.priority && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                      opt.priority.startsWith('Critical') ? 'bg-[#ffebee] text-[#c62828]' : 'bg-[#fff3e0] text-[#e65100]'
                    }`}>{opt.priority.startsWith('Critical') ? 'Critical' : 'High'}</span>
                  )}
                  {opt.badge && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] shrink-0">{opt.badge}</span>
                  )}
                </div>
                {opt.description && <p className="text-[11px] text-[#737373] mt-0.5">{opt.description}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onConfirm}
        className="mt-3 w-full py-2 rounded-lg text-xs font-semibold bg-[#2d4ccd] text-white hover:bg-[#293d87] transition-colors"
      >
        Confirm
      </button>
    </div>
  );
}

function ConfirmationCard({ summary, onActivate, onKeepRefining }) {
  return (
    <div className="mt-4 border border-[#E5E5E5] rounded-xl overflow-hidden bg-white">
      <div className="p-4 bg-[#FAFAFA] border-b border-[#E5E5E5]">
        <h4 className="font-semibold text-[14px] text-[#171717] mb-3">{summary.name}</h4>
        <div className="space-y-2.5 text-[13px]">
          <ConfirmRow label="Sources" value={summary.sources.join(', ')} />
          {summary.rules && summary.rules.length > 0 && (
            <div>
              <span className="text-[#737373] text-[13px]">Rules</span>
              <div className="mt-1.5 space-y-1">
                {summary.rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#404040]">
                    <Icon name="check-circle" className="w-3 h-3 shrink-0" style={{ color: '#2e7d32' }} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!summary.rules && summary.ruleCount > 0 && (
            <ConfirmRow label="Rules" value={`${summary.ruleCount} active`} />
          )}
          <ConfirmRow label="Trigger" value={summary.trigger} icon="zap" highlight />
          {summary.actions && summary.actions.length > 0 && (
            <ConfirmRow label="Actions" value={summary.actions.join(', ')} icon="flag" highlight />
          )}
          {summary.routing && (
            <ConfirmRow label="Route to" value={summary.routing} />
          )}
          <ConfirmRow label="Scope" value={summary.scope} />
          <ConfirmRow label="Est. volume" value={summary.estimatedVolume} />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <button
          onClick={onActivate}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#2d4ccd] text-white hover:bg-[#293d87] transition-colors"
        >
          Activate Workflow
        </button>
        <div className="flex gap-2">
          <button
            onClick={onActivate}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAFA] transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={onKeepRefining}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAFA] transition-colors"
          >
            Keep Refining
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value, icon, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#737373]">{label}</span>
      <span className={`font-medium flex items-center gap-1.5 ${highlight ? 'text-[#171717]' : 'text-[#404040]'}`}>
        {icon && <Icon name={icon} className="w-3 h-3 text-[#737373]" />}
        {value}
      </span>
    </div>
  );
}

function CanvasEmptyState() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center max-w-xs">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-5 bg-white border border-[#E5E5E5] flex items-center justify-center">
          <Icon name="layers" className="w-7 h-7 text-[#A3A3A3]" strokeWidth={1} />
        </div>
        <p className="font-semibold text-[15px] text-[#171717] mb-1.5">Workflow Canvas</p>
        <p className="text-sm text-[#737373] leading-relaxed">
          Describe what you want to automate, or select a template to get started.
        </p>
      </div>
    </div>
  );
}

function TriggerNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-xl border-2 border-dashed border-[#A3A3A3] bg-white shadow-sm min-w-[140px] cursor-pointer hover:border-[#2d4ccd] transition-all">
      <Handle type="source" position={Position.Right} style={{ background: '#2d4ccd', width: 6, height: 6, border: 'none' }} />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#171717]">
          <Icon name={data.icon} className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Trigger</p>
          <p className="text-[13px] font-semibold text-[#171717]">{data.label}</p>
        </div>
      </div>
    </div>
  );
}

function DataSourceNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white shadow-sm min-w-[150px] cursor-pointer hover:border-[#A3A3A3] transition-all">
      <Handle type="target" position={Position.Left} style={{ background: '#A3A3A3', width: 6, height: 6, border: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#2d4ccd', width: 6, height: 6, border: 'none' }} />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#FAFAFA] flex items-center justify-center text-[#171717]">
          <Icon name={data.icon} className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Source</p>
          <p className="text-[13px] font-semibold text-[#171717]">{data.label}</p>
        </div>
      </div>
    </div>
  );
}

function ProcessingNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white shadow-sm min-w-[150px] cursor-pointer hover:border-[#A3A3A3] transition-all">
      <Handle type="target" position={Position.Left} style={{ background: '#A3A3A3', width: 6, height: 6, border: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#2d4ccd', width: 6, height: 6, border: 'none' }} />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#FAFAFA] flex items-center justify-center text-[#171717]">
          <Icon name={data.icon} className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Step</p>
          <p className="text-[13px] font-semibold text-[#171717]">{data.label}</p>
        </div>
      </div>
    </div>
  );
}

function OutputNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white shadow-sm min-w-[150px] cursor-pointer hover:border-[#2e7d32] transition-all">
      <Handle type="target" position={Position.Left} style={{ background: '#2e7d32', width: 6, height: 6, border: 'none' }} />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#e8f5e9] flex items-center justify-center" style={{ color: '#2e7d32' }}>
          <Icon name={data.icon} className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#2e7d32' }}>Output</p>
          <p className="text-[13px] font-semibold text-[#171717]">{data.label}</p>
        </div>
      </div>
    </div>
  );
}

function ActionNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-xl border-2 border-[#2d4ccd] bg-white shadow-sm min-w-[140px] cursor-pointer hover:shadow-md transition-all">
      <Handle type="target" position={Position.Left} style={{ background: '#2d4ccd', width: 6, height: 6, border: 'none' }} />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#2d4ccd] flex items-center justify-center text-white">
          <Icon name={data.icon} className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">Action</p>
          <p className="text-[13px] font-semibold text-[#171717]">{data.label}</p>
        </div>
      </div>
    </div>
  );
}

function generateSampleFlags(workflowId, dsIds, workflowName) {
  const clients = [
    { name: 'Alexis Jordan', clinician: 'Emily Chen', noteType: 'Individual Progress Note' },
    { name: 'Derek Washington', clinician: 'James Wilson', noteType: 'Individual Progress Note' },
    { name: 'Priya Patel', clinician: 'Anthony Brown', noteType: 'Group Therapy Note' },
    { name: 'Carlos Mendez', clinician: 'Rachel Torres', noteType: 'Individual Progress Note' },
    { name: 'Tamika Harris', clinician: 'David Park', noteType: 'Individual Progress Note' },
  ];
  const findings = [
    { text: 'Goal/Objective Linkage failure — session focus on anger management not linked to any treatment plan objective.', severity: 'critical', confidence: 0.92 },
    { text: 'Intervention not scope-aligned — family therapy interventions documented for session billed as individual therapy.', severity: 'high', confidence: 0.91 },
    { text: 'Client response not documented — note describes interventions but not the client\'s response.', severity: 'medium', confidence: 0.85 },
    { text: 'Copy-paste detected — 97% similarity to previous note by same provider.', severity: 'high', confidence: 0.97 },
    { text: 'Progress not mentioned — note describes session activities without any progress statement.', severity: 'low', confidence: 0.82 },
  ];
  const excerpts = [
    'Focused on anger management techniques. Practiced deep breathing and cognitive restructuring for anger triggers.',
    'Conducted family systems assessment with client and mother present. Explored family dynamics.',
    'Provided psychoeducation on relapse prevention. Led group CBT exercise on identifying triggers.',
    'Client discussed ongoing stressors related to housing instability. Utilized CBT techniques to reframe negative thought patterns.',
    'Client participated in group exercise on relapse prevention. Shared personal triggers with group.',
  ];

  return clients.map((c, i) => {
    const f = findings[i];
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      id: `${workflowId}-flag-${i + 1}`,
      workflowId,
      clientName: c.name,
      clinician: c.clinician,
      severity: f.severity,
      confidence: f.confidence,
      finding: f.text,
      noteType: c.noteType,
      noteDate: d.toISOString().slice(0, 10),
      status: 'unreviewed',
      dataSources: dsIds.slice(0, Math.min(dsIds.length, 2 + (i % 2))),
      noteExcerpt: excerpts[i],
      audioExcerpt: null,
      eligibilityNote: dsIds.includes('eligibility') && i === 3
        ? 'Authorization expires in 5 days. 2 of 16 approved units remaining.'
        : null,
    };
  });
}

function NodeConfigPanel({ node, onClose }) {
  return (
    <div className="absolute top-4 right-4 w-72 bg-white/90 backdrop-blur-md rounded-xl border border-[#E5E5E5] shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-3.5 border-b border-[#E5E5E5]">
        <p className="text-[13px] font-semibold text-[#171717]">Configure</p>
        <button onClick={onClose} className="text-[#A3A3A3] hover:text-[#171717] transition-colors">
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center text-[#171717]">
            <Icon name={node.data.icon} className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#171717]">{node.data.label}</p>
            {node.data.description && <p className="text-[11px] text-[#737373] mt-0.5">{node.data.description}</p>}
          </div>
        </div>
        {node.type === 'trigger' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Trigger Type</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                {TRIGGER_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Schedule</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                <option>On note submit</option>
                <option>6:00 AM daily</option>
                <option>Monday 7:00 AM</option>
                <option>Custom cron</option>
              </select>
            </div>
          </div>
        )}
        {node.type === 'dataSource' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Date Range</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Program Filter</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                <option>All Programs</option>
                <option>Adult Outpatient</option>
                <option>Child & Adolescent</option>
                <option>Substance Use</option>
              </select>
            </div>
          </div>
        )}
        {node.type === 'processing' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Sensitivity</label>
              <input type="range" min="1" max="100" defaultValue="70" className="w-full accent-[#2d4ccd]" />
              <div className="flex justify-between text-[10px] text-[#737373] mt-1">
                <span>Low</span><span>High</span>
              </div>
            </div>
          </div>
        )}
        {(node.type === 'output' || node.type === 'action') && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Route To</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                <option>Direct Supervisor</option>
                <option>Workflow Owner</option>
                <option>QA Team (Round-robin)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A3A3] block mb-1.5">Notification</label>
              <select className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[13px] text-[#171717] outline-none focus:border-[#2d4ccd]">
                <option>In-app + Email</option>
                <option>In-app only</option>
                <option>Email digest (daily)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
