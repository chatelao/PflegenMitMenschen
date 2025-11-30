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
                    {
                        id: 't1',
                        residentId: 'r1',
                        residentName: 'Gertrud Bauer',
                        description: 'Medikamente geben',
                        scheduledTime: '2023-10-27T08:00:00',
                        status: 'pending',
                        history: [
                            {
                                description: 'Frühstück helfen',
                                performedAt: '2023-10-27T07:30:00',
                                performedBy: '456-def',
                                performedByName: 'Petra Schmid'
                            },
                            {
                                description: 'Vitalzeichen messen',
                                performedAt: '2023-10-27T07:15:00',
                                performedBy: '123-abc',
                                performedByName: 'Hans Müller'
                            }
                        ]
                    },
                    {
                        id: 't2',
                        residentId: 'r1',
                        residentName: 'Gertrud Bauer',
                        description: 'Wundversorgung',
                        scheduledTime: '2023-10-27T10:00:00',
                        status: 'pending',
                        history: [
                             {
                                description: 'Medikamente geben',
                                performedAt: '2023-10-27T08:00:00',
                                performedBy: '123-abc', // Same user, should not show
                                performedByName: 'Hans Müller'
                            },
                            {
                                description: 'Morgenpflege',
                                performedAt: '2023-10-27T07:00:00',
                                performedBy: '456-def', // Different user, should show
                                performedByName: 'Petra Schmid'
                            }
                        ]
                    },
                    {
                        id: 't3',
                        residentId: 'r2',
                        residentName: 'Walter Hofer',
                        description: 'Insulin verabreichen',
                        scheduledTime: '2023-10-27T08:15:00',
                        status: 'pending',
                        history: []
                    }
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

/**
 * Generiert HTML-Elemente für die API-Antwort basierend auf dem Endpunkt.
 */
