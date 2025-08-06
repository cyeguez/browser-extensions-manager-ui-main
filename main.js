// Load and render extensions data
let extensionsData = [];

// Function to load JSON data
async function loadExtensionsData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    extensionsData = await response.json();
    renderExtensions(extensionsData);
  } catch (error) {
    console.error("Error loading extensions data:", error);
  }
}

// Function to render extensions
function renderExtensions(extensions) {
  const container = document.querySelector(".extensions-list__container");
  if (!container) return;

  container.innerHTML = "";

  extensions.forEach((extension) => {
    const extensionElement = createExtensionElement(extension);
    container.appendChild(extensionElement);
  });
}

// Function to create extension element
function createExtensionElement(extension) {
  const article = document.createElement("article");
  article.className = "extensions-list__item";

  // Get icon ID from logo filename

  article.innerHTML = `
    <div class="extensions-list__item-content">
      <img src="${
        extension.logo
      }" class="extensions-list__item-image" width="60" height="60">
      <div class="extensions-list__item-details">
        <h2>${extension.name}</h2>
        <p>${extension.description}</p>
      </div>
    </div>
    <div class="extensions-list__item-actions">
      <button class="btn" type="button">Remove</button>
      <label class="switch">
        <input type="checkbox" ${extension.isActive ? "checked" : ""} />
        <span class="slider"></span>
      </label>
    </div>
  `;

  return article;
}

// Theme Management
const btnLight = document.getElementById("btnLight");
const btnDark = document.getElementById("btnDark");

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem("theme") || "light";

// Apply the saved theme on page load
if (currentTheme === "dark") {
  document.body.classList.add("dark");
  updateButtonStates("dark");
} else {
  document.body.classList.remove("dark");
  updateButtonStates("light");
}

// Function to update button visibility states
function updateButtonStates(theme) {
  if (theme === "dark") {
    btnDark.classList.add("hidden");
    btnLight.classList.remove("hidden");
  } else {
    btnLight.classList.add("hidden");
    btnDark.classList.remove("hidden");
  }
}

// Dark theme activation
btnDark.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.add("dark");
  localStorage.setItem("theme", "dark");
  updateButtonStates("dark");
});

// Light theme activation
btnLight.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.remove("dark");
  localStorage.setItem("theme", "light");
  updateButtonStates("light");
});

// Filter functionality
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(
    ".extensions-list__filter-buttons .btn"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Filter extensions based on button text
      const filterType = button.textContent.toLowerCase();
      filterExtensions(filterType);
    });
  });
}

// Function to filter extensions
function filterExtensions(filterType) {
  let filteredExtensions;

  switch (filterType) {
    case "active":
      filteredExtensions = extensionsData.filter((ext) => ext.isActive);
      break;
    case "inactive":
      filteredExtensions = extensionsData.filter((ext) => !ext.isActive);
      break;
    case "all":
    default:
      filteredExtensions = extensionsData;
      break;
  }

  renderExtensions(filteredExtensions);
  setupSwitchHandlers(); // Re-setup handlers after re-render
  setupRemoveButtons(); // Re-setup remove button handlers
}

// Function to setup switch handlers
function setupSwitchHandlers() {
  const switches = document.querySelectorAll('.switch input[type="checkbox"]');

  switches.forEach((switchElement, index) => {
    switchElement.addEventListener("change", (e) => {
      const extensionName = e.target
        .closest(".extensions-list__item")
        .querySelector("h2").textContent;

      // Update the data
      const extension = extensionsData.find(
        (ext) => ext.name === extensionName
      );
      if (extension) {
        extension.isActive = e.target.checked;
      }

      console.log(
        `${extensionName} is now ${e.target.checked ? "active" : "inactive"}`
      );
    });
  });
}

// Function to setup remove buttons
function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(
    ".extensions-list__item .btn"
  );

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const extensionItem = e.target.closest(".extensions-list__item");
      const extensionName = extensionItem.querySelector("h2").textContent;

      // Remove from data array
      const index = extensionsData.findIndex(
        (ext) => ext.name === extensionName
      );
      if (index > -1) {
        extensionsData.splice(index, 1);
      }

      // Remove from DOM with animation
      extensionItem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      extensionItem.style.opacity = "0";
      extensionItem.style.transform = "translateX(-100%)";

      setTimeout(() => {
        extensionItem.remove();
      }, 300);

      console.log(`${extensionName} removed`);
    });
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  await loadExtensionsData();
  setupFilterButtons();
  setupSwitchHandlers();
  setupRemoveButtons();
});
