// LenCraft - Script Initialization (Part 3 Polish)
// Select DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");

// Event Listener for Search Submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  // 1. LOADING STATE
  resultsContainer.innerHTML = '<p class="loading-state">Searching...</p>';

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

  try {
    const response = await fetch(url);

    // FIX 1: Explicit response.ok check
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const items = data.query ? Object.values(data.query.pages) : [];

    // 2. EMPTY STATE
    if (items.length === 0) {
      resultsContainer.innerHTML = `<p class="empty-state">No results found for "${query}". Try another search.</p>`;
      return;
    }

    // 3. SUCCESS STATE
    renderResults(items, query);

  } catch (error) {
    // 4. ERROR STATE
    console.error("Error fetching data:", error);
    resultsContainer.innerHTML = '<p class="error-state">Something went wrong. Please try again.</p>';
  }
});

// Render Function
function renderResults(items, query) {
  resultsContainer.innerHTML = "";

  // FIX 2: Polish Feature - Result Count Heading
  const countHeading = document.createElement("p");
  countHeading.className = "result-count";
  countHeading.textContent = `Showing ${items.length} results for "${query}"`;
  resultsContainer.appendChild(countHeading);

  // Render cards with smooth fade-in polish
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.opacity = "0";
    card.style.transition = "opacity 0.4s ease-in-out";

    const img = document.createElement("img");
    img.src = item.imageinfo?.[0]?.thumburl || "";
    img.alt = item.title || "Image result";

    const caption = document.createElement("p");
    caption.textContent = item.title;

    if (item.imageinfo?.[0]?.url) {
      const link = document.createElement("a");
      link.href = item.imageinfo[0].url;
      link.target = "_blank";
      link.appendChild(img);
      card.appendChild(link);
    } else {
      card.appendChild(img);
    }

    card.appendChild(caption);
    resultsContainer.appendChild(card);

    // Trigger smooth fade-in effect
    setTimeout(() => {
      card.style.opacity = "1";
    }, 50);
  });
}
