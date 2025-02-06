async function fetchStatusData() {
    const response = await fetch('services.json');
    const services = await response.json();
    updateStatusGrid(services);
}

function updateStatusGrid(services) {
    const grid = document.getElementById('status-grid');
    grid.innerHTML = '';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = `status-card ${service.lastStatus}`;
        card.innerHTML = `
            <h3>${service.name}</h3>
            <p>Status: ${service.lastStatus}</p>
            <p>Last Check: ${service.lastCheck}</p>
            <p>Uptime: ${service.uptime}%</p>
        `;
        grid.appendChild(card);
        
        card.addEventListener('click', () => showServiceDetails(service.name));
    });
}

async function showServiceDetails(serviceName) {
    const detailsPanel = document.getElementById('details-panel');
    const serviceTitleEl = document.getElementById('service-name');
    const errorLogEl = document.getElementById('error-log');

    serviceTitleEl.textContent = serviceName;
    
    try {
        const response = await fetch(`logs/${serviceName}_errors.log`);
        const errorLog = await response.text();
        errorLogEl.textContent = errorLog || 'No errors recorded';
    } catch (error) {
        errorLogEl.textContent = 'Error log not available';
    }

    detailsPanel.classList.remove('hidden');
}

// Update status every 5 minutes
setInterval(fetchStatusData, 300000);
fetchStatusData();
