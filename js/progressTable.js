// Import the necessary Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

// Your Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Fetch all progress documents for the current user.
 * Assumes data is stored at: users/{userId}/progress/{dateId}
 */
async function fetchAllProgress() {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated");
    return [];
  }
  const progressRef = collection(db, 'users', user.uid, 'progress');

  try {
    const progressSnapshot = await getDocs(progressRef);
    const progressData = [];

    if (progressSnapshot.empty) {
      console.warn("No progress data found in Firestore.");
      return [];
    }

    // Loop through each document in the progress collection
    progressSnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      progressData.push({
        date: docSnapshot.id, // Document ID assumed to be the date
        athkar: data.athkar ? "Yes" : "No",
        workout: data.workout ? "Yes" : "No",
        fajr: data.prayersf ? "Yes" : "No",
        duhur: data.prayersd ? "Yes" : "No",
        asr: data.prayersa ? "Yes" : "No",
        maghrib: data.prayersm ? "Yes" : "No",
        ishaa: data.prayersi ? "Yes" : "No",
        taraweeh: data.prayerst ? "Yes" : "No",
        quranpages: data.quranpages || "none",
        goals: data.goals || "none"
      });
    });
    
    console.log("Fetched progress data:", progressData);
    return progressData;
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return [];
  }
}

/**
 * Render the progress data into an HTML table.
 */
async function renderProgressTable() {
  const progressData = await fetchAllProgress();
  const tableBody = document.querySelector("#progressTable tbody");
  tableBody.innerHTML = ""; // Clear existing table rows

  if (progressData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11">No progress data available</td></tr>`;
    return;
  }

  // Create a row for each progress record
  progressData.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.date}</td>
      <td>${record.fajr}</td>
      <td>${record.duhur}</td>
      <td>${record.asr}</td>
      <td>${record.maghrib}</td>
      <td>${record.ishaa}</td>
      <td>${record.taraweeh}</td>
      <td>${record.athkar}</td>
      <td>${record.workout}</td>
      <td>${record.quranpages}</td>
      <td>${record.goals}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User authenticated:", user.uid);
    renderProgressTable(); // Render table once the user is authenticated
  } else {
    console.log("User not authenticated. Redirecting to login...");
    window.location.href = "login.html";
  }
});
