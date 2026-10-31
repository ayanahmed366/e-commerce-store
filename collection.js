/*
  collection.js - Collection page (collection.html) ka code.
  URL se pata chalta hai kaun si collection kholni hai, jaise collection.html?c=rice
  Products products.js ke store se aate hain. Edit Mode mein products add / edit / delete ho sakte hain.
*/
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');
const productEmpty = document.getElementById('emptyState');
const collectionTitle = document.getElementById('collectionTitle');
const productSearch = document.getElementById('searchInput');
const addProductBtn = document.getElementById('addProductBtn');

const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const productKicker = document.getElementById('productKicker');
const productModalTitle = document.getElementById('productModalTitle');
const saveProductBtn = document.getElementById('saveProductBtn');
const productNameInput = document.getElementById('productName');
const productImageInput = document.getElementById('productImage');
const productPreview = document.getElementById('productPreview');
const productUploadTitle = document.getElementById('productUploadTitle');
const productUploadHint = document.getElementById('productUploadHint');
const productEmojiInput = document.getElementById('productEmoji');
const productPriceInput = document.getElementById('productPrice');
const productPiecesInput = document.getElementById('productPieces');
const productCartonPriceInput = document.getElementById('productCartonPrice');
const productPerCartonInput = document.getElementById('productPerCarton');
const productError = document.getElementById('productError');

const slug = new URLSearchParams(window.location.search).get('c');
let editingProductId = null;
let productImageData = '';

function currentCollection() {
  return slug ? findCollection(slug) : null;
}

function makeProductCard(product, artClass) {
  const card = document.createElement('article');
  card.className = 'collection-card product-card';
  card.dataset.name = product.name.toLowerCase();
  card.dataset.id = product.id;

  const art = document.createElement('div');
  art.className = `product-art ${artClass || ''}`.trim();
  if (product.image) {
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    image.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:8px;';
    art.appendChild(image);
  } else {
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', product.name);
    art.textContent = product.emoji || '🛒';
  }

  const content = document.createElement('div');
  content.className = 'card-content';
  const title = document.createElement('h3');
  title.textContent = product.name;
  const price = document.createElement('p');
  price.className = 'price-tag';
  price.innerHTML = `${money(product.price)} <small>per box</small>`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'black-btn collection-btn add-cart-btn';
  button.dataset.productId = product.id;
  button.innerHTML = 'Add to Cart <span>🛒</span>';
  content.append(title, price, button);

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit-btn admin-only';
  edit.setAttribute('aria-label', `Edit ${product.name}`);
  edit.title = 'Edit product';
  edit.textContent = '✎';

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'delete-btn admin-only';
  del.setAttribute('aria-label', `Delete ${product.name}`);
  del.title = 'Delete product';
  del.textContent = '×';

  card.append(art, content, edit, del);
  return card;
}

