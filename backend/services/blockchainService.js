const { ethers } = require('ethers');
const LandRegistryABI = require('../../blockchain/artifacts/contracts/LandRegistry.sol/LandRegistry.json').abi;
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
    this.wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.contract = new ethers.Contract(this.contractAddress, LandRegistryABI, this.wallet);
  }

  /**
   * Register a new land on the blockchain
   * @param {Object} landData - Land data to register
   * @returns {Promise<Object>} Transaction receipt
   */
  async registerLand(landData) {
    try {
      const { surveyNumber, location, area, areaUnit, metadataURI } = landData;
      
      const tx = await this.contract.registerLand(
        surveyNumber,
        location,
        area,
        areaUnit,
        metadataURI
      );
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        landId: receipt.events?.find(e => e.event === 'LandRegistered')?.args?.landId.toString()
      };
    } catch (error) {
      logger.error('Error registering land on blockchain:', error);
      throw new Error('Failed to register land on blockchain');
    }
  }

  /**
   * Upload a document for a land
   * @param {Object} documentData - Document data to upload
   * @returns {Promise<Object>} Transaction receipt
   */
  async uploadDocument(documentData) {
    try {
      const { landId, documentHash, documentType, metadataURI } = documentData;
      
      const tx = await this.contract.uploadDocument(
        landId,
        documentHash,
        documentType,
        metadataURI || ''
      );
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        documentId: receipt.events?.find(e => e.event === 'DocumentUploaded')?.args?.documentId.toString()
      };
    } catch (error) {
      logger.error('Error uploading document to blockchain:', error);
      throw new Error('Failed to upload document to blockchain');
    }
  }

  /**
   * Verify a document
   * @param {string} documentId - Document ID to verify
   * @param {boolean} isVerified - Whether to verify or reject
   * @returns {Promise<Object>} Transaction receipt
   */
  async verifyDocument(documentId, isVerified = true) {
    try {
      const tx = await this.contract.verifyDocument(documentId, isVerified);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      logger.error('Error verifying document on blockchain:', error);
      throw new Error('Failed to verify document on blockchain');
    }
  }

  /**
   * Transfer land ownership
   * @param {string} to - New owner address
   * @param {string} landId - Land ID to transfer
   * @param {string} documentHash - IPFS hash of the transfer document
   * @returns {Promise<Object>} Transaction receipt
   */
  async transferOwnership(to, landId, documentHash = '') {
    try {
      const tx = await this.contract.transferOwnership(to, landId, documentHash);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      logger.error('Error transferring land ownership on blockchain:', error);
      throw new Error('Failed to transfer land ownership on blockchain');
    }
  }

  /**
   * Get land details
   * @param {string} landId - Land ID to fetch
   * @returns {Promise<Object>} Land details
   */
  async getLand(landId) {
    try {
      const land = await this.contract.getLand(landId);
      return {
        id: land.id.toString(),
        surveyNumber: land.surveyNumber,
        location: land.location,
        area: land.area.toString(),
        areaUnit: land.areaUnit,
        owner: land.owner,
        isActive: land.isActive,
        createdAt: new Date(land.createdAt * 1000).toISOString(),
        updatedAt: new Date(land.updatedAt * 1000).toISOString()
      };
    } catch (error) {
      logger.error('Error fetching land from blockchain:', error);
      throw new Error('Failed to fetch land details from blockchain');
    }
  }

  /**
   * Get document details
   * @param {string} documentId - Document ID to fetch
   * @returns {Promise<Object>} Document details
   */
  async getDocument(documentId) {
    try {
      const doc = await this.contract.getDocument(documentId);
      return {
        id: doc.id.toString(),
        landId: doc.landId.toString(),
        documentHash: doc.documentHash,
        documentType: doc.documentType,
        metadataURI: doc.metadataURI,
        uploadedBy: doc.uploadedBy,
        verifiedBy: doc.verifiedBy,
        isVerified: doc.isVerified,
        verifiedAt: doc.verifiedAt ? new Date(doc.verifiedAt * 1000).toISOString() : null,
        createdAt: new Date(doc.createdAt * 1000).toISOString()
      };
    } catch (error) {
      logger.error('Error fetching document from blockchain:', error);
      throw new Error('Failed to fetch document details from blockchain');
    }
  }

  /**
   * Get all documents for a land
   * @param {string} landId - Land ID
   * @returns {Promise<Array>} Array of document IDs
   */
  async getLandDocuments(landId) {
    try {
      const docIds = await this.contract.getLandDocuments(landId);
      return docIds.map(id => id.toString());
    } catch (error) {
      logger.error('Error fetching land documents from blockchain:', error);
      throw new Error('Failed to fetch land documents from blockchain');
    }
  }
}

module.exports = new BlockchainService();
