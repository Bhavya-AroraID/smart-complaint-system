const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Noise', 'Public Safety', 'Health', 'Other']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected']
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  aiAnalysis: {
    priority: String,
    department: String,
    summary: String,
    autoResponse: String,
    analyzedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