function applyProductSearch() {
  const query = productSearch.value.trim().toLowerCase();
  const cards = productGrid.querySelectorAll('.product-card');
  let visible = 0;
  cards.forEach(card => {
    const matches = card.dataset.name.includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  const total = cards.length;
  productEmpty.textContent = total === 0
    ? 'No products have been added to this collection yet.'
    : 'No products match your search.';
  productEmpty.hidden = visible !== 0;
  productCount.textContent = total === 0
    ? 'No products yet'
    : query
      ? `${visible} of ${total} products found`
      : `${total} products available`;
}

function renderPage() {
  const collection = currentCollection();
  if (!collection) {
    collectionTitle.textContent = 'Collection not found';
    document.title = 'Collection | Rustam Super Mart';
    productGrid.replaceChildren();
    productCount.textContent = '';
    productEmpty.textContent = 'This collection does not exist. Please go back and choose a category.';
    productEmpty.hidden = false;
    addProductBtn.remove();
    return;
  }
  collectionTitle.textContent = collection.title;
  document.title = `${collection.title} | Rustam Super Mart`;
  productGrid.replaceChildren(...(collection.products || []).map(product => makeProductCard(product, collection.art)));
  applyProductSearch();
}

/* ---------- Add / Edit product form ---------- */
function setProductError(message) {
  productError.textContent = message;
  productError.hidden = false;
}
function showProductPreview(data) {
  productPreview.src = data || '';
  productPreview.hidden = !data;
}
function openProductModal(product) {
  editingProductId = product ? product.id : null;
  productForm.reset();
  productNameInput.value = product ? product.name : '';
  productEmojiInput.value = product ? (product.emoji || '') : '';
  productPriceInput.value = product ? product.price : '';
  productPiecesInput.value = product ? product.pieces : '';
  productCartonPriceInput.value = product ? product.cartonPrice : '';
  productPerCartonInput.value = product ? product.boxesPerCarton : '';
  productImageData = product && product.image ? product.image : '';
  showProductPreview(productImageData);
  productUploadTitle.textContent = productImageData ? 'Current picture' : 'Choose an image';
  productUploadHint.textContent = productImageData ? 'Choose a new image to replace it' : IMAGE_HINT;
  productKicker.textContent = product ? 'UPDATE PRODUCT' : 'NEW PRODUCT';
  productModalTitle.textContent = product ? 'Edit Product' : 'Add Product';
  saveProductBtn.firstChild.textContent = product ? 'Save Changes ' : 'Save Product ';
  productError.hidden = true;
  productModal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => productNameInput.focus(), 50);
}
function closeProductModal() {
  if (productModal.hidden) return;
  productModal.hidden = true;
  document.body.style.overflow = '';
  productForm.reset();
  editingProductId = null;
  productImageData = '';
  showProductPreview('');
  productError.hidden = true;
}

addProductBtn.addEventListener('click', () => openProductModal(null));
document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
document.getElementById('cancelProductModal').addEventListener('click', closeProductModal);
productModal.addEventListener('click', event => { if (event.target === productModal) closeProductModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeProductModal(); });

productImageInput.addEventListener('change', async () => {
  productError.hidden = true;
  const file = productImageInput.files && productImageInput.files[0];
  if (!file) return;
  productUploadTitle.textContent = file.name;
  productUploadHint.textContent = 'Preparing image...';
  try {
    const data = await prepareImage(file);
    if (productImageInput.files[0] !== file) return;
    productImageData = data;
    showProductPreview(data);
    productUploadHint.textContent = 'Image ready';
  } catch (error) {
    productImageInput.value = '';
    productUploadTitle.textContent = productImageData ? 'Current picture' : 'Choose an image';
    productUploadHint.textContent = productImageData ? 'Choose a new image to replace it' : IMAGE_HINT;
    setProductError(error.message);
  }
});

productForm.addEventListener('submit', event => {
  event.preventDefault();
  productError.hidden = true;
  const name = productNameInput.value.trim();
  const price = Number(productPriceInput.value);
  const cartonPrice = Number(productCartonPriceInput.value);
  const pieces = Number(productPiecesInput.value);
  const boxesPerCarton = Number(productPerCartonInput.value);

  if (!name) return setProductError('Please enter the product name.');
  if (!(price > 0)) return setProductError('Please enter a valid box price.');
  if (!Number.isInteger(pieces) || pieces < 1) return setProductError('Pieces in 1 box must be a whole number (1 or more).');
  if (!(cartonPrice > 0)) return setProductError('Please enter a valid carton price.');
  if (!Number.isInteger(boxesPerCarton) || boxesPerCarton < 1) return setProductError('Boxes in 1 carton must be a whole number (1 or more).');

  const data = {
    name,
    emoji: productEmojiInput.value.trim() || '🛒',
    image: productImageData,
    price, pieces, boxesPerCarton, cartonPrice
  };
  const wasEditing = Boolean(editingProductId);
  const ok = editStore(list => {
    const collection = list.find(entry => entry.id === slug);
    if (!collection) return;
    if (!Array.isArray(collection.products)) collection.products = [];
    if (wasEditing) {
      const product = collection.products.find(item => item.id === editingProductId);
      if (product) Object.assign(product, data);
    } else {
      collection.products.push({ id: makeId('prd'), ...data });
    }
  });
  if (!ok) return setProductError('Your browser storage is full. Try a smaller image or delete something.');

  closeProductModal();
  renderPage();
  showToast(wasEditing ? `“${name}” updated.` : `“${name}” added to this collection.`);
});

/* ---------- Search + card buttons ---------- */
productSearch.addEventListener('input', applyProductSearch);

productGrid.addEventListener('click', event => {
  const card = event.target.closest('.product-card');
  if (!card) return;
  const id = card.dataset.id;

  const cartButton = event.target.closest('.add-cart-btn');
  if (cartButton) {
    openCart(findProduct(cartButton.dataset.productId));
    return;
  }

  if (event.target.closest('.edit-btn')) {
    const product = findProduct(id);
    if (product) openProductModal(product);
    return;
  }

  if (event.target.closest('.delete-btn')) {
    const product = findProduct(id);
    if (!product) return;
    if (!confirm(`Delete "${product.name}"?`)) return;
    const ok = editStore(list => {
      const collection = list.find(entry => entry.id === slug);
      if (!collection) return;
      collection.products = collection.products.filter(item => item.id !== id);
    });
    if (!ok) return showToast('Could not delete. Please try again.');
    renderPage();
    showToast(`“${product.name}” deleted.`);
  }
});

renderPage();
