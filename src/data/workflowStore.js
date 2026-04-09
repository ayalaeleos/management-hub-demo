let createdWorkflows = [];
let createdFlags = [];
let listeners = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function getCreatedWorkflows() {
  return createdWorkflows;
}

export function getCreatedFlags() {
  return createdFlags;
}

export function addWorkflow(workflow, flags = []) {
  createdWorkflows = [workflow, ...createdWorkflows];
  createdFlags = [...flags, ...createdFlags];
  notify();
}

export function findWorkflow(id) {
  return createdWorkflows.find((w) => w.id === id);
}

export function findFlagsForWorkflow(id) {
  return createdFlags.filter((f) => f.workflowId === id);
}
