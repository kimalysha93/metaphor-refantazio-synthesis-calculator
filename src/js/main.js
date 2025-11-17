// Dynamic dependent selects for the Select panel
// - When the `select-lin-a` value changes, `select-arch-a` options are updated.
// - No form submission is required; this works purely with event listeners.

document.addEventListener('DOMContentLoaded', () => {
		const lineageSelectA = document.getElementById('select-lin-a');
		const archetypeSelectA = document.getElementById('select-arch-a');
		const lineageSelectB = document.getElementById('select-lin-b');
		const archetypeSelectB = document.getElementById('select-arch-b');
		const resultsContent = document.getElementById('results-content');

		// Mapping from lineage value -> array of { value, label } for archetypes
		// Edit this object to match your real lineage -> archetype relationships.
		const archetypeMap = {
			// example values; replace with real keys and options
			'seeker': [
				{ value: 'magic-seeker', label: 'Magic Seeker' },
				{ value: 'soul-hacker', label: 'Soul Hacker' }
			],
			'knight': [
				{ value: 'magic-knight', label: 'Magic Knight' },
				{ value: 'paladin', label: 'Paladin' },
				{ value: 'dark-knight', label: 'Dark Knight' },
				{ value: 'royal-knight', label: 'Royal Knight' }
			]
			// add more mappings as needed
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
			placeholder.textContent = lineageValue ? '-- choose archetype --' : '-- choose lineage first --';
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

		async function sendSelections() {
			if (!resultsContent) return;
			// collect selections (supporting optional B selects)
			const selections = [];
			if (lineageSelectA) selections.push({ lineage: lineageSelectA.value || '', archetype: (archetypeSelectA ? archetypeSelectA.value : '') || '' });
			if (lineageSelectB) selections.push({ lineage: lineageSelectB.value || '', archetype: (archetypeSelectB ? archetypeSelectB.value : '') || '' });

			// Show loading state
			resultsContent.textContent = 'Loading...';

			try {
				const resp = await fetch('/api/evaluate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ selections })
				});

				if (!resp.ok) {
					const txt = await resp.text();
					resultsContent.textContent = 'Error: ' + txt;
					return;
				}

				const data = await resp.json();
				renderResults(data);
			} catch (err) {
				resultsContent.textContent = 'Network error: ' + err.message;
			}
		}

		function renderResults(data) {
			if (!resultsContent) return;
			if (!data || !data.results) {
				resultsContent.textContent = 'No results.';
				return;
			}

			// Build simple HTML for results
			const list = document.createElement('div');
			list.className = 'results-list';

			data.results.forEach((r, idx) => {
				const item = document.createElement('div');
				item.className = 'result-item';
				item.innerHTML = `<strong>Selection ${idx + 1}:</strong> Lineage = ${escapeHtml(r.lineage)}, Archetype = ${escapeHtml(r.archetype)} — Score = ${escapeHtml(String(r.score))}`;
				list.appendChild(item);
			});

			// replace content
			resultsContent.innerHTML = '';
			resultsContent.appendChild(list);
		}

		function escapeHtml(s) {
			if (!s) return '';
			return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		}

		// Initialize selects if present
		populateArchetypes(lineageSelectA ? lineageSelectA.value : '', archetypeSelectA);
		populateArchetypes(lineageSelectB ? lineageSelectB.value : '', archetypeSelectB);

		// Events: update archetypes and then send selections to backend
		if (lineageSelectA) {
			lineageSelectA.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectA);
				sendSelections();
			});
		}
		if (archetypeSelectA) {
			archetypeSelectA.addEventListener('change', () => sendSelections());
		}

		if (lineageSelectB) {
			lineageSelectB.addEventListener('change', (e) => {
				populateArchetypes(e.target.value, archetypeSelectB);
				sendSelections();
			});
		}
		if (archetypeSelectB) {
			archetypeSelectB.addEventListener('change', () => sendSelections());
		}

		// initial send to populate results if any
		sendSelections();
	});