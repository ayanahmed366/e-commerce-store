/*
  products.js - Store ka data (collections + products).

  Pehli dafa site khulti hai to neeche wala DEFAULT_COLLECTIONS use hota hai.
  Uske baad sab kuch (add / edit / delete) browser ki localStorage mein save hota hai.
  Agar default data wapas chahiye to browser ki site data clear kar dein.

  Collection:  id, title, description, art (css class), emoji, image (optional), products[]
  Product:     id, name, emoji, image (optional), price (ek BOX ki price),
               pieces (ek box mein pieces), boxesPerCarton, cartonPrice
*/
const STORE_KEY = 'rustamSuperMartStoreV2';
const OLD_COLLECTIONS_KEY = 'rustamSuperMartCollectionsV1'; // purani custom collections yahan se migrate hoti hain

const DEFAULT_COLLECTIONS = [
  {
    id: 'medicines', title: 'Medicines', art: 'medicine-art', emoji: '💊 🧴', image: '',
    description: 'Find everyday healthcare essentials and wellness products.',
    products: [
      { id: 'med-1', name: 'Paracetamol Tablets', emoji: '💊', price: 250, pieces: 10, boxesPerCarton: 12, cartonPrice: 2900 },
      { id: 'med-2', name: 'Cough Syrup', emoji: '🧴', price: 1800, pieces: 12, boxesPerCarton: 6, cartonPrice: 10500 },
      { id: 'med-3', name: 'Bandage Roll', emoji: '🩹', price: 400, pieces: 12, boxesPerCarton: 20, cartonPrice: 7800 },
      { id: 'med-4', name: 'Vitamin C Tablets', emoji: '🍊', price: 900, pieces: 10, boxesPerCarton: 10, cartonPrice: 8800 }
    ]
  },
  {
    id: 'biscuits', title: 'Biscuits', art: 'biscuit-art', emoji: '🍪 🍪', image: '',
    description: 'Delicious biscuits for every mood and moment.',
    products: [
      { id: 'bis-1', name: 'Chocolate Cream Biscuits', emoji: '🍫', price: 480, pieces: 12, boxesPerCarton: 12, cartonPrice: 5600 },
      { id: 'bis-2', name: 'Wheat Digestive Biscuits', emoji: '🍪', price: 520, pieces: 12, boxesPerCarton: 10, cartonPrice: 5000 },
      { id: 'bis-3', name: 'Coconut Cookies', emoji: '🥥', price: 450, pieces: 12, boxesPerCarton: 12, cartonPrice: 5300 },
      { id: 'bis-4', name: 'Salty Crackers', emoji: '🧂', price: 360, pieces: 12, boxesPerCarton: 15, cartonPrice: 5300 }
    ]
  },
  {
    id: 'snacks', title: 'Snacks & Nimko', art: 'snacks-art', emoji: '🥨 🍿 🥔', image: '',
    description: 'Crunchy, tasty snacks for every occasion.',
    products: [
      { id: 'snk-1', name: 'Potato Chips', emoji: '🥔', price: 600, pieces: 12, boxesPerCarton: 10, cartonPrice: 5800 },
      { id: 'snk-2', name: 'Nimko Mix', emoji: '🥨', price: 900, pieces: 12, boxesPerCarton: 8, cartonPrice: 7000 },
      { id: 'snk-3', name: 'Popcorn', emoji: '🍿', price: 480, pieces: 12, boxesPerCarton: 12, cartonPrice: 5600 },
      { id: 'snk-4', name: 'Masala Peanuts', emoji: '🥜', price: 700, pieces: 12, boxesPerCarton: 8, cartonPrice: 5500 }
    ]
  },
  {
    id: 'wheat-flour', title: 'Wheat Flour', art: 'flour-art', emoji: '🌾 🥣', image: '',
    description: 'Quality atta for fresh and delicious everyday cooking.',
    products: [
      { id: 'flr-1', name: 'Wheat Flour (Atta) 5 kg', emoji: '🌾', price: 3000, pieces: 4, boxesPerCarton: 5, cartonPrice: 14500 },
      { id: 'flr-2', name: 'Wheat Flour (Atta) 10 kg', emoji: '🌾', price: 3100, pieces: 2, boxesPerCarton: 5, cartonPrice: 15000 },
      { id: 'flr-3', name: 'Fine Flour (Maida) 1 kg', emoji: '🥣', price: 2000, pieces: 10, boxesPerCarton: 5, cartonPrice: 9700 },
      { id: 'flr-4', name: 'Semolina (Suji) 1 kg', emoji: '🍞', price: 2200, pieces: 10, boxesPerCarton: 5, cartonPrice: 10700 }
    ]
  },
  {
    id: 'rice', title: 'Rice', art: 'rice-art', emoji: '🍚 🌾', image: '',
    description: 'Quality rice for healthy and delicious meals.',
    products: [
      { id: 'ric-1', name: 'Basmati Rice 5 kg', emoji: '🍚', price: 4800, pieces: 4, boxesPerCarton: 5, cartonPrice: 23500 },
      { id: 'ric-2', name: 'Sella Rice 5 kg', emoji: '🍚', price: 4500, pieces: 4, boxesPerCarton: 5, cartonPrice: 22000 },
      { id: 'ric-3', name: 'Super Kernel Basmati 1 kg', emoji: '🌾', price: 2600, pieces: 10, boxesPerCarton: 5, cartonPrice: 12700 },
      { id: 'ric-4', name: 'Brown Rice 1 kg', emoji: '🍘', price: 2300, pieces: 10, boxesPerCarton: 5, cartonPrice: 11200 }
    ]
  },
  {
    id: 'pulses', title: 'Pulses & Daal', art: 'pulses-art', emoji: '🫘 🥣 🫘', image: '',
    description: 'Nutritious pantry staples for your everyday meals.',
    products: [
      { id: 'pls-1', name: 'Masoor Daal 1 kg', emoji: '🫘', price: 2300, pieces: 10, boxesPerCarton: 5, cartonPrice: 11200 },
      { id: 'pls-2', name: 'Moong Daal 1 kg', emoji: '🫘', price: 2500, pieces: 10, boxesPerCarton: 5, cartonPrice: 12200 },
      { id: 'pls-3', name: 'Chana Daal 1 kg', emoji: '🥣', price: 2200, pieces: 10, boxesPerCarton: 5, cartonPrice: 10700 },
      { id: 'pls-4', name: 'White Chickpeas 1 kg', emoji: '🫛', price: 2400, pieces: 10, boxesPerCarton: 5, cartonPrice: 11700 }
    ]
  },
  {
    id: 'candies', title: 'Candies & Sweets', art: 'candy-art', emoji: '🍭 🍬 🍭', image: '',
    description: 'A little sweetness in every day.',
    products: [
      { id: 'can-1', name: 'Fruit Candy', emoji: '🍬', price: 350, pieces: 24, boxesPerCarton: 12, cartonPrice: 4000 },
      { id: 'can-2', name: 'Lollipops', emoji: '🍭', price: 420, pieces: 24, boxesPerCarton: 12, cartonPrice: 4800 },
      { id: 'can-3', name: 'Chocolate Toffee', emoji: '🍫', price: 500, pieces: 24, boxesPerCarton: 10, cartonPrice: 4800 },
      { id: 'can-4', name: 'Jelly Sweets', emoji: '🍡', price: 380, pieces: 24, boxesPerCarton: 12, cartonPrice: 4300 }
    ]
  }
];

