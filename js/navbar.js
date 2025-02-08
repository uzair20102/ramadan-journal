// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

// Your Firebase configuration (update with your actual configuration)
const firebaseConfig = {
    apiKey: "AIzaSyCoVX9WRmy83Rh5dRkpH3OAqMFEiB_LiAY",
    authDomain: "ramadan-journal-4b6b9.firebaseapp.com",
    projectId: "ramadan-journal-4b6b9",
    storageBucket: "ramadan-journal-4b6b9.firebasestorage.app",
    messagingSenderId: "932727132042",
    appId: "1:932727132042:web:ee5b8f50b6bcab7bd78273",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Build the navbar HTML based on whether the user is authenticated.
 */
function buildNavbar(user) {
  let navbarHTML = `
    <nav class="navbar">
      <div class="navbar-left">
        <a class="navbar-brand" href="index.html">Ramadan Journal</a>
      </div>
      <div class="navbar-center">
        <ul class="navbar-menu">
          <li class="navbar-item"><a href="/index.html">Home</a></li>
          <li class="navbar-item"><a href="/html/tracker.html">Tracker</a></li>
          <li class="navbar-item"><a href="/html/progress.html">Progress</a></li>
          <li class="navbar-item"><a href="/html/contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="navbar-right">`;

  if (user) {
    // If the user is logged in, show a greeting and a Logout button
    navbarHTML += `
          <span class="navbar-user">Hello, ${user.email}</span>
          <button id="logoutBtn" class="navbar-btn btn2"><b>Logout</b></button>`;
  } else {
    // If no user is logged in, show a Login link
    navbarHTML += `
          <b><a href="/html/login.html" class="navbar-btn btn2">Login</a></b>`;
  }

  navbarHTML += `
      </div>
    </nav>
  `;
  return navbarHTML;
}

/**
 * Update the navbar in the DOM.
 */
function updateNavbar(user) {
  const navbarContainer = document.getElementById("navbar-container");
  navbarContainer.innerHTML = buildNavbar(user);

  // If the user is authenticated, attach logout event handler
  if (user) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            console.log("User signed out successfully.");
            window.location.href = "/index.html";
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      });
    }
  }
}

// Listen for auth state changes and update the navbar accordingly.
onAuthStateChanged(auth, (user) => {
  updateNavbar(user);
});
