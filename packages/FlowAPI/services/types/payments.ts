/**
 * Configuration interface for payment API credentials and endpoint
 * @interface Config
 * @description Contains the necessary authentication and configuration parameters for the payment API
 */
export interface Config {
    /** 
     * API key for authentication
     * @type {string}
     * @required
     */
    apiKey: string;

    /** 
     * Secret key for secure API communication
     * @type {string}
     * @required
     */
    secretKey: string;

    /** 
     * Base URL for the payment API endpoint
     * @type {string}
     * @required
     */
    apiUrl: string;
}
  
/**
 * Standard response format for payment operations
 * @interface PaymentResponse
 * @description Represents the structure of the API response for payment-related operations
 */
export interface PaymentResponse {
    /** 
     * Indicates if the operation was successful
     * @type {boolean}
     */
    success: boolean;

    /** 
     * Optional response data when operation is successful
     * @type {any}
     * @optional
     */
    data?: any;

    /** 
     * Error message when operation fails
     * @type {string}
     * @optional
     */
    error?: string;
}

/**
 * Payment parameters for creating a new payment request
 * @interface PaymentParams
 * @description Represents the data required to create a new payment request
 * 
 */
export interface PaymentParams {
    /**
     * Unique identifier for the commerce order
     * @type {string}
     * @required
    */
    commerceOrder?: string;
    /**
     * Subject or description of the payment
     * @type {string}
     * @required
     */
    subject: string;
    /**
     * Currency code for the payment amount
     * @type {string}
     * @required
     */
    currency: string;
    /**
     * Amount to be paid
     * @type {number}
     * @required
     */
    amount: number;
    /**
     * Email address for payment notifications
     * @type {string}
     * @required
     */
    email: string;
    /**
     * URL to confirm payment status
     * @type {string}
     * @required
     */
    urlConfirmation: string;
    /**
     * URL to redirect after payment completion
     * @type {string}
     * @required
     */
    urlReturn: string;
    optional?: Record<string, unknown>;
}