/* ---------- Store helpers ---------- */
function cloneData(value) { return JSON.parse(JSON.stringify(value)); }

let storeCache = null;

function loadStore() {
  if (storeCache) return storeCache;
  let data = null;
  try { data = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { data = null; }
  if (!Array.isArray(data)) {
    data = cloneData(DEFAULT_COLLECTIONS);
    // Purani version mein user ne jo collections add ki thin, unhein saath le aao
    try {
      const old = JSON.parse(localStorage.getItem(OLD_COLLECTIONS_KEY) || '[]');
      if (Array.isArray(old)) {
        old.forEach(item => {
          if (item && item.id && item.name) {
            data.push({ id: String(item.id), title: item.name, description: item.description || '', art: '', emoji: '', image: item.image || '', products: [] });
          }
        });
      }
    } catch { /* ignore */ }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }
  storeCache = data;
  return data;
}

/* change(list) ko ek copy par chalata hai; save ho jaye to true, warna false (data wahi rehta hai) */
function editStore(change) {
  const draft = cloneData(loadStore());
  change(draft);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(draft)); } catch { return false; }
  storeCache = draft;
  return true;
}

function makeId(prefix) {
  const clean = String(prefix || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'item';
  return `${clean}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function findCollection(id) {
  return loadStore().find(collection => collection.id === id) || null;
}

function findProduct(id) {
  for (const collection of loadStore()) {
    const product = (collection.products || []).find(item => item.id === id);
    if (product) return product;
  }
  return null;
}
