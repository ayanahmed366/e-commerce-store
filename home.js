/*
  home.js - sirf Home page (index.html) ka code:
  collection cards, search, aur Add / Edit / Delete collection (Edit Mode mein).
  Shared cheezein (toast, login, cart, nav, image helpers) script.js mein hain.
  Data products.js ke store se aata hai.
*/
const grid = document.getElementById('collectionGrid');
const modal = document.getElementById('collectionModal');
const form = document.getElementById('collectionForm');
const nameInput = document.getElementById('collectionName');
const imageInput = document.getElementById('collectionImage');
const descriptionInput = document.getElementById('collectionDescription');
const preview = document.getElementById('imagePreview');
const uploadTitle = document.getElementById('uploadTitle');
const uploadHint = document.getElementById('uploadHint');
const formError = document.getElementById('formError');
const searchInput = document.getElementById('searchInput');
const countText = document.getElementById('collectionCount');
const emptyState = document.getElementById('emptyState');
const modalKicker = document.getElementById('modalKicker');
const modalTitle = document.getElementById('modalTitle');
const saveCollectionBtn = document.getElementById('saveCollectionBtn');
let selectedImageData = '';
let editingId = null;

function setError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

/* ---------- Count text (updates with search) ---------- */
function updateCount() {
  const cards = grid.querySelectorAll('.collection-card');
  const total = cards.length;
  const visible = [...cards].filter(card => !card.hidden).length;
  const query = searchInput.value.trim();
  countText.textContent = total === 0
    ? ''
    : query
      ? `${visible} of ${total} collections found`
      : `${total} collections to explore`;
}

/* ---------- Build a card for a collection ---------- */
function makeCollectionCard(item) {
  const card = document.createElement('article');
  card.className = 'collection-card';
  card.dataset.name = `${item.title} ${item.description}`.toLowerCase();
  card.dataset.id = item.id;

  const art = document.createElement('div');
  art.className = `product-art ${item.art || ''}`.trim();
  art.appendChild(makeArtImage(item.image, item.title));

  const content = document.createElement('div');
  content.className = 'card-content';
  const title = document.createElement('h3');
  title.textContent = item.title;
  const desc = document.createElement('p');
  desc.textContent = item.description;
  const button = document.createElement('a');
  button.className = 'black-btn collection-btn';
  button.href = `collection.html?c=${encodeURIComponent(item.id)}`;
  button.innerHTML = 'View Collection <span>→</span>';
  content.append(title, desc, button);

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit-btn admin-only';
  edit.setAttribute('aria-label', `Edit ${item.title} collection`);
  edit.title = 'Edit collection';
  edit.textContent = '✎';

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'delete-btn admin-only';
  del.setAttribute('aria-label', `Delete ${item.title} collection`);
  del.title = 'Delete collection';
  del.textContent = '×';

  card.append(art, content, edit, del);
  return card;
}

function renderCollections() {
  grid.replaceChildren(...loadStore().map(makeCollectionCard));
  applySearch();
}

/* ---------- Modal (Add / Edit Collection form) ---------- */
function showPreview(data) {
  if (data) {
    preview.src = data;
    preview.hidden = false;
  } else {
    preview.src = '';
    preview.hidden = true;
  }
}

function openModal(item) {
  editingId = item ? item.id : null;
  form.reset();
  nameInput.value = item ? item.title : '';
  descriptionInput.value = item ? item.description : '';
  selectedImageData = item && item.image ? item.image : '';
  showPreview(selectedImageData);
  uploadTitle.textContent = selectedImageData ? 'Current picture' : 'Choose an image';
  uploadHint.textContent = selectedImageData ? 'Choose a new image to replace it' : IMAGE_HINT;
  modalKicker.textContent = item ? 'UPDATE YOUR STORE' : 'GROW YOUR STORE';
  modalTitle.textContent = item ? 'Edit Collection' : 'Add New Collection';
  saveCollectionBtn.firstChild.textContent = item ? 'Save Changes ' : 'Save Collection ';
  formError.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => nameInput.focus(), 50);
}
function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  form.reset();
  editingId = null;
  selectedImageData = '';
  showPreview('');
  formError.hidden = true;
}

document.getElementById('addCollectionBtn').addEventListener('click', () => openModal(null));
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

/* ---------- Image pick (picture is optional) ---------- */
imageInput.addEventListener('change', async () => {
  formError.hidden = true;
  const file = imageInput.files && imageInput.files[0];
  if (!file) return; // purani picture waisi hi rehti hai
  uploadTitle.textContent = file.name;
  uploadHint.textContent = 'Preparing image...';
  try {
    const data = await prepareImage(file);
    if (imageInput.files[0] !== file) return; // user ne dusri file chun li
    selectedImageData = data;
    showPreview(data);
    uploadHint.textContent = 'Image ready';
  } catch (error) {
    imageInput.value = '';
    uploadTitle.textContent = selectedImageData ? 'Current picture' : 'Choose an image';
    uploadHint.textContent = selectedImageData ? 'Choose a new image to replace it' : IMAGE_HINT;
    setError(error.message);
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  formError.hidden = true;
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!name || !description) return setError('Please fill in the name and description.');

  const wasEditing = Boolean(editingId);
  const ok = editStore(list => {
    if (wasEditing) {
      const item = list.find(entry => entry.id === editingId);
      if (!item) return;
      item.title = name;
      item.description = description;
      item.image = selectedImageData;
    } else {
      list.push({
        id: makeId(name), title: name, description, art: '',
        image: selectedImageData, products: []
      });
    }
  });
  if (!ok) return setError('Your browser storage is full. Try a smaller image or delete something.');

  closeModal();
  renderCollections();
  showToast(wasEditing ? `“${name}” collection updated.` : `“${name}” collection added successfully!`);
});

/* ---------- Search ---------- */
function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = grid.querySelectorAll('.collection-card');
  let visible = 0;
  cards.forEach(card => {
    const matches = card.dataset.name.includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  emptyState.textContent = cards.length === 0
    ? 'No collections yet. Turn on Edit Mode and press “Add Collection”.'
    : 'No collections match your search.';
  emptyState.hidden = visible !== 0;
  updateCount();
}
searchInput.addEventListener('input', applySearch);

/* ---------- Edit / Delete buttons on cards ---------- */
grid.addEventListener('click', event => {
  const card = event.target.closest('.collection-card');
  if (!card) return;
  const id = card.dataset.id;

  if (event.target.closest('.edit-btn')) {
    const item = findCollection(id);
    if (item) openModal(item);
    return;
  }

  if (event.target.closest('.delete-btn')) {
    const item = findCollection(id);
    if (!item) return;
    const count = (item.products || []).length;
    const extra = count ? ` Its ${count} product(s) will be deleted too.` : '';
    if (!confirm(`Delete "${item.title}" collection?${extra}`)) return;
    if (!editStore(list => { const i = list.findIndex(entry => entry.id === id); if (i !== -1) list.splice(i, 1); })) {
      return showToast('Could not delete. Please try again.');
    }
    renderCollections();
    showToast(`“${item.title}” collection deleted.`);
  }
});

renderCollections();
