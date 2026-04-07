const mongoose = require('mongoose');
const Incident = require('./incident.model');
const User = require('../users/user.model');

const generateIncidentNumber = async () => {
  let incidentNumber = '';
  let exists = true;

  while (exists) {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    incidentNumber = `INC-${randomPart}`;
    const existing = await Incident.findOne({ incidentNumber });
    exists = Boolean(existing);
  }

  return incidentNumber;
};

const createIncident = async (req, res) => {
  try {
    const {
      type,
      title,
      description = '',
      priority = 'medium',
      relatedEntityType = 'other',
      relatedEntityId = '',
      assignedTo = null,
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'type and title are required',
      });
    }

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid assignedTo user id',
        });
      }

      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found',
        });
      }
    }

    const incidentNumber = await generateIncidentNumber();

    const incident = await Incident.create({
      incidentNumber,
      type,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'open',
      relatedEntityType,
      relatedEntityId: relatedEntityId ? String(relatedEntityId).trim() : '',
      assignedTo: assignedTo || null,
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      data: incident,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating incident',
      error: error.message,
    });
  }
};

const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('assignedTo', 'firstName lastName email status')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Incidents fetched successfully',
      data: incidents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching incidents',
      error: error.message,
    });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id)
      .populate('assignedTo', 'firstName lastName email status')
      .populate('createdBy', 'firstName lastName email');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Incident fetched successfully',
      data: incident,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching incident',
      error: error.message,
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes = '' } = req.body;

    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: open, in_progress, resolved, closed',
      });
    }

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    incident.status = status;

    if (resolutionNotes) {
      incident.resolutionNotes = resolutionNotes.trim();
    }

    if (status === 'resolved' || status === 'closed') {
      incident.resolvedAt = new Date();
    } else {
      incident.resolvedAt = null;
    }

    await incident.save();

    return res.status(200).json({
      success: true,
      message: 'Incident status updated successfully',
      data: incident,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating incident status',
      error: error.message,
    });
  }
};

const assignIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'assignedTo is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignedTo user id',
      });
    }

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found',
      });
    }

    incident.assignedTo = user._id;

    if (incident.status === 'open') {
      incident.status = 'in_progress';
    }

    await incident.save();

    return res.status(200).json({
      success: true,
      message: 'Incident assigned successfully',
      data: incident,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error assigning incident',
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
};