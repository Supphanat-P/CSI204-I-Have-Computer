# Walkthrough - Profile Page, LocalStorage Persistence & Authentication Flow

We have successfully developed a premium, interactive Profile page and linked it to a reactive `localStorage` authentication system.

## Changes Made

### 1. Registration (`Register.jsx`)
- Modified the form submission handler to register users locally in `localStorage` under the `users` array.
- Ensures duplicate email prevention and validates fields before registering.

### 2. Login Flow (`Login.jsx`)
- Modified the submit handler to authenticate credentials against registered users in `localStorage` (`users`).
- Initializes a default mock user (`theefordev@gmail.com` with password `password123`) if no users have been registered yet.
- On successful login, saves the user session as `currentUser` in `localStorage` and redirects to `/profile`.

### 3. Layout Reactivity (`MainLayout.jsx`)
- Watches route changes using `useLocation()` and updates the navigation bar’s login/logout status dynamically, matching `currentUser` presence.

### 4. Profiles Page Auth & Persistence (`Profiles.jsx`)
- **Protected Route**: Implemented a mounting check that alerts the user and redirects to `/login` if no user session is found in `localStorage`.
- **User Info Management**: Profile data is loaded dynamically from `localStorage` and can be edited and saved back to the `users` list.
- **Empty Initial Addresses**: Removed the mock dummy addresses from initial states of `shippingAddresses` and `taxAddresses`. Both sections start completely empty (`[]`), only showing addresses explicitly entered by the user.
- **Multiple Addresses**: Shipping and tax invoice addresses are loaded and saved dynamically per user in `localStorage` (e.g., `shippingAddresses_<userId>`), enabling persistent updates across page reloads.
- **Logout Action**: Added a logout button in the sidebar that clears `currentUser` and redirects to the login page.
