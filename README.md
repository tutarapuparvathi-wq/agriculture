# Smart Agriculture System – App Version

This is a replacement `frontend` designed to work directly with GitHub Pages.

## What changed

### Login
- Phone number instead of username/password
- OTP screen
- Demo OTP: `123456`
- No real SMS service is used yet

### Dashboard
- App-style farmer dashboard
- Crop Information
- Weather
- Market Prices
- Soil Health
- Farm Alerts
- Farm Locations
- Summary cards
- Mobile responsive navigation

### Locations
- Search village/town/district
- Andhra Pradesh and Telangana filters
- Sample locations including Ravulapalem, Amalapuram, Rajahmundry, Kakinada, Vijayawada, Hyderabad, Nizamabad, Warangal and Karimnagar
- Select a farm location and keep it in browser localStorage

## GitHub Pages

Replace the files inside your repository's `frontend` folder with the three files inside this package:

- `frontend/index.html`
- `frontend/style.css`
- `frontend/app.js`

Commit and push them. Make sure GitHub Pages is configured to publish the `frontend` folder from the `main` branch.

The app uses no npm dependency, so it can run directly as a static GitHub Pages site.

## Demo login

Any valid 10-digit Indian mobile number can be entered.

OTP: `123456`

For production, connect the OTP screen to a real backend/SMS provider.
