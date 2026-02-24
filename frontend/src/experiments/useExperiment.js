/**
 * A/B Testing Hook
 * Selects a variant and persists it for consistency.
 * @param {string} experimentName - Unique ID for the experiment
 * @param {string[]} variants - Array of variant names e.g. ["A", "B"]
 * @returns {string} The selected variant
 */
export function useExperiment(experimentName, variants) {
    // Check if user already has a variant assigned
    const stored = localStorage.getItem(`exp_${experimentName}`);
    if (stored && variants.includes(stored)) {
        return stored;
    }

    // Randomly assign a variant
    const chosen = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(`exp_${experimentName}`, chosen);

    return chosen;
}
