// Definition der API-Module basierend auf openapi.yaml
const apiModules = [
    {
        id: 'hr',
        name: 'HR (Personal)',
        endpoints: [
            {
                method: 'GET',
                path: '/hr/employees',
                summary: 'Liste aller Mitarbeiter abrufen',
                mockResponse: [
                    { id: '123-abc', firstName: 'Hans', lastName: 'Müller', jobTitle: 'Pflegefachmann', department: 'Station A' },
                    { id: '456-def', firstName: 'Petra', lastName: 'Schmid', jobTitle: 'Pflegeassistentin', department: 'Station B' }
                ]
            },
            {
                method: 'POST',
                path: '/hr/employees',
                summary: 'Neuen Mitarbeiter erstellen',
                mockResponse: { id: '789-ghi', firstName: 'Neu', lastName: 'Mitarbeiter', status: 'created' }
            },
            {
                method: 'POST',
                path: '/hr/time-tracking/clock-in',
                summary: 'Mitarbeiter einstempeln',
                mockResponse: { status: 'success', timestamp: new Date().toISOString() }
            }
        ]
    },
    {
        id: 'scheduling',
        name: 'Dienstplanung (GAV)',
        endpoints: [
            {
                method: 'GET',
                path: '/scheduling/roster',
                summary: 'Dienstplan abrufen',
                mockResponse: [
                    { id: 's1', employeeId: '123-abc', startTime: '2023-10-27T07:00:00', endTime: '2023-10-27T16:00:00', status: 'planned' },
                    { id: 's2', employeeId: '456-def', startTime: '2023-10-27T14:00:00', endTime: '2023-10-27T23:00:00', status: 'planned' }
                ]
            },
            {
                method: 'POST',
                path: '/scheduling/roster/generate',
                summary: 'Dienstplan GAV-konform generieren',
                mockResponse: { message: 'Generation started', jobId: 'job-999' }
            }
        ]
    },
    {
        id: 'residents',
        name: 'Bewohner',
        endpoints: [
            {
                method: 'GET',
                path: '/residents',
                summary: 'Bewohnerliste anzeigen',
                mockResponse: [
                    { id: 'r1', firstName: 'Gertrud', lastName: 'Bauer', roomNumber: '101', careLevel: 'BESA 3' },
                    { id: 'r2', firstName: 'Walter', lastName: 'Hofer', roomNumber: '102', careLevel: 'BESA 4' }
                ]
            },
            {
                method: 'POST',
                path: '/residents',
                summary: 'Neuen Bewohner aufnehmen',
                mockResponse: { id: 'r3', status: 'admitted' }
            }
        ]
    },
    {
        id: 'care-planning',
        name: 'Pflegeplanung',
        endpoints: [
            {
                method: 'GET',
                path: '/care/plans/{residentId}',
                summary: 'Pflegeplan abrufen',
                mockResponse: {
                    residentId: 'r1',
                    diagnoses: ['Hypertonie', 'Demenz'],
                    goals: [{ description: 'Mobilität erhalten', status: 'active' }]
                }
            }
        ]
    },
    {
        id: 'care-execution',
        name: 'Pflegedurchführung',
        endpoints: [
            {
                method: 'GET',
                path: '/care/tasks',
                summary: 'Tägliche Aufgaben abrufen',
                mockResponse: [
                    { id: 't1', description: 'Medikamente geben', time: '08:00', status: 'pending' },
                    { id: 't2', description: 'Wundversorgung', time: '10:00', status: 'pending' }
                ]
            }
        ]
    },
    {
        id: 'billing',
        name: 'Abrechnung',
        endpoints: [
            {
                method: 'POST',
                path: '/billing/invoices/generate',
                summary: 'Rechnungen generieren',
                mockResponse: { generatedCount: 124, batchId: 'batch-2023-10' }
            }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const navList = document.getElementById('nav-list');
    const contentArea = document.getElementById('content-area');
    const template = document.getElementById('endpoint-template');

    // Navigation aufbauen
    apiModules.forEach(module => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = module.name;
        button.onclick = () => loadModule(module, button);
        li.appendChild(button);
        navList.appendChild(li);
    });

    function loadModule(module, btn) {
        // Active State setzen
        document.querySelectorAll('.module-nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Content leeren
        contentArea.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = module.name;
        contentArea.appendChild(title);

        module.endpoints.forEach(endpoint => {
            const clone = template.content.cloneNode(true);

            const methodSpan = clone.querySelector('.method');
            methodSpan.textContent = endpoint.method;
            methodSpan.classList.add(endpoint.method.toLowerCase());

            clone.querySelector('.path').textContent = endpoint.path;
            clone.querySelector('.endpoint-summary').textContent = endpoint.summary;

            const executeBtn = clone.querySelector('.btn-execute');
            const responseDiv = clone.querySelector('.endpoint-response');
            const responseBody = clone.querySelector('.response-body');

            executeBtn.onclick = () => {
                responseDiv.classList.remove('hidden');
                responseBody.textContent = 'Lade...';

                // Simuliere Netzwerklatenz
                setTimeout(() => {
                    responseBody.textContent = JSON.stringify(endpoint.mockResponse, null, 2);
                }, 600);
            };

            contentArea.appendChild(clone);
        });
    }
});
