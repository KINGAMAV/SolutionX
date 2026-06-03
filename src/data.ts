import { type Artisan, type Product, type Order, type User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Jean-Marc',
    email: 'jean@example.com',
    houseNumber: 'Villa 124',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    role: 'client'
  },
  {
    id: 'u2',
    name: 'Admin Principal',
    email: 'admin@solutionx.ci',
    houseNumber: 'HQ-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    role: 'admin'
  }
];

export const ARTISANS: Artisan[] = [
  {
    id: '1',
    name: 'Koffi Kouassi',
    category: 'Electricien',
    experience: 12,
    rating: 4.9,
    hourlyRate: 15000,
    verified: true,
    specialty: 'Expert Électricien',
    zones: ['Cocody', 'Riviera', 'Bingerville'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSjzHWp6PmNFxRSa7WNvGVem9xucSM89puNb3c8ODo-dFPiAzmRwKPGT0d0xtF8sMjt-kYgVegyTb4SlhyhEZkP6p9Q6TB9ftVfanSxjEz1NXna83L-ynDjjrCsm_rl5QjbVFvJUavjmHz897nM1-LBRiJqGGI97fiHTP8ApocaFzFrcC4zNk1A4CD8XcjWqlAoGYm5R7n8TMKebUPk6ltWwa_C5zlKxtNWkC7on5WXHpYWM2Psvu66o-lBURCJuHINQEVhvBUUmvA'
  },
  {
    id: '2',
    name: 'Aminata Diallo',
    category: 'Menuiserie',
    experience: 8,
    rating: 4.7,
    hourlyRate: 12000,
    verified: true,
    specialty: 'Menuiserie • Design intérieur',
    zones: ['Marcory', 'Zone 4'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaixwngHHUaD6cM8UCJ5zWjKnGXWppOyuvgOB48D0W9GAWJODWR2sAGc4eTxEDiBU96sRQPiC3gqCfVgmwGSYr5SBcElstsZzGAS43ORrFDoDD1nCFa4lQEkfTA1bX_2JI0o-UVAHDBjqDVb38c7KUiw6rCWF6D9YR37BvIIBI2CgSy4yWoPnw394xkUHFszqa12KgDy-4yIz0I4ypahK9rmwBgmR3O-XgB3FpYM59Zt3ViU0VAE4efolqBOSWOiDHJtiM1Hdr0hhj'
  },
  {
    id: '3',
    name: 'Moussa Traoré',
    category: 'Plomberie',
    experience: 15,
    rating: 4.8,
    hourlyRate: 10000,
    verified: true,
    specialty: 'Plomberie • Dépannage 24/7',
    zones: ['Plateau', 'Adjamé'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP5WWIGcnMzAqHjkVs78766LybBNTgzYfuy2ypdWigqLRvNeryJj7Wi_6v9RciTgLg2whU9lgg2sri2D4Hizh_650HyCIwKqQkpH-IoXZakbHCQv1Nn_zvR86KhC_pQULscsn0Z3iUp2hKgCKWpXjL_YJjunPm6QqWeepHcBHsM0dJDU4g05vJDUGd10v7HYBXHbTk4NoqiBR3j8V6z-LH8qpitBlcEFOqhsVTeQpPFjTXnkV9OnGmhOgpVEjCDE8r7ZncVfxHhrtj'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sac de Riz (5kg)',
    category: 'Céréales',
    price: 4500,
    unit: '5kg',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdhsrtZPXBCLLKZj-f8mHWNveZHN7GMZ-pm7voTVC9HPMqcD6avK_f6ZRYdE1YP-1pbP5Q3VWNDreOtqDquugXaoGjnXmzyaurnsOQbPqVAILvOVn_ITR3nzRSoS42cEOrRNt0iB6KjN1BKe46AGbpyYbOh6s2jDISJI1Q2EmtXJONp_MAu6pa-aUhY8mjXyrywOqUdZMjZRUjFqFSFluuXcK5G_NeTYwnRqQn4KIS0Sz1fepvn1BIt3cD6mINcXZqIJ0jFycsbWJg'
  },
  {
    id: 'p2',
    name: 'Huile de palme (1L)',
    category: 'Épicerie',
    price: 1200,
    unit: '1L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi0J2TeVnv1pB62BZUZxwuPM036rRwYXrsoufLIwrjqkHWnTKpMax6OOVddFqBTX6iaINjRJPW_wBUiCcMw3LEV2X3gVTg2CwpZkiYWXS3EwKSFXaL9EVTcBD0Hwnu7hu4-9M_51mJeHJzQZ2slHGFY2O6Gsu4jRI3o3kdFk_yBpnAewmIKKcRljRU8mwR8tWBMN1WzDXPuZe2IKZOOat-N0h2ES0ENV1ZZRjl_WOavRuUWbMLf4jOuk1hPI36l-adNs2CEfzGN9Ch'
  },
  {
    id: 'p3',
    name: 'Tomates Fraîches (1kg)',
    category: 'Légumes',
    price: 800,
    unit: '1kg',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTIcHcV2DWjdrVC33iCv8AX2wknppHpjD6lLBuj3jigNPDQIEGUrbmiytOz3ZoNxGdjQk7oYLkRBvBqBeMUXZvZnRql_yhCklq88qbE-LWnU4qRm13j6miEzbYpD4FrxeNi-QlwHzvnK0yIOIrn-Eso-pkJaShCTU6yIX6akNKuCqdnm-Oqosm7vfAQ-_p7vxJXFoHcdWLU9sdNSXKNloljMah8RHKvr69M4Glb-Bj7TOAxm9s706Far0vZRAeiS8vWjVLgQr0hQxL'
  },
  {
    id: 'p4',
    name: 'Pack Eau Minérale (6x1.5L)',
    category: 'Boissons',
    price: 2500,
    unit: 'Pack',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6KTrl7NDzMck2UcVkDF9Bp1hKukL3mCXpvM7mCWAuCm6d3Pmv8_kDyX2afwz5FNbbYPIaZMmm-vZ1GCvFzSNnoTUeSohEacjNmsDdVEoW5OCb07lQSBlILK92ToWnac2Z3Hzrn7PGE71Z35bfSw_UZPeDDtMuA9LJz0132Ma15cdlEsGraZV45NT-Q2df3hboR5DRgxdPk3dglCSfdHeAOVHMIG2zx6wh9E0GKvygfVZq4U_qKT4qivBO6NXmFT9cHHyOtHg5bYbo'
  },
  {
    id: 'p5',
    name: 'Beurre de Cacahuète (500g)',
    category: 'Épicerie',
    price: 2800,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1516685018646-549d2f93b09d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p6',
    name: 'Savon Multi-usage',
    category: 'Hygiène',
    price: 950,
    unit: 'Unité',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p7',
    name: 'Jus de Fruits (1L)',
    category: 'Boissons',
    price: 1800,
    unit: '1L',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p8',
    name: 'Farine de Blé (5kg)',
    category: 'Boulangerie',
    price: 3500,
    unit: '5kg',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'SOL-92834',
    userId: 'u1',
    status: 'delivering',
    paymentStatus: 'paid',
    items: [
      { id: '1', productId: 'p1', name: '2x Poulet Braisé ATTIÉKÉ', price: 12000, quantity: 2 },
      { id: '2', productId: 'p2', name: '1x Alloco (Format Large)', price: 2500, quantity: 1 }
    ],
    total: 16000,
    deliveryFee: 1500,
    createdAt: '14:05',
    deliveryTime: '14:45',
    carrier: 'Moussa'
  }
];
