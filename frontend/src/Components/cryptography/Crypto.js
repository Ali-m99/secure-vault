import CryptoJS from 'crypto-js';

// Derive encryption key from master password
const deriveKey = (keySeed, salt) => {
    return CryptoJS.PBKDF2(keySeed, salt, {
        keySize: 256 / 32, // 256-bit key
        iterations: 100000,
    });
};

// Encrypt data using AES-256
const encryptData = (data, key) => {
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
};

// Decrypt data using AES-256
const decryptData = (encryptedData, key) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
};

export { deriveKey, encryptData, decryptData };