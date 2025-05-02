document.addEventListener('DOMContentLoaded', function() {
    // Initialize the cost savings calculator
    initCostCalculator();
    
    // Make sure to update translations if language is changed
    if (typeof i18next !== 'undefined') {
        i18next.on('languageChanged', function() {
            // Update all translations
            updateContent();
        });
    }
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
