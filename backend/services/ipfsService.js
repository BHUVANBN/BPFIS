const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = require('../config/config');

/**
 * Uploads a file to IPFS using Pinata
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileType - The MIME type of the file
 * @returns {Promise<Object>} - The IPFS hash and URL
 */
const uploadToIPFS = async (fileBuffer, fileType) => {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    // Create form data
    const data = new FormData();
    data.append('file', fileBuffer, {
      filename: `document-${Date.now()}`,
      contentType: fileType
    });

    // Add metadata
    const metadata = JSON.stringify({
      name: `Document-${Date.now()}`,
      keyvalues: {
        type: fileType,
        uploadedAt: new Date().toISOString(),
        service: 'farmchain-backend'
      }
    });
    data.append('pinataMetadata', metadata);

    // Add options
    const options = JSON.stringify({
      cidVersion: 0,
      wrapWithDirectory: false
    });
    data.append('pinataOptions', options);

    // Make the request
    const response = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });

    return {
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

/**
 * Pins JSON data to IPFS
 * @param {Object} data - The JSON data to pin
 * @returns {Promise<Object>} - The IPFS hash and URL
 */
const pinJSONToIPFS = async (data) => {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    
    const response = await axios.post(
      url,
      {
        pinataMetadata: {
          name: `data-${Date.now()}.json`,
          keyvalues: {
            type: 'json',
            service: 'farmchain-backend'
          }
        },
        pinataContent: data
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );

    return {
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error pinning JSON to IPFS:', error);
    throw new Error('Failed to pin JSON to IPFS');
  }
};

/**
 * Fetches a file from IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Buffer>} - The file data as a buffer
 */
const getFromIPFS = async (ipfsHash) => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch file from IPFS');
  }
};

/**
 * Saves a file from IPFS to the local filesystem
 * @param {string} ipfsHash - The IPFS hash of the file
 * @param {string} outputPath - The path to save the file to
 * @returns {Promise<string>} - The path to the saved file
 */
const saveFileFromIPFS = async (ipfsHash, outputPath) => {
  try {
    const fileData = await getFromIPFS(ipfsHash);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(outputPath, fileData);
    return outputPath;
  } catch (error) {
    console.error('Error saving file from IPFS:', error);
    throw new Error('Failed to save file from IPFS');
  }
};

// Remove a file from IPFS
const removeFromIPFS = async (ipfsHash) => {
  try {
    const url = `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`;
    await axios.delete(url, {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });
    return true;
  } catch (error) {
    console.error('Error removing from IPFS:', error);
    throw new Error('Failed to remove file from IPFS');
  }
};

module.exports = {
  uploadToIPFS,
  pinJSONToIPFS,
  getFromIPFS,
  saveFileFromIPFS,
  removeFromIPFS
};
