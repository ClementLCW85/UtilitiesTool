# Admin Setup Guide

To enable the Secure Admin Interface using Firebase, follow these steps in your Firebase Console.

## 1. Enable Authentication
1. Go to **Firebase Console** > **Build** > **Authentication**.
2. Click **Get Started**.
3. Select **Email/Password** from the Sign-in method list.
4. Enable **Email/Password** toggle.
5. Click **Save**.

## 2. Create the Admin Account
Since functionality to "Sign Up" is not exposed in the UI (to prevent unauthorized users from registering), you must create the admin user explicitly in the console.

1. Go to **Authentication** > **Users** tab.
2. Click **Add user**.
3. Enter Email: `wei91my@gmail.com`
   - *Note: This matches the hardcoded email in `js/auth.js`.*
4. Enter Password: [Choose a Strong Password]
   - *This will be your "Master Password".*
5. Click **Add user**.

## 3. Verify Login
1. Open your deployed site (or local version).
2. Go to the **Admin** tab.
3. Enter the password you just created.
4. If successful, you should see the Admin Dashboard.
