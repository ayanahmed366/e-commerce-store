/*
  script.js - SHARED code, runs on EVERY page.
  Header (nav bar), footer, login form, add-to-cart form, toast and cart count
  sab yahin se banta hai, is liye saare pages par bilkul same rahta hai.
*/
const USER_KEY = 'rustamSuperMartCustomerV1';
const CART_KEY = 'rustamSuperMartCartV1';
const pageSearchPlaceholder = document.body.dataset.searchPlaceholder || 'Search...';

/* ---------- Same header on every page ---------- */
const HEADER_HTML = `
<header class="site-header">
  <a class="brand" href="index.html#home" aria-label="Rustam Super Mart home">
    <span class="brand-mark">RS</span><span>Rustam Super Mart</span>
  </a>
  <label class="search-box"><span aria-hidden="true">⌕</span><input id="searchInput" type="search"
      placeholder="${pageSearchPlaceholder}" aria-label="Search"></label>
  <nav class="main-nav" id="mainNav">
    <a data-nav="home" href="index.html#home">Home</a><a data-nav="collections" href="index.html#collections">Collection</a><a
      data-nav="about" href="index.html#about">About</a><a data-nav="contact" href="#contact">Contact</a>
  </nav>
  <div class="header-actions"><button class="admin-btn" type="button" id="adminBtn" aria-pressed="false">✎ Edit Mode</button><button class="black-btn login-btn" type="button" id="loginBtn">Login</button><button
      class="cart-btn" type="button" id="cartBtn" aria-label="Shopping cart">🛒 <span id="cartCount">0</span></button></div>
  <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
</header>`;

/* ---------- Same footer on every page ---------- */
const FOOTER_HTML = `
<footer id="contact" class="site-footer">
  <div class="footer-main wrap">
    <div class="footer-brand"><span class="brand-mark">RS</span>
      <div><strong>Rustam Super Mart</strong>
        <p>Freshness <b>•</b> Quality <b>•</b> Convenience</p>
      </div>
    </div>
    <div class="footer-links"><strong>Quick Links</strong><a href="index.html#home">Home</a><a
        href="index.html#collections">Collection</a><a href="index.html#about">About</a><a href="#contact">Contact</a></div>
    <div class="footer-links"><strong>Customer Service</strong><a href="#contact" data-soon="FAQs">FAQs</a><a
        href="#contact" data-soon="Shipping info">Shipping</a><a href="#contact" data-soon="Returns info">Returns</a></div>
    <div class="footer-social"><strong>Follow Us</strong>
      <div class="social-icons">
        <a href="#contact" data-soon="Facebook page" aria-label="Facebook">f</a>
        <a href="#contact" data-soon="Instagram page" aria-label="Instagram">◎</a>
        <a href="#contact" data-soon="YouTube channel" aria-label="YouTube">▶</a>
      </div>
    </div>
  </div>
  <div class="copyright">© 2026 Rustam Super Mart. All Rights Reserved.</div>
</footer>`;

