import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { GOOGLE_AI_API_KEY } from '../config/config.js';

// Initialize Google's Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

/**
 * Extracts land data from an image or PDF using OCR
 * @param {Buffer} fileBuffer - The file buffer to process
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<Object>} - The extracted data
 */
export const extractLandData = async (fileBuffer, mimeType) => {
  try {
    // For the MVP, we'll use a simple text extraction approach
    // In a production environment, you would use a more sophisticated OCR service
    // like Google Cloud Vision, Amazon Textract, or Tesseract.js
    
    // Write the buffer to a temporary file
    const tempFilePath = join(tmpdir(), `land-doc-${Date.now()}.${mimeType.split('/')[1] || 'bin'}`);
    writeFileSync(tempFilePath, fileBuffer);
    
    try {
      // Use Google's Generative AI to extract structured data
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      // Convert the file to a base64 string
      const base64Data = fileBuffer.toString('base64');
      
      // Prepare the prompt
      const prompt = `
      Analyze this land document and extract the following information in JSON format:
      {
        "documentType": "RTC/AADHAAR/AGREEMENT/OTHER",
        "surveyNumber": "string or null",
        "ownerName": "string or null",
        "fatherOrHusbandName": "string or null",
        "village": "string or null",
        "taluk": "string or null",
        "district": "string or null",
        "state": "string or null",
        "pincode": "string or null",
        "area": {
          "value": "number or null",
          "unit": "ACRE/HECTARE/SQM/CENTS/GROUND or null"
        },
        "boundaries": {
          "north": "string or null",
          "south": "string or null",
          "east": "string or null",
          "west": "string or null"
        },
        "extractionConfidence": "number between 0-1",
        "extractedFields": ["list of fields that were extracted"]
      }
      
      If a field cannot be determined, use null as the value.
      `;
      
      // For images
      let result;
      if (mimeType.startsWith('image/')) {
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };
        
        result = await model.generateContent([prompt, imagePart]);
      } 
      // For PDFs (would need to convert to images first in a real implementation)
      else if (mimeType === 'application/pdf') {
        // For MVP, we'll just try to extract text from the first page
        const pdfPart = {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        };
        
        result = await model.generateContent([
          prompt + '\n\nThis is a PDF document. Please extract text from the first page.',
          pdfPart
        ]);
      } else {
        throw new Error('Unsupported file type for OCR');
      }
      
      const response = await result.response;
      const text = response.text();
      
      // Try to parse the JSON response
      try {
        // Extract JSON from markdown code block if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        
        const extractedData = JSON.parse(jsonString);
        
        // Clean up the temporary file
        try {
          unlinkSync(tempFilePath);
        } catch (e) {
          console.warn('Could not delete temporary file:', tempFilePath);
        }
        
        return extractedData;
      } catch (parseError) {
        console.error('Error parsing OCR result:', parseError);
        return {
          documentType: 'OTHER',
          extractionConfidence: 0,
          extractedFields: [],
          rawText: text,
          error: 'Failed to parse extracted data'
        };
      }
    } catch (error) {
      console.error('Error during OCR processing:', error);
      
      // Clean up the temporary file in case of error
      try {
        unlinkSync(tempFilePath);
      } catch (e) {
        console.warn('Could not delete temporary file after error:', tempFilePath);
      }
      
      // Return a basic error response
      return {
        documentType: 'OTHER',
        extractionConfidence: 0,
        extractedFields: [],
        error: error.message || 'Failed to process document'
      };
    }
  } catch (error) {
    console.error('Error in extractLandData:', error);
    throw new Error(`Document processing failed: ${error.message}`);
  }
};

/**
 * Validates if the extracted data matches the land record
 * @param {Object} extractedData - The data extracted from the document
 * @param {Object} landData - The existing land data to validate against
 * @returns {Object} - Validation result with matches and confidence
 */
export const validateExtractedData = (extractedData, landData) => {
  const result = {
    isValid: true,
    confidence: 1,
    mismatches: [],
    matches: []
  };
  
  // Simple validation logic - can be enhanced based on requirements
  const fieldsToCheck = [
    'surveyNumber',
    'village',
    'taluk',
    'district',
    'state',
    'pincode'
  ];
  
  fieldsToCheck.forEach(field => {
    if (extractedData[field] && landData[field]) {
      const extractedValue = String(extractedData[field]).toLowerCase().trim();
      const landValue = String(landData[field]).toLowerCase().trim();
      
      if (extractedValue === landValue) {
        result.matches.push(field);
      } else {
        result.mismatches.push({
          field,
          extracted: extractedData[field],
          expected: landData[field]
        });
        result.isValid = false;
        result.confidence -= 0.1; // Reduce confidence for each mismatch
      }
    }
  });
  
  // Ensure confidence is between 0 and 1
  result.confidence = Math.max(0, Math.min(1, result.confidence));
  
  return result;
};
