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
                    goals: [{ description: 'Mobilität erhalten', status: 'active' }],
                    activities: [
                        { description: 'Ganzkörperwaschung', time: '07:30' },
                        { description: 'Frühstück unterstützen', time: '08:00' },
                        { description: 'Medikamente richten', time: '08:15' },
                        { description: 'Mobilisation (Gehübungen)', time: '10:00' },
                        { description: 'Mittagessen', time: '12:00' },
                        { description: 'Ruhephase', time: '13:00' },
                        { description: 'Abendpflege', time: '19:00' }
                    ]
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
        const container = el('div', 'ui-card');
        container.style.overflowX = 'auto'; // Allow horizontal scrolling if needed

        // Header with resident info
        const header = el('div', 'ui-grid-key-value');
        header.innerHTML = `
            <span class="key">Bewohner ID:</span>
            <span>${data.residentId}</span>
        `;
        container.appendChild(header);

        // 7-Day View Container
        const calendarGrid = el('div', '');
        calendarGrid.style.display = 'grid';
        calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        calendarGrid.style.gap = '10px';
        calendarGrid.style.marginTop = '20px';

        const today = new Date();
        // Generate days: -2, -1, 0, +1, +2, +3, +4
        const days = [-2, -1, 0, 1, 2, 3, 4].map(offset => {
            const d = new Date(today);
            d.setDate(today.getDate() + offset);
            return {
                date: d,
                isToday: offset === 0,
                label: d.toLocaleDateString('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit' })
            };
        });

        days.forEach(day => {
            const col = el('div', 'calendar-day');
            col.style.border = '1px solid #eee';
            col.style.borderRadius = '8px';
            col.style.padding = '8px';
            col.style.backgroundColor = day.isToday ? '#e8f5e9' : '#fff'; // Green tint for today
            if (day.isToday) col.style.borderColor = '#4caf50';

            // Date Header
            const dateHeader = el('div', '', day.label);
            dateHeader.style.fontWeight = 'bold';
            dateHeader.style.textAlign = 'center';
            dateHeader.style.marginBottom = '10px';
            dateHeader.style.paddingBottom = '5px';
            dateHeader.style.borderBottom = '1px solid #ddd';
            if (day.isToday) dateHeader.style.color = '#2e7d32';

            col.appendChild(dateHeader);

            // Activities List
            const activitiesList = el('div', 'day-activities');
            if (data.activities && Array.isArray(data.activities)) {
                data.activities.forEach(act => {
                    const actItem = el('div', 'activity-item');
                    actItem.style.fontSize = '0.85rem';
                    actItem.style.padding = '4px';
                    actItem.style.marginBottom = '4px';
                    actItem.style.backgroundColor = '#f5f5f5';
                    actItem.style.borderRadius = '4px';

                    actItem.innerHTML = `
                        <div style="font-weight:bold; font-size: 0.75rem; color: #555;">${act.time}</div>
                        <div>${act.description}</div>
                    `;
                    col.appendChild(actItem);
                });
            }

            calendarGrid.appendChild(col);
        });

        container.appendChild(calendarGrid);
        return container;
    }

    // 9. Care Tasks
    if (endpoint.path === '/care/tasks') {
        const list = el('div', 'task-list');
        list.innerHTML = data.map(t => `
            <div class="task-item">
                <div>
                    <div style="font-weight:bold">${t.description}</div>
                    <small style="color:#666">Zeit: ${t.time}</small>
                </div>
                <span class="ui-badge warning">${t.status}</span>
            </div>
        `).join('');
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
