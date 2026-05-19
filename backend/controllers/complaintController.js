const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Private
const addComplaint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }

    const { name, email, title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location
    });

    res.status(201).json({
      message: 'Complaint stored successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;

    const updatedComplaint = await complaint.save();

    res.json({
      message: 'Complaint updated successfully',
      complaint: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: 'Complaint removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=xyz
// @access  Private
const searchByLocation = async (req, res, next) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location query parameter is required' });
    }

    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({
      complaints,
      total: complaints.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  searchByLocation
};
