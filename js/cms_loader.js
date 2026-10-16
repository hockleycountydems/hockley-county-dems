const OWNER = 'sunaxle';
const REPO = 'hockley-county-dems';
const BRANCH = 'main';

async function ghPut( targetPath, data, sha, message) {
  const currentToken = localStorage.getItem('gh_token');
  
  const bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
  const binString = String.fromCharCode(...bytes);
  const contentB64 = btoa(binString);
  const payload = { message, content: contentB64, branch: BRANCH };
  if (sha) payload.sha = sha;

  // FIXED LINE BELOW: Changed domain to api.github.com and added /repos/ with proper \${OWNER} syntax
  const res = await fetch(`https://github.com{OWNER}/${REPO}/contents/${targetPath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${currentToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function checkAuth() {
  const tokenInput = document.getElementById('token-input');
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  
  let currentToken = localStorage.getItem('gh_token');
  if (!currentToken && tokenInput && tokenInput.value) {
    currentToken = tokenInput.value.trim();
  }

  if (!currentToken) {
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    return;
  }

  try {
    const res = await fetch('https://github.com', {
    headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    if (res.ok) {
      localStorage.setItem('gh_token', currentToken);
      if (loginView) loginView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';
      if (typeof loadDashboardData === 'function') loadDashboardData();
    } else {
      localStorage.removeItem('gh_token');
      alert('Invalid GitHub Token. Please try again.');
      if (loginView) loginView.style.display = 'block';
      if (dashboardView) dashboardView.style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', checkAuth);
