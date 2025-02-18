
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

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
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', function() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      
      const params = new URLSearchParams(window.location.search);
      const selectedDate = params.get('date'); // Expected to be in "YYYY-MM-DD" format
      if (!selectedDate) {
        window.location.href = "https://ramadanjournal.co.uk/html/progress.html";
        document.getElementById('selected-date').textContent = "No date selected!";
        return;
      }
      
      console.log("Selected date from URL:", selectedDate);
      document.getElementById('selected-date').textContent = selectedDate;
      
      const userRef = doc(db, 'users', user.uid);
      const progressRef = collection(userRef, 'progress');
      const docRef = doc(progressRef, selectedDate);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          document.getElementById('day-detail').innerHTML = `                
                <h3>${selectedDate}</h3>
                <p><strong>Fajr:</strong> ${data.prayersf ? 'Yes' : 'No'}</p>
                <p><strong>Dohur:</strong> ${data.prayersd ? 'Yes' : 'No'}</p>
                <p><strong>Asr:</strong> ${data.prayersa ? 'Yes' : 'No'}</p>
                <p><strong>Maghrib:</strong> ${data.prayersm ? 'Yes' : 'No'}</p>
                <p><strong>Isha:</strong> ${data.prayersi ? 'Yes' : 'No'}</p>
                <p><strong>Taraweeh:</strong> ${data.prayerst ? 'Yes' : 'No'}</p>
                <p><strong>Athkar:</strong> ${data.athkar ? 'Yes' : 'No'}</p>
                <p><strong>Workout:</strong> ${data.workout ? "Yes" : "No"}</p>
                <p><strong>Qur'an Pages:</strong> ${data.quranpages || "none"}</p>`;

        } else {
          document.getElementById('day-detail').innerHTML = "<p>No progress found for this date.</p>";
        }
      } catch (error) {
        console.error("Error fetching progress detail:", error);
        document.getElementById('day-detail').innerHTML = "<p>Error fetching progress, please try again later <br> Error Code: " + error + "</p>"
      }
    
      updateLayout()
    });
  });
  

  

  document.addEventListener('DOMContentLoaded', function() {
    // Compare button event listener
    document.getElementById('compare-btn').addEventListener('click', async function() {
      const compareDate = document.getElementById('compare-date').value;
      if (!compareDate) {
        alert("Please select a date to compare.");
        return;
      }
      
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      
      const userRef = doc(db, 'users', user.uid);
      const progressRef = collection(userRef, 'progress');
      const compareDocRef = doc(progressRef, compareDate);
      
      try {
        const compareSnap = await getDoc(compareDocRef);
        if (compareSnap.exists()) {
          const data = compareSnap.data();
          document.getElementById('comparison-result').innerHTML = `
                <h3>${compareDate}</h3> 
                <p><strong>Fajr:</strong> ${data.prayersf ? 'Yes' : 'No'}</p>
                <p><strong>Dohur:</strong> ${data.prayersd ? 'Yes' : 'No'}</p>
                <p><strong>Asr:</strong> ${data.prayersa ? 'Yes' : 'No'}</p>
                <p><strong>Maghrib:</strong> ${data.prayersm ? 'Yes' : 'No'}</p>
                <p><strong>Isha:</strong> ${data.prayersi ? 'Yes' : 'No'}</p>
                <p><strong>Taraweeh:</strong> ${data.prayerst ? 'Yes' : 'No'}</p>
                <p><strong>Athkar:</strong> ${data.athkar ? 'Yes' : 'No'}</p>
                <p><strong>Workout:</strong> ${data.workout ? "Yes" : "No"}</p>
                <p><strong>Qur'an Pages:</strong> ${data.quranpages || "none"}</p>
          `;

          document.getElementById('comparison-result').classList.remove('hidden');
        } else {
          document.getElementById('comparison-result').innerHTML = "<p>No data for the selected date.</p>";
          document.getElementById('comparison-result').classList.remove('hidden');
        }
        updateLayout();
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      }
    });
});



    
    // Function to update the layout based on compare card content
    function updateLayout() {
      const container = document.querySelector('.container');
      const compareCard = document.getElementById('comparison-result');
      // If compareCard is empty or indicates no data, use a single column layout
      if (!compareCard || compareCard.innerHTML.trim() === "" || compareCard.innerHTML.includes("No data")) {
        container.style.gridTemplateColumns = '1fr';
      } else {
        container.style.gridTemplateColumns = '1fr 1fr';
      }
    }
