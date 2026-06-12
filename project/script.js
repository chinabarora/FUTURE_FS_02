// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
	e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({
    behavior: 'smooth'
});
  });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeHrBYko5qJhOCCoXi5I4slgwkvjY-ro8",
  authDomain: "brewhaven-af193.firebaseapp.com",
  projectId: "brewhaven-af193",
  storageBucket: "brewhaven-af193.firebasestorage.app",
  messagingSenderId: "302724803980",
  appId: "1:302724803980:web:eb607e736e59f72621baa9",
  measurementId: "G-3DGL1SMF2S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.onload = function(){
    document.getElementById("signinPopup").style.display = "block";
    document.getElementById("websiteContent").style.display = "none";
};

function createAccount(){

    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;
    let confirm = document.getElementById("signupConfirmPassword").value;

    if(password !== confirm){
        alert("Passwords do not match");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

        localStorage.setItem("userName", name);

        alert("Account Created Successfully");

        showLogin();
    })
    .catch((error) => {
        alert(error.message);
    });
}

function loginUser(){

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

        document.getElementById("signinPopup").style.display = "none";
        document.getElementById("websiteContent").style.display = "block";

        let name = localStorage.getItem("userName");

        document.getElementById("displayName").innerHTML =
        "👋 " + name;

    })
    .catch((error) => {
        alert(error.message);
    });
}

function showSignup(){
    document.getElementById("loginForm").style.display="none";
    document.getElementById("signupForm").style.display="block";
    document.getElementById("forgotForm").style.display="none";
}

function showLogin(){
    document.getElementById("loginForm").style.display="block";
    document.getElementById("signupForm").style.display="none";
    document.getElementById("forgotForm").style.display="none";
}

function showForgot(){
    document.getElementById("loginForm").style.display="none";
    document.getElementById("signupForm").style.display="none";
    document.getElementById("forgotForm").style.display="block";
}

function resetPassword(){

    let email = document.getElementById("resetEmail").value;

    sendPasswordResetEmail(auth, email)
    .then(() => {
        alert("Password Reset Email Sent");
    })
    .catch((error) => {
        alert(error.message);
    });
}
function openOrderForm(){
    document.getElementById("orderPopup").style.display = "flex";
}

function closeOrderForm(){
    document.getElementById("orderPopup").style.display = "none";
}

window.openOrderForm = openOrderForm;
window.closeOrderForm = closeOrderForm;

window.loginUser = loginUser;
window.createAccount = createAccount;
window.resetPassword = resetPassword;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.showForgot = showForgot;
window.orderNow = orderNow;