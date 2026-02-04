const API = "https://me-api-playground-zrps.onrender.com";

let PROJECTS = [];

// Load user profile
async function loadProfile() {
  const res = await fetch(`${API}/profile`);
  const data = await res.json();

  document.getElementById("name").innerText = data.name;
  document.getElementById("email").innerText = data.email;
  document.getElementById("education").innerText = data.education;
}

// Load skills and remove duplicates
async function loadSkills() {
  const res = await fetch(`${API}/skills`);
  const data = await res.json();

  // Deduplicate skills
  const uniqueSkills = [...new Set(data)];

  const ul = document.getElementById("skills");
  ul.innerHTML = "";

  uniqueSkills.forEach(skill => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute('href', `?skill=${skill}`);
    a.textContent = skill;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", `?skill=${skill}`);
      filterSkills();
    });

    li.appendChild(a);
    ul.appendChild(li);
  });
}

// Handle browser navigation (back/forward)
function handleRouteChange() {
  const params = new URLSearchParams(window.location.search);
  const skill = params.get("skill");

  if (skill) {
    filterSkills();
  } else {
    loadProjects();
  }
}

// Filter projects by skill
async function filterSkills() {
  const params = new URLSearchParams(window.location.search);
  const skill = params.get('skill');

  if (!skill) return;

  const res = await fetch(`${API}/projects/${skill}`);
  const data = await res.json();

  // Deduplicate projects
  PROJECTS = Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse);
  renderProjects();
}

// Load all projects
async function loadProjects() {
  const res = await fetch(`${API}/projects`);
  const data = await res.json();

  // Deduplicate projects
  PROJECTS = Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse);
  renderProjects();
}

// Render projects to DOM
function renderProjects() {
  const div = document.getElementById("projects");
  div.innerHTML = "";

  PROJECTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p[0]}</h3>
      <p>${p[1]}</p>
      <a href="${p[2]}" target="_blank">View</a>
    `;
    div.appendChild(card);
  });
}

// Listen for browser back/forward
window.addEventListener("popstate", () => {
  handleRouteChange();
});

// Initial load
loadProfile();
loadSkills();
loadProjects();
