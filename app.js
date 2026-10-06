(() => {
  const $ = (selector) => document.querySelector(selector);
  const storeKey = 'ai-automation-agent-demo-v1';
  const form = $('#workflowForm');
  const input = $('#sampleInput');
  const nameInput = $('#workflowName');
  const actionInput = $('#action');
  const dialog = $('#infoDialog');
  let toastTimer;

  const readState = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storeKey) || '{}');
      return {
        runs: Number.isFinite(value.runs) ? value.runs : 0,
        workflows: Number.isFinite(value.workflows) ? value.workflows : 0,
        activity: Array.isArray(value.activity) ? value.activity.slice(0, 8) : [],
      };
    } catch {
      return { runs: 0, workflows: 0, activity: [] };
    }
  };
  let data = readState();

  function save() {
    try { localStorage.setItem(storeKey, JSON.stringify(data)); } catch { /* Storage can be disabled; the current page still works. */ }
    render();
  }

  function render() {
    $('#runCount').textContent = data.runs;
    $('#workflowCount').textContent = data.workflows;
    $('#charCount').textContent = `${input.value.length} / 1200`;
    const host = $('#activityRows');
    if (!data.activity.length) {
      host.innerHTML = '<div class="empty-row">No demo runs yet. Run a workflow above to add one.</div>';
      return;
    }
    host.innerHTML = data.activity.map((item) => `
      <div class="activity-row">
        <div><b>${escapeHtml(item.name)}</b><small>Local demo preview</small></div>
        <span>${escapeHtml(item.trigger)}</span>
        <span class="activity-state">${escapeHtml(item.result)}</span>
        <small>${escapeHtml(item.time)}</small>
      </div>`).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function showDialog(title, body, eyebrow = 'DEMO GUIDE') {
    $('#dialogTitle').textContent = title;
    $('#dialogEyebrow').textContent = eyebrow;
    $('#dialogBody').innerHTML = body;
    dialog.showModal();
  }

  function makePreview(action, text) {
    const clean = text.trim().replace(/\s+/g, ' ');
    if (!clean) return 'Add sample text above, then run the workflow again.';
    if (action === 'Draft a reply') {
      return `REPLY DRAFT — REVIEW BEFORE SENDING\n\nThanks for reaching out. I’ve received your message and will review the details. I’ll follow up with the next steps as soon as they’re confirmed.\n\nBased on sample input: “${clean.slice(0, 250)}${clean.length > 250 ? '…' : ''}”\n\nThis is a generic local preview. It has not been sent.`;
    }
    if (action === 'Summarize text') {
      const sentences = clean.match(/[^.!?]+[.!?]?/g) || [clean];
      const summary = sentences.slice(0, 2).join(' ').trim();
      return `SAMPLE SUMMARY\n\n${summary.slice(0, 420)}${summary.length > 420 ? '…' : ''}\n\nThis summary uses a simple local preview rule, not an AI model.`;
    }
    if (action === 'Classify priority') {
      const urgent = /urgent|asap|deadline|immediately|blocked|cannot access/i.test(clean);
      return `SAMPLE CLASSIFICATION\n\nSuggested priority: ${urgent ? 'HIGH' : 'NORMAL'}\nReason: ${urgent ? 'The sample text contains a term often associated with time sensitivity.' : 'No common urgency terms were found in the sample text.'}\n\nThis is a keyword-based suggestion, not an AI decision.`;
    }
    return `HANDOFF PREVIEW\n\nTopic: ${clean.slice(0, 120)}${clean.length > 120 ? '…' : ''}\nSuggested next step: A person reviews the details and chooses the appropriate owner.\n\nNo task or message was sent to another service.`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const action = actionInput.value;
    const trigger = $('#trigger').value;
    const preview = makePreview(action, input.value);
    $('#resultPlaceholder').hidden = true;
    const output = $('#resultOutput');
    output.hidden = false;
    output.textContent = preview;
    $('#runStatus').textContent = 'Local sample completed just now';
    $('#resultState').textContent = 'Preview ready';
    data.runs += 1;
    if (!data.activity.some((item) => item.name === nameInput.value.trim())) data.workflows += 1;
    data.activity.unshift({
      name: nameInput.value.trim() || 'Untitled workflow', trigger,
      result: action === 'Draft a reply' ? 'Draft prepared' : 'Preview prepared',
      time: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    });
    data.activity = data.activity.slice(0, 8);
    save();
    notify('Local preview is ready. Nothing was sent.');
  });

  input.addEventListener('input', () => { $('#charCount').textContent = `${input.value.length} / 1200`; });
  $('#clearActivity').addEventListener('click', () => {
    data.activity = [];
    data.runs = 0;
    data.workflows = 0;
    $('#resultPlaceholder').hidden = false;
    $('#resultOutput').hidden = true;
    $('#runStatus').textContent = 'Ready for a sample run';
    $('#resultState').textContent = 'Waiting';
    save();
    notify('Demo activity cleared from this browser.');
  });

  $('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    const light = document.body.classList.contains('light');
    $('#themeToggle').textContent = light ? '☾' : '☼';
    $('#themeToggle').setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    try { localStorage.setItem(`${storeKey}-theme`, light ? 'light' : 'dark'); } catch { /* optional preference */ }
  });
  try {
    if (localStorage.getItem(`${storeKey}-theme`) === 'light') {
      document.body.classList.add('light');
      $('#themeToggle').textContent = '☾';
      $('#themeToggle').setAttribute('aria-label', 'Switch to dark theme');
    }
  } catch { /* optional preference */ }

  $('#docsButton').addEventListener('click', () => showDialog('What this demo does', '<p>The page lets you choose a sample trigger and action, enter text, and see a local preview. It is designed to make a workflow understandable before you connect services.</p><ul><li>Choose a sample trigger and action.</li><li>Run the workflow to generate an in-browser preview.</li><li>Review the result before adapting it for a real service.</li></ul><p><b>Demo limitation:</b> no AI model, provider account, backend automation, or real email is connected.</p>'));
  $('#dialogOk').addEventListener('click', () => dialog.close());
  document.querySelectorAll('[data-guide]').forEach((button) => button.addEventListener('click', () => {
    const name = button.dataset.guide;
    showDialog(`${name} setup guide`, `<p><b>${escapeHtml(name)}</b> is shown as an integration example only. This public demo has no connected account.</p><ul><li>Choose an approved account and the minimum required permissions.</li><li>Store credentials on a protected server, never in browser code.</li><li>Add a human review step before sending or changing external data.</li></ul><p>These setup steps are guidance; the demo does not connect or transmit anything.</p>`, 'INTEGRATION GUIDE');
  }));

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  render();
})();
