const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  searchByLocation
} = require('../controllers/complaintController');
const { auth } = require('../middleware/auth');

// @route   GET /api/complaints/search?location=xyz
// NOTE: This must be BEFORE /:id route to avoid conflict
router.get('/search', auth, searchByLocation);

// @route   POST /api/complaints
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').isIn(['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Noise', 'Public Safety', 'Health', 'Other']).withMessage('Invalid category'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  addComplaint
);

// @route   GET /api/complaints
router.get('/', auth, getComplaints);

// @route   GET /api/complaints/:id
router.get('/:id', auth, getComplaint);

// @route   PUT /api/complaints/:id
router.put('/:id', auth, updateComplaint);

// @route   DELETE /api/complaints/:id
router.delete('/:id', auth, deleteComplaint);

module.exports = router;
