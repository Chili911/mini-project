function loadBooks() {
  fetch("/books")
    .then(res => res.json())
    .then(books => {
      const container = document.getElementById("bookGrid");
      container.innerHTML = "";

      const buyCart = JSON.parse(localStorage.getItem("buyCart")) || [];
      const borrowCart = JSON.parse(localStorage.getItem("borrowCart")) || [];

      books.forEach(book => {
        const { title, author, cover, price } = book;
        const alreadyBought = buyCart.some(b => b.title === title);
        const alreadyBorrowed = borrowCart.some(b => b.title === title);

        const card = document.createElement("div");
        card.className = "col";

        const cardInner = document.createElement("div");
        cardInner.className = "card h-100 shadow-sm";
        cardInner.style.maxWidth = "180px";
        cardInner.style.margin = "auto";

        const img = document.createElement("img");
        img.src = cover;
        img.alt = title;
        img.className = "card-img-top";
        img.style.height = "200px";
        img.style.objectFit = "cover";

        const body = document.createElement("div");
        body.className = "card-body p-2 text-center";

        const titleEl = document.createElement("h6");
        titleEl.className = "card-title mb-1";
        titleEl.textContent = title;

        const authorEl = document.createElement("small");
        authorEl.className = "text-muted";
        authorEl.textContent = author;

        const priceEl = document.createElement("div");
        priceEl.className = "text-success fw-bold";
        priceEl.textContent = price;

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "mt-2 d-grid gap-2";

        // --- Buy Button ---
        const buyBtn = document.createElement("button");
        buyBtn.className = `btn btn-sm ${alreadyBorrowed ? 'btn-secondary' : 'btn-outline-success'}`;
        buyBtn.textContent = "Buy";
        if (alreadyBorrowed) {
          buyBtn.disabled = true;
          buyBtn.title = "Already in Borrow cart";
        } else {
          buyBtn.onclick = () => handleBuy(title, author, cover, price);
        }

        // --- Borrow Button ---
        const borrowBtn = document.createElement("button");
        borrowBtn.className = `btn btn-sm ${alreadyBought ? 'btn-secondary' : 'btn-outline-primary'}`;
        borrowBtn.textContent = "Borrow";
        if (alreadyBought) {
          borrowBtn.disabled = true;
          borrowBtn.title = "Already in Buy cart";
        } else {
          borrowBtn.onclick = () => handleBorrow(title, author, cover);
        }

        // Append all
        buttonGroup.appendChild(buyBtn);
        buttonGroup.appendChild(borrowBtn);
        body.append(titleEl, authorEl, document.createElement("br"), priceEl, buttonGroup);
        cardInner.append(img, body);
        card.appendChild(cardInner);
        container.appendChild(card);
      });
    })
    .catch(err => console.error("Error fetching books:", err));
}

  
 

// ── 3) Cart action handlers ──
function handleBuy(title, author, coverUrl, price) {
    const cart = JSON.parse(localStorage.getItem("buyCart")) || [];
  
    // Check if the book is already in the cart
    if (!cart.find(book => book.title === title)) {
        cart.push({ title, author, cover: coverUrl, price });
        localStorage.setItem("buyCart", JSON.stringify(cart));
    }
  
    // Update the cart counts and show confirmation
    updateCartCounts();
    showConfirm(`${title} added to your <strong>Buy</strong> cart.`);
}
  
function handleBorrow(title, author, coverUrl) {
    const cart = JSON.parse(localStorage.getItem("borrowCart")) || [];
  
    // Check if the book is already in the cart
    if (!cart.find(book => book.title === title)) {
        cart.push({ title, author, cover: coverUrl });
        localStorage.setItem("borrowCart", JSON.stringify(cart));
    }
  
    // Update the cart counts and show confirmation
    updateCartCounts();
    showConfirm(`${title} added to your <strong>Borrow</strong> list.`);
}

// Updates the cart icon counts for both buy and borrow carts
function updateCartCounts() {
    const borrowCart = JSON.parse(localStorage.getItem("borrowCart")) || [];
    const buyCart = JSON.parse(localStorage.getItem("buyCart")) || [];
  
    // Update the display for cart counts
    document.getElementById("borrowCount").textContent = borrowCart.length;
    document.getElementById("buyCount").textContent = buyCart.length;
  
    // Optionally, update the cart icon dynamically if you have one
    document.getElementById("borrowCartIcon").setAttribute("data-count", borrowCart.length);
    document.getElementById("buyCartIcon").setAttribute("data-count", buyCart.length);
}

// Initialize cart counts to 0 when the page loads or is reset
document.addEventListener("DOMContentLoaded", function() {
    resetCartToDefault();  // Reset cart counts to 0 on page load
});

// Display a confirmation message
function showConfirm(message) {
    const confirmDiv = document.createElement('div');
    confirmDiv.classList.add('confirm');
    confirmDiv.innerHTML = message;
    document.body.appendChild(confirmDiv);
    setTimeout(() => confirmDiv.remove(), 3000);  // Remove the message after 3 seconds
}

// Reset cart to default (set both buy and borrow counts to 0)
function resetCartToDefault() {
    // Clear the cart data in localStorage
    localStorage.setItem("borrowCart", JSON.stringify([]));
    localStorage.setItem("buyCart", JSON.stringify([]));

    // Update the cart counts to 0
    document.getElementById("borrowCount").textContent = 0;
    document.getElementById("buyCount").textContent = 0;

    // Update the cart icon counts (if applicable)
    document.getElementById("borrowCartIcon").setAttribute("data-count", 0);
    document.getElementById("buyCartIcon").setAttribute("data-count", 0);
}
