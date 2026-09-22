const app = document.getElementById("app");

const locations = [
  {name:"Ravulapalem", state:"ANDHRA PRADESH", crop:"Paddy • Coconut • Banana", icon:"🌴"},
  {name:"Amalapuram", state:"ANDHRA PRADESH", crop:"Coconut • Paddy • Aqua", icon:"🌾"},
  {name:"Rajahmundry", state:"ANDHRA PRADESH", crop:"Paddy • Banana • Vegetables", icon:"🌿"},
  {name:"Kakinada", state:"ANDHRA PRADESH", crop:"Paddy • Coconut • Aqua", icon:"🥥"},
  {name:"Vijayawada", state:"ANDHRA PRADESH", crop:"Paddy • Chilli • Vegetables", icon:"🌶️"},
  {name:"Hyderabad", state:"TELANGANA", crop:"Vegetables • Maize • Cotton", icon:"🌱"},
  {name:"Nizamabad", state:"TELANGANA", crop:"Paddy • Turmeric • Maize", icon:"🌾"},
  {name:"Warangal", state:"TELANGANA", crop:"Cotton • Chilli • Maize", icon:"🌶️"},
  {name:"Karimnagar", state:"TELANGANA", crop:"Paddy • Cotton • Maize", icon:"🌱"}
];

let phone = "";
let screen = "login";
let loginStep = 1;
let activePage = "home";
let selectedLocation = localStorage.getItem("farmLocation") || "Ravulapalem";
let locationFilter = "ALL";

function render(){
  if(screen === "login") renderLogin();
  else renderApp();
}

function renderLogin(){
  app.innerHTML = `
    <div class="login-screen">
      <section class="login-photo">
        <div class="login-photo-content">
          <div class="brand"><div class="brand-mark">🌾</div> Smart Agriculture</div>
          <h1>Smart tools for<br>better farming.</h1>
          <p>Get useful crop, weather, market and farm information through one simple farmer-friendly app.</p>
          <div class="trust-row"><span>✓ Simple</span><span>✓ Mobile Friendly</span><span>✓ Farmer Focused</span></div>
        </div>
      </section>
      <section class="login-area">
        <div class="login-box">
          <div class="login-logo">🌱</div>
          <div class="login-kicker">FARMER LOGIN</div>
          <h2>${loginStep===1 ? "Welcome back" : "Verify your number"}</h2>
          <p class="login-desc">${loginStep===1 ? "Login using your mobile number. No password is required." : "Enter the OTP sent to your mobile number to continue."}</p>
          ${loginStep===1 ? `
            <form id="phoneForm">
              <label class="label">Mobile Number</label>
              <div class="phone-field"><span class="country">+91</span><input id="phone" maxlength="10" inputmode="numeric" placeholder="Enter 10-digit mobile number" /></div>
              <button class="main-btn">Send OTP →</button>
            </form>
          ` : `
            <form id="otpForm">
              <label class="label">6-Digit OTP</label>
              <input class="otp-field" id="otp" maxlength="6" inputmode="numeric" placeholder="Enter OTP" />
              <button class="main-btn">Verify & Continue →</button>
              <button type="button" class="secondary-btn" id="changePhone">Change mobile number</button>
            </form>
          `}
          <div id="loginMsg"></div>
          ${loginStep===2 ? `<div class="demo-note"><b>Demo mode:</b> use OTP <b>123456</b>. Real SMS/OTP can be connected to the backend later.</div>` : ""}
          <div class="login-bottom"><span>🔒 Secure login</span><span>•</span><span>Farmer friendly</span></div>
        </div>
      </section>
    </div>`;
  if(loginStep===1){
    document.getElementById("phoneForm").onsubmit = e => {
      e.preventDefault();
      const value = document.getElementById("phone").value.trim();
      if(!/^[6-9]\d{9}$/.test(value)){
        document.getElementById("loginMsg").innerHTML = `<div class="error">Please enter a valid 10-digit mobile number.</div>`;
        return;
      }
      phone=value; loginStep=2; render();
      setTimeout(()=>document.getElementById("otp")?.focus(),50);
    };
  }else{
    document.getElementById("otpForm").onsubmit = e => {
      e.preventDefault();
      const value = document.getElementById("otp").value.trim();
      if(value!=="123456"){
        document.getElementById("loginMsg").innerHTML = `<div class="error">Incorrect OTP. Please use 123456 for this demo.</div>`;
        return;
      }
      localStorage.setItem("farmerPhone",phone);
      screen="app"; activePage="home"; render();
    };
    document.getElementById("changePhone").onclick=()=>{loginStep=1;render()};
  }
}

