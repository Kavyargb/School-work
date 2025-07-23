document.addEventListener('DOMContentLoaded', () => {

    const orrery = document.getElementById('orrery');
    if (orrery) {
        const sun = document.getElementById('sun');
        const mobileList = document.getElementById('mobile-list');
        const infoPanel = document.getElementById('info-panel');
        const orbitPathsContainer = document.getElementById('orbit-paths');
        const connectionLine = document.getElementById('connection-line');
        const root = document.documentElement;

        // --- Data updated from nav.js ---
        const portfolioData = [
            { id: 'math', name: 'Mathematics', baseMass: 10, rx: 0.18, ry: 0.174, offsetAngle: 90, baseSize: 19, color: '#f77a52', topics: [
                { name: 'Relations & Functions', href: 'Mathematics/RelnFunctions.html', type: 'notes' },
                { name: 'Inverse Trigonometry', href: 'Mathematics/InverseTrigo.html', type: 'notes' },
                { name: 'Matrices', href: 'Mathematics/Matrices.html', type: 'notes' },
                { name: 'Determinants', href: 'Mathematics/Determinants.html', type: 'notes' },
                { name: 'Continuity & Differentiability', href: 'Mathematics/ContinuityDifferentiability.html', type: 'notes' },
                { name: 'Application of Derivatives', href: 'Mathematics/AOD.html', type: 'notes' },
            ] },
            { id: 'chem', name: 'Chemistry', baseMass: 10, rx: 0.28, ry: 0.26, offsetAngle: 180, baseSize: 26, color: '#44a0e6', topics: [
                { name: 'Haloalkanes and Haloarenes', href: 'Chemistry/Haloalkanes and Haloarenes.html', type: 'notes' },
                { name: 'Alcohols, Phenols & Ethers', href: 'Chemistry/AlcoholsPhenolsEthers.html', type: 'notes' },
                { name: 'Solutions', href: 'Chemistry/Solutions.html', type: 'notes' },
                { name: 'Aldehydes, Ketones and Carboxylic Acids', href: 'Chemistry/Carbonyl.html', type: 'notes' },
                { name: 'Amines', href: 'Chemistry/Amines.html', type: 'notes' },
                { name: 'Biomolecules', href: 'Chemistry/Biomolecules.html', type: 'notes' },
                { name: 'Chemistry Project', href: 'Chemistry/CHEMISTRYPROJECT.html', type: 'project' },
                { name: 'Peter Sykes\'s Guidebook to Reaction Mechanism', href: 'Chemistry/PeterSkyes.html', type: 'notes' },
            ] },
            { id: 'phys', name: 'Physics', baseMass: 10, rx: 0.38, ry: 0.36, offsetAngle: 270, baseSize: 25, color: '#e6cf44', topics: [
                { name: 'Electric Charges and Field', href: 'Physics/ElectricChargesandField.html', type: 'notes' },
                { name: 'Electric Potential and Capacitance', href: 'Physics/ElectricPotentialAndCapacitance.html', type: 'notes' },
                { name: 'Current Electricity', href: 'Physics/CurrentElectricity.html', type: 'notes' },
                { name: 'Magnetic Field', href: 'Physics/mf1.html', type: 'notes' },
                { name: 'Magnetic Field due to a Current', href: 'Physics/mf2.html', type: 'notes' },
                { name: 'Holiday Homework Assignment', href: 'Physics/HWWAssignment.html', type: 'project' },
            ] },
            { id: 'cs', name: 'Computer Science', baseMass: 10, rx: 0.48, ry: 0.44, offsetAngle: 0, baseSize: 22, color: '#64ffda', topics: [
                { name: 'Basics of Class XI', href: 'Computer Science/BasicsofClassXI.html', type: 'notes' },
                { name: 'Functions', href: 'Computer Science/Functions.html', type: 'notes' },
                { name: 'MySQL', href: 'Computer Science/MySQL.html', type: 'notes' },
            ] },
            { id: 'eng', name: 'English', baseMass: 10, rx: 0.58, ry: 0.52, offsetAngle: 12, baseSize: 28, color: '#64ffda', topics: [
                { name: 'The Last Lesson', href: 'English/LastLesson.html', type: 'notes' },
                { name: 'My Mother at Sixty-Six', href: 'English/MyMotherAtSixtySix.html', type: 'notes' },
                { name: 'The Third Level', href: 'English/TheThirdLevel.html', type: 'notes' },
                { name: 'Lost Spring', href: 'English/LostSpring.html', type: 'notes' },
                { name: 'The Tiger King', href: 'English/TigerKing.html', type: 'notes' },
                { name: 'Keeping Quiet', href: 'English/KeepingQuiet.html', type: 'notes' },
                { name: 'Deep Water', href: 'English/DeepWater.html', type: 'notes' },
                { name: 'Grammar Work-1', href: 'English/GrammarWork-1.html', type: 'notes' },
            ] },
        ];
        // --- End of updated data ---

        const SUN_MASS = 1000;
        const WOBBLE_FACTOR = 1;
        const SPEED_CONSTANT = 5;

        let state = { activePlanetId: null, containerSize: 0, centerX: 0, centerY: 0, planets: [], lastTime: 0 };

        function initializeSystem() {
            const containerRect = orrery.getBoundingClientRect();
            state.containerSize = Math.min(containerRect.width, containerRect.height);
            state.centerX = containerRect.width / 2;
            state.centerY = containerRect.height / 2;
            orbitPathsContainer.innerHTML = '';
            document.querySelectorAll('.planet').forEach(p => p.remove());

            portfolioData.forEach(subject => {
                const totalMass = subject.baseMass + subject.topics.length;
                const size = subject.baseSize + Math.sqrt(subject.topics.length) * 3;
                const a = subject.rx * state.containerSize;
                const b = subject.ry * state.containerSize;
                const focalDistance = Math.sqrt(a * a - b * b);
                const orbitalSpeed = (SPEED_CONSTANT / a) * 0.001;
                const planetEl = document.createElement('div');
                planetEl.className = 'planet';
                planetEl.id = `planet-${subject.id}`;
                planetEl.style.width = `${size}px`;
                planetEl.style.height = `${size}px`;
                planetEl.style.background = subject.color;
                planetEl.innerHTML = `<div class="planet-label">${subject.name}</div>`;
                planetEl.addEventListener('click', (event) => { event.stopPropagation(); handlePlanetClick(subject.id); });

                if (subject.topics.length > 0) {
                    const moonOrbit = document.createElement('div');
                    moonOrbit.className = 'moon-orbit';
                    subject.topics.forEach((topic, i) => {
                        const angle = (360 / subject.topics.length) * i;
                        const moonOrbitRadius = 50;
                        const moon = document.createElement('div');
                        moon.className = `moon type-${topic.type}`;
                        moon.style.transform = `rotate(${angle}deg) translateX(${moonOrbitRadius}px)`;
                        moon.innerHTML = `<a href="${topic.href}" target="_blank" title="${topic.name}"></a><div class="moon-label">${topic.name}</div>`;
                        moonOrbit.appendChild(moon);
                    });
                    planetEl.appendChild(moonOrbit);
                }
                orrery.appendChild(planetEl);

                const orbitPath = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                orbitPath.setAttribute('class', 'orbit-path');
                orbitPath.setAttribute('id', `orbit-${subject.id}`);
                orbitPath.setAttribute('cx', state.centerX + focalDistance);
                orbitPath.setAttribute('cy', state.centerY);
                orbitPath.setAttribute('rx', a);
                orbitPath.setAttribute('ry', b);
                orbitPathsContainer.appendChild(orbitPath);
                state.planets.push({ ...subject, el: planetEl, angle: subject.offsetAngle * Math.PI / 180, a, b, focalDistance, totalMass, orbitalSpeed });
            });
        }

        function animationLoop(currentTime) {
            if (!state.lastTime) state.lastTime = currentTime;
            const deltaTime = currentTime - state.lastTime;
            state.lastTime = currentTime;
            let totalPullX = 0; let totalPullY = 0;
            state.planets.forEach(p => {
                p.angle += p.orbitalSpeed * deltaTime;
                const x = state.centerX + p.focalDistance + p.a * Math.cos(p.angle);
                const y = state.centerY + p.b * Math.sin(p.angle);
                p.el.style.left = `${x}px`; p.el.style.top = `${y}px`;
                p.el.style.transform = `translate(-50%, -50%)`;
                const pullVectorX = x - state.centerX;
                const pullVectorY = y - state.centerY;
                totalPullX += pullVectorX * p.totalMass;
                totalPullY += pullVectorY * p.totalMass;
                if (p.id === state.activePlanetId) {
                    connectionLine.setAttribute('x2', x);
                    connectionLine.setAttribute('y2', y);
                }
            });
            const sunWobbleX = (totalPullX / SUN_MASS) * WOBBLE_FACTOR;
            const sunWobbleY = (totalPullY / SUN_MASS) * WOBBLE_FACTOR;
            root.style.setProperty('--sun-wobble-x', `${sunWobbleX}px`);
            root.style.setProperty('--sun-wobble-y', `${sunWobbleY}px`);
            connectionLine.setAttribute('x1', state.centerX + sunWobbleX);
            connectionLine.setAttribute('y1', state.centerY + sunWobbleY);
            requestAnimationFrame(animationLoop);
        }

        function handlePlanetClick(subjectId) {
            state.activePlanetId === subjectId ? unfocusAll() : focusOnPlanet(subjectId);
        }

        function focusOnPlanet(subjectId) {
            unfocusAll(true);
            state.activePlanetId = subjectId;
            const subject = state.planets.find(s => s.id === subjectId);
            if (!subject) return;
            subject.el.classList.add('is-active');
            document.getElementById(`orbit-${subject.id}`).classList.add('active-orbit');
            const focusX = (orrery.offsetWidth * 0.25 - subject.el.offsetLeft);
            const focusY = (orrery.offsetHeight / 2 - subject.el.offsetTop);
            root.style.setProperty('--focus-scale', '1.2');
            root.style.setProperty('--focus-x', `${focusX}px`);
            root.style.setProperty('--focus-y', `${focusY}px`);
            connectionLine.classList.add('is-visible');
            orrery.classList.add('is-focused');
            updateInfoPanel(subjectId);
        }

        function unfocusAll(isSoft = false) {
            state.activePlanetId = null;
            document.querySelectorAll('.planet.is-active, .orbit-path.active-orbit').forEach(el => el.classList.remove('is-active', 'active-orbit'));
            if (!isSoft) {
                root.style.setProperty('--focus-scale', '1');
                root.style.setProperty('--focus-x', '0px');
                root.style.setProperty('--focus-y', '0px');
                orrery.classList.remove('is-focused');
                updateInfoPanel(null);
            }
            connectionLine.classList.remove('is-visible');
        }

        function updateInfoPanel(subjectId) {
            if (!subjectId) {
                infoPanel.classList.remove('is-visible');
                setTimeout(() => { if (!state.activePlanetId) infoPanel.innerHTML = ''; }, 1200);
                return;
            }
            const subject = portfolioData.find(s => s.id === subjectId);
            if (!subject) return;
            let topicsHtml = '<ul>';
            if (subject.topics.length > 0) {
                subject.topics.forEach(topic => { topicsHtml += `<li><a href="${topic.href}" target="_blank" class="type-${topic.type}">${topic.name}</a></li>`; });
            } else {
                topicsHtml += `<li><p>Notes & projects are being uploaded.</p></li>`;
            }
            topicsHtml += '</ul>';
            infoPanel.innerHTML = `<h2>${subject.name}</h2>${topicsHtml}<p class="close-hint">Click the planet, sun, or background to reset view.</p>`;
            infoPanel.classList.add('is-visible');
        }

        const generateMobileList = () => {
            portfolioData.forEach(subject => {
                const subjectDiv = document.createElement('div');
                let topicsHtml = '<ul>';
                if (subject.topics.length > 0) {
                    subject.topics.forEach(topic => { topicsHtml += `<li><a href="${topic.href}" target="_blank">${topic.name}</a></li>`; });
                } else {
                    topicsHtml += `<li>Notes coming soon...</li>`;
                }
                topicsHtml += '</ul>';
                subjectDiv.innerHTML = `<h2>${subject.name}</h2>${topicsHtml}`;
                mobileList.appendChild(subjectDiv);
            });
        };

        sun.addEventListener('click', (e) => { e.stopPropagation(); unfocusAll(); });
        orrery.addEventListener('click', (e) => { if (e.target === orrery || e.target.closest('svg')) unfocusAll(); });
        window.addEventListener('resize', initializeSystem);

        initializeSystem();
        generateMobileList();
        requestAnimationFrame(animationLoop);
    }
});