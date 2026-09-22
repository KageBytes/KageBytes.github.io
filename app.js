const GITHUB_ORG_NAME = "KageBytes";
const WORKER_URL = "https://your-worker.your-subdomain.workers.dev"; // Will replace when backend is ready

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  initThemeToggle();
  fetchOrgMembers();
  initFormHandler();
});

/* Theme Switcher */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";

  document.documentElement.setAttribute("data-theme", currentTheme);

  toggleBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = activeTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/* GitHub Members Fetch */
async function fetchOrgMembers() {
  const container = document.getElementById("members-grid");

  try {
    const response = await fetch(`https://api.github.com/orgs/${GITHUB_ORG_NAME}/members`);
    
    if (!response.ok) throw new Error();

    const members = await response.json();

    if (members.length === 0) {
      container.innerHTML = '<p class="status-text">No public members found.</p>';
      return;
    }

    container.innerHTML = members.map(m => `
      <a href="${m.html_url}" target="_blank" rel="noopener noreferrer" class="member-card">
        <img src="${m.avatar_url}" alt="${m.login}" class="member-avatar" />
        <span class="member-name">${m.login}</span>
      </a>
    `).join("");

  } catch {
    container.innerHTML = '<p class="status-text">Unable to load members.</p>';
  }
}

/* Form Submission */
function initFormHandler() {
  const form = document.getElementById("join-form");
  const msgContainer = document.getElementById("form-message");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      reason: document.getElementById("reason").value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    msgContainer.className = "status-message";
    msgContainer.textContent = "";

    try {
      /* Connected when backend is set up:
      const res = await fetch(`${WORKER_URL}/api/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      */

      await new Promise(r => setTimeout(r, 800)); // Simulated delay

      msgContainer.className = "status-message success";
      msgContainer.textContent = "Application submitted.";
      form.reset();
    } catch {
      msgContainer.className = "status-message error";
      msgContainer.textContent = "Submission failed.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }
  });
}
