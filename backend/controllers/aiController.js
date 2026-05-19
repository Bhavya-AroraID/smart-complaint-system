const Complaint = require('../models/Complaint');

// AI Analysis Engine - Smart rule-based classifier
const analyzeComplaint = (title, description, category) => {
  const text = `${title} ${description}`.toLowerCase();

  // ========== 1. PRIORITY DETECTION ==========
  const criticalKeywords = ['emergency', 'fire', 'flood', 'explosion', 'collapse', 'death', 'dying', 'electrocution', 'gas leak', 'toxic', 'life threatening', 'immediate'];
  const highKeywords = ['urgent', 'dangerous', 'hazard', 'broken', 'overflow', 'outage', 'accident', 'severe', 'damage', 'leakage', 'contaminated', 'blocked', 'failure'];
  const mediumKeywords = ['repair', 'fix', 'maintenance', 'issue', 'problem', 'complaint', 'delay', 'irregular', 'poor', 'bad'];
  const lowKeywords = ['suggestion', 'request', 'improvement', 'feedback', 'minor', 'small', 'inquiry', 'information'];

  let priority = 'Medium';
  let priorityScore = 50;

  if (criticalKeywords.some(kw => text.includes(kw))) {
    priority = 'Critical';
    priorityScore = 95;
  } else if (highKeywords.some(kw => text.includes(kw))) {
    priority = 'High';
    priorityScore = 75;
  } else if (lowKeywords.some(kw => text.includes(kw))) {
    priority = 'Low';
    priorityScore = 25;
  } else if (mediumKeywords.some(kw => text.includes(kw))) {
    priority = 'Medium';
    priorityScore = 50;
  }

  // ========== 2. DEPARTMENT RECOMMENDATION ==========
  const departmentMap = {
    'Water Supply': {
      name: 'Water & Sewerage Department',
      keywords: ['water', 'pipeline', 'sewage', 'drainage', 'tap', 'supply', 'leakage', 'tank', 'contaminated']
    },
    'Electricity': {
      name: 'Electricity Board / Power Department',
      keywords: ['electricity', 'power', 'wire', 'transformer', 'voltage', 'blackout', 'outage', 'electric', 'pole', 'meter']
    },
    'Roads': {
      name: 'Public Works Department (PWD)',
      keywords: ['road', 'pothole', 'bridge', 'footpath', 'construction', 'highway', 'traffic', 'pavement', 'crack']
    },
    'Garbage': {
      name: 'Sanitation & Waste Management Department',
      keywords: ['garbage', 'waste', 'trash', 'dump', 'sanitation', 'cleaning', 'sweeping', 'dustbin', 'recycle']
    },
    'Noise': {
      name: 'Pollution Control Board',
      keywords: ['noise', 'pollution', 'loud', 'sound', 'speaker', 'disturbance', 'factory', 'emission', 'air quality']
    },
    'Public Safety': {
      name: 'Police & Law Enforcement Department',
      keywords: ['safety', 'crime', 'theft', 'vandalism', 'harassment', 'security', 'fight', 'assault', 'suspicious']
    },
    'Health': {
      name: 'Health & Medical Services Department',
      keywords: ['health', 'hospital', 'clinic', 'disease', 'infection', 'medical', 'hygiene', 'mosquito', 'dengue', 'malaria']
    }
  };

  let department = 'General Administration Department';

  if (departmentMap[category]) {
    department = departmentMap[category].name;
  }

  // Cross-check with keywords for more accuracy
  for (const [cat, info] of Object.entries(departmentMap)) {
    if (info.keywords.some(kw => text.includes(kw))) {
      department = info.name;
      break;
    }
  }

  // ========== 3. COMPLAINT SUMMARY ==========
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let summary = '';

  if (sentences.length <= 2) {
    summary = description;
  } else {
    // Take first two sentences as summary
    summary = sentences.slice(0, 2).map(s => s.trim()).join('. ') + '.';
  }

  if (summary.length > 200) {
    summary = summary.substring(0, 197) + '...';
  }

  // ========== 4. AUTO-GENERATED RESPONSE ==========
  const responseTemplates = {
    'Critical': `URGENT ALERT: Your complaint regarding "${title}" has been flagged as CRITICAL priority. The ${department} has been immediately notified and emergency response teams will be dispatched. Expected response time: Within 2 hours. Please stay safe and contact emergency services if needed. Reference will be provided shortly.`,
    'High': `Your complaint regarding "${title}" has been classified as HIGH priority. The ${department} has been notified and will take action within 24 hours. We understand the urgency and are working to resolve this as quickly as possible.`,
    'Medium': `Thank you for reporting "${title}". Your complaint has been registered and forwarded to the ${department}. We will address this within 3-5 business days. You can track the status using your complaint reference number.`,
    'Low': `Thank you for your feedback regarding "${title}". Your concern has been noted and forwarded to the ${department}. This will be addressed during our regular maintenance cycle within 7-10 business days.`
  };

  const autoResponse = responseTemplates[priority];

  return {
    priority,
    priorityScore,
    department,
    summary,
    autoResponse,
    analyzedAt: new Date()
  };
};

// @desc    Analyze a complaint using AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaintAPI = async (req, res, next) => {
  try {
    const { title, description, category, complaintId } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: 'Title, description, and category are required for analysis'
      });
    }

    const analysis = analyzeComplaint(title, description, category);

    // If complaintId is provided, update the complaint with AI analysis
    if (complaintId) {
      const complaint = await Complaint.findById(complaintId);
      if (complaint) {
        complaint.aiAnalysis = {
          priority: analysis.priority,
          department: analysis.department,
          summary: analysis.summary,
          autoResponse: analysis.autoResponse,
          analyzedAt: analysis.analyzedAt
        };
        complaint.priority = analysis.priority;
        await complaint.save();
      }
    }

    res.json({
      message: 'AI Analysis completed successfully',
      analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaintAPI };
