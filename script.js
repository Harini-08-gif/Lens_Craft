// LenCraft - Script Initialization (Part 3 Polish)
// Select DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");

// Event Listener for Search Submission
form.addEventListener("submit", async (event) => {
  // Task 1: Prevent page reload
  event.preventDefault();

  // Read query
  const query = input.value.trim();

  // Task 4: Ignore empty searches
  if (!query) return;

  // 1. LOADING STATE: Display a loading message immediately before fetching
  resultsContainer.innerHTML = '<p class="loading-state">Searching...</p>';

  // Task 2: Build API URL using encodeURIComponent
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

  try {
    // Task 2: Fetch data and check response.ok
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Task 2: Parse JSON
    const data = await response.json();
    const items = data.query ? Object.values(data.query.pages) : [];

    // 2. EMPTY STATE: Handle when 0 results are returned
    if (items.length === 0) {
      resultsContainer.innerHTML = `<p class="empty-state">No results found for "${query}". Try another search.</p>`;
      return;
    }

    // Task 3: Render results when data is present
    renderResults(items, query);

  } catch (error) {
    // 3. ERROR STATE: Handle network or API failure
    console.error("Error fetching data:", error);
    resultsContainer.innerHTML = '<p class="error-state">Something went wrong. Please try again.</p>';
  }
});

// Render Function
function renderResults(items, query) {
  // Task 3: Clear previous results
  resultsContainer.innerHTML = "";

  // Task 5 (Enhancement): Display result count
  const countHeading = document.createElement("p");
  countHeading.className = "result-count";
  countHeading.textContent = `Showing ${items.length} results for "${query}"`;
  resultsContainer.appendChild(countHeading);

  // Task 3: Build card per result and append to container
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageinfo?.[0]?.thumburl || "";
    img.alt = item.title || "Image result";

    const caption = document.createElement("p");
    caption.textContent = item.title;

    // Make card image clickable (Enhancement feature)
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
  });
}
