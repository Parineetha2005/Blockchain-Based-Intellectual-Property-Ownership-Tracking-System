import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Database Connection (Fallback to in-memory/local mock if URI is missing)
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ip-registry';
  
  // For the sake of "fully working locally" in AI Studio without a real MongoDB instance,
  // we will use a simple in-memory storage if the connection fails or if we want to be safe.
  // However, the code below is standard Mongoose.
  
  const ideaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    category: { type: String, default: 'General' },
    licenseType: { type: String, default: 'Proprietary' },
    version: { type: String, default: '1.0.0' },
    tags: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
    transactionId: { type: String }, // Stellar TX ID
    feePaid: { type: Number, default: 0 },
    paymentId: { type: String },
  });

  const userSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String },
    avatarColor: { type: String, default: '#0f172a' },
    joinedAt: { type: Date, default: Date.now }
  });

  const Idea = mongoose.model('Idea', ideaSchema);
  const Profile = mongoose.model('User', userSchema);

  // Memory fallback for demo if DB is not available
  let memoryIdeas: any[] = [
    {
      _id: 'seed-1',
      title: 'Neural Synthesis Protocol',
      description: 'A revolutionary approach to cross-chain neural weights transfer using zero-knowledge proofs.',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      owner: 'G...DEMO_AUTHOR_1',
      category: 'AI/ML',
      licenseType: 'MIT',
      version: '1.0.0',
      tags: ['Neural Networks', 'ZK-Proofs', 'Privacy'],
      transactionId: 'TX-SEEDED-001',
      feePaid: 10,
      paymentId: 'PAY-001',
      timestamp: new Date(Date.now() - 3600000 * 24 * 30)
    },
    {
      _id: 'seed-2',
      title: 'Autonomous Solar Grid Optimizer',
      description: 'Edge computing algorithm for dynamic load balancing in decentralized micro-grids.',
      hash: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
      owner: 'G...DEMO_AUTHOR_2',
      category: 'Renewable Energy',
      licenseType: 'Apache-2.0',
      version: '2.1.0',
      tags: ['Smart Grid', 'IoT', 'Sustainability'],
      transactionId: 'TX-SEEDED-002',
      feePaid: 10,
      paymentId: 'PAY-002',
      timestamp: new Date(Date.now() - 3600000 * 24 * 25)
    },
    {
      _id: 'seed-3',
      title: 'Biometric Encryption Standard',
      description: 'Hashing biometric vectors using homomorphic encryption for secure identity vaulting.',
      hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      owner: 'G...DEMO_AUTHOR_1',
      category: 'Cybersecurity',
      licenseType: 'Proprietary',
      version: '0.9.5-beta',
      tags: ['Biometrics', 'Encryption', 'Security'],
      transactionId: 'TX-SEEDED-003',
      feePaid: 10,
      paymentId: 'PAY-003',
      timestamp: new Date(Date.now() - 3600000 * 24 * 20)
    },
    {
      _id: 'seed-4',
      title: 'Decentralized Clinical Trials Registry',
      description: 'Blockchain-based consensus mechanism for ensuring data integrity in global medical trials.',
      hash: '4db419b45663673f7c13284061a995642a488a03350172828b17300c0a6b7d2f',
      owner: 'G...MED_INSTITUTE_X',
      category: 'Healthcare',
      licenseType: 'GPL-3.0',
      version: '1.2.0',
      tags: ['Medical', 'Blockchain', 'Integrity'],
      transactionId: 'TX-SEEDED-004',
      feePaid: 10,
      paymentId: 'PAY-004',
      timestamp: new Date(Date.now() - 3600000 * 24 * 15)
    },
    {
      _id: 'seed-5',
      title: 'Quantum-Resistant Signature Scheme',
      description: 'Post-quantum lattice-based digital signatures optimized for low-power embedded systems.',
      hash: '8f4e2f9d1a3c5b7e90d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6',
      owner: 'G...QUANTUM_LABS',
      category: 'Cryptography',
      licenseType: 'Creative Commons',
      version: '1.0.1',
      tags: ['Quantum', 'Security', 'Hardware'],
      transactionId: 'TX-SEEDED-005',
      feePaid: 10,
      paymentId: 'PAY-005',
      timestamp: new Date(Date.now() - 3600000 * 24 * 10)
    },
    {
      _id: 'seed-6',
      title: 'P2P Energy Trading Hub',
      description: 'Marketplace for residential solar producers to sell excess energy directly to neighbors.',
      hash: 'hash-demo-6-energy',
      owner: 'G...ENERGY_BLOCK',
      category: 'Fintech',
      licenseType: 'MIT',
      version: '0.9.0',
      tags: ['P2P', 'Energy', 'Marketplace'],
      transactionId: 'TX-SEEDED-006',
      feePaid: 10,
      paymentId: 'PAY-006',
      timestamp: new Date(Date.now() - 3600000 * 24 * 8)
    },
    {
      _id: 'seed-7',
      title: 'Supply Chain RFID Tracker',
      description: 'Immutable tracking of luxury goods from factory to retail using IoT and Stellar.',
      hash: 'hash-demo-7-rfid',
      owner: 'G...CHIP_CORP',
      category: 'Logistics',
      licenseType: 'Proprietary',
      version: '3.0.0',
      tags: ['IoT', 'RFID', 'Anti-Counterfeit'],
      transactionId: 'TX-SEEDED-007',
      feePaid: 10,
      paymentId: 'PAY-007',
      timestamp: new Date(Date.now() - 3600000 * 24 * 6)
    },
    {
      _id: 'seed-8',
      title: 'On-Chain Credential Vault',
      description: 'System for universities to issue zero-knowledge academic credentials on the ledger.',
      hash: 'hash-demo-8-edu',
      owner: 'G...ACADEMY_WEB',
      category: 'Education',
      licenseType: 'Apache-2.0',
      version: '1.1.0',
      tags: ['Education', 'ZKP', 'Verified'],
      transactionId: 'TX-SEEDED-008',
      feePaid: 10,
      paymentId: 'PAY-008',
      timestamp: new Date(Date.now() - 3600000 * 24 * 4)
    },
    {
      _id: 'seed-9',
      title: 'Satellite Dynamic Data Relay',
      description: 'Space-native protocol for low-latency data relay between LEO satellite swarms.',
      hash: 'hash-demo-9-space',
      owner: 'G...SPACE_NODE',
      category: 'Aerospace',
      licenseType: 'LGPL-3.0',
      version: '0.5.0',
      tags: ['Satellites', 'Networking', 'Space'],
      transactionId: 'TX-SEEDED-009',
      feePaid: 10,
      paymentId: 'PAY-009',
      timestamp: new Date(Date.now() - 3600000 * 24 * 3)
    },
    {
      _id: 'seed-10',
      title: 'Carbon Credit Verification Engine',
      description: 'Real-time satellite imagery analysis for verifying carbon sequestration in forests.',
      hash: 'hash-demo-10-green',
      owner: 'G...GREEN_TEAM',
      category: 'Sustainability',
      licenseType: 'Creative Commons',
      version: '1.4.2',
      tags: ['ESV', 'Carbon', 'Satellite'],
      transactionId: 'TX-SEEDED-010',
      feePaid: 10,
      paymentId: 'PAY-010',
      timestamp: new Date(Date.now() - 3600000 * 24 * 2)
    },
    {
      _id: 'seed-11',
      title: 'Decentralized Ad-Exchange',
      description: 'Privacy-preserving advertising network using local computational proofs.',
      hash: 'hash-demo-11-ads',
      owner: 'G...AD_NETWORK',
      category: 'AdTech',
      licenseType: 'MIT',
      version: '2.0.0',
      tags: ['Privacy', 'Ads', 'Edge'],
      transactionId: 'TX-SEEDED-011',
      feePaid: 10,
      paymentId: 'PAY-011',
      timestamp: new Date(Date.now() - 3600000 * 12)
    },
    {
      _id: 'seed-12',
      title: 'NFT-Based Patent Staking',
      description: 'Fractional ownership of engineering patents represented as liquid on-chain tokens.',
      hash: 'hash-demo-12-patent',
      owner: 'G...PATENT_POOL',
      category: 'LegalTech',
      licenseType: 'Proprietary',
      version: '1.0.0',
      tags: ['Patents', 'RWA', 'Fractional'],
      transactionId: 'TX-SEEDED-012',
      feePaid: 10,
      paymentId: 'PAY-012',
      timestamp: new Date(Date.now() - 3600000 * 2)
    }
  ];

  let memoryProfiles: any[] = [
    {
      address: 'G...DEMO_AUTHOR_1',
      name: 'Dr. Orion Vance',
      bio: 'Principal Architect at Neural Synthesis Labs. Blockchain Enthusiast.',
      avatarColor: '#4f46e5'
    },
    {
      address: 'G...DEMO_AUTHOR_2',
      name: 'Elena Solis',
      bio: 'Grid Systems Engineer with a focus on sustainable blockchain nodes.',
      avatarColor: '#10b981'
    }
  ];

  // Connect to MongoDB
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.warn('MongoDB connection failed. Using in-memory mock for demo.');
    });

  // API Routes
  
  // Register Idea
  app.post('/api/register', async (req, res) => {
    try {
      const { title, description, hash, owner, transactionId, category, licenseType, version, tags, feePaid, paymentId } = req.body;

      // Try DB first
      if (mongoose.connection.readyState === 1) {
        const existing = await Idea.findOne({ hash });
        if (existing) {
          return res.status(400).json({ error: 'Idea already registered' });
        }

        const newIdea = new Idea({
          title,
          description,
          hash,
          owner,
          transactionId,
          category,
          licenseType,
          version,
          tags,
          feePaid,
          paymentId
        });

        await newIdea.save();
        return res.status(201).json(newIdea);
      } else {
        // Fallback to memory
        const existing = memoryIdeas.find(i => i.hash === hash);
        if (existing) return res.status(400).json({ error: 'Idea already registered' });
        
        const newIdea = {
          _id: Math.random().toString(36).substring(7),
          title,
          description,
          hash,
          owner,
          transactionId,
          category: category || 'General',
          licenseType: licenseType || 'Proprietary',
          version: version || '1.0.0',
          tags: tags || [],
          feePaid: feePaid || 0,
          paymentId: paymentId || '',
          timestamp: new Date()
        };
        memoryIdeas.push(newIdea);
        return res.status(201).json(newIdea);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all Ideas (Dashboard)
  app.get('/api/ideas', async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const ideas = await Idea.find().sort({ timestamp: -1 });
        res.json(ideas);
      } else {
        res.json([...memoryIdeas].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Profile Routes
  app.get('/api/profile/:address', async (req, res) => {
    const { address } = req.params;
    try {
      if (mongoose.connection.readyState === 1) {
        const profile = await Profile.findOne({ address });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
      } else {
        const profile = memoryProfiles.find(p => p.address === address);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/profile', async (req, res) => {
    const { address, name, bio, avatarColor } = req.body;
    try {
      if (mongoose.connection.readyState === 1) {
        const profile = await Profile.findOneAndUpdate(
          { address },
          { name, bio, avatarColor },
          { upsert: true, new: true }
        );
        res.json(profile);
      } else {
        let profile = memoryProfiles.find(p => p.address === address);
        if (profile) {
          profile.name = name;
          profile.bio = bio;
          profile.avatarColor = avatarColor;
        } else {
          profile = { address, name, bio, avatarColor, joinedAt: new Date() };
          memoryProfiles.push(profile);
        }
        res.json(profile);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Verify Idea
  app.post('/api/verify', async (req, res) => {
    try {
      const { hash } = req.body;
      let idea;
      
      if (mongoose.connection.readyState === 1) {
        idea = await Idea.findOne({ hash });
      } else {
        idea = memoryIdeas.find(i => i.hash === hash);
      }
      
      if (idea) {
        res.json({
          found: true,
          owner: idea.owner,
          timestamp: idea.timestamp,
          title: idea.title,
          category: idea.category,
          version: idea.version,
          licenseType: idea.licenseType
        });
      } else {
        res.json({ found: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
