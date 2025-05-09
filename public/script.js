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
function handleBuy(title, author, cover, price) {
  const cart = JSON.parse(localStorage.getItem("buyCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover, price });
    localStorage.setItem("buyCart", JSON.stringify(cart));
  }

  updateCartCounts();
  loadBooks(); // ✅ Refresh UI to disable Borrow button for this book
}




function handleBorrow(title, author, coverUrl) {
  const cart = JSON.parse(localStorage.getItem("borrowCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover: coverUrl });
    localStorage.setItem("borrowCart", JSON.stringify(cart));
  }

  updateCartCounts();
  loadBooks(); // ✅ Refresh UI to disable Buy button for this book
}


// ── 3.1) Updating Cart Counts ──
function updateCartCounts() {
  const borrowCart = JSON.parse(localStorage.getItem("borrowCart")) || [];
  const buyCart = JSON.parse(localStorage.getItem("buyCart")) || [];

  document.getElementById("borrowCount").textContent = borrowCart.length;
  document.getElementById("buyCount").textContent = buyCart.length;

  const borrowIcon = document.getElementById("borrowCartIcon");
  const buyIcon = document.getElementById("buyCartIcon");

  if (borrowIcon) borrowIcon.setAttribute("data-count", borrowCart.length);
  if (buyIcon) buyIcon.setAttribute("data-count", buyCart.length);

  //updateCheckoutButton(buyCart, borrowCart); // ✅ pass both carts
}

// ── 3.2) Resetting Cart to Default ──
function resetCartToDefault() {
  // Clear the cart data in localStorage
  localStorage.setItem("borrowCart", JSON.stringify([]));
  localStorage.setItem("buyCart", JSON.stringify([]));

  // Update the cart counts to 0
  updateCartCounts();

  // Render the empty borrow and buy lists
  renderBorrowList([]);
  renderBuyList([]);
}



window.addEventListener("load", function () {
  // Check if the page load is due to an actual browser refresh
  if (performance.navigation.type === 1) {  // 1 = Reload
    localStorage.setItem("borrowCart", JSON.stringify([]));
    localStorage.setItem("buyCart", JSON.stringify([]));
  }

  updateCartCounts();
  loadBooks();
});