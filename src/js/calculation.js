import skills from '../data/synthesis.json' with { type: 'json' };

export class calculateSynthesis {
    constructor(lineage, archetype, lineageCount, royalCount) {
        this.lineage = lineage;
        this.archetype = archetype;
        this.lineageCount = lineageCount;
        this.royalCount = royalCount;
        // console.log('Calculating synthesis for:', lineage, archetype, lineageCount);
    }

    test() {
        console.log(this.lineage);
        console.log(this.archetype);
        console.log(this.lineageCount);
        console.log('Loaded synthesis data:', skills);
    }

    calculateSynthesis(){
        // need to clone or else we modify the original counts
        const localLineageCount = structuredClone(this.lineageCount);
        localLineageCount[this.lineage] -= 1;
        //console.log('Adjusted lineage counts:', this.lineageCount);

        // dictionary of all skills in archetype
        //console.log('Loaded synthesis data:', skills);
        const possibleSkills = skills[this.lineage][this.archetype];
        //console.log('Possible skills for', this.lineage, this.archetype, possibleSkills);

        const synthesizedSkills = [];
        // Checking each skill in archetype
        for (const skillKey in possibleSkills) {
            const skill = possibleSkills[skillKey];
            const requirements = skill['count'];
            if (skillKey == "armaggedons-final-sire"){
                if (this.royalCount >= 3) {
                    synthesizedSkills.push(skills[this.lineage][this.archetype][skillKey]);
                }
            } else if (skill['count-2']) {
                // skill has two sets of requirements
                const requirements2 = skill['count-2'];
                for (const reqLineage in requirements) {
                    // if first set of requirements met
                    if (localLineageCount[reqLineage] >= requirements[reqLineage]) {
                        // remove requirement from cloned local lineage count and scheck second set of requirements
                        let tempLineageCount = structuredClone(localLineageCount);
                        tempLineageCount[reqLineage] -= requirements[reqLineage];
                        let metSecondRequirements = false;
                        for (const reqLineage2 in requirements2) {
                            if (tempLineageCount[reqLineage2] >= requirements2[reqLineage2]) {
                                // console.log(`Skill ${skillKey} can be synthesized.`);
                                synthesizedSkills.push(skills[this.lineage][this.archetype][skillKey]);
                                metSecondRequirements = true;
                                break;
                            }
                        }
                        if (metSecondRequirements) {
                            break;
                        }
                    }
                }
            } else {
                for (const reqLineage in requirements) {
                    if (localLineageCount[reqLineage] >= requirements[reqLineage]) {
                        // console.log(`Skill ${skillKey} can be synthesized.`);
                        synthesizedSkills.push(skills[this.lineage][this.archetype][skillKey]);
                    }
                }
            }
        }

        //console.log('Synthesized Skills:', synthesizedSkills);
        return synthesizedSkills;

    }
    
}