
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

                 // Set the inner HTML of the card with book data and Buy/Borrow buttons
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
        .catch(err => {
            console.error("Error fetching books:", err);
        });
}


function showConfirm(message) {
    const bar = document.getElementById("actionConfirmBar");
    const msg = document.getElementById("confirmMessage");
    msg.innerHTML = message;

    bar.classList.remove("d-none");

    // Optional: hide after a few seconds
    setTimeout(() => {
        bar.classList.add("d-none");
    }, 5000);
}

// Optional handlers for actions
function handleBuy(title, author, coverUrl, price) {
    let cart = JSON.parse(localStorage.getItem("buyCart")) || [];

    if (!cart.find(book => book.title === title)) {
        cart.push({ title, author, cover: coverUrl,price });
        localStorage.setItem("buyCart", JSON.stringify(cart));
    }

    showConfirm(`${title} added to your <strong>Buy</strong> cart.`);
}

function handleBorrow(title, author, coverUrl) {
    let cart = JSON.parse(localStorage.getItem("borrowCart")) || [];

    if (!cart.find(book => book.title === title)) {
        cart.push({ title, author, cover: coverUrl });
        localStorage.setItem("borrowCart", JSON.stringify(cart));
    }
    
  // Show a confirmation message that the book was added
    showConfirm(`${title} added to your <strong>Borrow</strong> list.`);
}


// Automatically load books when on browse.html
if (window.location.pathname.includes("browse.html")) {
    loadBooks();
}

// ADD NEW , COOKIES accept or reject
document.addEventListener("DOMContentLoaded", function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
  
    // Function to set a cookie
    function setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + (days*24*60*60*1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
  
    // Function to get a cookie by name
    function getCookie(name) {
      const cname = name + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) {
          return c.substring(cname.length, c.length);
        }
      }
      return "";
    }
  
    // Check if user already made a choice
    if (getCookie("cookiesAccepted") === "yes" || getCookie("cookiesAccepted") === "no") {
      cookieConsent.classList.add('hidden'); // hide banner if already accepted or rejected
    } else {
      cookieConsent.classList.remove('hidden'); // show banner
    }
  
    acceptBtn.addEventListener('click', function() {
      setCookie("cookiesAccepted", "yes", 365);
      cookieConsent.classList.add('hidden');
    });
});

//Cart update function
function updateCartCount() {
    const cartCount = JSON.parse(localStorage.getItem("borrowCart"))?.length || 0;
    document.getElementById("cartCount").textContent = cartCount;
  }
  
  // Call this once when the page loads and also after adding a book
  updateCartCount();
  

