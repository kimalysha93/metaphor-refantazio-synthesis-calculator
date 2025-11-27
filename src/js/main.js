import { calculateSynthesis } from './calculation.js';

// Dynamic dependent selects for the Select panel
// - When the `select-lin-a` value changes, `select-arch-a` options are updated.
// - No form submission is required; this works purely with event listeners.

document.addEventListener('DOMContentLoaded', () => {
		const lineageSelectA = document.getElementById('select-lin-a');
		const archetypeSelectA = document.getElementById('select-arch-a');
		const lineageSelectB = document.getElementById('select-lin-b');
		const archetypeSelectB = document.getElementById('select-arch-b');
		const lineageSelectC = document.getElementById('select-lin-c');
		const archetypeSelectC = document.getElementById('select-arch-c');
		const lineageSelectD = document.getElementById('select-lin-d');
		const archetypeSelectD = document.getElementById('select-arch-d');
		const resultsContent = document.getElementById('results-content');

		// Mapping from lineage value -> array of { value, label } for archetypes
		const archetypeMap = {
			
			'berserker':[
				{ value: 'destroyer', label: 'Destroyer' },
				{ value: 'royal-berserker', label: 'Royal Beserker' },
			],
			'brawler':[
				{ value: 'pugilist', label: 'Pugilist' },
				{ value: 'martial-artist', label: 'Martial Artist' },
			],
			'commander':[
				{ value: 'general', label: 'General' },
				{ value: 'warlord', label: 'Warlord' },
			],
			'faker':[
				{ value: 'trickster', label: 'Trickster' },
			],
			'gunner':[
				{ value: 'sniper', label: 'Sniper' },
				{ value: 'dragoon', label: 'Dragoon' },
			],
			'healer':[
				{ value: 'cleric', label: 'Cleric' },
				{ value: 'saviour', label: 'Savior' },
			],
			'knight': [
				{ value: 'magic-knight', label: 'Magic Knight' },
				{ value: 'paladin', label: 'Paladin' },
				{ value: 'dark-knight', label: 'Dark Knight' },
				{ value: 'royal-knight', label: 'Royal Knight' },
			],
			'mage':[
				{ value: 'wizard', label: 'Wizard' },
				{ value: 'elemental-master', label: 'Elemental Master' },
				{ value: 'warlock', label: 'Warlock' },
			],
			'masked-dancer':[
				{ value: 'persona-master', label: 'Persona Master' },
				{ value: 'royal-masked-dancer', label: 'Royal Masked Dancer' },
			],
			'merchant':[
				{ value: 'tycoon', label: 'Tycoon' },
			],
			'seeker': [
				{ value: 'magic-seeker', label: 'Magic Seeker' },
				{ value: 'soul-hacker', label: 'Soul Hacker' }
			],
			'summoner':[
				{ value: 'devil-summoner', label: 'Devil Summoner' },
				{ value: 'royal-summoner', label: 'Royal Summoner' },
			],
			'thief': [
				{ value: 'assassin', label: 'Assassin' },
				{ value: 'ninja', label: 'Ninja' },
				{ value: 'royal-thief', label: 'Royal Thief' },
			],
			'warrior': [
				{ value: 'swordmaster', label: 'Swordmaster' },
				{ value: 'samurai', label: 'Samurai' },
				{ value: 'royal-warrior', label: 'Royal Warrior' },
			]
		};

		function clearOptions(select) {
			if (!select) return;
			while (select.options.length > 0) {
				select.remove(0);
			}
		}

		function populateArchetypes(lineageValue, archetypeSelect) {
			if (!archetypeSelect) return;
			clearOptions(archetypeSelect);

			// Placeholder option
			const placeholder = document.createElement('option');
			placeholder.value = '';
			placeholder.textContent = lineageValue ? '-' : '-- choose lineage first --';
			archetypeSelect.appendChild(placeholder);

			const list = archetypeMap[lineageValue];
			if (!list || list.length === 0) {
				archetypeSelect.disabled = true;
				return;
			}

			archetypeSelect.disabled = false;
			list.forEach(opt => {
				const el = document.createElement('option');
				el.value = opt.value;
				el.textContent = opt.label;
				archetypeSelect.appendChild(el);
			});
		}


		function calculateResults() {
		
		const lineageCount = {
			"seeker":0,
			"mage":0,
			"warrior":0,
			"knight":0,
			"thief":0,
			"berserker":0,
			"brawler":0,
			"masked-dancer":0,
			"commander":0,
			"gunner":0,
			"summoner":0,
			"healer":0,
			"merchant":0,
			"faker":0,
			"prince":0
		}

		let royalCount = 0;

		if (archetypeSelectA.value && archetypeSelectA.value.startsWith('royal-')) royalCount += 1;
		if (archetypeSelectB.value && archetypeSelectB.value.startsWith('royal-')) royalCount += 1;
		if (archetypeSelectC.value && archetypeSelectC.value.startsWith('royal-')) royalCount += 1;
		if (archetypeSelectD.value && archetypeSelectD.value.startsWith('royal-')) royalCount += 1;
		// console.log("Royal count:", royalCount);

		const selections = [];
		if (lineageSelectA) selections.push({ lineage: lineageSelectA.value || '', archetype: (archetypeSelectA ? archetypeSelectA.value : '') || '' });
		if (lineageSelectB) selections.push({ lineage: lineageSelectB.value || '', archetype: (archetypeSelectB ? archetypeSelectB.value : '') || '' });
		if (lineageSelectC) selections.push({ lineage: lineageSelectC.value || '', archetype: (archetypeSelectC ? archetypeSelectC.value : '') || '' });
		if (lineageSelectD) selections.push({ lineage: lineageSelectD.value || '', archetype: (archetypeSelectD ? archetypeSelectD.value : '') || '' });

		if (lineageSelectA) lineageCount[lineageSelectA.value] += 1;
		if (lineageSelectB) lineageCount[lineageSelectB.value] += 1;
		if (lineageSelectC) lineageCount[lineageSelectC.value] += 1;
		if (lineageSelectD) lineageCount[lineageSelectD.value] += 1;

		var synthesisA = [];

		if (lineageSelectA.value && archetypeSelectA.value == '') {
			const instanceA = new calculateSynthesis(lineageSelectA.value, lineageSelectA.value, lineageCount, royalCount);
			synthesisA = instanceA.calculateSynthesis();
		} else if (lineageSelectA.value && archetypeSelectA.value) {
			const instanceA = new calculateSynthesis(lineageSelectA.value, archetypeSelectA.value, lineageCount, royalCount);
			synthesisA = instanceA.calculateSynthesis();
		}

		var synthesisB = [];

		if (lineageSelectB.value && archetypeSelectB.value == '') {
			const instanceB = new calculateSynthesis(lineageSelectB.value, lineageSelectB.value, lineageCount, royalCount);
			synthesisB = instanceB.calculateSynthesis();
		} else if (lineageSelectB.value && archetypeSelectB.value) {
			const instanceB = new calculateSynthesis(lineageSelectB.value, archetypeSelectB.value, lineageCount, royalCount);
			synthesisB = instanceB.calculateSynthesis();
		}

		var synthesisC = [];

		if (lineageSelectC.value && archetypeSelectC.value == '') {
			const instanceC = new calculateSynthesis(lineageSelectC.value, lineageSelectC.value, lineageCount, royalCount);
			synthesisC = instanceC.calculateSynthesis();
		} else if (lineageSelectC.value && archetypeSelectC.value) {
			const instanceC = new calculateSynthesis(lineageSelectC.value, archetypeSelectC.value, lineageCount, royalCount);
			synthesisC = instanceC.calculateSynthesis();
		}

		var synthesisD = [];

		if (lineageSelectD.value && archetypeSelectD.value == '') {
			const instanceD = new calculateSynthesis(lineageSelectD.value, lineageSelectD.value, lineageCount, royalCount);
			synthesisD = instanceD.calculateSynthesis();
		} else if (lineageSelectD.value && archetypeSelectD.value) {
			const instanceD = new calculateSynthesis(lineageSelectD.value, archetypeSelectD.value, lineageCount, royalCount);
			synthesisD = instanceD.calculateSynthesis();
		}
			//console.log('Synthesis A Skills:', synthesisA);
			
			//console.log('Lineage counts:', lineageCount);
			
		const results = selections.map((sel, idx) => {
			return {
				lineage: sel.lineage,
				archetype: sel.archetype,
				skills: (idx === 0) ? synthesisA : (idx === 1) ? synthesisB : (idx === 2) ? synthesisC : (idx === 3) ? synthesisD : []
			};
		});			renderResults({ results });

		}

		function renderResults(data) {
			if (!resultsContent) return;
			if (!data || !data.results) {
				resultsContent.textContent = 'No results yet. Select lineage and archetype to see results.';
				return;
			}

		// Ensure we render Selection A, B, C, D in that order
		const letters = ['A', 'B', 'C', 'D'];			const list = document.createElement('div');
			list.className = 'results-list';

			for (let i = 0; i < letters.length; i++) {
				const r = data.results[i] || { lineage: '', archetype: '', skills: [] };

				const sectionDiv = document.createElement('div');
				sectionDiv.className = 'result-section';

				// Header: Selection letter, Lineage and Archetype
				const header = document.createElement('div');
				header.className = 'result-header';
				if (r.lineage) {
					const lineageText = formatLineage(r.lineage);
					const archeText = r.archetype ? formatArchetype(r.archetype) : '';
					header.innerHTML = `<strong> ${escapeHtml(lineageText).toUpperCase()}</strong> ${escapeHtml(archeText)}`;
				} else {
					header.innerHTML = `No selection`;
				}
				sectionDiv.appendChild(header);

				// Skills list (only include name, description, party-requirement)
				if (r.skills && r.skills.length > 0) {
					const skillsList = document.createElement('ul');
					skillsList.className = 'skills-list';

					r.skills.forEach(skill => {
						const skillItem = document.createElement('li');
						skillItem.className = 'skill-item';
						const name = escapeHtml(skill.name || '');
						const desc = escapeHtml(skill.description || '');
						const req = escapeHtml(skill['party-requirement'] || '');
						skillItem.innerHTML = `
							<div class="skill-name">${name}</div>
							<div class="skill-description">${desc}</div>
							<div class="skill-requirement">${req}</div>
						`;
						skillsList.appendChild(skillItem);
					});

					sectionDiv.appendChild(skillsList);
				} else {
					const noSkills = document.createElement('p');
					noSkills.textContent = 'No synthesis skills available.';
					sectionDiv.appendChild(noSkills);
				}

				list.appendChild(sectionDiv);
			}

			// replace content
			resultsContent.innerHTML = '';
			resultsContent.appendChild(list);
		}

		function escapeHtml(s) {
			if (!s) return '';
			return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		}

		function formatLineage(value) {
			if (!value) return '';
			// Capitalize first letter: seeker -> Seeker
			return value.charAt(0).toUpperCase() + value.slice(1);
		}

		function formatArchetype(value) {
			if (!value) return '';
			// Remove dashes and capitalize each word: magic-knight -> Magic Knight
			return value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		}

	// Initialize selects if present
	populateArchetypes(lineageSelectA ? lineageSelectA.value : '', archetypeSelectA);
	populateArchetypes(lineageSelectB ? lineageSelectB.value : '', archetypeSelectB);
	populateArchetypes(lineageSelectC ? lineageSelectC.value : '', archetypeSelectC);
	populateArchetypes(lineageSelectD ? lineageSelectD.value : '', archetypeSelectD);

	// Events: update archetypes and then calculate results locally
		if (lineageSelectA) {
			lineageSelectA.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectA);
				calculateResults();
			});
		}
		if (archetypeSelectA) {
			archetypeSelectA.addEventListener('change', () => calculateResults());
		}

		if (lineageSelectB) {
			lineageSelectB.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectB);
				calculateResults();
			});
		}
		if (archetypeSelectB) {
			archetypeSelectB.addEventListener('change', () => calculateResults());
		}

		if (lineageSelectC) {
			lineageSelectC.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectC);
				calculateResults();
			});
		}
		if (archetypeSelectC) {
			archetypeSelectC.addEventListener('change', () => calculateResults());
		}

		if (lineageSelectD) {
			lineageSelectD.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectD);
				calculateResults();
			});
		}
		if (archetypeSelectD) {
			archetypeSelectD.addEventListener('change', () => calculateResults());
		}

		// initial calculation to populate results if any
		calculateResults();
	});