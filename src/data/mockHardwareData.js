// VibeFab Luxury Curated Product Photography (8 high-res catalog photos)
export const SAMPLE_LUXURY_IMAGES = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80", // Emerald Velvet Sofa / Living
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80", // Curved Warm Ivory Boucle Lounge Chair
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80", // Handcrafted Walnut & Brass Console
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&auto=format&fit=crop&q=80", // Minimalist Haute Interior Nook
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=900&auto=format&fit=crop&q=80", // Velvet Dining Accent & Brass
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=900&auto=format&fit=crop&q=80", // Modular Floating Side Pod
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=900&auto=format&fit=crop&q=80", // Cashmere & Textured Ottoman Stool
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&auto=format&fit=crop&q=80", // Architectural Marble & Wood Detail
];

// Exact 4 Categories required for VibeFab Luxury
export const CATEGORIES = [
  "All Categories",
  "Smart Living",
  "On-The-Go Comfort",
  "Flexi Work & Dine",
  "Storage & Utility",
];

export const INITIAL_ITEMS = [
  {
    id: "item-1",
    sku: "VBF-SL-801",
    name: "Aura Smart Ambient Side Pedestal",
    category: "Smart Living",
    description: "Sculpted Italian travertine pedestal with integrated wireless inductive charging and touch-concealed LED illumination.",
    stock: 42,
    minStock: 15,
    spaceRequired: 30,
    location: "Gallery Wing A - Salon 01",
    price: 2450, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-29",
    supplier: "VibeFab Atelier Milano",
    images: [
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-2",
    sku: "VBF-OG-204",
    name: "Nomad Ergonomic Velvet Travel Bolster",
    category: "On-The-Go Comfort",
    description: "Compact memory-foam headrest and travel recliner bolster enveloped in stain-repellent Belgian velvet with magnetic strap.",
    stock: 78,
    minStock: 20,
    spaceRequired: 22,
    location: "Studio Vault B - Bay 04",
    price: 1850, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-28",
    supplier: "VibeFab Travel Atelier",
    images: [
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-3",
    sku: "VBF-FW-512",
    name: "Harmonix Foldable Walnut Bistro Desk",
    category: "Flexi Work & Dine",
    description: "Dual-utility folding workstation and breakfast surface featuring solid canaletto walnut with brushed muted royal gold dampers.",
    stock: 35,
    minStock: 12,
    spaceRequired: 45,
    location: "Showroom Hall C - Rack 08",
    price: 2300, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-27",
    supplier: "VibeFab Woodworks",
    images: [
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-4",
    sku: "VBF-SU-330",
    name: "Sovereign Concealed Leather Valet Chest",
    category: "Storage & Utility",
    description: "Modular soft-closing vertical chest featuring pebble-grain vegan leather, champagne brass pulls, and velvet watch trays.",
    stock: 55,
    minStock: 15,
    spaceRequired: 38,
    location: "Vault Wing D - Bin 02",
    price: 1950, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-26",
    supplier: "VibeFab Precision Leather",
    images: [
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[7],
      SAMPLE_LUXURY_IMAGES[0],
    ],
  },
  {
    id: "item-5",
    sku: "VBF-SL-822",
    name: "Lumina Scented Acoustic Hearth Pod",
    category: "Smart Living",
    description: "Acoustic fabric wrapped ambient pod with automated aroma diffusion and gentle warm-glow LED halo lighting.",
    stock: 19,
    minStock: 20,
    spaceRequired: 28,
    location: "Gallery Wing A - Salon 03",
    price: 2490, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-25",
    supplier: "VibeFab Atelier Milano",
    images: [
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-6",
    sku: "VBF-OG-210",
    name: "ThermaRest Lumbar Cocoon Cushion",
    category: "On-The-Go Comfort",
    description: "Temperature-regulating micro-gel core with quilted linen exterior for luxury vehicle seating and lounge transposition.",
    stock: 92,
    minStock: 25,
    spaceRequired: 18,
    location: "Studio Vault B - Bay 07",
    price: 1650, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-24",
    supplier: "VibeFab Travel Atelier",
    images: [
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-7",
    sku: "VBF-FW-518",
    name: "Pivot Arc Ergonomic Footrest & Stool",
    category: "Flexi Work & Dine",
    description: "Curved bentwood arch finished in matte charcoal with natural boucle upholstery, swiveling seamlessly for posture support.",
    stock: 64,
    minStock: 18,
    spaceRequired: 25,
    location: "Showroom Hall C - Rack 11",
    price: 1750, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-23",
    supplier: "VibeFab Woodworks",
    images: [
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[6],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[7],
    ],
  },
  {
    id: "item-8",
    sku: "VBF-SU-345",
    name: "Celestial Brass Modular Wall Ledge",
    category: "Storage & Utility",
    description: "Sleek aircraft-grade aluminum and brushed brass floating organizer with integrated hidden key hooks and mail cradle.",
    stock: 12,
    minStock: 20,
    spaceRequired: 20,
    location: "Vault Wing D - Bin 09",
    price: 2150, // Between ₹1500 - ₹2500
    lastUpdated: "2026-10-22",
    supplier: "VibeFab Precision Metal",
    images: [
      SAMPLE_LUXURY_IMAGES[7],
      SAMPLE_LUXURY_IMAGES[0],
      SAMPLE_LUXURY_IMAGES[1],
      SAMPLE_LUXURY_IMAGES[2],
      SAMPLE_LUXURY_IMAGES[3],
      SAMPLE_LUXURY_IMAGES[4],
      SAMPLE_LUXURY_IMAGES[5],
      SAMPLE_LUXURY_IMAGES[6],
    ],
  },
];

export const WAREHOUSE_TOTAL_CAPACITY = 600;

export const INITIAL_ORDERS = [
  {
    id: "ORD-VBF-9421",
    date: "2026-10-30",
    customerName: "Aditya Vardhan",
    customerPhone: "+91 98201 44521",
    address: "Penthouse 42B, The Imperial Towers, Tardeo, Mumbai 400034",
    itemsOrdered: [
      { name: "Aura Smart Ambient Side Pedestal", quantity: 2, price: 2450 },
      { name: "Nomad Ergonomic Velvet Travel Bolster", quantity: 1, price: 1850 },
    ],
    totalAmount: 6750,
    status: "Pending", // Pending / Dispatched / Delivered
  },
  {
    id: "ORD-VBF-9420",
    date: "2026-10-29",
    customerName: "Radhika Mehra",
    customerPhone: "+91 98110 33892",
    address: "Villa 14, Magnolia Enclave, Golf Course Road, Gurugram 122002",
    itemsOrdered: [
      { name: "Harmonix Foldable Walnut Bistro Desk", quantity: 1, price: 2300 },
      { name: "Sovereign Concealed Leather Valet Chest", quantity: 1, price: 1950 },
    ],
    totalAmount: 4250,
    status: "Pending",
  },
  {
    id: "ORD-VBF-9419",
    date: "2026-10-29",
    customerName: "Kabir Singhania",
    customerPhone: "+91 97690 12044",
    address: "Bungalow 7, Koregaon Park Lane 3, Pune 411001",
    itemsOrdered: [
      { name: "Lumina Scented Acoustic Hearth Pod", quantity: 1, price: 2490 },
    ],
    totalAmount: 2490,
    status: "Dispatched",
  },
  {
    id: "ORD-VBF-9418",
    date: "2026-10-28",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 99300 88210",
    address: "Residence 1902, Marina Bay Crest, Worli Sea Face, Mumbai 400018",
    itemsOrdered: [
      { name: "Celestial Brass Modular Wall Ledge", quantity: 2, price: 2150 },
      { name: "Pivot Arc Ergonomic Footrest & Stool", quantity: 1, price: 1750 },
    ],
    totalAmount: 6050,
    status: "Dispatched",
  },
  {
    id: "ORD-VBF-9417",
    date: "2026-10-27",
    customerName: "Vikramaditya Roy",
    customerPhone: "+91 98450 77103",
    address: "Estate 5, Sadashivanagar, Palace Cross Road, Bengaluru 560080",
    itemsOrdered: [
      { name: "Aura Smart Ambient Side Pedestal", quantity: 1, price: 2450 },
    ],
    totalAmount: 2450,
    status: "Delivered",
  },
  {
    id: "ORD-VBF-9416",
    date: "2026-10-26",
    customerName: "Zara Shroff",
    customerPhone: "+91 98210 55430",
    address: "Suite 11A, Alipore Park Mansions, Kolkata 700027",
    itemsOrdered: [
      { name: "ThermaRest Lumbar Cocoon Cushion", quantity: 2, price: 1650 },
    ],
    totalAmount: 3300,
    status: "Delivered",
  },
];
