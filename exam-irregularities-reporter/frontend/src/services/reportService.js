import { MOCK_REPORTS } from '../data/mockData';

let reports = [...MOCK_REPORTS];

const generateId = () => {
  const num = String(reports.length + 1).padStart(3, '0');
  return `EW-2024-${num}`;
};

export const reportService = {
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return [...reports];
  },

  getById: async (id) => {
    await new Promise((r) => setTimeout(r, 300));
    return reports.find((r) => r.id === id) || null;
  },

  submit: async (formData) => {
    await new Promise((r) => setTimeout(r, 900));
    const newReport = {
      ...formData,
      id: generateId(),
      priority: null,
      department: null,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      timeline: [
        { stage: 'Submitted', time: new Date().toISOString(), done: true },
        { stage: 'Pending', time: null, done: false },
        { stage: 'Assigned', time: null, done: false },
        { stage: 'In Progress', time: null, done: false },
        { stage: 'Resolved', time: null, done: false },
      ],
    };
    reports = [newReport, ...reports];
    return { success: true, report: newReport };
  },
};
