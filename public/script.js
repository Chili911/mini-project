//1) loading books and displaying them
function loadBooks() {
    fetch("/books")
      .then(res => res.json())
      .then(books => {
        const container = document.getElementById("bookGrid");
        container.innerHTML = "";
  
        books.forEach(book => {
          const { title, author, cover, price } = book;
          const card = document.createElement("div");
          card.className = "col";
  
          card.innerHTML = `
            <div class="card h-100 shadow-sm" style="max-width: 180px; margin: auto;">
              <img src="${cover}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${title}">
              <div class="card-body p-2 text-center">
                <h6 class="card-title mb-1">${title}</h6>
                <small class="text-muted">${author}</small><br>
                <strong class="text-success">${price}</strong>
                <div class="mt-2 d-grid gap-2">
                  <button class="btn btn-sm btn-outline-success"
                          onclick="handleBuy('${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${cover}', '${price}')">
                    Buy
                  </button>
                  <button class="btn btn-sm btn-outline-primary"
                          onclick="handleBorrow('${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${cover}')">
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          `;
  
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Error fetching books:", err));
  }
  
  // ── 2) Show a temporary confirmation bar ──
  function showConfirm(message) {
    const bar = document.getElementById("actionConfirmBar");
    const msg = document.getElementById("confirmMessage");
    msg.innerHTML = message;
    bar.classList.remove("d-none");
    setTimeout(() => bar.classList.add("d-none"), 5000);
  }


// ── 3) Cart Action Handlers ──
function handleBuy(title, author, coverUrl, price) {
  const cart = JSON.parse(localStorage.getItem("buyCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover: coverUrl, price });
    localStorage.setItem("buyCart", JSON.stringify(cart));
  }

  updateCartCounts();
  showConfirm(`${title} added to your <strong>Buy</strong> cart.`);
}

function handleBorrow(title, author, coverUrl) {
  const cart = JSON.parse(localStorage.getItem("borrowCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover: coverUrl });
    localStorage.setItem("borrowCart", JSON.stringify(cart));
  }

  updateCartCounts();
  showConfirm(`${title} added to your <strong>Borrow</strong> list.`);
}

// ── 3.1) Updating Cart Counts ──
function updateCartCounts() {
  const borrowCart = JSON.parse(localStorage.getItem("borrowCart")) || [];
  const buyCart = JSON.parse(localStorage.getItem("buyCart")) || [];

  document.getElementById("borrowCount").textContent = borrowCart.length;
  document.getElementById("buyCount").textContent = buyCart.length;

  document.getElementById("borrowCartIcon").setAttribute("data-count", borrowCart.length);
  document.getElementById("buyCartIcon").setAttribute("data-count", buyCart.length);

  updateCheckoutButton(buyCart, borrowCart); // ✅ pass both carts
}


// ── 3.2) Resetting Cart to Default ──
function resetCartToDefault() {
  // Clear the cart data in localStorage
  localStorage.setItem("borrowCart", JSON.stringify([]));
  localStorage.setItem("buyCart", JSON.stringify([]));

  // Update the cart counts to 0
  document.getElementById("borrowCount").textContent = 0;
  document.getElementById("buyCount").textContent = 0;

  // Optionally, disable checkout button if carts are empty
  updateCheckoutButton([]);

  // Render the empty borrow and buy lists
  renderBorrowList([]);
  renderBuyList([]);
}

// Render the empty lists
function renderBorrowList(cart) {
  const borrowListContainer = document.getElementById("borrowList");
  borrowListContainer.innerHTML = ""; // Clear the list
  cart.forEach(item => {
    // Render the items in the borrow list (example)
    const listItem = document.createElement("li");
    listItem.textContent = item.name;
    borrowListContainer.appendChild(listItem);
  });
}

function renderBuyList(cart) {
  const buyListContainer = document.getElementById("buyList");
  buyListContainer.innerHTML = ""; // Clear the list
  cart.forEach(item => {
    // Render the items in the buy list (example)
    const listItem = document.createElement("li");
    listItem.textContent = item.name;
    buyListContainer.appendChild(listItem);
  });
}


// Run this on page load to update the cart icon counts
window.addEventListener("load", function() {
// Reset carts on page load
localStorage.setItem("buyCart", JSON.stringify([]));
localStorage.setItem("borrowCart", JSON.stringify([]));

// Then update the icon/cart count display
updateCartCounts(); // Updates the counts for buy and borrow cart icons
});


//4) cookies ...
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  // Remove the conditional logic temporarily for testing
  banner.classList.remove("d-none");

  const consent = getCookie("cookiesAccepted");
  console.log("Cookie consent status:", consent);

  acceptBtn.addEventListener("click", () => {
    setCookie("cookiesAccepted", "yes", 365);
    banner.classList.add("d-none");
    loadGoogleAnalytics();
  });

  rejectBtn.addEventListener("click", () => {
    setCookie("cookiesAccepted", "no", 365);
    banner.classList.add("d-none");
  });

  if (consent === "yes") {
    loadGoogleAnalytics();
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(nameEQ))
      ?.substring(nameEQ.length) || "";
  }

  function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-HS9CC88JVC"; // Replace with your ID
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-HS9CC88JVC'); // Replace with your GA ID
  }
});

//4. save user email to json file 
const emailForm = document.getElementById("email-form");
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("name");

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !name) {
    return alert('Please enter both name and email.');
  }

  try {
    const response = await fetch('/save-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name })
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error('Error:', error);
  }
});
