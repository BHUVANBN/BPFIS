import { uploadToIPFS } from './ipfsService.js';
import { extractLandData } from './ocrService.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * Processes and validates a land document
 * @param {Object} file - The uploaded file object
 * @param {string} documentType - Type of document (RTC, AADHAAR, etc.)
 * @returns {Promise<Object>} - Processed document data
 */
export const processLandDocument = async (file, documentType) => {
  try {
    // 1. Upload to IPFS
    const ipfsResult = await uploadToIPFS(
      file.buffer,
      file.mimetype,
      `${documentType.toLowerCase()}_${Date.now()}`
    );

    // 2. Extract data using OCR if it's a document type that needs it
    let ocrData = null;
    if (['RTC', 'AADHAAR', 'SURVEY'].includes(documentType)) {
      try {
        ocrData = await extractLandData(file.buffer, documentType);
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
        // Continue without OCR data if OCR fails
      }
    }

    // 3. Create document metadata
    const documentData = {
      id: uuidv4(),
      type: documentType,
      fileUrl: ipfsResult.pinataUrl,
      ipfsHash: ipfsResult.ipfsHash,
      fileType: file.mimetype,
      fileName: file.originalname,
      fileSize: file.size,
      ocrData: ocrData || {},
      verified: false,
      uploadedAt: new Date(),
    };

    return {
      success: true,
      data: documentData,
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
};

/**
 * Validates document based on type and extracted OCR data
 * @param {Object} document - The document to validate
 * @param {Object} landData - Existing land data for validation
 * @returns {Object} - Validation result
 */
export const validateDocument = (document, landData = {}) => {
  const result = {
    isValid: true,
    issues: [],
    verifiedFields: {},
  };

  // Skip validation if no OCR data
  if (!document.ocrData || Object.keys(document.ocrData).length === 0) {
    return {
      ...result,
      isValid: false,
      issues: ['No OCR data available for validation'],
    };
  }

  const { ocrData } = document;
  const { surveyNumber, ownerName, area, location } = landData;

  // Validate survey number if present in both
  if (surveyNumber && ocrData.surveyNumber) {
    const isMatch = normalizeText(surveyNumber) === normalizeText(ocrData.surveyNumber);
    result.verifiedFields.surveyNumber = isMatch;
    if (!isMatch) {
      result.issues.push('Survey number does not match');
    }
  }

  // Validate owner name if present in both
  if (ownerName && ocrData.ownerName) {
    const isMatch = normalizeText(ownerName).includes(normalizeText(ocrData.ownerName)) || 
                   normalizeText(ocrData.ownerName).includes(normalizeText(ownerName));
    result.verifiedFields.ownerName = isMatch;
    if (!isMatch) {
      result.issues.push('Owner name does not match');
    }
  }

  // Validate area if present in both
  if (area && ocrData.area) {
    const docArea = parseFloat(ocrData.area);
    const isMatch = Math.abs(docArea - area.value) <= 0.1; // Allow small differences
    result.verifiedFields.area = isMatch;
    if (!isMatch) {
      result.issues.push('Area does not match');
    }
  }

  // Update overall validity
  result.isValid = result.issues.length === 0;

  return result;
};

/**
 * Normalizes text for comparison
 * @private
 */
const normalizeText = (text) => {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .trim();
};

/**
 * Extracts file extension from filename or path
 * @param {string} filename - The filename or path
 * @returns {string} - The file extension (without dot)
 */
export const getFileExtension = (filename) => {
  return path.extname(filename || '').slice(1).toLowerCase();
};

/**
 * Validates if a file is of an allowed type
 * @param {Object} file - The file object from multer
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean} - Whether the file type is allowed
 */
export const validateFileType = (file, allowedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf'
]) => {
  return file && allowedTypes.includes(file.mimetype);
};
