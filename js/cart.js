// Task 5: live cart and wishlist for the Leo template.
//
// How it works:
// 1. readProducts() reads each product card on the page (name, price, image)
//    and gives it an id, so there is no separate product list to keep in sync.
// 2. The cart and wishlist are plain arrays, saved to localStorage
//    so they survive a page refresh.
// 3. After every change, render() redraws the cart panel, the wishlist panel,
//    the hearts and the badge counters from those arrays.

const STORAGE_KEY = "leo-cart";

const products = {};   // "product-3" -> { id, name, price, image }
let cart = [];         // [{ id: "product-3", qty: 2 }]
let wishlist = [];     // ["product-1", "product-7"]

// ---------- 1. Read the products from the page ----------

function readProducts() {
  document.querySelectorAll(".product-item").forEach((card, index) => {
    const id = "product-" + (index + 1);
    card.dataset.id = id;

    const name = card.querySelector(".product-content h5 a").textContent.trim();
    const priceText = card.querySelector("[data-after='Add to cart'] span").textContent; // "$295.00"
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));                       // 295
    const image = card.querySelector(".product-image").getAttribute("src");

    products[id] = { id, name, price, image };
  });
}

// ---------- 2. Save and load (localStorage) ----------

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      // Keep only items that still exist on the page
      cart = (saved.cart || []).filter((item) => products[item.id]);
      wishlist = (saved.wishlist || []).filter((id) => products[id]);
    }
  } catch (error) {
    // Nothing saved yet, or storage blocked: start empty
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist }));
  } catch (error) {
    // Storage blocked: everything still works until the page is refreshed
  }
}

// ---------- Cart actions ----------

function addToCart(id) {
  const item = cart.find((line) => line.id === id);
  if (item) {
    item.qty += 1;               // already in the cart: one more
  } else {
    cart.push({ id, qty: 1 });   // new product: add a line
  }
  saveData();
}

function changeQty(id, change) {
  const item = cart.find((line) => line.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveData();
}

function removeFromCart(id) {
  cart = cart.filter((line) => line.id !== id);
  saveData();
}

function cartCount() {
  return cart.reduce((total, line) => total + line.qty, 0);
}

function cartTotal() {
  return cart.reduce((total, line) => total + products[line.id].price * line.qty, 0);
}

// ---------- Wishlist actions ----------

// Add if missing, remove if already there. Returns true if it is now in the wishlist.
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((wishedId) => wishedId !== id);
  } else {
    wishlist.push(id);
  }
  saveData();
  return wishlist.includes(id);
}

// ---------- 3. Draw everything ----------

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

function renderCart() {
  const list = document.getElementById("cart-items");

  if (cart.length === 0) {
    list.innerHTML = `<li class="list-group-item text-muted">Your cart is empty.</li>`;
    document.getElementById("checkout-btn").disabled = true;
    return;
  }

  const lines = cart.map((line) => {
    const product = products[line.id];
    return `
      <li class="list-group-item d-flex align-items-center gap-3 lh-sm" data-id="${line.id}">
        <img src="${product.image}" alt="" class="cart-thumb">
        <div class="flex-grow-1">
          <h6 class="my-0">${product.name}</h6>
          <small class="text-body-secondary">${formatPrice(product.price)} each</small>
          <div class="qty-control mt-2">
            <button type="button" data-action="minus" aria-label="One less ${product.name}">−</button>
            <span>${line.qty}</span>
            <button type="button" data-action="plus" aria-label="One more ${product.name}">+</button>
          </div>
        </div>
        <div class="text-end">
          <span class="d-block fw-semibold">${formatPrice(product.price * line.qty)}</span>
          <button type="button" class="btn btn-link btn-sm p-0 text-body-secondary" data-action="remove">Remove</button>
        </div>
      </li>`;
  }).join("");

  const totalLine = `
    <li class="list-group-item d-flex justify-content-between">
      <span>Total (USD)</span>
      <strong>${formatPrice(cartTotal())}</strong>
    </li>`;

  list.innerHTML = lines + totalLine;
  document.getElementById("checkout-btn").disabled = false;
}

