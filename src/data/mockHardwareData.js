// Mock Hardware Images (Monochromatic high-res hardware photography)
const SAMPLE_HARDWARE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80", // Hinge
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80", // Metal precision
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80", // Drawer slide / mechanism
  "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?w=600&auto=format&fit=crop&q=80", // Brass handle
  "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&auto=format&fit=crop&q=80", // Metallic knob
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80", // Steel bracket
  "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80", // Technical fitting
];

export const INITIAL_ITEMS = [
  {
    id: "item-1",
    sku: "HW-HNG-110",
    name: "Soft-Close Cabinet Hinge 110°",
    category: "Hinges & Pivots",
    stock: 145,
    minStock: 50,
    spaceRequired: 35,
    location: "Aisle A - Rack 04",
    price: 380, // in INR (₹)
    lastUpdated: "2026-10-25",
    supplier: "Austro Blum Ltd",
    images: [
      SAMPLE_HARDWARE_IMAGES[0],
      SAMPLE_HARDWARE_IMAGES[1],
      SAMPLE_HARDWARE_IMAGES[2],
      SAMPLE_HARDWARE_IMAGES[3],
      SAMPLE_HARDWARE_IMAGES[4],
      SAMPLE_HARDWARE_IMAGES[5],
      SAMPLE_HARDWARE_IMAGES[6],
    ],
  },
  {
    id: "item-2",
    sku: "HW-DRW-450",
    name: "Heavy-Duty Ball Bearing Slide 450mm",
    category: "Drawer Systems",
    stock: 82,
    minStock: 30,
    spaceRequired: 55,
    location: "Aisle B - Bay 12",
    price: 1450, // in INR (₹)
    lastUpdated: "2026-10-24",
    supplier: "Hettich Precision",
    images: [
      SAMPLE_HARDWARE_IMAGES[2],
      SAMPLE_HARDWARE_IMAGES[0],
      SAMPLE_HARDWARE_IMAGES[1],
      SAMPLE_HARDWARE_IMAGES[5],
      null,
      null,
      null,
    ],
  },
  {
    id: "item-3",
    sku: "HW-HND-160",
    name: "Brushed Brass T-Bar Handle 160mm",
    category: "Handles & Knobs",
    stock: 220,
    minStock: 40,
    spaceRequired: 25,
    location: "Aisle C - Shelf 02",
    price: 680, // in INR (₹)
    lastUpdated: "2026-10-26",
    supplier: "Forma Hardware",
    images: [
      SAMPLE_HARDWARE_IMAGES[3],
      SAMPLE_HARDWARE_IMAGES[4],
      SAMPLE_HARDWARE_IMAGES[0],
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-4",
    sku: "HW-STR-100",
    name: "Hydraulic Gas Strut 100N Lid Stay",
    category: "Lift & Flap Fittings",
    stock: 24,
    minStock: 25,
    spaceRequired: 20,
    location: "Aisle A - Rack 09",
    price: 950, // in INR (₹)
    lastUpdated: "2026-10-22",
    supplier: "Austro Blum Ltd",
    images: [
      SAMPLE_HARDWARE_IMAGES[1],
      SAMPLE_HARDWARE_IMAGES[6],
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-5",
    sku: "HW-KNB-030",
    name: "Matte Black Knurled Knob 30mm",
    category: "Handles & Knobs",
    stock: 310,
    minStock: 50,
    spaceRequired: 18,
    location: "Aisle C - Shelf 05",
    price: 420, // in INR (₹)
    lastUpdated: "2026-10-28",
    supplier: "Minimalist Studio",
    images: [
      SAMPLE_HARDWARE_IMAGES[4],
      SAMPLE_HARDWARE_IMAGES[3],
      SAMPLE_HARDWARE_IMAGES[1],
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-6",
    sku: "HW-BRK-040",
    name: "Zinc Heavy Corner Joint Bracket 40x40",
    category: "Fasteners & Brackets",
    stock: 480,
    minStock: 100,
    spaceRequired: 30,
    location: "Aisle D - Bin 15",
    price: 95, // in INR (₹)
    lastUpdated: "2026-10-19",
    supplier: "Titan Fasteners",
    images: [
      SAMPLE_HARDWARE_IMAGES[5],
      SAMPLE_HARDWARE_IMAGES[6],
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-7",
    sku: "HW-LTC-015",
    name: "Magnetic Touch Push-to-Open Latch",
    category: "Hinges & Pivots",
    stock: 15,
    minStock: 30,
    spaceRequired: 12,
    location: "Aisle A - Rack 01",
    price: 290, // in INR (₹)
    lastUpdated: "2026-10-27",
    supplier: "Sugatsune Tech",
    images: [
      SAMPLE_HARDWARE_IMAGES[0],
      SAMPLE_HARDWARE_IMAGES[1],
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-8",
    sku: "HW-LEG-120",
    name: "Adjustable Cylindrical Leg 120mm (Steel)",
    category: "Legs & Bases",
    stock: 95,
    minStock: 40,
    spaceRequired: 65,
    location: "Aisle B - Bay 03",
    price: 780, // in INR (₹)
    lastUpdated: "2026-10-20",
    supplier: "FurniBase Co.",
    images: [
      SAMPLE_HARDWARE_IMAGES[6],
      SAMPLE_HARDWARE_IMAGES[1],
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-9",
    sku: "HW-DRW-500U",
    name: "Under-Mount Synchronized Slide 500mm",
    category: "Drawer Systems",
    stock: 64,
    minStock: 25,
    spaceRequired: 48,
    location: "Aisle B - Bay 14",
    price: 1950, // in INR (₹)
    lastUpdated: "2026-10-28",
    supplier: "Hettich Precision",
    images: [
      SAMPLE_HARDWARE_IMAGES[2],
      SAMPLE_HARDWARE_IMAGES[0],
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: "item-10",
    sku: "HW-CAM-015",
    name: "Cam Lock & Connecting Bolt Set M6",
    category: "Fasteners & Brackets",
    stock: 650,
    minStock: 150,
    spaceRequired: 40,
    location: "Aisle D - Bin 08",
    price: 65, // in INR (₹)
    lastUpdated: "2026-10-21",
    supplier: "Titan Fasteners",
    images: [
      SAMPLE_HARDWARE_IMAGES[5],
      SAMPLE_HARDWARE_IMAGES[1],
      null,
      null,
      null,
      null,
      null,
    ],
  },
];

export const CATEGORIES = [
  "All Categories",
  "Hinges & Pivots",
  "Drawer Systems",
  "Handles & Knobs",
  "Lift & Flap Fittings",
  "Fasteners & Brackets",
  "Legs & Bases",
];

export const WAREHOUSE_TOTAL_CAPACITY = 600;

export const INITIAL_ORDERS = [
  {
    id: "ORD-9421",
    customer: "Oakline Cabinetry Studios",
    itemsCount: 48,
    amount: 115400, // in INR (₹)
    status: "Processing",
    date: "2026-10-29",
  },
  {
    id: "ORD-9420",
    customer: "Nordic Woodworks Co.",
    itemsCount: 112,
    amount: 312800, // in INR (₹)
    status: "Shipped",
    date: "2026-10-29",
  },
  {
    id: "ORD-9419",
    customer: "Archline Interiors",
    itemsCount: 30,
    amount: 64500, // in INR (₹)
    status: "Delivered",
    date: "2026-10-28",
  },
  {
    id: "ORD-9418",
    customer: "Metropolis Modular Kitchens",
    itemsCount: 95,
    amount: 215000, // in INR (₹)
    status: "Delivered",
    date: "2026-10-27",
  },
  {
    id: "ORD-9417",
    customer: "Apex Millwork Group",
    itemsCount: 64,
    amount: 155000, // in INR (₹)
    status: "Cancelled",
    date: "2026-10-26",
  },
];
