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

let fieldCount = 3;
const maxFields = 7;
const fieldRotationContainer = document.getElementById('field-rotation-container');
const addFieldBtn = document.getElementById('addFieldBtn');

function createFieldItem(fieldNumber)
{
  const fieldItem = document.createElement('div');
  fieldItem.className = 'field-item';
  fieldItem.dataset.fieldNumber = fieldNumber;
  
  fieldItem.innerHTML = `
    <div class="field-item-header">
      <div class="field-number">${fieldNumber}</div>
      <div class="form-group" style="flex: 2;">
        <select class="form-select" id="field${fieldNumber}">
          <option>None</option>
          <option>Pine Tree</option>
          <option>Blue Flower</option>
          <option>Pumpkin</option>
          <option>Sunflower</option>
          <option>Strawberry</option>
          <option>Bamboo</option>
          <option>Dandelion</option>
          <option>Spider</option>
          <option>Clover</option>
          <option>Mushroom</option>
          <option>Rose</option>
          <option>Cactus</option>
          <option>Coconut</option>
          <option>Mountain Top</option>
          <option>Pepper</option>
          <option>Pineapple</option>
        </select>
      </div>
      <button class="btn btn-secondary btn-small">Copy</button>
      <button class="btn btn-secondary btn-small">Paste</button>
      <button class="btn btn-danger btn-small remove-field-btn">Remove</button>
    </div>

    <div class="field-sections">
      <div class="field-section">
        <div class="field-section-title">Gathering</div>
        <div class="checkbox-wrapper">
          <input type="checkbox" id="drift${fieldNumber}">
          <label for="drift${fieldNumber}" class="checkbox-label">Drift Comp</label>
        </div>
      </div>

      <div class="field-section">
        <div class="field-section-title">Pattern</div>
        <div class="control-group">
          <div class="control-label">Pattern Shape</div>
          <select class="form-select">
            <option>Diamonds</option>
            <option>e_lol</option>
            <option>Snake</option>
            <option>Squares</option>
            <option>Stationary</option>
            <option>SuperCat</option>
          </select>
        </div>
        <div class="control-group">
          <div class="control-label">Length</div>
          <input type="number" class="number-input" value="3" min="1" max="9">
        </div>
        <div class="control-group">
          <div class="control-label">Width</div>
          <input type="number" class="number-input" value="2" min="1" max="9">
        </div>
        <div class="checkbox-wrapper">
          <input type="checkbox" id="shift${fieldNumber}">
          <label for="shift${fieldNumber}" class="checkbox-label">Gather w/Shift-Lock</label>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="control-label" style="margin: 0;">Invert:</span>
          <div class="checkbox-wrapper" style="flex: 1;">
            <input type="checkbox" id="invertFB${fieldNumber}">
            <label for="invertFB${fieldNumber}" class="checkbox-label">F/B</label>
          </div>
          <div class="checkbox-wrapper" style="flex: 1;">
            <input type="checkbox" id="invertLR${fieldNumber}">
            <label for="invertLR${fieldNumber}" class="checkbox-label">L/R</label>
          </div>
        </div>
      </div>

      <div class="field-section">
        <div class="field-section-title">Until</div>
        <div class="control-group">
          <div class="control-label">Mins</div>
          <input type="number" class="number-input" value="30" min="0">
        </div>
        <div class="control-group">
          <div class="control-label">Pack %</div>
          <div class="control-input-group">
            <button class="btn btn-secondary btn-icon">-</button>
            <input type="text" class="number-input" value="95" readonly>
            <button class="btn btn-secondary btn-icon">+</button>
          </div>
        </div>
        <div class="control-group">
          <div class="control-label">Rotate Camera</div>
          <div class="control-input-group">
            <button class="btn btn-secondary btn-icon">&lt;</button>
            <input type="text" class="number-input" value="None" readonly>
            <button class="btn btn-secondary btn-icon">&gt;</button>
          </div>
        </div>
        <div class="control-group">
          <div class="control-label">Times</div>
          <input type="number" class="number-input" value="2" min="1" max="4">
        </div>
        <div class="control-group">
          <div class="control-label">To Hive By</div>
          <div class="control-input-group">
            <button class="btn btn-secondary btn-icon">&lt;</button>
            <input type="text" class="number-input" value="Walk" readonly>
            <button class="btn btn-secondary btn-icon">&gt;</button>
          </div>
        </div>
      </div>

      <div class="field-section">
        <div class="field-section-title">Sprinkler</div>
        <div class="control-group">
          <div class="control-label">Start Location</div>
          <div class="control-input-group">
            <button class="btn btn-secondary btn-icon">&lt;</button>
            <input type="text" class="number-input" value="Center" readonly>
            <button class="btn btn-secondary btn-icon">&gt;</button>
          </div>
        </div>
        <div class="control-group">
          <div class="control-label">Distance</div>
          <input type="number" class="number-input" value="10" min="0">
        </div>
      </div>
    </div>
  `;
  
  const removeBtn = fieldItem.querySelector('.remove-field-btn');
  removeBtn.addEventListener('click', () => removeField(fieldItem));
  
  return fieldItem;
}

