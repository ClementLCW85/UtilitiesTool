// Authentication Logic
const auth = {
    // Admin Credential Configuration (Hardcoded Email for "Master Password" experience)
    adminEmail: "wei91my@gmail.com", // Virtual email for the single admin account

    init: function() {
        // Listen for auth state changes
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User signed in:", user.email);
                this.updateUI(true);
            } else {
                console.log("User signed out");
                this.updateUI(false);
            }
        });

        // Bind Login Event
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('admin-password').value;
                this.login(password);
            });
        }

        // Bind Logout Event
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    },

    login: function(password) {
        // Using Firebase Auth with a fixed email to simulate "Master Password"
        firebase.auth().signInWithEmailAndPassword(this.adminEmail, password)
            .then((userCredential) => {
                // Signed in
                console.log("Login Successful");
                // Clear password field
                document.getElementById('admin-password').value = '';
            })
            .catch((error) => {
                console.error("Login Error:", error.code, error.message);
                alert("Login Failed: " + error.message);
            });
    },

    logout: function() {
        firebase.auth().signOut().then(() => {
            console.log("Logout Successful");
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    },

    updateUI: function(isLoggedIn) {
        const loginSection = document.getElementById('admin-login');
        const adminContent = document.getElementById('admin-content');
        
        if (isLoggedIn) {
            if(loginSection) loginSection.style.display = 'none';
            if(adminContent) adminContent.style.display = 'block';
        } else {
            if(loginSection) loginSection.style.display = 'block';
            if(adminContent) adminContent.style.display = 'none';
        }
    }
};

// Expose auth globally so app.js can initialize it
window.auth = auth;