function renderApp(){
  const masked = phone ? `+91 ${phone.slice(0,2)}••••••${phone.slice(-2)}` : "Farmer";
  app.innerHTML = `
  <div class="app">
    <aside class="sidebar">
      <div class="side-logo"><div class="brand-mark">🌾</div><div><strong>Smart Agriculture</strong><small>Farmer App</small></div></div>
      <nav class="nav">
        ${nav("home","⌂","Home")}${nav("crops","🌱","Crops")}${nav("weather","☀️","Weather")}${nav("market","📈","Market")}${nav("locations","📍","Locations")}
      </nav>
      <div class="side-footer"><div class="support"><b>Need help?</b><p>Choose a feature from the menu to explore your farm information.</p></div><button class="logout" id="logout">↪ Logout</button></div>
    </aside>
    <main class="content">
      <header class="top">
        <div><div class="kicker">${activePage==="locations"?"FARM LOCATIONS":"FARMER DASHBOARD"}</div><h1>${pageTitle()}</h1><p>${pageSubtitle()}</p></div>
        <div class="user-chip"><div class="avatar">👨‍🌾</div><div><strong>Farmer</strong><small>${masked}</small></div></div>
      </header>
      ${pageContent()}
    </main>
  </div>`;
  document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{activePage=b.dataset.page;renderApp()});
  document.getElementById("logout").onclick=()=>{screen="login";loginStep=1;phone="";render()};
  document.querySelectorAll(".feature").forEach(b=>b.onclick=()=>{activePage=b.dataset.page;renderApp()});
  document.querySelectorAll(".select-location").forEach(b=>b.onclick=()=>{selectedLocation=b.dataset.name;localStorage.setItem("farmLocation",selectedLocation);renderApp()});
  document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{locationFilter=b.dataset.filter;renderApp()});
  const search=document.getElementById("locationSearch");
  if(search) search.oninput=()=>renderLocations(search.value);
}

function nav(page,icon,label){return `<button class="nav-btn ${activePage===page?"active":""}" data-page="${page}"><span>${icon}</span>${label}</button>`}
function pageTitle(){return activePage==="home"?"Good morning, Farmer 👋":activePage[0].toUpperCase()+activePage.slice(1)}
function pageSubtitle(){return activePage==="home"?"Everything you need for smarter farming, in one place.":activePage==="locations"?"Select your farm area to view location-specific information.":"Simple information to help you make everyday farming decisions."}

function pageContent(){
  if(activePage==="locations") return locationsPage();
  if(activePage==="home") return dashboardPage();
  const data={
    crops:["🌱","Crop Information","Get crop details, growing guidance and seasonal information.","4","Active crops","Kharif • Rabi • Seasonal"],
    weather:["☀️","Weather","Check temperature, humidity, rainfall and useful weather updates.","28°C","Today","Partly cloudy"],
    market:["📈","Market Prices","Compare crop prices and market information before selling.","₹2,850","Average","Current sample price"]
  }[activePage];
  return `<div class="info-panel"><button class="back-btn" onclick="activePage='home';renderApp()">← Back to Dashboard</button><div style="margin-top:20px;font-size:35px">${data[0]}</div><h2>${data[1]}</h2><p>${data[2]}</p><div class="mini-grid"><div class="mini"><b>${data[4]}</b><span>${data[3]}</span></div><div class="mini"><b>Location</b><span style="font-size:14px">${selectedLocation}</span></div><div class="mini"><b>Status</b><span style="font-size:14px">Updated</span></div></div></div>`;
}

