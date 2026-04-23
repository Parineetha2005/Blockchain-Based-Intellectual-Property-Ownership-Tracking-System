import { isConnected, getAddress, setAllowed, Networks } from '@stellar/freighter-api';
import { Networks as StellarNetworks, Horizon } from 'stellar-sdk';
import CryptoJS from 'crypto-js';

// Configuration for Stellar Testnet
export const STELLAR_NETWORK = StellarNetworks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

const server = new Horizon.Server(HORIZON_URL);

/**
 * Fetches recent transactions for a given account
 */
export const fetchRecentTransactions = async (publicKey: string) => {
  if (!publicKey) return [];
  try {
    const transactions = await server
      .transactions()
      .forAccount(publicKey)
      .limit(20)
      .order("desc")
      .call();
    
    return transactions.records;
  } catch (error) {
    console.error('[Stellar] Failed to fetch transactions:', error);
    return [];
  }
};

// Mock Contract ID for demo
export const CONTRACT_ID = 'CCGJUY6K2P7J7W4S2D4X2E6O4R7T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H';

/**
 * Generates SHA-256 hash of a string
 */
export const generateHash = (content: string): string => {
  return CryptoJS.SHA256(content).toString();
};

/**
 * Promisified timeout to prevent hanging on extension calls
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Extension request timed out (30s). Is Freighter open or locked? Try opening the app in a new tab if you are using an iframe.'));
    }, timeoutMs);

    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
};

/**
 * Utility to wait for a few milliseconds
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Connects to Freighter Wallet
 */
export const connectWallet = async (): Promise<string | null> => {
  console.log('[Wallet] Initiating robust connection sequence...');
  
  try {
    // 1. Detection with retry (extensions can sometimes take a moment to inject)
    let freighterExtension = (window as any).freighter;
    if (!freighterExtension) {
      console.log('[Wallet] Initial check failed, retrying detection...');
      await sleep(500); // Wait 500ms and check again
      freighterExtension = (window as any).freighter;
    }

    console.log('[Wallet] window.freighter presence:', !!freighterExtension);

    if (!freighterExtension) {
      // Instead of confirm (which might be blocked), we'll return a special error code
      // handled by App.tsx to show a custom modal or prompt.
      // But for now, we'll try one last alert to be sure.
      const useMock = confirm('Freighter Wallet NOT detected. Do you have the extension installed? \n\nClick OK to use a Demo Wallet instead, or CANCEL to try installing it.');
      if (useMock) {
        return 'G...DEMO_USER_WALLET_777';
      }
      return null;
    }

    // 2. Connectivity check - some versions wait indefinitely if locked
    console.log('[Wallet] Verifying extension state...');
    try {
      // Skip isConnected check as it often hangs if not already allowed
      // and go straight to fetch attempts
    } catch (e) {
      console.warn('[Wallet] Connectivity check skipped.');
    }

    // 3. Main Connection Attempt (Combined setAllowed + getAddress)
    console.log('[Wallet] Attempting to retrieve address...');
    
    // We try both the library and the window object directly
    const fetchAddress = async () => {
      // First ensure we are allowed
      try {
        if (freighterExtension.setAllowed) {
          await freighterExtension.setAllowed();
        } else {
          await setAllowed();
        }
      } catch (err) {
        console.warn('[Wallet] setAllowed failed, attempting getAddress anyway...');
      }

      // Then get the address
      if (freighterExtension.getAddress) {
        return await freighterExtension.getAddress();
      }
      return await getAddress();
    };

    try {
      const result = await withTimeout(fetchAddress(), 15000); // 15s timeout for user interaction
      console.log('[Wallet] Address raw result:', result);

      let address = "";
      if (typeof result === 'string') {
        address = result;
      } else if (result && (result as any).address) {
        address = (result as any).address;
      } else if (result && (result as any).error) {
        throw new Error((result as any).error);
      }

      if (address && address.length > 20) {
        console.log('[Wallet] Connection successful:', address);
        return address;
      }
    } catch (err: any) {
      console.error('[Wallet] Retrieval error:', err.message);
      if (err.message.includes('timed out')) {
        alert('Connection timed out. Please check if the Freighter extension is asking for your password or if it is already open.');
      } else {
        alert(`Wallet Error: ${err.message}`);
      }
    }

    return null;
  } catch (error: any) {
    console.error('[Wallet] Critical failure:', error);
    alert(error.message || 'An unexpected error occurred while connecting.');
    return null;
  }
};