function updateAddButtonText()
{
  addFieldBtn.innerHTML = `
    <i data-lucide="plus" style="width: 16px; height: 16px; margin-right: 5px;"></i>
    Add Field (${fieldCount}/7)
  `;
  lucide.createIcons();
  
  if (fieldCount >= maxFields)
  {
    addFieldBtn.disabled = true;
    addFieldBtn.style.opacity = '0.5';
    addFieldBtn.style.cursor = 'not-allowed';
  }
  else
  {
    addFieldBtn.disabled = false;
    addFieldBtn.style.opacity = '1';
    addFieldBtn.style.cursor = 'pointer';
  }
}

function removeField(fieldItem)
{
  if (fieldCount <= 1)
  {
    alert('You must have at least 1 field!');
    return;
  }
  
  fieldItem.remove();
  fieldCount--;
  updateAddButtonText();
  renumberFields();
}

function renumberFields()
{
  const fields = fieldRotationContainer.querySelectorAll('.field-item');
  fields.forEach((field, index) =>
  {
    const number = index + 1;
    field.dataset.fieldNumber = number;
    field.querySelector('.field-number').textContent = number;
    
    const fieldSelect = field.querySelector('.form-select');
    if (fieldSelect)
    {
      fieldSelect.id = `field${number}`;
    }
  });
}

addFieldBtn.addEventListener('click', () =>
{
  if (fieldCount >= maxFields)
  {
    return;
  }
  
  fieldCount++;
  const newField = createFieldItem(fieldCount);
  fieldRotationContainer.appendChild(newField);
  updateAddButtonText();
  
  lucide.createIcons();
});

document.querySelectorAll('.remove-field-btn').forEach(btn =>
{
  btn.addEventListener('click', () =>
  {
    const fieldItem = btn.closest('.field-item');
    removeField(fieldItem);
  });
});

async function loadGatherConfig()
{
  try
  {
    const result = await window.electronAPI.loadConfig();
    
    if (result.success && result.config && result.config.Gather)
    {
      const gatherConfig = result.config.Gather;
      
      for (let i = 1; i <= 3; i++)
      {
        const fieldSelect = document.getElementById(`field${i}`);
        if (fieldSelect && gatherConfig[`FieldName${i}`])
        {
          fieldSelect.value = gatherConfig[`FieldName${i}`];
        }
        
        const driftCheck = document.getElementById(`drift${i}`);
        if (driftCheck && gatherConfig[`FieldDriftCheck${i}`] !== undefined)
        {
          driftCheck.checked = gatherConfig[`FieldDriftCheck${i}`] === '1';
        }
        
        const shiftCheck = document.getElementById(`shift${i}`);
        if (shiftCheck && gatherConfig[`FieldPatternShift${i}`] !== undefined)
        {
          shiftCheck.checked = gatherConfig[`FieldPatternShift${i}`] === '1';
        }
        
        const invertFB = document.getElementById(`invertFB${i}`);
        if (invertFB && gatherConfig[`FieldPatternInvertFB${i}`] !== undefined)
        {
          invertFB.checked = gatherConfig[`FieldPatternInvertFB${i}`] === '1';
        }
        
        const invertLR = document.getElementById(`invertLR${i}`);
        if (invertLR && gatherConfig[`FieldPatternInvertLR${i}`] !== undefined)
        {
          invertLR.checked = gatherConfig[`FieldPatternInvertLR${i}`] === '1';
        }
      }
      
      console.log('Gather config loaded successfully');
    }
  }
  catch (error)
  {
    console.error('Error loading gather config:', error);
  }
}

