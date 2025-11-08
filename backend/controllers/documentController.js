const { validationResult } = require('express-validator');
const { processLandDocument, validateDocument } = require('../services/documentService');
const { Land } = require('../models/Land');
const { Types } = require('mongoose');

/**
 * @desc    Upload and process a document for a land
 * @route   POST /api/lands/:landId/documents
 * @access  Private (Farmer only)
 */
const uploadLandDocument = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { landId } = req.params;
    const { documentType } = req.body;
    const file = req.file;

    // Check if land exists and user is the owner
    const land = await Land.findOne({
      _id: landId,
      owner: req.user.id,
      isDeleted: false
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found or access denied'
      });
    }

    // Process the document
    const { data: documentData } = await processLandDocument(file, documentType);
    
    // Add to land documents
    land.documents.push(documentData);
    await land.save();

    // Validate document against land data
    const validation = validateDocument(documentData, land.toObject());
    
    // Update document verification status
    const documentIndex = land.documents.findIndex(doc => doc.id === documentData.id);
    if (documentIndex !== -1) {
      land.documents[documentIndex].verified = validation.isValid;
      land.documents[documentIndex].verificationResult = validation;
      await land.save();
    }

    // Update land verification status if needed
    await updateLandVerificationStatus(land);

    res.status(201).json({
      success: true,
      data: land.documents[documentIndex],
      validation
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get all documents for a land
 * @route   GET /api/lands/:landId/documents
 * @access  Private (Owner/Admin)
 */
const getLandDocuments = async (req, res) => {
  try {
    const { landId } = req.params;

    // Check if land exists and user has access
    const land = await Land.findOne({
      _id: landId,
      $or: [
        { owner: req.user.id },
        { 'sharedWith.user': req.user.id }
      ],
      isDeleted: false
    }).select('documents');

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      count: land.documents.length,
      data: land.documents
    });

  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Verify a document (Admin only)
 * @route   PUT /api/lands/:landId/documents/:documentId/verify
 * @access  Private (Admin only)
 */
const verifyDocument = async (req, res) => {
  try {
    const { landId, documentId } = req.params;
    const { isVerified, notes } = req.body;

    // Check if land exists
    const land = await Land.findOne({
      _id: landId,
      isDeleted: false
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Find and update document
    const document = land.documents.id(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update verification status
    document.verified = isVerified;
    document.verifiedAt = new Date();
    document.verifiedBy = req.user.id;
    
    if (notes) {
      document.verificationNotes = notes;
    }

    await land.save();

    // Update land verification status
    await updateLandVerificationStatus(land);

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Delete a document
 * @route   DELETE /api/lands/:landId/documents/:documentId
 * @access  Private (Owner/Admin)
 */
const deleteDocument = async (req, res) => {
  try {
    const { landId, documentId } = req.params;

    // Check if land exists and user has permission
    const land = await Land.findOne({
      _id: landId,
      $or: [
        { owner: req.user.id },
        { 'sharedWith.user': req.user.id, 'sharedWith.role': 'admin' }
      ],
      isDeleted: false
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found or access denied'
      });
    }

    // Find and remove document
    const document = land.documents.id(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Mark as deleted
    document.isDeleted = true;
    document.deletedAt = new Date();
    document.deletedBy = req.user.id;
    
    await land.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Helper function to update land verification status based on documents
 * @param {Object} land - The land document
 */
const updateLandVerificationStatus = (land) => {
  try {
    // Count verified documents
    const verifiedCount = land.documents.filter(doc => doc.verified && !doc.isDeleted).length;
    const totalDocuments = land.documents.filter(doc => !doc.isDeleted).length;
    
    // Update verification status
    land.verificationStatus = totalDocuments === 0 ? 'pending' :
                             verifiedCount === totalDocuments ? 'verified' :
                             verifiedCount > 0 ? 'partially_verified' : 'pending';
    
    land.save();
  } catch (error) {
    console.error('Error updating land verification status:', error);
    throw error;
  }
};

module.exports = {
  uploadLandDocument,
  getLandDocuments,
  verifyDocument,
  deleteDocument,
  updateLandVerificationStatus
};
