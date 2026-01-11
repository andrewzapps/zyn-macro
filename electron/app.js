const tabIcons = document.querySelectorAll('.tab-icon');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('pageTitle');

const tabTitles = 
{
  gather: 'Gathering',
  collect: 'Collect/Kill',
  boost: 'Boost',
  quests: 'Quests',
  planters: 'Planters',
  status: 'Status',
  settings: 'Settings',
  misc: 'Misc',
  credits: 'Credits'
};

tabIcons.forEach(icon => 
{
  icon.addEventListener('click', () => 
  {
    const tabName = icon.getAttribute('data-tab');
    
    tabIcons.forEach(i => i.classList.remove('active'));
    icon.classList.add('active');
    
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    pageTitle.textContent = tabTitles[tabName];
  });
});

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');
const currentFieldEl = document.getElementById('currentField');

startBtn.addEventListener('click', () => 
{
  const field1 = document.getElementById('field1').value;
  statusEl.textContent = `Starting macro...`;
  window.electronAPI.startMacro({ field: field1 });
});

pauseBtn.addEventListener('click', () => 
{
  statusEl.textContent = 'Paused';
  window.electronAPI.pauseMacro();
});

stopBtn.addEventListener('click', () => 
{
  statusEl.textContent = 'Stopped';
  window.electronAPI.stopMacro();
});

window.electronAPI.onMacroStarted((data) => 
{
  statusEl.textContent = 'Running';
});

window.electronAPI.onMacroStopped((data) => 
{
  statusEl.textContent = 'Stopped';
});

window.electronAPI.onMacroPaused((data) => 
{
  statusEl.textContent = 'Paused';
});

window.electronAPI.onMacroStatus((data) => 
{
  statusEl.textContent = data.status;
});

window.electronAPI.onMacroError((data) => 
{
  statusEl.textContent = `Error: ${data.error}`;
});

const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const subTabContents = document.querySelectorAll('.sub-tab-content');

subTabBtns.forEach(btn => 
{
  btn.addEventListener('click', () => 
  {
    const targetId = btn.getAttribute('data-subtab');
    
    btn.parentElement.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    subTabContents.forEach(content => 
    {
      if (content.id === targetId) 
      {
        content.classList.add('active');
      } 
      else 
      {
        content.classList.remove('active');
      }
    });
  });
});

lucide.createIcons();
