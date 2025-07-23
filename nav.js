document.addEventListener('DOMContentLoaded', function () {
    // --- Single Source of Truth for Navigation ---
    const navData = {
        "Home": "index.html", // Path from a subject folder back to root
        "Chemistry": {
            "Haloalkanes and Haloarenes": "Haloalkanes and Haloarenes.html",
            "Alcohols, Phenols & Ethers": "AlcoholsPhenolsEthers.html",
            "Solutions": "Solutions.html",
            "Aldehydes, Ketones and Carboxylic Acids": "Carbonyl.html",
            "Amines": "Amines.html",
            "Biomolecules": "Biomolecules.html",
            "Electrochemistry": "Electrochemistry.html",
            "Chemical Kinetics": "Kinetics.html",
            "D & F block": "dnf.html",
            "Coordination Compounds": "cnc.html",
            "Chemistry Project": "CHEMISTRYPROJECT.html",
            "Peter Sykes's Guidebook to Reaction Mechanism": "PeterSkyes.html",
            "IUPAC name to Structure Renderer": "iupacrenderer.html"
        },
        "Computer Science": {
            "Basics of Class XI": "BasicsofClassXI.html",
            "Functions": "Functions.html",
            "MySQL": "MySQL.html",
            "File Handling": "FileHandling.html",
            "File Handling(CSV)": "CSV-FileHandling.html"

        },
        "English": {
            "The Last Lesson": "LastLesson.html",
            "My Mother at Sixty-Six": "MyMotherAtSixtySix.html",
            "The Third Level": "TheThirdLevel.html",
            "Lost Spring": "LostSpring.html",
            "The Tiger King": "TigerKing.html",
            "Keeping Quiet": "KeepingQuiet.html",
            "Deep Water": "DeepWater.html",
            "Grammar Work-1": "GrammarWork-1.html"
        },
        "Mathematics": {
            "Relations & Functions": "RelnFunctions.html",
            "Inverse Trigonometry": "InverseTrigo.html",
            "Matrices": "Matrices.html",
            "Determinants": "Determinants.html",
            "Continuity & Differentiability": "ContinuityDifferentiability.html",
            "Application of Derivatives": "AOD.html",
            "Integrals" : "Integrals.html"
        },
        "Physics": {
            "Electric Charges and Field": "ElectricChargesandField.html",
            "Electric Potential and Capacitance": "ElectricPotentialAndCapacitance.html",
            "Current Electricity": "CurrentElectricity.html",
            "Magnetic Field": "mf1.html",
            "Magnetic Field due to a Current": "mf2.html",
            "Holiday Homework Assignment": "HWWAssignment.html"
        }
    };

    const sidebar = document.getElementById('index-sidebar');
    const navbar = document.getElementById('global-navbar');
    const currentPath = window.location.pathname;

    function buildSidebar() {
        if (!sidebar) return;

        let sidebarHtml = '<h3><a href="../index.html">Home</a></h3><table>';

        for (const subject in navData) {
            if (typeof navData[subject] === 'object') {
                sidebarHtml += `<thead><tr><th>${subject}</th></tr></thead><tbody>`;
                for (const pageName in navData[subject]) {
                    const path = `../${subject}/${navData[subject][pageName]}`;
                    sidebarHtml += `<tr><td><a href="${path}">${pageName}</a></td></tr>`;
                }
                sidebarHtml += '</tbody>';
            }
        }
        sidebarHtml += '</table>';
        sidebar.innerHTML = sidebarHtml;
    }
    
    function buildNavbar() {
        if (!navbar) return;

        let navHtml = '<div class="nav-logo"><a href="../index.html">Narayani Namostute</a></div><ul class="nav-links">';

        for (const subject in navData) {
            if (typeof navData[subject] === 'object') {
                navHtml += '<li class="dropdown">';
                navHtml += `<a href="#">${subject}</a>`;
                navHtml += '<div class="dropdown-content">';
                for (const pageName in navData[subject]) {
                    const path = `../${subject}/${navData[subject][pageName]}`;
                    navHtml += `<a href="${path}">${pageName}</a>`;
                }
                navHtml += '</div></li>';
            }
        }

        navHtml += '</ul>';
        navbar.innerHTML = navHtml;
    }

    buildSidebar();
    buildNavbar();
});