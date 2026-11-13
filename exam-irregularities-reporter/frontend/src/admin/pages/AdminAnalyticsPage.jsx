import { useEffect, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { reportService } from '../../services/reportService';

const PALETTE = ['#2878D0', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'];

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#142B4A]">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [reports, setReports] = useState([]);
  useEffect(() => { reportService.getAll().then(setReports); }, []);

  // Branch × Category heatmap data
  const branches = ['CSE', 'ECE', 'CIVL', 'ME', 'EEE', 'ISE'];
  const categories = ['Malpractice', 'Medical', 'Technical', 'Disturbance', 'Missing Script'];

  const branchCategoryData = branches.map((b) => {
    const row = { branch: b };
    categories.forEach((c) => {
      row[c] = reports.filter((r) => r.branch === b && r.category === c).length;
    });
    return row;
  });

  // Session distribution
  const sessionData = ['Morning', 'Afternoon', 'Evening'].map((s) => ({
    name: s,
    value: reports.filter((r) => r.session === s).length,
  }));

  // Priority per branch
  const priorityBranchData = branches.map((b) => ({
    branch: b,
    Critical: reports.filter((r) => r.branch === b && r.priority === 'Critical').length,
    High:     reports.filter((r) => r.branch === b && r.priority === 'High').length,
    Medium:   reports.filter((r) => r.branch === b && r.priority === 'Medium').length,
  }));

  // Dispatch status per department
  const depts = [...new Set(reports.map((r) => r.department).filter(Boolean))];
  const dispatchData = depts.map((d) => ({
    name: d.length > 18 ? d.slice(0, 16) + '…' : d,
    Dispatched: reports.filter((r) => r.department === d && r.dispatchStatus === 'Dispatched').length,
    Pending:    reports.filter((r) => r.department === d && r.dispatchStatus !== 'Dispatched').length,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Detailed breakdown of report data across all dimensions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Priority by Branch" subtitle="Stacked bar showing priority distribution per branch">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={priorityBranchData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Critical" stackId="a" fill="#e74c3c" radius={[0,0,0,0]} />
              <Bar dataKey="High"     stackId="a" fill="#f39c12" />
              <Bar dataKey="Medium"   stackId="a" fill="#2878D0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Session Distribution" subtitle="Reports by examination session">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sessionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {sessionData.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Category by Branch" subtitle="Number of reports per category for each branch">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={branchCategoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {categories.map((c, i) => (
                <Bar key={c} dataKey={c} stackId="b" fill={PALETTE[i % PALETTE.length]}
                  radius={i === categories.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Dispatch Status by Department" subtitle="Dispatched vs pending per department">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dispatchData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Dispatched" stackId="c" fill="#27ae60" radius={[0,0,0,0]} />
              <Bar dataKey="Pending"    stackId="c" fill="#f39c12" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
