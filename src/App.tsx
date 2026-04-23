import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Register from './components/Register';
import Verify from './components/Verify';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import ProfileSetup from './components/ProfileSetup';
import Auth from './components/Auth';
import { connectWallet } from './lib/stellar';
import { fetchProfile, User } from './lib/api';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [prevTab, setPrevTab] = useState('home');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress && walletAddress !== 'G...DEMO_USER_WALLET_777') {
      checkProfile(walletAddress);
    }
  }, [walletAddress]);

  // Handle protected tabs
  useEffect(() => {
    if (['register', 'dashboard', 'transactions'].includes(activeTab) && !walletAddress) {
      setPrevTab(activeTab);
      setActiveTab('login');
    }
  }, [activeTab, walletAddress]);

  const checkProfile = async (address: string) => {
    try {
      const profile = await fetchProfile(address);
      if (profile) {
        setUserProfile(profile);
        // If we were trying to go somewhere, go there now
        if (activeTab === 'login') {
          setActiveTab(prevTab !== 'login' ? prevTab : 'dashboard');
        }
      } else {
        setShowProfileSetup(true);
      }
    } catch (err) {
      setShowProfileSetup(true);
    }
  };

  const handleConnect = async () => {
    console.log('[App] handleConnect triggered');
    setStatus('connecting');
    setError(null);
    try {
      const address = await connectWallet();
      console.log('[App] connectWallet result:', address);
      if (address) {
        setWalletAddress(address);
        setStatus('connected');
      } else {
        setStatus('error');
        setError('Extension not found or request cancelled.');
      }
    } catch (err: any) {
      console.error('[App] Connection error:', err);
      setStatus('error');
      setError(err.message || 'An unexpected error occurred during connection.');
    }
  };

  const handleUseDemo = () => {
    setWalletAddress('G...DEMO_USER_WALLET_777');
    setUserProfile({
      address: 'G...DEMO_USER_WALLET_777',
      name: 'Demo Architect',
      avatarColor: '#0f172a'
    });
    setStatus('connected');
    setError(null);
    if (activeTab === 'login') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setWalletAddress(null);
    setUserProfile(null);
    setShowProfileSetup(false);
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onStart={() => setActiveTab('register')} />;
      case 'login':
        return (
          <Auth 
            onConnect={handleConnect} 
            onUseDemo={handleUseDemo} 
            isConnecting={status === 'connecting'} 
            error={error} 
          />
        );
      case 'register':
        return (
          <Register 
            walletAddress={walletAddress} 
            onConnect={handleConnect} 
            onUseDemo={handleUseDemo}
            isConnecting={status === 'connecting'}
            connectionError={error}
          />
        );
      case 'verify':
        return <Verify />;
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return (
          <TransactionHistory 
            walletAddress={walletAddress || ''} 
            onConnect={handleConnect}
            onUseDemo={handleUseDemo}
            isConnecting={status === 'connecting'}
          />
        );
      default:
        return <Home onStart={() => setActiveTab('register')} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        walletAddress={walletAddress}
        user={userProfile}
        onConnect={handleConnect}
        onLogout={handleLogout}
        isConnecting={status === 'connecting'}
        connectionError={error}
      >
        {renderContent()}
      </Layout>

      {showProfileSetup && walletAddress && (
        <ProfileSetup 
          address={walletAddress} 
          onComplete={(profile) => {
            setUserProfile(profile);
            setShowProfileSetup(false);
          }} 
        />
      )}
    </>
  );
}
