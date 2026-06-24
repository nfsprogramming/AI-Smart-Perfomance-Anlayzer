document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // UI Loading State
    const btn = document.querySelector('.btn-primary');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.loading-spinner');

    btnText.style.display = 'none';
    spinner.classList.remove('hidden');
    btn.disabled = true;

    // Collect Data
    const data = {
        marks: document.getElementById('marks').value,
        attendance: document.getElementById('attendance').value,
        sleep_hours: document.getElementById('sleep_hours').value,
        screen_time: document.getElementById('screen_time').value,
        assignment_delay: document.getElementById('assignment_delay').value,
        feedback: document.getElementById('feedback').value
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            displayResults(result);
        } else {
            alert('Error: ' + (result.error || 'Something went wrong'));
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    } finally {
        // Reset UI
        btnText.style.display = 'block';
        spinner.classList.add('hidden');
        btn.disabled = false;
    }
});

function displayResults(data) {
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');

    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });

    // 1. Risk Badge
    const riskBadge = document.getElementById('riskBadge');
    const riskIndex = data.prediction.risk_index;

    riskBadge.className = 'risk-badge px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2'; // Reset
    if (riskIndex === 0) {
        riskBadge.classList.add('risk-low');
        riskBadge.innerHTML = 'LOW RISK <span class="w-2 h-2 rounded-full bg-emerald-500"></span>';
    } else if (riskIndex === 1) {
        riskBadge.classList.add('risk-med');
        riskBadge.innerHTML = 'MEDIUM RISK <span class="w-2 h-2 rounded-full bg-yellow-500"></span>';
    } else {
        riskBadge.classList.add('risk-high');
        riskBadge.innerHTML = 'HIGH RISK <span class="w-2 h-2 rounded-full bg-rose-500"></span>';
    }

    // 2. Probabilities
    const probs = data.prediction.final_probs; // [low, med, high]
    document.getElementById('probLow').style.width = (probs[0] * 100) + '%';
    document.getElementById('probMed').style.width = (probs[1] * 100) + '%';
    document.getElementById('probHigh').style.width = (probs[2] * 100) + '%';

    // 3. Recommendations
    const recList = document.getElementById('recommendationsList');
    recList.innerHTML = '';
    data.recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'flex items-start gap-3 p-4 factor-pill rounded-xl';
        div.innerHTML = `<span class="text-emerald-500">✨</span><p class="text-sm text-gray-300">${rec}</p>`;
        recList.appendChild(div);
    });

    // 4. Feature Importance
    const featContainer = document.getElementById('featureImportance');
    featContainer.innerHTML = '';
    const importances = data.feature_importance;

    // Convert to array and sort
    const sortedFeatures = Object.entries(importances).sort(([, a], [, b]) => b - a);

    sortedFeatures.forEach(([key, value]) => {
        const div = document.createElement('div');
        div.className = 'factor-pill px-4 py-2 rounded-full text-xs flex items-center gap-2';
        // Format key (e.g., sleep_hours -> Sleep Hours)
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        div.innerHTML = `<span class="text-gray-400">${label}</span> <span class="text-emerald-400 font-bold">${(value * 100).toFixed(1)}%</span>`;
        featContainer.appendChild(div);
    });
}