function setupGatherFieldListeners()
{
  for (let i = 1; i <= 7; i++)
  {
    const fieldSelect = document.getElementById(`field${i}`);
    if (fieldSelect)
    {
      fieldSelect.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Gather', `FieldName${i}`, fieldSelect.value);
        console.log(`Saved FieldName${i}:`, fieldSelect.value);
      });
    }
    
    const driftCheck = document.getElementById(`drift${i}`);
    if (driftCheck)
    {
      driftCheck.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Gather', `FieldDriftCheck${i}`, driftCheck.checked ? '1' : '0');
        console.log(`Saved FieldDriftCheck${i}:`, driftCheck.checked);
      });
    }
    
    const shiftCheck = document.getElementById(`shift${i}`);
    if (shiftCheck)
    {
      shiftCheck.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Gather', `FieldPatternShift${i}`, shiftCheck.checked ? '1' : '0');
        console.log(`Saved FieldPatternShift${i}:`, shiftCheck.checked);
      });
    }
    
    const invertFB = document.getElementById(`invertFB${i}`);
    if (invertFB)
    {
      invertFB.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Gather', `FieldPatternInvertFB${i}`, invertFB.checked ? '1' : '0');
        console.log(`Saved FieldPatternInvertFB${i}:`, invertFB.checked);
      });
    }
    
    const invertLR = document.getElementById(`invertLR${i}`);
    if (invertLR)
    {
      invertLR.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Gather', `FieldPatternInvertLR${i}`, invertLR.checked ? '1' : '0');
        console.log(`Saved FieldPatternInvertLR${i}:`, invertLR.checked);
      });
    }
  }
}

async function loadCollectKillConfig()
{
  try
  {
    const result = await window.electronAPI.loadConfig();
    
    if (result.success && result.config && result.config.Collect)
    {
      const collectConfig = result.config.Collect;
      
      const configMapping = {
        'clockCheck': 'ClockCheck',
        'mondoCheck': 'MondoBuffCheck',
        'antPassCheck': 'AntPassCheck',
        'antPassBuyCheck': 'AntPassBuyCheck',
        'roboPassCheck': 'RoboPassCheck',
        'honeystormCheck': 'HoneystormCheck',
        'honeyDisCheck': 'HoneyDisCheck',
        'treatDisCheck': 'TreatDisCheck',
        'blueberryCheck': 'BlueberryDisCheck',
        'strawberryCheck': 'StrawberryDisCheck',
        'coconutCheck': 'CoconutDisCheck',
        'royalJellyCheck': 'RoyalJellyDisCheck',
        'glueDisCheck': 'GlueDisCheck',
        'normalMMCheck': 'NormalMemoryMatchCheck',
        'megaMMCheck': 'MegaMemoryMatchCheck',
        'extremeMMCheck': 'ExtremeMemoryMatchCheck',
        'nightMMCheck': 'NightMemoryMatchCheck',
        'winterMMCheck': 'WinterMemoryMatchCheck',
        'blenderCheck': 'BlenderCheck',
        'beesmasInterrupt': 'BeesmasGatherInterruptCheck',
        'stockingsCheck': 'StockingsCheck',
        'wreathCheck': 'WreathCheck',
        'feastCheck': 'FeastCheck',
        'rbpDelevelCheck': 'RBPDelevelCheck',
        'gingerbreadCheck': 'GingerbreadCheck',
        'snowMachineCheck': 'SnowMachineCheck',
        'candlesCheck': 'CandlesCheck',
        'samovarCheck': 'SamovarCheck',
        'lidArtCheck': 'LidArtCheck',
        'gummyBeaconCheck': 'GummyBeaconCheck',
        'bugrunInterrupt': 'BugrunInterruptCheck',
        'ladybugsKill': 'BugrunLadybugsCheck',
        'ladybugsLoot': 'BugrunLadybugsLoot',
        'rhinoKill': 'BugrunRhinoBeetlesCheck',
        'rhinoLoot': 'BugrunRhinoBeetlesLoot',
        'spiderKill': 'BugrunSpiderCheck',
        'spiderLoot': 'BugrunSpiderLoot',
        'mantisKill': 'BugrunMantisCheck',
        'mantisLoot': 'BugrunMantisLoot',
        'scorpionsKill': 'BugrunScorpionsCheck',
        'scorpionsLoot': 'BugrunScorpionsLoot',
        'werewolfKill': 'BugrunWerewolfCheck',
        'werewolfLoot': 'BugrunWerewolfLoot',
        'stingerCheck': 'StingerCheck',
        'stingerDailyCheck': 'StingerDailyBonusCheck',
        'stingerClover': 'StingerCloverCheck',
        'stingerSpider': 'StingerSpiderCheck',
        'stingerCactus': 'StingerCactusCheck',
        'stingerRose': 'StingerRoseCheck',
        'stingerMountain': 'StingerMountainTopCheck',
        'stingerPepper': 'StingerPepperCheck',
        'tunnelCheck': 'TunnelBearCheck',
        'beetleCheck': 'KingBeetleCheck',
        'crabCheck': 'CocoCrabCheck',
        'snailCheck': 'StumpSnailCheck',
        'chickCheck': 'CommandoCheck'
      };
      
      const collectCheckboxes = Object.keys(configMapping);
      
      collectCheckboxes.forEach(checkboxId =>
      {
        const checkbox = document.getElementById(checkboxId);
        const configKey = configMapping[checkboxId];
        
        if (checkbox && configKey && collectConfig[configKey] !== undefined)
        {
          checkbox.checked = collectConfig[configKey] === '1';
        }
      });
      
      const mondoAction = document.getElementById('mondoAction');
      if (mondoAction && collectConfig.MondoAction)
      {
        mondoAction.value = collectConfig.MondoAction;
      }
      
      const mondoSecs = document.getElementById('mondoSecs');
      if (mondoSecs && collectConfig.MondoSecs)
      {
        mondoSecs.value = collectConfig.MondoSecs;
      }
      
      const antPassAction = document.getElementById('antPassAction');
      if (antPassAction && collectConfig.AntPassAction)
      {
        antPassAction.value = collectConfig.AntPassAction;
      }
      
      const chickTime = document.getElementById('chickTime');
      if (chickTime && collectConfig.ChickTime)
      {
        chickTime.value = collectConfig.ChickTime;
      }
      
      const monsterRespawn = document.getElementById('monsterRespawn');
      if (monsterRespawn && collectConfig.MonsterRespawnTime)
      {
        monsterRespawn.value = collectConfig.MonsterRespawnTime;
      }
      
      console.log('Collect/Kill config loaded successfully');
    }
  }
  catch (error)
  {
    console.error('Error loading collect/kill config:', error);
  }
}

