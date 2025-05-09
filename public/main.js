let allBooks = [];

// Fetch all books from server and store for searching
function loadBooksForSearch() {
  fetch("/books")
    .then(res => res.json())
    .then(books => {
      allBooks = books; // Store in global variable for search
      const container = document.getElementById("bookGrid"); //target where the books will be shown
      if (container) {
        container.innerHTML = "";
        books.forEach(book => {
          const { title, author, cover, price } = book;
          const card = document.createElement("div");
          card.className = "col";
        //html template for the book
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
      }
    })
    .catch(err => console.error("Error fetching books:", err));
}

function searchBook() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!input) return alert("Please enter a search term.");

  const match = allBooks.find(book =>
    book.title.toLowerCase().includes(input)
    ||
  book.author.toLowerCase().includes(input) //allowing partial matches
  );
  

  if (match) {
    localStorage.setItem("selectedBook", JSON.stringify(match));
    window.location.href = "book-details.html";
  } else {
    alert("Book not found!");

  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadBooksForSearch();  
});



  