function renderResponse(endpoint, data) {
    const container = document.createElement('div');

    // Helper function to create safe text nodes
    const el = (tag, className, content) => {
        const e = document.createElement(tag);
        if (className) e.className = className;
        if (content) {
            if (typeof content === 'string') e.textContent = content;
            else e.appendChild(content);
        }
        return e;
    };

    // 1. HR: Employees List
    if (endpoint.path === '/hr/employees' && endpoint.method === 'GET') {
        if (!Array.isArray(data)) return el('pre', '', JSON.stringify(data, null, 2));

        const table = el('table', 'ui-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Titel</th>
                    <th>Abteilung</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(e => `
                    <tr>
                        <td>${e.firstName} ${e.lastName}</td>
                        <td>${e.jobTitle}</td>
                        <td>${e.department}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        return table;
    }

    // 2. HR: Create Employee
    if (endpoint.path === '/hr/employees' && endpoint.method === 'POST') {
        const card = el('div', 'ui-msg-box success');
        card.innerHTML = `
            <div class="ui-msg-large">Mitarbeiter erstellt</div>
            <div>ID: <strong>${data.id}</strong></div>
            <div>Name: ${data.firstName} ${data.lastName}</div>
            <div style="margin-top:5px"><span class="ui-badge success">Status: ${data.status}</span></div>
        `;
        return card;
    }

    // 3. HR: Clock In
    if (endpoint.path === '/hr/time-tracking/clock-in') {
        const card = el('div', 'ui-msg-box success');
        const time = new Date(data.timestamp).toLocaleTimeString('de-CH');
        card.innerHTML = `
            <div class="ui-msg-large">Eingestempelt</div>
            <div>Zeit: <strong>${time}</strong></div>
            <div style="margin-top:5px"><span class="ui-badge success">${data.status}</span></div>
        `;
        return card;
    }

    // 4. Scheduling: Roster
    if (endpoint.path === '/scheduling/roster' && endpoint.method === 'GET') {
        const table = el('table', 'ui-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>MA-ID</th>
                    <th>Start</th>
                    <th>Ende</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(s => {
                    const start = new Date(s.startTime).toLocaleString('de-CH');
                    const end = new Date(s.endTime).toLocaleTimeString('de-CH');
                    return `
                    <tr>
                        <td>${s.employeeId}</td>
                        <td>${start}</td>
                        <td>${end}</td>
                        <td><span class="ui-badge info">${s.status}</span></td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        return table;
    }

    // 5. Scheduling: Generate
    if (endpoint.path === '/scheduling/roster/generate') {
        const card = el('div', 'ui-msg-box info');
        card.innerHTML = `
            <div class="ui-msg-large">Planung gestartet</div>
            <div>${data.message}</div>
            <div style="margin-top:5px">Job ID: <code>${data.jobId}</code></div>
        `;
        return card;
    }

    // 6. Residents: List
    if (endpoint.path === '/residents' && endpoint.method === 'GET') {
        const table = el('table', 'ui-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Zimmer</th>
                    <th>Pflegestufe</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(r => `
                    <tr>
                        <td>${r.firstName} ${r.lastName}</td>
                        <td>${r.roomNumber}</td>
                        <td><span class="ui-badge warning">${r.careLevel}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        return table;
    }

    // 7. Residents: Admit
    if (endpoint.path === '/residents' && endpoint.method === 'POST') {
        const card = el('div', 'ui-msg-box success');
        card.innerHTML = `
            <div class="ui-msg-large">Bewohner aufgenommen</div>
            <div>ID: <strong>${data.id}</strong></div>
            <div style="margin-top:5px"><span class="ui-badge success">Status: ${data.status}</span></div>
        `;
        return card;
    }

    // 8. Care Plan
    if (endpoint.path === '/care/plans/{residentId}') {
        const card = el('div', 'ui-card');

        const diagnoses = data.diagnoses.map(d => `<div class="ui-list-item">${d}</div>`).join('');
        const goals = data.goals.map(g => `
            <div class="ui-list-item">
                <span>${g.description}</span>
                <span class="ui-badge primary">${g.status}</span>
            </div>`).join('');

        card.innerHTML = `
            <div class="ui-grid-key-value">
                <span class="key">Bewohner ID:</span>
                <span>${data.residentId}</span>
            </div>

            <div class="ui-section-title">Diagnosen</div>
            <div class="task-list">${diagnoses}</div>

            <div class="ui-section-title">Ziele</div>
            <div class="task-list">${goals}</div>
        `;
        return card;
    }

    // 9. Care Tasks
    if (endpoint.path === '/care/tasks') {
        const CURRENT_USER_ID = '123-abc';
        const list = el('div', 'task-list');

        // Sort by scheduledTime
        const sortedData = data.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

        list.innerHTML = sortedData.map(t => {
            const time = new Date(t.scheduledTime).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

            // Filter history: same resident, different employee
            // "Blende vor jeder Tätigkeit die vorangehenden 3 Tätigkeiten in Kurzfassung des selben Bewohner ein, falls diese nicht durch dieselbe Pflegekraft wahrgenommen wurde."
            const historyHtml = (t.history || [])
                .filter(h => h.performedBy !== CURRENT_USER_ID)
                .slice(-3) // Take last 3
                .map(h => {
                    const hTime = new Date(h.performedAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
                    return `
                        <div style="font-size: 0.85em; color: #666; margin-bottom: 4px; padding-left: 10px; border-left: 2px solid #ccc;">
                            <span style="font-weight:500">${h.description}</span>
                            <span style="margin-left:5px">(${hTime} - ${h.performedByName})</span>
                        </div>
                    `;
                }).join('');

            return `
            <div class="task-group" style="margin-bottom: 15px;">
                ${historyHtml}
                <div class="task-item" style="margin-top: 5px;">
                    <div>
                        <div style="font-weight:bold">${t.description}</div>
                        <div style="font-size: 0.9em; color: #444;">${t.residentName}</div>
                        <small style="color:#666">Richtzeit: ${time}</small>
                    </div>
                    <span class="ui-badge warning">${t.status}</span>
                </div>
            </div>
        `;
        }).join('');
        return list;
    }

    // 10. Billing: Invoices
    if (endpoint.path === '/billing/invoices/generate') {
        const card = el('div', 'ui-msg-box success');
        card.innerHTML = `
            <div class="ui-msg-large">Rechnungslauf beendet</div>
            <div class="generated-count" style="font-size: 2.5rem; font-weight: bold; margin: 15px 0; color: #155724;">${data.generatedCount}</div>
            <div>Rechnungen generiert</div>
            <div style="margin-top:10px; font-size: 0.8rem; color: #666">Batch ID: ${data.batchId}</div>
        `;
        return card;
    }

    // Fallback: JSON Dump
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.fontFamily = 'monospace';
    pre.textContent = JSON.stringify(data, null, 2);
    return pre;
}

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
            const responseContent = clone.querySelector('.response-content');

            executeBtn.onclick = () => {
                responseDiv.classList.remove('hidden');
                responseContent.innerHTML = '<div style="padding:10px; color:#666">Lade...</div>';

                // Simuliere Netzwerklatenz
                setTimeout(() => {
                    responseContent.innerHTML = '';
                    try {
                        const ui = renderResponse(endpoint, endpoint.mockResponse);
                        responseContent.appendChild(ui);
                    } catch (e) {
                        console.error(e);
                        responseContent.textContent = 'Fehler beim Rendern: ' + e.message;
                    }
                }, 600);
            };

            contentArea.appendChild(clone);
        });
    }
});