function dashboardPage(){
 return `
 <section class="stats">
  <div class="stat"><span class="stat-icon s-green">🌱</span><div><small>MY CROPS</small><strong>4</strong><em>Active crops</em></div></div>
  <div class="stat"><span class="stat-icon s-blue">🌤️</span><div><small>WEATHER</small><strong>28°C</strong><em>Partly cloudy</em></div></div>
  <div class="stat"><span class="stat-icon s-orange">📈</span><div><small>MARKET</small><strong>₹2,850</strong><em>Avg. crop price</em></div></div>
  <div class="stat"><span class="stat-icon s-purple">📍</span><div><small>LOCATION</small><strong style="font-size:14px">${selectedLocation}</strong><em>Farm area</em></div></div>
 </section>
 <section class="section-title"><div><div class="kicker">APP FEATURES</div><h2>What would you like to check?</h2></div><span class="muted">Tap a feature to continue</span></section>
 <section class="feature-grid">
  ${feature("crops","🌱","f-green","CROPS","Crop Information","Growing guidance, crop details and seasonal information.")}
  ${feature("weather","☀️","f-blue","WEATHER","Weather","Temperature, rainfall and useful weather updates.")}
  ${feature("market","📈","f-orange","MARKET","Market Prices","Check crop prices and compare market information.")}
  ${feature("soil","🪴","f-brown","SOIL","Soil Health","Keep soil observations and important field details.")}
  ${feature("alerts","🔔","f-purple","ALERTS","Farm Alerts","See reminders and important farming notifications.")}
  ${feature("locations","📍","f-teal","LOCATION","Farm Locations","Choose your village, town or district.")}
 </section>
 <div class="tip"><div class="tip-icon">💡</div><div><b>Today's farming tip</b><p>Check the weather before planning irrigation or spraying activities.</p></div><button onclick="activePage='weather';renderApp()">View weather →</button></div>
 <div class="footer"><span>🌿 Smart Agriculture System</span><span>Simple • Useful • Farmer Friendly</span></div>`;
}
function feature(page,icon,cls,tag,title,text){return `<button class="feature" data-page="${page}"><div class="f-icon ${cls}">${icon}</div><span class="tag">${tag}</span><h3>${title}</h3><p>${text}</p><span class="arrow">→</span></button>`}

function locationsPage(){
 const states=[...new Set(locations.map(x=>x.state))];
 return `<div class="location-head"><div><div class="kicker">CHOOSE YOUR AREA</div><h2 style="margin:5px 0 0">Farm locations</h2></div><input id="locationSearch" class="search" placeholder="Search village, town or district..." /></div>
 <div class="location-tools"><button class="filter ${locationFilter==="ALL"?"active":""}" data-filter="ALL">All</button>${states.map(s=>`<button class="filter ${locationFilter===s?"active":""}" data-filter="${s}">${s.replace("ANDHRA PRADESH","AP").replace("TELANGANA","TELANGANA")}</button>`).join("")}</div>
 <div id="locationResults" class="location-grid">${locationCards()}</div>`;
}
function locationCards(query=""){
 const q=query.toLowerCase();
 return locations.filter(x=>(locationFilter==="ALL"||x.state===locationFilter)&&(x.name.toLowerCase().includes(q)||x.crop.toLowerCase().includes(q))).map(x=>`
 <article class="location-card"><div class="location-art">${x.icon}<span style="margin-left:auto;font-size:10px;color:#52715e">${x.state}</span></div><div class="location-body"><div class="state">${x.state}</div><h3>${x.name}</h3><p>Main crops: ${x.crop}</p>${selectedLocation===x.name?`<div class="selected-location">✓ Selected farm location</div>`:`<button class="select-location" data-name="${x.name}">Select this location</button>`}</div></article>`).join("") || `<div class="info-panel" style="grid-column:1/-1"><b>No locations found.</b><p>Try another village, town or district name.</p></div>`;
}
function renderLocations(query=""){const box=document.getElementById("locationResults");if(box)box.innerHTML=locationCards(query)}

render();
