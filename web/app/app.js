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
                    { id: 't2', description: 'Wundversorgung', time: '10:00', status: 'pending' },
                    { id: 't3', description: 'Blutdruck messen', time: '12:00', status: 'pending' },
                    { id: 't4', description: 'Mittagessen begleiten', time: '12:30', status: 'pending' }
                ]
            },
            {
                method: 'PATCH',
                path: '/care/tasks/{taskId}',
                summary: 'Aufgabe aktualisieren (Status/Zeit)',
                mockResponse: { status: 'success' }
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

        // Special handling for Care Execution
        if (module.id === 'care-execution') {
            renderCareExecution(module);
            return;
        }

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

    function renderCareExecution(module) {
        const tasksEndpoint = module.endpoints.find(e => e.method === 'GET');
        // Deep copy to work with a fresh list each time module is loaded
        let tasks = JSON.parse(JSON.stringify(tasksEndpoint.mockResponse));

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="care-dashboard">
                <p>Aufgaben per Drag & Drop verschieben. Haken zum Bestätigen, X zum Ablehnen.</p>
                <div class="endpoint-header" style="margin-bottom: 1rem;">
                    <span class="method get">GET</span> <span class="path">/care/tasks</span>
                </div>
                <ul id="care-task-list" class="task-list"></ul>
            </div>
        `;
        contentArea.appendChild(container);

        const list = container.querySelector('#care-task-list');

        function renderList() {
            list.innerHTML = '';
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task-item ${task.status === 'completed' ? 'completed' : ''} ${task.status === 'cancelled' ? 'cancelled' : ''}`;
                li.draggable = true;
                li.dataset.index = index;
                li.dataset.id = task.id;

                li.innerHTML = `
                    <div class="task-info">
                        <span class="task-time">${task.time}</span>
                        <span class="task-desc">${task.description}</span>
                    </div>
                    <div class="task-actions">
                        ${task.status === 'pending' ? `
                            <button class="btn-confirm" title="Bestätigen">✓</button>
                            <button class="btn-deny" title="Ablehnen">✗</button>
                        ` : `<span>${task.status === 'completed' ? 'Erledigt' : 'Storniert'}</span>`}
                    </div>
                `;

                // Event Listeners for Buttons
                if (task.status === 'pending') {
                    li.querySelector('.btn-confirm').onclick = () => updateTaskStatus(index, 'completed');
                    li.querySelector('.btn-deny').onclick = () => updateTaskStatus(index, 'cancelled');
                }

                // Drag Events
                li.addEventListener('dragstart', handleDragStart);
                li.addEventListener('dragover', handleDragOver);
                li.addEventListener('drop', handleDrop);
                li.addEventListener('dragend', handleDragEnd);

                list.appendChild(li);
            });
        }

        function updateTaskStatus(index, newStatus) {
            tasks[index].status = newStatus;
            console.log(`PATCH /care/tasks/${tasks[index].id} - Status: ${newStatus}`);
            renderList();
        }

        // Drag & Drop Logic
        let draggedItem = null;

        function handleDragStart(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDrop(e) {
            e.stopPropagation();
            if (draggedItem !== this) {
                const srcIndex = parseInt(draggedItem.dataset.index);
                const destIndex = parseInt(this.dataset.index);

                // Swap in array
                const item = tasks.splice(srcIndex, 1)[0];
                tasks.splice(destIndex, 0, item);

                console.log(`PATCH /care/tasks/${item.id} - Rescheduled (Shift)`);
                renderList();
            }
            return false;
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
        }

        renderList();
    }
});