function setupCollectKillListeners()
{
  const configMapping = {
    'clockCheck': 'ClockCheck',
    'mondoCheck': 'MondoBuffCheck',
    'antPassCheck': 'AntPassCheck',
    'antPassBuyCheck': 'AntPassBuyCheck',
    'roboPassCheck': 'RoboPassCheck',
    'honeystormCheck': 'HoneystormCheck',
    'honeyDisCheck': 'HoneyDisCheck',
    'treatDisCheck': 'TreatDisCheck',
    'blueberryCheck': 'BlueberryDisCheck',
    'strawberryCheck': 'StrawberryDisCheck',
    'coconutCheck': 'CoconutDisCheck',
    'royalJellyCheck': 'RoyalJellyDisCheck',
    'glueDisCheck': 'GlueDisCheck',
    'normalMMCheck': 'NormalMemoryMatchCheck',
    'megaMMCheck': 'MegaMemoryMatchCheck',
    'extremeMMCheck': 'ExtremeMemoryMatchCheck',
    'nightMMCheck': 'NightMemoryMatchCheck',
    'winterMMCheck': 'WinterMemoryMatchCheck',
    'blenderCheck': 'BlenderCheck',
    'beesmasInterrupt': 'BeesmasGatherInterruptCheck',
    'stockingsCheck': 'StockingsCheck',
    'wreathCheck': 'WreathCheck',
    'feastCheck': 'FeastCheck',
    'rbpDelevelCheck': 'RBPDelevelCheck',
    'gingerbreadCheck': 'GingerbreadCheck',
    'snowMachineCheck': 'SnowMachineCheck',
    'candlesCheck': 'CandlesCheck',
    'samovarCheck': 'SamovarCheck',
    'lidArtCheck': 'LidArtCheck',
    'gummyBeaconCheck': 'GummyBeaconCheck',
    'bugrunInterrupt': 'BugrunInterruptCheck',
    'ladybugsKill': 'BugrunLadybugsCheck',
    'ladybugsLoot': 'BugrunLadybugsLoot',
    'rhinoKill': 'BugrunRhinoBeetlesCheck',
    'rhinoLoot': 'BugrunRhinoBeetlesLoot',
    'spiderKill': 'BugrunSpiderCheck',
    'spiderLoot': 'BugrunSpiderLoot',
    'mantisKill': 'BugrunMantisCheck',
    'mantisLoot': 'BugrunMantisLoot',
    'scorpionsKill': 'BugrunScorpionsCheck',
    'scorpionsLoot': 'BugrunScorpionsLoot',
    'werewolfKill': 'BugrunWerewolfCheck',
    'werewolfLoot': 'BugrunWerewolfLoot',
    'stingerCheck': 'StingerCheck',
    'stingerDailyCheck': 'StingerDailyBonusCheck',
    'stingerClover': 'StingerCloverCheck',
    'stingerSpider': 'StingerSpiderCheck',
    'stingerCactus': 'StingerCactusCheck',
    'stingerRose': 'StingerRoseCheck',
    'stingerMountain': 'StingerMountainTopCheck',
    'stingerPepper': 'StingerPepperCheck',
    'tunnelCheck': 'TunnelBearCheck',
    'beetleCheck': 'KingBeetleCheck',
    'crabCheck': 'CocoCrabCheck',
    'snailCheck': 'StumpSnailCheck',
    'chickCheck': 'CommandoCheck'
  };
  
  Object.entries(configMapping).forEach(([id, key]) =>
  {
    const checkbox = document.getElementById(id);
    if (checkbox)
    {
      checkbox.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Collect', key, checkbox.checked ? '1' : '0');
        console.log(`Saved ${key}:`, checkbox.checked);
      });
    }
  });
}

