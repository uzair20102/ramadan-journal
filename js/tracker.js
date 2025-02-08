import { db, doc, setDoc, getDoc, auth, collection, getDocs } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

// document.getElementById('progress-history').addEventListener('click', loadProgress);

document.addEventListener('DOMContentLoaded', (event) => {
    initializeApp();
});


// This function will display the user's progress once they are authenticated
async function displayProgress() {
    const user = auth.currentUser;
    if (!user) {
        console.error('User is not authenticated');
        return;
    }

    const userRef = doc(db, 'users', user.uid); // Reference to user's Firestore document
    try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const progress = data.progress || {};

            console.log('User Progress:', progress); // Log to verify the data

            // Display the saved progress (check/uncheck checkboxes)
            document.getElementById('prayersf').checked = progress.prayersf || false;
            document.getElementById('prayersd').checked = progress.prayersd || false;
            document.getElementById('prayersa').checked = progress.prayersa || false;
            document.getElementById('prayersm').checked = progress.prayersm || false;
            document.getElementById('prayersi').checked = progress.prayersi || false;
            document.getElementById('prayerst').checked = progress.prayerst || false;
            document.getElementById('athkar').checked = progress.athkar || false;
            document.getElementById('workout').checked = progress.workout || false;
            document.getElementById('pages').value = progress.quranpages || '';
            document.getElementById('goals').value = progress.goals || '';
        } else {
            // console.log('No progress found!');
        }
    } catch (error) {
        console.error('Error retrieving progress: ', error);
    }
}

// Wait for Firebase authentication state to be established
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is authenticated:', user.uid, user.email);
        displayProgress(); // Only display the progress once the user is authenticated
        initializeApp()
        renderProgressChart()
    } else {
        console.log('User is not authenticated');
        // Redirect to login page or handle as necessary
        window.location.href = 'login.html'; // Redirect to login page if no user
    }
});

// Save progress to Firestore when the form is submitted
async function saveProgress(event) {
    event.preventDefault(); // Prevent form submission

    const user = auth.currentUser;
    if (!user) {
        console.error('User is not authenticated');
        return;
    }

    const userRef = doc(db, 'users', user.uid); // Reference to user's Firestore document
    const progressRef = collection(userRef, 'progress'); // Sub-collection for daily progress

    // Get the selected date
    const selectedDate = document.getElementById('date').value;

    if (!selectedDate) {
        alert('Please select a date!');
        return;
    }

    const dailyProgress = {
        date: selectedDate,
        prayersf: document.getElementById('prayersf').checked,
        prayersd: document.getElementById('prayersd').checked,
        prayersa: document.getElementById('prayersa').checked,
        prayersm: document.getElementById('prayersm').checked,
        prayersi: document.getElementById('prayersi').checked,
        prayerst: document.getElementById('prayerst').checked,
        athkar: document.getElementById('athkar').checked,
        workout: document.getElementById('workout').checked,
        quranpages: document.getElementById('pages').value,
        goals: document.getElementById('goals').value
    };

    try {
        // Save progress under the selected date (document ID = selected date)
        await setDoc(doc(progressRef, selectedDate), dailyProgress);
        console.log('Progress saved:', dailyProgress);
        document.getElementById('saved').innerHTML = 'Progress saved successfully'
    } catch (error) {
        console.error('Error saving progress:', error);
        document.getElementById('error').innerHTML = 'Error saving progress:', error
    }
}


async function loadProgress() {
    const user = auth.currentUser;
    if (!user) {
        console.error('User is not authenticated');
        return;
    }

    const userRef = doc(db, 'users', user.uid); // Reference to user's Firestore document
    const progressRef = collection(userRef, 'progress'); // Sub-collection for daily progress

    // Get the selected date
    const selectedDate = document.getElementById('date').value;

    if (!selectedDate) {
        alert('Please select a date to load progress!');
        return;
    }

    try {
        const docRef = doc(progressRef, selectedDate); // Reference to the specific date's document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Loaded progress:', data);

            // Populate the form with the loaded data
            document.getElementById('prayersf').checked = data.prayersf || false;
            document.getElementById('prayersd').checked = data.prayersd || false;
            document.getElementById('prayersa').checked = data.prayersa || false;
            document.getElementById('prayersm').checked = data.prayersm || false;
            document.getElementById('prayersi').checked = data.prayersi || false;
            document.getElementById('prayerst').checked = data.prayerst || false;
            document.getElementById('athkar').checked = data.athkar || false;
            document.getElementById('workout').checked = data.workout || false;
            document.getElementById('pages').value = data.quranpages || '';
            document.getElementById('goals').value = data.goals || '';
        } else {
            alert('No progress found for the selected date!');
            console.error('No progress found for the selected date.');
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}







// Background
// Logout function to sign out the user
function logout() {
    auth.signOut().then(() => {
        alert('Logged out successfully!');
        window.location.href = 'login.html'; // Redirect to login page
    }).catch((error) => {
        console.error('Error logging out: ', error);
    });
}

// Add event listeners
document.getElementById('progress-form').addEventListener('submit', saveProgress);
document.getElementById('logout').addEventListener('click', logout);

function initializeApp() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User authenticated:", user.uid);
        } else {
            console.log("User not authenticated. Redirecting...");
            window.location.href = "login.html";
        }
    });
}