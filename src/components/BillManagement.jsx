import React, { useState } from 'react';
import { Card, Button, Modal, Form, Badge } from 'react-bootstrap';

function BillItem({ bill, onMarkPaid }) {
  const dueDate = new Date(bill.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  let statusClass = '';
  let statusText = '';
  
  if (bill.paid) {
    statusClass = 'paid';
    statusText = 'Paid';
  } else if (daysUntilDue < 0) {
    statusClass = 'overdue';
    statusText = `${Math.abs(daysUntilDue)} days overdue`;
  } else if (daysUntilDue <= 7) {
    statusClass = 'due-soon';
    statusText = `Due in ${daysUntilDue} days`;
  } else {
    statusText = `Due ${dueDate.toLocaleDateString()}`;
  }

  return (
    <div className={`bill-item ${statusClass}`}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="mb-1">{bill.name}</h6>
          <small className="text-muted">{bill.category}</small>
          <div className="mt-2">
            <Badge 
              bg={bill.paid ? 'success' : daysUntilDue < 0 ? 'danger' : daysUntilDue <= 7 ? 'warning' : 'secondary'}
            >
              {statusText}
            </Badge>
          </div>
        </div>
        <div className="text-end">
          <h5 className="mb-1">${bill.amount.toFixed(2)}</h5>
          {!bill.paid && (
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onMarkPaid(bill.id)}
              className="mt-2"
            >
              ✓ Mark Paid
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddBillModal({ show, handleClose, handleAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd({
      name,
      amount: parseFloat(amount),
      dueDate,
      paid: false,
      category
    });
    setName('');
    setAmount('');
    setDueDate('');
    setCategory('Utilities');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Bill Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Electric Bill, Rent"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Utilities">Utilities</option>
              <option value="Rent/Mortgage">Rent/Mortgage</option>
              <option value="Insurance">Insurance</option>
              <option value="Internet/Phone">Internet/Phone</option>
              <option value="Subscription">Subscription</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Bill
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function BillManagement() {
  const [bills, setBills] = useState([
    { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-04-01', paid: false, category: 'Rent/Mortgage' },
    { id: '2', name: 'Electric Bill', amount: 120, dueDate: '2026-03-25', paid: false, category: 'Utilities' },
    { id: '3', name: 'Internet', amount: 79.99, dueDate: '2026-03-28', paid: false, category: 'Internet/Phone' },
    { id: '4', name: 'Car Insurance', amount: 150, dueDate: '2026-03-15', paid: true, category: 'Insurance' },
    { id: '5', name: 'Netflix', amount: 15.99, dueDate: '2026-03-30', paid: false, category: 'Subscription' },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleAddBill = (newBill) => {
    setBills([...bills, { ...newBill, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleMarkPaid = (id) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, paid: true } : bill
    ));
  };

  const upcomingBills = bills.filter(b => !b.paid);
  const totalUpcoming = upcomingBills.reduce((sum, b) => sum + b.amount, 0);
  const overdueBills = bills.filter(b => !b.paid && new Date(b.dueDate) < new Date());

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📋 Bill Management</h5>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Add Bill
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Upcoming Bills:</span>
            <strong>${totalUpcoming.toFixed(2)}</strong>
          </div>
          {overdueBills.length > 0 && (
            <div className="alert alert-danger mb-0">
              ⚠️ You have {overdueBills.length} overdue bill(s)!
            </div>
          )}
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {bills.map(bill => (
            <BillItem 
              key={bill.id} 
              bill={bill} 
              onMarkPaid={handleMarkPaid}
            />
          ))}
        </div>
      </Card.Body>
      <AddBillModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleAdd={handleAddBill}
      />
    </Card>
  );
}

export default BillManagement;
