import { useEffect, useState } from 'react';
import {
  initializeEncryption,
  getPublicKey,
  getPrivateKey,
  clearKeys,
} from '@/lib/encryption';
import encryptionService from '@/services/encryptionService';
import authService from '@/services/authService';

/**
 * Hook to initialize and manage end-to-end encryption for the current user
 */
export function useEncryption() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = authService.getStoredUser();
        if (!user) {
          console.log('No user logged in, skipping encryption init');
          setIsInitialized(true);
          return;
        }

        const userId = user._id;
        
        // Check if keys already exist for this user
        let publicKey = getPublicKey(userId);
        let privateKey = getPrivateKey(userId);

        if (!publicKey || !privateKey) {
          console.log('No encryption keys found for user, generating new ones...');
          // Generate new keys
          const keys = await initializeEncryption(userId);
          publicKey = keys.publicKey;
          privateKey = keys.privateKey;
        } else {
          console.log('Existing encryption keys found for user');
        }

        // Always upload public key to server to ensure it's synced
        console.log('Uploading public key to server...');
        await encryptionService.updatePublicKey(publicKey);
        console.log('Public key uploaded successfully');

        setIsInitialized(true);
      } catch (err: any) {
        console.error('Encryption initialization error:', err);
        setError(err.message || 'Failed to initialize encryption');
        setIsInitialized(true); // Still mark as initialized to not block UI
      }
    };

    init();
  }, []);

  const reinitialize = async () => {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const userId = user._id;
      
      // Clear existing keys
      clearKeys();
      
      // Generate new keys
      const keys = await initializeEncryption(userId);
      
      // Upload public key to server
      await encryptionService.updatePublicKey(keys.publicKey);
      
      setIsInitialized(true);
      setError(null);
    } catch (err: any) {
      console.error('Encryption reinitialization error:', err);
      setError(err.message || 'Failed to reinitialize encryption');
    }
  };

  return { isInitialized, error, reinitialize };
}
