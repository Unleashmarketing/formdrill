// interactive.js - Füge diese Datei zu deinem Projekt hinzu

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive process visualization
    initProcessVisualization();
    
    // Initialize the cost savings calculator
    initCostCalculator();
    
    // Make sure to update translations if language is changed
    if (typeof i18next !== 'undefined') {
        i18next.on('languageChanged', function() {
            // Update all translations
            updateContent();
        });
    }
    
    // Add translation keys after i18next is loaded
    setTimeout(addTranslationsForInteractive, 1000);
});

// Interactive Process Visualization Functionality
function initProcessVisualization() {
    const stageButtons = document.querySelectorAll('.stage-button');
    const processHotspots = document.querySelectorAll('.process-hotspot');
    const infoContents = document.querySelectorAll('.process-info-content');
    const processImage = document.getElementById('process-image');
    
    if (!stageButtons.length || !infoContents.length) return;
    
    // Define images for each step (replace with your actual images)
    const stepImages = {
        1: 'https://images.pexels.com/photos/5853930/pexels-photo-5853930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        2: 'https://images.pexels.com/photos/29988967/pexels-photo-29988967.jpeg?auto=compress&cs=tinysrgb&w=1200',
        3: 'https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg?auto=compress&cs=tinysrgb&w=1200'
    };
    
    // Initial active step
    let activeStep = 1;
    
// Function to change the active step
function changeStep(stepNumber) {
    // Convert to number to ensure proper comparison
    stepNumber = parseInt(stepNumber);
    
    // Update active state for buttons
    stageButtons.forEach(button => {
        const buttonStep = parseInt(button.getAttribute('data-step'));
        if (buttonStep === stepNumber) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update content sections
    infoContents.forEach(content => {
        const contentStep = parseInt(content.getAttribute('data-step'));
        if (contentStep === stepNumber) {
            content.classList.add('active');
            // Add animation class
            content.classList.add('step-transition');
            // Remove animation class after animation completes
            setTimeout(() => {
                content.classList.remove('step-transition');
            }, 1000);
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update image with cross-fade transition
    if (processImage && stepImages[stepNumber]) {
        // Create a temporary copy of the current image that will remain in place
        const oldImage = processImage.cloneNode(true);
        oldImage.style.position = 'absolute';
        oldImage.style.top = '0';
        oldImage.style.left = '0';
        oldImage.style.zIndex = '1';
        oldImage.classList.add('fade-out');
        
        // Add the old image to the container
        processImage.parentNode.appendChild(oldImage);
        
        // Update the source of the main image
        processImage.src = stepImages[stepNumber];
        processImage.style.opacity = '0';
        
        // After a short delay, fade in the new image
        setTimeout(() => {
            processImage.style.opacity = '1';
            processImage.style.zIndex = '2'; // Ensure it's above the old image
            
            // Remove the old image after fade completes
            setTimeout(() => {
                if (oldImage.parentNode) {
                    oldImage.parentNode.removeChild(oldImage);
                }
            }, 500);
        }, 50);
    }
    
    // Update active step
    activeStep = stepNumber;
}

// Add this CSS rule via JavaScript to ensure proper transition
document.addEventListener('DOMContentLoaded', function() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .fade-out {
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        .fade-out.fade-out {
            opacity: 0;
        }
        
        .process-image-container {
            position: relative;
        }
        
        @media (min-width: 992px) {
            .process-visualization {
                height: 500px;
            }
        }
    `;
    document.head.appendChild(styleEl);
});

// Cost Savings Calculator Functionality
function initCostCalculator() {
    // Get all input elements
    const productionVolumeInput = document.getElementById('production-volume');
    const productionVolumeRange = document.getElementById('production-volume-range');
    const connectionsPerUnitInput = document.getElementById('connections-per-unit');
    const connectionsPerUnitRange = document.getElementById('connections-per-unit-range');
    const conventionalCostInput = document.getElementById('conventional-cost');
    const conventionalCostRange = document.getElementById('conventional-cost-range');
    const laborRateInput = document.getElementById('labor-rate');
    const laborRateRange = document.getElementById('labor-rate-range');
    
    // Get result output elements
    const conventionalMaterialCost = document.getElementById('conventional-material-cost');
    const conventionalLaborCost = document.getElementById('conventional-labor-cost');
    const conventionalTotalCost = document.getElementById('conventional-total-cost');
    const formdrillMaterialCost = document.getElementById('formdrill-material-cost');
    const formdrillLaborCost = document.getElementById('formdrill-labor-cost');
    const formdrillTotalCost = document.getElementById('formdrill-total-cost');
    const annualSavings = document.getElementById('annual-savings');
    const savingsPercentage = document.getElementById('savings-percentage');
    
    // Get reset button
    const resetButton = document.getElementById('reset-calculator');
    
    // If any element is missing, abort initialization
    if (!productionVolumeInput || !connectionsPerUnitInput || !conventionalCostInput || 
        !laborRateInput || !conventionalMaterialCost || !conventionalLaborCost || 
        !conventionalTotalCost || !formdrillMaterialCost || !formdrillLaborCost || 
        !formdrillTotalCost || !annualSavings || !savingsPercentage || !resetButton) {
        console.error('Calculator initialization failed: Missing elements');
        return;
    }
    
    // Sync number inputs with range inputs
    function syncInputs(inputElement, rangeElement) {
        inputElement.addEventListener('input', function() {
            rangeElement.value = this.value;
            calculateSavings();
        });
        
        rangeElement.addEventListener('input', function() {
            inputElement.value = this.value;
            calculateSavings();
        });
    }
    
    // Set up syncing for all input pairs
    syncInputs(productionVolumeInput, productionVolumeRange);
    syncInputs(connectionsPerUnitInput, connectionsPerUnitRange);
    syncInputs(conventionalCostInput, conventionalCostRange);
    syncInputs(laborRateInput, laborRateRange);
    
    // Reset calculator to default values
    resetButton.addEventListener('click', function() {
        productionVolumeInput.value = 10000;
        productionVolumeRange.value = 10000;
        connectionsPerUnitInput.value = 4;
        connectionsPerUnitRange.value = 4;
        conventionalCostInput.value = 0.85;
        conventionalCostRange.value = 0.85;
        laborRateInput.value = 30;
        laborRateRange.value = 30;
        
        calculateSavings();
    });
    
    // Format currency
    function formatCurrency(value) {
        return '€ ' + value.toLocaleString('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    // Format percentage
    function formatPercentage(value) {
        return Math.round(value) + '%';
    }
    
    // Calculate savings based on input values
    function calculateSavings() {
        // Get current values
        const productionVolume = parseInt(productionVolumeInput.value);
        const connectionsPerUnit = parseInt(connectionsPerUnitInput.value);
        const conventionalCost = parseFloat(conventionalCostInput.value);
        const laborRate = parseFloat(laborRateInput.value);
        
        // Calculate total connections
        const totalConnections = productionVolume * connectionsPerUnit;
        
        // Conventional method calculations
        // Material cost for conventional method (nuts, inserts, etc.)
        const convMaterialCost = totalConnections * conventionalCost;
        
        // Labor cost for conventional method (slower process)
        // Assuming 30 seconds per connection on average
        const convLaborHours = (totalConnections * 30) / 3600; // Convert to hours
        const convLaborCost = convLaborHours * laborRate;
        
        // Total conventional cost
        const convTotalCost = convMaterialCost + convLaborCost;
        
        // Formdrill method calculations
        // Material cost for Formdrill (minimal, only the tools)
        // Assuming Formdrill tool cost is about 10% of conventional material cost
        const fdMaterialCost = convMaterialCost * 0.1;
        
        // Labor cost for Formdrill method (faster process)
        // Assuming 10 seconds per connection on average
        const fdLaborHours = (totalConnections * 10) / 3600; // Convert to hours
        const fdLaborCost = fdLaborHours * laborRate;
        
        // Total Formdrill cost
        const fdTotalCost = fdMaterialCost + fdLaborCost;
        
        // Savings calculations
        const totalSavings = convTotalCost - fdTotalCost;
        const savingsPercent = (totalSavings / convTotalCost) * 100;
        
        // Update the display values
        conventionalMaterialCost.textContent = formatCurrency(convMaterialCost);
        conventionalLaborCost.textContent = formatCurrency(convLaborCost);
        conventionalTotalCost.textContent = formatCurrency(convTotalCost);
        
        formdrillMaterialCost.textContent = formatCurrency(fdMaterialCost);
        formdrillLaborCost.textContent = formatCurrency(fdLaborCost);
        formdrillTotalCost.textContent = formatCurrency(fdTotalCost);
        
        annualSavings.textContent = formatCurrency(totalSavings);
        savingsPercentage.textContent = formatPercentage(savingsPercent);
    }
    
    // Initialize with default calculation
    calculateSavings();
}
