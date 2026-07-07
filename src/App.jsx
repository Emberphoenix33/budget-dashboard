import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import BudgetTracking from './components/BudgetTracking';
import BillManagement from './components/BillManagement';
import VisualReports from './components/VisualReports';

const SAMPLE_DATA = {
  budgets: [
    { category: 'Groceries', limit: 600, spent: 425.50, month: '2026-03' },
    { category: 'Entertainment', limit: 200, spent: 180.00, month: '2026-03' },
    { category: 'Transportation', limit: 300, spent: 150.75, month: '2026-03' },
    { category: 'Utilities', limit: 250, spent: 220.00, month: '2026-03' },
    { category: 'Dining Out', limit: 150, spent: 95.25, month: '2026-03' },
  ],
  bills: [
    { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-04-01', paid: false, category: 'Rent/Mortgage' },
    { id: '2', name: 'Electric Bill', amount: 120, dueDate: '2026-03-25', paid: false, category: 'Utilities' },
    { id: '3', name: 'Internet', amount: 79.99, dueDate: '2026-03-28', paid: false, category: 'Internet/Phone' },
    { id: '4', name: 'Car Insurance', amount: 150, dueDate: '2026-03-15', paid: true, category: 'Insurance' },
    { id: '5', name: 'Netflix', amount: 15.99, dueDate: '2026-03-30', paid: false, category: 'Subscription' },
  ],
  expenses: [
    { date: '2026-03-01', category: 'Groceries', amount: 125.50, description: 'Weekly shopping' },
    { date: '2026-03-05', category: 'Entertainment', amount: 45.00, description: 'Movie tickets' },
    { date: '2026-03-10', category: 'Transportation', amount: 60.00, description: 'Gas' },
    { date: '2026-03-15', category: 'Groceries', amount: 98.75, description: 'Grocery run' },
    { date: '2026-03-18', category: 'Utilities', amount: 120.00, description: 'Electric bill' },
    { date: '2026-03-20', category: 'Dining Out', amount: 55.25, description: 'Restaurant' },
    { date: '2026-03-25', category: 'Entertainment', amount: 15.99, description: 'Streaming subscription' },
  ]
};

function DashboardSummary({ budgets, bills, expenses }) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalBills = bills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const overdueBills = bills.filter(b => !b.paid && new Date(b.dueDate) < new Date()).length;

  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="stat-card bg-primary text-white">
          <Card.Body>
            <h6>Total Budget</h6>
            <h3>${totalBudget.toFixed(2)}</h3>
            <small>Monthly</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stat-card bg-success text-white">
          <Card.Body>
            <h6>Total Spent</h6>
            <h3>${totalSpent.toFixed(2)}</h3>
            <small>{((totalSpent/totalBudget)*100).toFixed(1)}% of budget</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stat-card bg-info text-white">
          <Card.Body>
            <h6>Upcoming Bills</h6>
            <h3>${totalBills.toFixed(2)}</h3>
            <small>Unpaid</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className={`stat-card ${overdueBills > 0 ? 'bg-danger' : 'bg-secondary'} text-white`}>
          <Card.Body>
            <h6>Overdue Bills</h6>
            <h3>{overdueBills}</h3>
            <small>{overdueBills > 0 ? 'Action needed!' : 'All caught up'}</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function App() {
  const [budgets, setBudgets] = useState(SAMPLE_DATA.budgets);
  const [bills, setBills] = useState(SAMPLE_DATA.bills);
  const [expenses, setExpenses] = useState(SAMPLE_DATA.expenses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load from localStorage if available
      const savedBudgets = localStorage.getItem('budgets');
      const savedBills = localStorage.getItem('bills');
      const savedExpenses = localStorage.getItem('expenses');

      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      if (savedBills) setBills(JSON.parse(savedBills));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handle CSV import
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const categoryIdx = headers.findIndex(h => h.includes('category'));
    const amountIdx = headers.findIndex(h => h.includes('amount'));
    const descIdx = headers.findIndex(h => h.includes('description') || h.includes('desc'));

    if (dateIdx === -1 || amountIdx === -1) {
      alert('CSV must have at least Date and Amount columns');
      return;
    }

    const newExpenses = lines.slice(1).map((line, i) => {
      const cols = line.split(',').map(c => c.trim());
      return {
        id: `imported-${Date.now()}-${i}`,
        date: cols[dateIdx] || new Date().toISOString().split('T')[0],
        category: cols[categoryIdx] || 'Other',
        amount: parseFloat(cols[amountIdx]?.replace(/[^0-9.-]/g, '')) || 0,
        description: cols[descIdx] || 'Imported transaction'
      };
    }).filter(e => e.amount > 0);

    setExpenses([...expenses, ...newExpenses]);
    alert(`Imported ${newExpenses.length} transactions!`);
    e.target.value = ''; // Reset file input
  };

  const handleExportData = () => {
    const data = { budgets, bills, expenses };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('This will delete all your data. Are you sure?')) {
      localStorage.clear();
      setBudgets(SAMPLE_DATA.budgets);
      setBills(SAMPLE_DATA.bills);
      setExpenses(SAMPLE_DATA.expenses);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your budget dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar bg="dark" variant="dark" className="mb-4 rounded px-3">
        <Navbar.Brand href="/">💰 Budget Dashboard</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Nav.Link href="#budgets">Budgets</Nav.Link>
          <Nav.Link href="#bills">Bills</Nav.Link>
          <Nav.Link href="#reports">Reports</Nav.Link>
          <label className="btn btn-outline-light btn-sm ms-2 mb-0" style={{ cursor: 'pointer' }}>
            📥 Import CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleImportCSV} 
              style={{ display: 'none' }} 
            />
          </label>
          <button className="btn btn-outline-light btn-sm ms-2" onClick={handleExportData}>
            💾 Export
          </button>
          <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleClearData}>
            🗑️ Clear
          </button>
        </Nav>
      </Navbar>

      <DashboardSummary 
        budgets={budgets} 
        bills={bills} 
        expenses={expenses} 
      />

      <Row className="mb-4">
        <Col lg={8}>
          <BudgetTracking />
        </Col>
        <Col lg={4}>
          <BillManagement />
        </Col>
      </Row>

      <Row>
        <Col>
          <VisualReports budgets={budgets} bills={bills} expenses={expenses} />
        </Col>
      </Row>

      <footer className="text-center text-muted mt-5 py-3">
        <small>Budget Dashboard &copy; 2026 | Powered by Google Sheets</small>
      </footer>
    </div>
  );
}

export default App;
