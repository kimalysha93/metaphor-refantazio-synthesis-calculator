// Dynamic dependent selects for the Select panel
// - When the `select-lin-a` value changes, `select-arch-a` options are updated.
// - No form submission is required; this works purely with event listeners.

document.addEventListener('DOMContentLoaded', () => {
	const lineageSelectA = document.getElementById('select-lin-a');
	const archetypeSelectA = document.getElementById('select-arch-a');
    const lineageSelectB = document.getElementById('select-lin-b');
	const archetypeSelectB = document.getElementById('select-arch-b');


	if (!lineageSelectA || !archetypeSelectA) return;

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
            { value: 'royal-knight', label: 'Royal Knight' },
		]
		// add more mappings as needed
	};

	function clearOptions(select) {
		while (select.options.length > 0) {
			select.remove(0);
		}
	}

	function populateArchetypes(lineageValue, archetypeSelect) {
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

	// Initialize based on any pre-selected lineage
	populateArchetypes(lineageSelectA.value, archetypeSelectA);
    populateArchetypes(lineageSelectB.value, archetypeSelectB);

	lineageSelectA.addEventListener('change', (e) => {
		populateArchetypes(e.target.value, archetypeSelectA);
		// You can dispatch custom events or call other functions here to update results
		// e.g. updateResults();
	});

    lineageSelectB.addEventListener('change', (e) => {
		populateArchetypes(e.target.value, archetypeSelectB);
		// You can dispatch custom events or call other functions here to update results
		// e.g. updateResults();
	});
});