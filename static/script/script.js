/* ============================================
   Gourav's Portfolio Logic
   ============================================ */

// 1. Portfolio Data Source
const portfolioData = {
    name: "Gourav",
    title: "AI & ML Research Engineer",
    contact: {
        email: "gouravbirwaz@gmail.com",
        phone: "+91 9141017165",
        github: "github.com/Gouravbirwaz",
        linkedin: "linkedin.com/in/gourav-b62157295",
    },
    // Summary from Resume
    objective: `Highly motivated B.E. Student specializing in Artificial Intelligence and Machine Learning (Expected 2027), with a strong academic standing (GPA: 9.23/10). Skilled in end-to-end system development, translating research into production-ready, real-time solutions.`,

    // Experience
    experience: [
        {
            company: "Caprae Capital",
            role: "Software Engineering Intern",
            date: "May 2024 - Aug 2024",
            description: "Contributed to backend development and system optimization. Worked closely with the engineering team to implement scalable solutions.",
            icon: "fa-briefcase",
            verification: "/static/document/Caprae Capital Certificate of Completion - Gourav.pdf"
        }
    ],

    // Education
    education: [
        {
            degree: "Bachelor of Engineering in Computer Science",
            specialization: "AI & ML Specialization",
            university: "Visvesvaraya Technological University, Karnataka",
            years: "Expected 2027",
            gpa: "GPA: 9.23/10",
        },
        {
            degree: "Pre-University (PCMC)",
            university: "Karnataka State Board",
            years: "2021",
            gpa: "Grade: 95%",
        },
    ],

    // Technical Skills
    skills: {
        'Languages': ['Python', 'C++', 'Dart', 'Java', 'C'],
        'AI & ML': ['TensorFlow', 'scikit-learn', 'NumPy', 'Pandas', 'OpenCV'],
        'Backend': ['Django', 'Django REST Framework', 'REST APIs'],
        'Mobile & Cloud': ['Flutter', 'Firebase (Auth, Realtime DB, Storage)'],
        'Tools': ['Git', 'GitHub', 'Linux', 'DSA', 'Model Deployment']
    },

    // Projects
    projects: [
        {
            title: 'Sirennet – Disaster Management System',
            role: 'Lead Developer',
            description: 'Engineered a full-stack emergency response platform. multi-modal ML pipeline for automated emergency classification and forgery detection.',
            image: '/static/images/brand_img.png',
            tags: ['Flutter', 'Django', 'Firebase', 'Machine Learning'],
            repoUrl: 'https://github.com/Gouravbirwaz'
        },
        {
            title: 'EcoConnect – Environmental Monitoring',
            role: 'Full Stack Developer',
            description: 'Developed a real-time environmental reporting platform. Integrated AI models to detect environmental anomalies.',
            image: '/static/images/eco_credix_logo.jpeg',
            tags: ['React.js', 'Node.js', 'AI/ML', 'Firebase'],
            repoUrl: 'https://github.com/Gouravbirwaz'
        }
    ],

    // Certifications
    certifications: [
        {
            name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
            issuer: "Oracle Corporation",
            date: "Sep 2025",
            icon: "fa-cloud"
        },
        {
            name: "Deep Learning in Ecological Studies",
            issuer: "Indian Institute of Remote Sensing (IIRS)",
            date: "Nov 2024",
            icon: "fa-satellite"
        },
        {
            name: "Problem Solving (Basic)",
            issuer: "HackerRank",
            date: "Jul 2024",
            icon: "fa-code"
        }
    ]
};

// --- DOM Manipulation Logic ---

document.addEventListener('DOMContentLoaded', function () {
    renderExperience();
    renderProjects();
    renderSkills();
    renderCertifications();

    initScrollEffects();
    initIntersectionObserver();

    // Typewriter effect if element exists
    const nameElement = document.querySelector('.gradient-text');
    if (nameElement && nameElement.textContent === 'GOURAV') {
        // Simple typewriter re-trigger or leave static
    }
});

// Render Experience
function renderExperience() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;

    // Inject Modal HTML if not exists
    if (!document.getElementById('experienceModal')) {
        const modalHTML = `
            <div id="experienceModal" class="modal">
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    <div class="modal-header">
                        <h2 class="modal-title" id="modalCompany"></h2>
                        <p class="modal-role" id="modalRole"></p>
                        <p class="modal-date" id="modalDate"></p>
                    </div>
                    <div class="modal-body">
                        <p id="modalDescription"></p>
                        <a id="modalVerification" href="#" target="_blank" class="btn btn-secondary" style="margin-top: 1.5rem; display: inline-block;">
                            <i class="fas fa-file-contract"></i> View Verification
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Bind Close Events
        const modal = document.getElementById('experienceModal');
        const closeBtn = modal.querySelector('.close-modal');

        closeBtn.onclick = () => closeModal();
        window.onclick = (event) => {
            if (event.target == modal) closeModal();
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    }

    container.innerHTML = portfolioData.experience.map((exp, index) => `
        <div class="experience-item" onclick="openExperienceModal(${index})">
            <div class="exp-icon">
                <i class="fas ${exp.icon}"></i>
            </div>
            <div class="exp-details">
                <h3>${exp.company}</h3>
                <p class="exp-role">${exp.role}</p>
                <p class="exp-date">${exp.date}</p>
            </div>
            <div class="exp-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `).join('');
}

// Modal Functions
window.openExperienceModal = function (index) {
    const data = portfolioData.experience[index];
    if (!data) return;

    document.getElementById('modalCompany').textContent = data.company;
    document.getElementById('modalRole').textContent = data.role;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalDescription').textContent = data.description;

    const verifyBtn = document.getElementById('modalVerification');
    if (data.verification) {
        verifyBtn.href = data.verification;
        verifyBtn.style.display = 'inline-block';
    } else {
        verifyBtn.style.display = 'none';
    }

    const modal = document.getElementById('experienceModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
};

function closeModal() {
    const modal = document.getElementById('experienceModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match CSS transition
}

// Render Projects
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = portfolioData.projects.map(project => `
        <div class="project-card" onclick="window.open('${project.repoUrl}', '_blank')" style="cursor: pointer;">
            <div class="project-image" style="background-image: url('${project.image}'); background-size: cover; background-position: center;">
                ${!project.image ? '<i class="fas fa-code"></i>' : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Render Skills
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    container.innerHTML = Object.entries(portfolioData.skills).map(([category, skillList]) => `
        <div class="skill-category">
            <h3>${category}</h3>
            <div class="skill-tags">
                ${skillList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Render Certifications
function renderCertifications() {
    const container = document.getElementById('certificationsContainer');
    if (!container) return;

    container.innerHTML = portfolioData.certifications.map(cert => `
        <div class="certification-item">
            <div class="cert-icon">
                <i class="fas ${cert.icon}"></i>
            </div>
            <div class="cert-details">
                <h4>${cert.name}</h4>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date">${cert.date}</p>
            </div>
        </div>
    `).join('');
}

// Navbar Scroll Effect & Smooth Scroll
function initScrollEffects() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll background
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(3, 7, 18, 0.98)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(3, 7, 18, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
    });

    // Theme Toggle Logic
    const themeBtn = document.querySelector('button[title="Toggle Theme"]');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = themeBtn.querySelector('i');
            if (icon.classList.contains('fa-moon')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.experience-item, .project-card, .skill-category, .research-card, .contact-card, .certification-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}