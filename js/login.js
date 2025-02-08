import { auth } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Form elements
const authForm = document.getElementById('auth-form');
const signupBtn = document.getElementById('signup-btn');
const fail = document.getElementById('fail')
const success = document.getElementById('success')

// Handle Login
authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Firebase login function
        await signInWithEmailAndPassword(auth, email, password);
        success.innerHTML = 'Logging in - please wait...'
        window.location.href = 'tracker.html'; // Redirect to Tracker page
    } catch (error) {
        console.error("Login error:", error);
        fail.innerHTML = getFriendlyErrorMessage(error)
    }
});

// Handle Sign Up
signupBtn.addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Firebase sign-up function
      await createUserWithEmailAndPassword(auth, email, password);
      fail.innerHTML = '';
      success.innerHTML = 'Sign-up successful! You can now log in.';
    } catch (error) {
        console.error("Signup error:", error);
        fail.innerHTML = getFriendlyErrorMessage(error)
    }
});



// Add this helper function at the top of your login.js file (or wherever you handle auth)
function getFriendlyErrorMessage(error) {
    // You can add more cases as needed
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with that email address.';
      case 'auth/wrong-password':
        return 'The password you entered is incorrect. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please try logging in or use a different email.';
      case 'auth/invalid-email':
        return 'The email address you entered is invalid. Please check it and try again.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please choose a stronger password.';
      case 'auth/invalid-login-credentials':
        return 'Invalid email/password'
      case 'auth/password-does-not-meet-requirements':
        return 'Please ensure password contains at least 1 number and at least 1 symbol'
      default:
        return 'An error occurred. Please try again later.';
    }
  }
