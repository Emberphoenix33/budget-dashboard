import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function SpendingByCategory({ expenses }) {
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card className="chart-container h-100">
      <Card.Header className="bg-white">
        <h5 className="mb-0">🥧 Spending by Category</h5>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

function MonthlySpending({ expenses }) {
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = expense.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, amount]) => ({
      month,
      amount
    }));

  return (
    <Card className="chart-container h-100">
      <Card.Header className="bg-white">
        <h5 className="mb-0">📈 Monthly Spending Trend</h5>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              name="Spending"
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

function BudgetVsActual({ budgets }) {
  const data = budgets.map(budget => ({
    category: budget.category,
    Budget: budget.limit,
    Spent: budget.spent
  }));

  return (
    <Card className="chart-container h-100">
      <Card.Header className="bg-white">
        <h5 className="mb-0">📊 Budget vs Actual</h5>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Budget" fill="#0088FE" />
            <Bar dataKey="Spent" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

function VisualReports({ budgets = [], expenses = [] }) {
  const sampleExpenses = expenses.length > 0 ? expenses : [
    { date: '2026-03-01', category: 'Groceries', amount: 125.50, description: 'Weekly shopping' },
    { date: '2026-03-05', category: 'Entertainment', amount: 45.00, description: 'Movie tickets' },
    { date: '2026-03-10', category: 'Transportation', amount: 60.00, description: 'Gas' },
    { date: '2026-03-15', category: 'Groceries', amount: 98.75, description: 'Grocery run' },
    { date: '2026-03-18', category: 'Utilities', amount: 120.00, description: 'Electric bill' },
    { date: '2026-03-20', category: 'Dining Out', amount: 55.25, description: 'Restaurant' },
    { date: '2026-03-25', category: 'Entertainment', amount: 15.99, description: 'Streaming subscription' },
  ];

  const sampleBudgets = budgets.length > 0 ? budgets : [
    { category: 'Groceries', limit: 600, spent: 425.50, month: '2026-03' },
    { category: 'Entertainment', limit: 200, spent: 180.00, month: '2026-03' },
    { category: 'Transportation', limit: 300, spent: 150.75, month: '2026-03' },
    { category: 'Utilities', limit: 250, spent: 220.00, month: '2026-03' },
    { category: 'Dining Out', limit: 150, spent: 95.25, month: '2026-03' },
  ];

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">📉 Visual Reports</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6} lg={4}>
            <SpendingByCategory expenses={sampleExpenses} />
          </Col>
          <Col md={6} lg={4}>
            <MonthlySpending expenses={sampleExpenses} />
          </Col>
          <Col md={12} lg={4}>
            <BudgetVsActual budgets={sampleBudgets} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default VisualReports;
