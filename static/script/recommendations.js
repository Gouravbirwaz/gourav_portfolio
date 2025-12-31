document.getElementById('recommendationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const query = document.getElementById('userQuery').value;
    const loading = document.getElementById('loadingContainer');
    const results = document.getElementById('resultsContainer');
    const form = document.querySelector('.recommendation-form');
    
    // Show loading
    form.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Simulate AI Steps
    setTimeout(() => document.getElementById('step1').classList.add('active'), 500);
    setTimeout(() => document.getElementById('step2').classList.add('active'), 1500);
    setTimeout(() => document.getElementById('step3').classList.add('active'), 2500);
    
    // Show Results after delay
    setTimeout(() => {
        loading.classList.add('hidden');
        results.classList.remove('hidden');
        populateResults(query);
    }, 3500);
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('resultsContainer').classList.add('hidden');
    document.querySelector('.recommendation-form').classList.remove('hidden');
    document.getElementById('userQuery').value = '';
    // Reset steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
});

function populateResults(query) {
    // Simulated AI Analysis based on keywords in the query
    const summary = document.getElementById('aiSummary');
    const projContainer = document.getElementById('recommendedProjects');
    const skillsContainer = document.getElementById('recommendedSkills');
    
    // Simple keyword matching for demo purposes
    let focus = "General Engineering";
    if(query.toLowerCase().includes('vision') || query.toLowerCase().includes('image')) focus = "Computer Vision";
    if(query.toLowerCase().includes('system') || query.toLowerCase().includes('backend')) focus = "System Architecture";
    
    summary.innerHTML = `
        <p>Based on your interest in <strong>${focus}</strong>, I've analyzed Gourav's portfolio.</p>
        <p>He appears to be a strong match, particularly with his work on <em>Sirennet</em> and his specialization in AI & ML at VTU.</p>
    `;
    
    projContainer.innerHTML = `
        <div class="card">
            <h4>Sirennet</h4>
            <p class="card-desc">AI-powered emergency dispatch using real-time ML analysis. Highly relevant to ${focus}.</p>
        </div>
    `;
    
    skillsContainer.innerHTML = `
        <span class="tech-tag">TensorFlow</span>
        <span class="tech-tag">Python</span>
        <span class="tech-tag">System Design</span>
    `;
}