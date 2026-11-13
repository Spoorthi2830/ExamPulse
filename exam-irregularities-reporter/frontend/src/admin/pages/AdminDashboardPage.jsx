import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Info,
  Send,
  Timer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '../../components/StatCard';
import { reportService } from '../../services/reportService';

const PALETTE = ['#2878D0', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#142B4A] mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => { reportService.getAll().then(setReports); }, []);

  const total     = reports.length;
  const critical  = reports.filter((r) => r.priority === 'Critical').length;
  const high      = reports.filter((r) => r.priority === 'High').length;
  const medium    = reports.filter((r) => r.priority === 'Medium').length;
  const pending   = reports.filter((r) => ['Submitted', 'Pending'].includes(r.status)).length;
  const dispatched = reports.filter((r) => r.dispatchStatus === 'Dispatched').length;
  const resolved  = reports.filter((r) => r.status === 'Resolved').length;

  const categoryData = ['Malpractice', 'Medical', 'Technical', 'Disturbance', 'Missing Script'].map(
    (cat) => ({ name: cat, value: reports.filter((r) => r.category === cat).length })
  );

  const priorityData = [
    { name: 'Critical', value: critical },
    { name: 'High',     value: high },
    { name: 'Medium',   value: medium },
  ];

  const branchData = ['CSE', 'ECE', 'CIVL', 'ME', 'EEE', 'ISE'].map((b) => ({
    name: b,
    Reports: reports.filter((r) => r.branch === b).length,
  }));

  const deptMap = {};
  reports.forEach((r) => { if (r.department) deptMap[r.department] = (deptMap[r.department] || 0) + 1; });
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Resolved',    value: resolved },
    { name: 'In Progress', value: reports.filter((r) => r.status === 'In Progress').length },
    { name: 'Pending',     value: pending },
  ];

  const dateMap = {};
  reports.forEach((r) => { dateMap[r.examDate] = (dateMap[r.examDate] || 0) + 1; });
  const timelineData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, Reports]) => ({ date: date.slice(5), Reports }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of all examination irregularity reports.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <StatCard label="Total"      value={total}      icon={ClipboardList} color="blue"   />
        <StatCard label="Critical"   value={critical}   icon={AlertTriangle} color="red"    />
        <StatCard label="High"       value={high}       icon={AlertTriangle} color="orange" />
        <StatCard label="Medium"     value={medium}     icon={Info}          color="purple" />
        <StatCard label="Pending"    value={pending}    icon={Timer}         color="orange" />
        <StatCard label="Dispatched" value={dispatched} icon={Send}          color="blue"   />
        <StatCard label="Resolved"   value={resolved}   icon={CheckCircle}   color="blue"   />
      </div>

      {/* Row 1 */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {categoryData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Priority Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={['#e74c3c', '#f39c12', '#2878D0'][i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Reports by Branch">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Reports" fill="#2878D0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department-wise Reports">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="#142B4A" radius={[0, 4, 4, 0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3 */}
      <div className="grid md:grid-cols-2 gap-5">
        <ChartCard title="Status Overview">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={['#27ae60', '#f39c12', '#e74c3c'][i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reports Over Time">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Reports" fill="#4A9FE8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
