import {createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    const customRule = (key, sourceValue, targetValue, source, target) => {
        if (key !== searchField) return { continue: true };
        if (!targetValue) return { skip: true };
        
        const searchTerm = String(targetValue).toLowerCase();
        const searchFields = ['date', 'customer', 'seller'];
        
        for (const field of searchFields) {
            const fieldValue = source[field];
            if (fieldValue && String(fieldValue).toLowerCase().includes(searchTerm)) {
                return { result: true };
            }
        }
        return { result: false };
    };
    
    const compare = createComparison(['skipEmptyTargetValues'], [customRule]);

    return (data, state, action) => {
        return data.filter(row => compare(row, state));
    };
}