function renderWishlist() {
  const list = document.getElementById("wish-items");

  if (wishlist.length === 0) {
    list.innerHTML = `<li class="list-group-item text-muted">No saved items yet. Tap the heart on any product.</li>`;
    return;
  }

  list.innerHTML = wishlist.map((id) => {
    const product = products[id];
    return `
      <li class="list-group-item d-flex align-items-center gap-3 lh-sm" data-id="${id}">
        <img src="${product.image}" alt="" class="cart-thumb">
        <div class="flex-grow-1">
          <h6 class="my-0">${product.name}</h6>
          <small class="text-body-secondary">${formatPrice(product.price)}</small>
          <div class="mt-2">
            <button type="button" class="btn btn-primary btn-sm" data-action="move">Move to cart</button>
          </div>
        </div>
        <button type="button" class="btn btn-link btn-sm p-0 text-body-secondary" data-action="unwish">Remove</button>
      </li>`;
  }).join("");
}

// Highlight the heart on every product card that is in the wishlist
function renderHearts() {
  document.querySelectorAll(".product-item").forEach((card) => {
    const heart = card.querySelector(".btn-wishlist");
    const active = wishlist.includes(card.dataset.id);
    heart.classList.toggle("is-active", active);
    heart.setAttribute("aria-pressed", active);
    heart.setAttribute("aria-label", (active ? "Remove from" : "Add to") + " wishlist");
  });
}

function renderBadges() {
  setBadge(document.getElementById("cart-count"), cartCount());
  setBadge(document.getElementById("wish-count"), wishlist.length);
  document.getElementById("cart-panel-count").textContent = cartCount();
  document.getElementById("wish-panel-count").textContent = wishlist.length;
}

function setBadge(badge, number) {
  badge.textContent = number;
  badge.hidden = number === 0;
  badge.classList.remove("bump");
  void badge.offsetWidth; // restart the animation
  badge.classList.add("bump");
}

function render() {
  renderCart();
  renderWishlist();
  renderHearts();
  renderBadges();
}

// ---------- Small pop-up message ----------

let toastTimer;
function showToast(message) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------- Clicks ----------
// One listener on the whole page ("event delegation"). It checks what was clicked,
// so it keeps working for buttons that are redrawn later.

document.addEventListener("click", (event) => {
  // "Add to cart" on a product card (the price link)
  const addLink = event.target.closest(".product-item [data-after='Add to cart']");
  if (addLink) {
    event.preventDefault(); // stop the link from opening cart.html
    const id = addLink.closest(".product-item").dataset.id;
    addToCart(id);
    render();
    showToast(products[id].name + " added to cart");
    return;
  }

  // Heart on a product card
  const heart = event.target.closest(".product-item .btn-wishlist");
  if (heart) {
    event.preventDefault(); // stop the link from opening wishlist.html
    const id = heart.closest(".product-item").dataset.id;
    const added = toggleWishlist(id);
    render();
    showToast(products[id].name + (added ? " saved to wishlist" : " removed from wishlist"));
    return;
  }

  // Buttons inside the cart and wishlist panels
  const button = event.target.closest("#cart-items [data-action], #wish-items [data-action]");
  if (button) {
    const id = button.closest("[data-id]").dataset.id;
    const action = button.dataset.action;

    if (action === "plus") changeQty(id, 1);
    if (action === "minus") changeQty(id, -1);
    if (action === "remove") removeFromCart(id);
    if (action === "unwish") toggleWishlist(id);
    if (action === "move") {
      addToCart(id);
      toggleWishlist(id);
      showToast(products[id].name + " moved to cart");
    }
    render();
    // The clicked button was redrawn, so keep keyboard focus inside the open panel
    // (otherwise Escape stops closing it)
    const panel = document.querySelector(".offcanvas.show");
    if (panel && !panel.contains(document.activeElement)) panel.focus();
    return;
  }

  // Checkout is not part of this task
  if (event.target.closest("#checkout-btn")) {
    showToast("Checkout is not connected in this demo");
  }
});

// ---------- Start ----------
readProducts();
loadData();
render();
