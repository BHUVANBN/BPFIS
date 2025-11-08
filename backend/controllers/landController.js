const { getLandModel } = require('../models/Land');

// This will be initialized when the controller is first used
let Land;
const { uploadToIPFS } = require('../services/ipfsService');
const { extractLandData } = require('../services/ocrService');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new land
 * @route   POST /api/lands
 * @access  Private (Farmer only)
 */
const registerLand = async (req, res) => {
  try {
    // Initialize Land model if not already done
    if (!Land) {
      Land = await getLandModel();
    }

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      surveyNumber, 
      area, 
      location, 
      soilType, 
      irrigation, 
      ownershipType,
      documents
    } = req.body;

    // Check if land with same survey number in same district already exists
    const existingLand = await Land.findOne({
      surveyNumber,
      'location.address.district': location.address.district,
      farmer: { $ne: req.user._id } // Allow same farmer to have multiple lands with same survey number
    });

    if (existingLand) {
      return res.status(400).json({
        success: false,
        message: 'A land with this survey number already exists in this district'
      });
    }

    // Create new land
    const land = new Land({
      farmer: req.user._id,
      surveyNumber,
      area,
      location: {
        type: 'Point',
        coordinates: [
          location.coordinates[0], // longitude
          location.coordinates[1]  // latitude
        ],
        address: location.address
      },
      soilType,
      irrigation,
      ownershipType,
      documents: []
    });

    // Process and upload documents
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        // Upload to IPFS
        const ipfsResult = await ipfsService.uploadToIPFS(doc.buffer, doc.mimetype);
        
        // Extract data from document if it's an image or PDF
        let ocrData = {};
        if (doc.mimetype.startsWith('image/') || doc.mimetype === 'application/pdf') {
          ocrData = await ocrService.extractLandData(doc.buffer, doc.mimetype);
        }

        land.documents.push({
          type: doc.documentType,
          fileUrl: ipfsResult.url,
          fileType: doc.mimetype,
          fileName: doc.originalname,
          fileSize: doc.size,
          ocrData,
          verified: false
        });
      }
    }

    await land.save();

    res.status(201).json({
      success: true,
      data: land
    });
  } catch (error) {
    console.error('Error registering land:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all lands for the authenticated farmer
 * @route   GET /api/lands/my-lands
 * @access  Private (Farmer only)
 */
const getMyLands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [lands, total] = await Promise.all([
      Land.find({ farmer: req.user._id, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Land.countDocuments({ farmer: req.user._id, isActive: true })
    ]);

    res.status(200).json({
      success: true,
      count: lands.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: lands
    });
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get land by ID
 * @route   GET /api/lands/:id
 * @access  Private
 */
const getLandById = async (req, res) => {
  try {
    const land = await Land.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('farmer', 'name phone email');

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Check if the user has permission to view this land
    if (land.farmer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this land'
      });
    }

    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    console.error('Error fetching land:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update land details
 * @route   PUT /api/lands/:id
 * @access  Private (Land owner or admin)
 */
const updateLand = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['surveyNumber', 'area', 'location', 'soilType', 'irrigation', 'ownershipType'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates!'
      });
    }

    const land = await Land.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Check if user is the owner or admin
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this land'
      });
    }

    // Apply updates
    updates.forEach(update => {
      if (update === 'location') {
        land.location.coordinates = req.body.location.coordinates;
        land.location.address = req.body.location.address;
      } else {
        land[update] = req.body[update];
      }
    });

    await land.save();

    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    console.error('Error updating land:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating land'
    });
  }
};

/**
 * @desc    Delete a land (soft delete)
 * @route   DELETE /api/lands/:id
 * @access  Private (Land owner or admin)
 */
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Check if user is the owner or admin
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this land'
      });
    }

    // Soft delete
    land.isActive = false;
    await land.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting land:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Add document to land
 * @route   POST /api/lands/:id/documents
 * @access  Private (Land owner or admin)
 */
const addDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    if (!file || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type and file are required'
      });
    }

    const land = await Land.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Check if user is the owner or admin
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add documents to this land'
      });
    }

    // Upload to IPFS
    const ipfsResult = await uploadToIPFS(file.buffer, file.mimetype);
    
    // Extract data from document if it's an image or PDF
    let ocrData = {};
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      ocrData = await extractLandData(file.buffer, file.mimetype);
    }

    // Add document to land
    land.documents.push({
      type: documentType,
      fileUrl: ipfsResult.url,
      fileType: file.mimetype,
      fileName: file.originalname,
      fileSize: file.size,
      ocrData,
      verified: req.user.role === 'admin' // Auto-verify if added by admin
    });

    await land.save();

    res.status(201).json({
      success: true,
      data: land.documents[land.documents.length - 1]
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Export all controller functions
module.exports = {
  registerLand,
  getMyLands,
  getLandById,
  updateLand,
  deleteLand,
  addDocument
};