async function loadBoostConfig()
{
  try
  {
    const result = await window.electronAPI.loadConfig();
    
    if (result.success && result.config && result.config.Boost)
    {
      const boostConfig = result.config.Boost;
      
      const fieldBooster1 = document.getElementById('fieldBooster1');
      if (fieldBooster1 && boostConfig.FieldBooster1)
      {
        fieldBooster1.value = boostConfig.FieldBooster1;
      }
      
      const fieldBooster2 = document.getElementById('fieldBooster2');
      if (fieldBooster2 && boostConfig.FieldBooster2)
      {
        fieldBooster2.value = boostConfig.FieldBooster2;
      }
      
      const fieldBooster3 = document.getElementById('fieldBooster3');
      if (fieldBooster3 && boostConfig.FieldBooster3)
      {
        fieldBooster3.value = boostConfig.FieldBooster3;
      }
      
      const fieldBoosterMins = document.getElementById('fieldBoosterMins');
      if (fieldBoosterMins && boostConfig.FieldBoosterMins)
      {
        fieldBoosterMins.value = boostConfig.FieldBoosterMins;
      }
      
      const boostChaserCheck = document.getElementById('boostChaserCheck');
      if (boostChaserCheck && boostConfig.BoostChaserCheck !== undefined)
      {
        boostChaserCheck.checked = boostConfig.BoostChaserCheck === '1';
      }
      
      for (let i = 2; i <= 7; i++)
      {
        const hotbarWhile = document.getElementById(`hotbarWhile${i}`);
        if (hotbarWhile && boostConfig[`HotbarWhile${i}`])
        {
          hotbarWhile.value = boostConfig[`HotbarWhile${i}`];
        }
      }
      
      const stickerStackCheck = document.getElementById('stickerStackCheck');
      if (stickerStackCheck && boostConfig.StickerStackCheck !== undefined)
      {
        stickerStackCheck.checked = boostConfig.StickerStackCheck === '1';
      }
      
      console.log('Boost config loaded successfully');
    }
  }
  catch (error)
  {
    console.error('Error loading boost config:', error);
  }
}

function setupBoostListeners()
{
  const fieldBoosterMins = document.getElementById('fieldBoosterMins');
  if (fieldBoosterMins)
  {
    fieldBoosterMins.addEventListener('change', async () =>
    {
      await window.electronAPI.saveConfig('Boost', 'FieldBoosterMins', fieldBoosterMins.value);
      console.log('Saved FieldBoosterMins:', fieldBoosterMins.value);
    });
  }
  
  const boostChaserCheck = document.getElementById('boostChaserCheck');
  if (boostChaserCheck)
  {
    boostChaserCheck.addEventListener('change', async () =>
    {
      await window.electronAPI.saveConfig('Boost', 'BoostChaserCheck', boostChaserCheck.checked ? '1' : '0');
      console.log('Saved BoostChaserCheck:', boostChaserCheck.checked);
    });
  }
  
  for (let i = 2; i <= 7; i++)
  {
    const hotbarWhile = document.getElementById(`hotbarWhile${i}`);
    if (hotbarWhile)
    {
      hotbarWhile.addEventListener('change', async () =>
      {
        await window.electronAPI.saveConfig('Boost', `HotbarWhile${i}`, hotbarWhile.value);
        console.log(`Saved HotbarWhile${i}:`, hotbarWhile.value);
      });
    }
  }
  
  const stickerStackCheck = document.getElementById('stickerStackCheck');
  if (stickerStackCheck)
  {
    stickerStackCheck.addEventListener('change', async () =>
    {
      await window.electronAPI.saveConfig('Boost', 'StickerStackCheck', stickerStackCheck.checked ? '1' : '0');
      console.log('Saved StickerStackCheck:', stickerStackCheck.checked);
    });
  }
}

setupGatherFieldListeners();
loadGatherConfig();

setupCollectKillListeners();
loadCollectKillConfig();

setupBoostListeners();
loadBoostConfig();

lucide.createIcons();
