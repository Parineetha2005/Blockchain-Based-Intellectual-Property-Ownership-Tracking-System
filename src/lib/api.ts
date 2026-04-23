const API_BASE = '/api';

export interface Idea {
  _id?: string;
  title: string;
  description: string;
  hash: string;
  owner: string;
  category?: string;
  licenseType?: string;
  version?: string;
  tags?: string[];
  feePaid?: number;
  paymentId?: string;
  timestamp: string;
  transactionId?: string;
}

export const registerIdea = async (data: Omit<Idea, '_id' | 'timestamp'>) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  return response.json();
};

export const fetchIdeas = async (): Promise<Idea[]> => {
  const response = await fetch(`${API_BASE}/ideas`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch ideas');
  }
  return response.json();
};

export interface User {
  address: string;
  name: string;
  bio?: string;
  avatarColor?: string;
  joinedAt?: string;
}

export const fetchProfile = async (address: string): Promise<User | null> => {
  const response = await fetch(`${API_BASE}/profile/${address}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateProfile = async (userData: User): Promise<User> => {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Profile update failed');
  }
  return response.json();
};

export const verifyIdea = async (hash: string) => {
  const response = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Verification failed');
  }
  return response.json();
};