/* ---------- Login form + Add to Cart form + toast ---------- */
const MODALS_HTML = `
<div class="modal-backdrop" id="loginModal" hidden>
  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="modal-close" id="closeLogin" type="button" aria-label="Close login form">×</button>
    <span class="modal-kicker">WELCOME</span>
    <h2 id="loginTitle">Customer Login</h2>
    <p class="modal-intro">Enter your details to continue shopping.</p>
    <form id="loginForm" novalidate>
      <label for="loginName">Full name <span>*</span></label>
      <input id="loginName" type="text" placeholder="e.g. Ali Khan" maxlength="50" autocomplete="name" required>
      <label for="loginPhone">Phone number <span>*</span></label>
      <input id="loginPhone" type="tel" placeholder="e.g. 0300 1234567" maxlength="20" autocomplete="tel" required>
      <label for="loginPassword">Password <span>*</span></label>
      <input id="loginPassword" type="password" placeholder="At least 6 characters" minlength="6" autocomplete="current-password" required>
      <label for="loginLocation">Location <span>*</span></label>
      <input id="loginLocation" type="text" placeholder="City, area and full address" maxlength="120" autocomplete="street-address" required>
      <p class="form-error" id="loginError" role="alert" hidden></p>
      <div class="form-actions">
        <button class="cancel-btn" type="button" id="logoutBtn" hidden>Logout</button>
        <button class="cancel-btn" type="button" id="cancelLogin">Cancel</button>
        <button class="black-btn save-btn" type="submit">Login <span>→</span></button>
      </div>
    </form>
    <p class="storage-note">Your name, phone and location are saved in this browser only.</p>
  </section>
</div>

<div class="modal-backdrop" id="cartModal" hidden>
  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <button class="modal-close" id="closeCart" type="button" aria-label="Close order form">×</button>
    <span class="modal-kicker">ADD TO CART</span>
    <h2 id="cartTitle">Product</h2>
    <div class="cart-info">
      <div><small>Box unit price</small><strong id="ciBoxPrice">-</strong></div>
      <div><small>Pieces in 1 box</small><strong id="ciPieces">-</strong></div>
      <div><small>Carton price</small><strong id="ciCartonPrice">-</strong></div>
      <div><small>Boxes in 1 carton</small><strong id="ciPerCarton">-</strong></div>
    </div>
    <form id="cartForm" novalidate>
      <div class="field-row">
        <div>
          <label for="orderCartons">Cartons to order</label>
          <input id="orderCartons" type="number" min="0" step="1" value="0" inputmode="numeric">
        </div>
        <div>
          <label for="orderBoxes">Boxes to order</label>
          <input id="orderBoxes" type="number" min="0" step="1" value="1" inputmode="numeric">
        </div>
      </div>
      <div class="total-lines">
        <div><span>Boxes total</span><span id="orderBoxesTotal">Rs 0</span></div>
        <div><span>Cartons total</span><span id="orderCartonsTotal">Rs 0</span></div>
      </div>
      <div class="total-box"><span>Total price</span><strong id="orderTotal">Rs 0</strong></div>
      <p class="storage-note">Total = (box unit price × boxes) + (carton price × cartons)</p>
      <p class="form-error" id="cartError" role="alert" hidden></p>
      <div class="form-actions">
        <button class="cancel-btn" type="button" id="cancelCart">Cancel</button>
        <button class="black-btn save-btn" type="submit">Add to Cart <span>🛒</span></button>
      </div>
    </form>
  </section>
</div>

<div class="modal-backdrop" id="cartViewModal" hidden>
  <section class="modal cart-view" role="dialog" aria-modal="true" aria-labelledby="cartViewTitle">
    <button class="modal-close" id="closeCartView" type="button" aria-label="Close cart">×</button>
    <span class="modal-kicker">YOUR ORDERS</span>
    <h2 id="cartViewTitle">Shopping Cart</h2>
    <div class="cart-list" id="cartList"></div>
    <p class="empty-state" id="cartEmpty" hidden>Your cart is empty. Add some products first.</p>
    <div class="cart-footer" id="cartFooter">
      <div class="cart-grand"><small>Total of all orders</small><strong id="cartGrandTotal">Rs 0</strong></div>
      <button class="black-btn save-btn" type="button" id="buyNowBtn">Buy Now <span>→</span></button>
    </div>
  </section>
</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

function injectLayout(placeholderId, html) {
  const el = document.getElementById(placeholderId);
  if (el) el.outerHTML = html;
}
injectLayout('siteHeader', HEADER_HTML);
injectLayout('siteFooter', FOOTER_HTML);
injectLayout('siteModals', MODALS_HTML);

/* ---------- Helpers ---------- */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function money(value) {
  return 'Rs ' + Number(value).toLocaleString('en-US');
}
function readStorage(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data === null || data === undefined ? fallback : data;
  } catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

/* ---------- Edit Mode (owner only): add / edit / delete ---------- */
// NOTE: Yeh PIN sirf customers ko galti se edit buttons dekhne se rokta hai.
// Asli security ke liye server chahiye (abhi site ka koi server nahi hai).
const ADMIN_PIN = '1234'; // <-- apna PIN yahan badal lein
const ADMIN_KEY = 'rustamSuperMartAdminV1';
const adminBtn = document.getElementById('adminBtn');
function isAdmin() {
  try { return sessionStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; }
}
function applyAdminMode() {
  const on = isAdmin();
  document.body.classList.toggle('admin-on', on);
  adminBtn.textContent = on ? '✎ Exit Edit Mode' : '✎ Edit Mode';
  adminBtn.setAttribute('aria-pressed', String(on));
}
adminBtn.addEventListener('click', () => {
  if (isAdmin()) {
    try { sessionStorage.removeItem(ADMIN_KEY); } catch { /* ignore */ }
    applyAdminMode();
    showToast('Edit Mode is off.');
    return;
  }
  const pin = prompt('Enter the owner PIN to turn on Edit Mode:');
  if (pin === null) return;
  if (pin.trim() !== ADMIN_PIN) return showToast('Wrong PIN.');
  try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch { return showToast('Could not turn on Edit Mode in this browser.'); }
  applyAdminMode();
  showToast('Edit Mode is on. You can add, edit and delete now.');
});
applyAdminMode();

/* ---------- Image helpers (used by the add / edit forms) ---------- */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // original file limit (image is shrunk before saving)
const MAX_IMAGE_SIDE = 600;              // longest side of the saved image, in pixels
const IMAGE_QUALITY = 0.8;               // JPEG quality for the saved image
const IMAGE_HINT = 'PNG, JPG, WEBP · Max 5 MB (optional)';
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; // JPEG has no transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}
async function prepareImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a valid image file.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Please choose an image smaller than 5 MB.');
  try { return await compressImage(file); }
  catch { throw new Error('Could not read this image. Please try another file.'); }
}

/* ---------- Header: mobile menu ---------- */
const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Header: active nav link ---------- */
const navLinks = [...nav.querySelectorAll('a')];
const navSections = ['home', 'collections', 'about', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);
function updateActiveNav() {
  // Pages other than home (e.g. collection page) set data-active-nav on <body>
  let current = document.body.dataset.activeNav;
  if (!current) {
    current = 'home';
    navSections.forEach(section => {
      if (section.getBoundingClientRect().top <= 140) current = section.id;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = 'contact';
  }
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === current));
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);
updateActiveNav();

/* ---------- Footer links that are not ready yet ---------- */
document.querySelectorAll('[data-soon]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showToast(`${link.dataset.soon} will be added soon.`);
  });
});

/* ---------- Login form ---------- */
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginName = document.getElementById('loginName');
const loginPhone = document.getElementById('loginPhone');
const loginPassword = document.getElementById('loginPassword');
const loginLocation = document.getElementById('loginLocation');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

function getUser() { return readStorage(USER_KEY, null); }
function refreshLoginButton() {
  const user = getUser();
  loginBtn.textContent = user ? `Hi, ${String(user.name).split(' ')[0]}` : 'Login';
}
function openLogin() {
  const user = getUser();
  loginForm.reset();
  if (user) {
    loginName.value = user.name || '';
    loginPhone.value = user.phone || '';
    loginLocation.value = user.location || '';
  }
  logoutBtn.hidden = !user;
  loginError.hidden = true;
  loginModal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => loginName.focus(), 50);
}
function closeLogin() {
  if (loginModal.hidden) return;
  loginModal.hidden = true;
  document.body.style.overflow = '';
  loginForm.reset();
}
function setLoginError(message) {
  loginError.textContent = message;
  loginError.hidden = false;
}
loginBtn.addEventListener('click', openLogin);
document.getElementById('closeLogin').addEventListener('click', closeLogin);
document.getElementById('cancelLogin').addEventListener('click', closeLogin);
loginModal.addEventListener('click', event => { if (event.target === loginModal) closeLogin(); });
logoutBtn.addEventListener('click', () => {
  try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
  closeLogin();
  refreshLoginButton();
  showToast('You are logged out.');
});
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  loginError.hidden = true;
  const name = loginName.value.trim();
  const phone = loginPhone.value.trim();
  const password = loginPassword.value;
  const location = loginLocation.value.trim();
  const phoneDigits = phone.replace(/\D/g, '');
  if (!name || !phone || !password || !location) return setLoginError('Please fill in all fields.');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) return setLoginError('Please enter a valid phone number.');
  if (password.length < 6) return setLoginError('Password must be at least 6 characters.');
  if (location.length < 3) return setLoginError('Please enter your location.');
  // The password is only checked here and is NOT saved (there is no server yet).
  if (!writeStorage(USER_KEY, { name, phone, location })) return setLoginError('Could not save your details in this browser.');
  closeLogin();
  refreshLoginButton();
  showToast(`Welcome, ${name.split(' ')[0]}!`);
});
refreshLoginButton();

/* ---------- Cart ---------- */
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartForm = document.getElementById('cartForm');
const cartTitle = document.getElementById('cartTitle');
const orderCartons = document.getElementById('orderCartons');
const orderBoxes = document.getElementById('orderBoxes');
const orderTotal = document.getElementById('orderTotal');
const cartError = document.getElementById('cartError');
let currentProduct = null;

function getCart() {
  const items = readStorage(CART_KEY, []);
  return Array.isArray(items) ? items : [];
}
function refreshCartCount() {
  cartCount.textContent = String(getCart().length);
}
function wholeNumber(input) {
  const value = Math.floor(Number(input.value));
  return Number.isFinite(value) && value > 0 ? Math.min(value, 100000) : 0;
}
function updateOrderTotal() {
  // Total = (box unit price x boxes) + (carton price x cartons)
  const boxes = wholeNumber(orderBoxes);
  const cartons = wholeNumber(orderCartons);
  const boxesTotal = currentProduct ? currentProduct.price * boxes : 0;
  const cartonsTotal = currentProduct ? currentProduct.cartonPrice * cartons : 0;
  document.getElementById('orderBoxesTotal').textContent = money(boxesTotal);
  document.getElementById('orderCartonsTotal').textContent = money(cartonsTotal);
  orderTotal.textContent = money(boxesTotal + cartonsTotal);
}
function openCart(product) {
  if (!product) return;
  currentProduct = product;
  cartTitle.textContent = product.name;
  document.getElementById('ciBoxPrice').textContent = money(product.price);
  document.getElementById('ciPieces').textContent = `${product.pieces} pieces`;
  document.getElementById('ciCartonPrice').textContent = money(product.cartonPrice);
  document.getElementById('ciPerCarton').textContent = `${product.boxesPerCarton} boxes`;
  orderCartons.value = 0;
  orderBoxes.value = 1;
  cartError.hidden = true;
  updateOrderTotal();
  cartModal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => orderBoxes.focus(), 50);
}
function closeCart() {
  if (cartModal.hidden) return;
  cartModal.hidden = true;
  document.body.style.overflow = '';
  currentProduct = null;
}
orderBoxes.addEventListener('input', updateOrderTotal);
orderCartons.addEventListener('input', updateOrderTotal);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cancelCart').addEventListener('click', closeCart);
cartModal.addEventListener('click', event => { if (event.target === cartModal) closeCart(); });
cartForm.addEventListener('submit', event => {
  event.preventDefault();
  cartError.hidden = true;
  const cartons = wholeNumber(orderCartons);
  const boxes = wholeNumber(orderBoxes);
  if (cartons === 0 && boxes === 0) {
    cartError.textContent = 'Please enter how many cartons or boxes you want to order.';
    cartError.hidden = false;
    return;
  }
  const items = getCart();
  items.push({
    id: currentProduct.id,
    name: currentProduct.name,
    cartons,
    boxes,
    boxPrice: currentProduct.price,
    cartonPrice: currentProduct.cartonPrice
  });
  if (!writeStorage(CART_KEY, items)) {
    cartError.textContent = 'Could not save your cart in this browser.';
    cartError.hidden = false;
    return;
  }
  const name = currentProduct.name;
  closeCart();
  refreshCartCount();
  showToast(`${name} added to cart.`);
});
refreshCartCount();

/* ---------- Cart view: all orders + grand total + Buy Now ---------- */
const ORDERS_KEY = 'rustamSuperMartOrdersV1';
const cartViewModal = document.getElementById('cartViewModal');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartGrandTotal = document.getElementById('cartGrandTotal');

// Total of one order = (box price x boxes) + (carton price x cartons)
function itemTotals(item) {
  const boxesTotal = (Number(item.boxPrice) || 0) * (Number(item.boxes) || 0);
  const cartonsTotal = (Number(item.cartonPrice) || 0) * (Number(item.cartons) || 0);
  return { boxesTotal, cartonsTotal, total: boxesTotal + cartonsTotal };
}
function cartGrand(items) {
  return items.reduce((sum, item) => sum + itemTotals(item).total, 0);
}
function makeCartRow(item, index) {
  const { boxesTotal, cartonsTotal, total } = itemTotals(item);
  const row = document.createElement('div');
  row.className = 'cart-row';

  const info = document.createElement('div');
  info.className = 'cart-row-info';
  const title = document.createElement('strong');
  title.textContent = item.name;
  info.appendChild(title);
  if (item.cartons > 0) {
    const line = document.createElement('small');
    line.textContent = `${item.cartons} carton(s) × ${money(item.cartonPrice || 0)} = ${money(cartonsTotal)}`;
    info.appendChild(line);
  }
  if (item.boxes > 0) {
    const line = document.createElement('small');
    line.textContent = `${item.boxes} box(es) × ${money(item.boxPrice || 0)} = ${money(boxesTotal)}`;
    info.appendChild(line);
  }

  const price = document.createElement('span');
  price.className = 'cart-row-total';
  price.textContent = money(total);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'cart-remove';
  remove.dataset.index = String(index);
  remove.setAttribute('aria-label', `Remove ${item.name} from cart`);
  remove.title = 'Remove';
  remove.textContent = '×';

  row.append(info, price, remove);
  return row;
}
function renderCartView() {
  const items = getCart();
  cartList.replaceChildren(...items.map(makeCartRow));
  cartEmpty.hidden = items.length > 0;
  cartFooter.hidden = items.length === 0;
  cartGrandTotal.textContent = money(cartGrand(items));
}
function openCartView() {
  renderCartView();
  cartViewModal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeCartView() {
  if (cartViewModal.hidden) return;
  cartViewModal.hidden = true;
  document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCartView);
document.getElementById('closeCartView').addEventListener('click', closeCartView);
cartViewModal.addEventListener('click', event => { if (event.target === cartViewModal) closeCartView(); });
cartList.addEventListener('click', event => {
  const remove = event.target.closest('.cart-remove');
  if (!remove) return;
  const items = getCart();
  items.splice(Number(remove.dataset.index), 1);
  writeStorage(CART_KEY, items);
  refreshCartCount();
  renderCartView();
});
document.getElementById('buyNowBtn').addEventListener('click', () => {
  const items = getCart();
  if (!items.length) return;
  const user = getUser();
  if (!user) {
    // We need the customer's name, phone and location to deliver the order
    closeCartView();
    openLogin();
    setLoginError('Please login first, then open your cart and press Buy Now.');
    return;
  }
  const total = cartGrand(items);
  const orders = readStorage(ORDERS_KEY, []);
  orders.push({ date: new Date().toISOString(), customer: user, items, total });
  if (!writeStorage(ORDERS_KEY, orders)) return showToast('Could not place the order. Please try again.');
  writeStorage(CART_KEY, []);
  refreshCartCount();
  closeCartView();
  showToast(`Order placed! Total ${money(total)}. Thank you, ${String(user.name).split(' ')[0]}.`);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeLogin(); closeCart(); closeCartView(); }
});
