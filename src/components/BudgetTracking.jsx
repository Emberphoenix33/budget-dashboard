import React, { useState } from 'react';
import { Card, ProgressBar, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getBudgets, addExpense, SHEETS } from '../utils/googleSheets';

function BudgetCard({ category, limit, spent, month }) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = limit - spent;
  
  let variant = 'success';
  if (percentage > 90) variant = 'danger';
  else if (percentage > 70) variant = 'warning';

  return (
    <Card className="budget-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">{category}</Card.Title>
          <span className="text-muted">{month}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Spent: ${spent.toFixed(2)}</span>
          <span className="text-muted">Limit: ${limit.toFixed(2)}</span>
        </div>
        <ProgressBar 
          now={percentage} 
          variant={variant}
          label={`${percentage.toFixed(1)}%`}
          className="mb-2"
        />
        <div className="d-flex justify-content-between">
          <small className={remaining < 0 ? 'text-danger' : 'text-success'}>
            {remaining < 0 ? 'Over budget' : 'Remaining'}: ${Math.abs(remaining).toFixed(2)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

function AddBudgetModal({ show, handleClose, handleAdd }) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd({ category, limit: parseFloat(limit), spent: 0, month });
    setCategory('');
    setLimit('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Budget Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Groceries, Entertainment"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Monthly Limit ($)</Form.Label>
            <Form.Control
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="500"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Month</Form.Label>
            <Form.Control
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Budget
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function BudgetTracking() {
  const [budgets, setBudgets] = useState([
    { category: 'Groceries', limit: 600, spent: 425.50, month: '2026-03' },
    { category: 'Entertainment', limit: 200, spent: 180.00, month: '2026-03' },
    { category: 'Transportation', limit: 300, spent: 150.75, month: '2026-03' },
    { category: 'Utilities', limit: 250, spent: 220.00, month: '2026-03' },
    { category: 'Dining Out', limit: 150, spent: 95.25, month: '2026-03' },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleAddBudget = async (newBudget) => {
    // In production, this would save to Google Sheets
    setBudgets([...budgets, newBudget]);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📊 Budget Tracking</h5>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Add Budget
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h6>Total Monthly Budget</h6>
          <ProgressBar 
            now={totalPercentage} 
            variant={totalPercentage > 90 ? 'danger' : totalPercentage > 70 ? 'warning' : 'success'}
            label={`${totalPercentage.toFixed(1)}% of $${totalBudget.toFixed(2)}`}
          />
          <div className="mt-2 d-flex justify-content-between">
            <span>Spent: <strong>${totalSpent.toFixed(2)}</strong></span>
            <span>Remaining: <strong className="text-success">${(totalBudget - totalSpent).toFixed(2)}</strong></span>
          </div>
        </div>

        <Row>
          {budgets.map((budget, index) => (
            <Col md={6} lg={4} key={index}>
              <BudgetCard {...budget} />
            </Col>
          ))}
        </Row>
      </Card.Body>
      <AddBudgetModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleAdd={handleAddBudget}
      />
    </Card>
  );
}

export default BudgetTracking;
