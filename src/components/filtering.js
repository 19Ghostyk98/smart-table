import {createComparison} from "../lib/compare.js";

const defaultRules = ['skipEmptyTargetValues', 'caseInsensitiveStringIncludes', 'arrayAsRange'];

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (select && indexes[elementName]) {
            Object.values(indexes[elementName]).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    });
    
    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }
        
        const filterState = { ...state };
        
        if (filterState.totalFrom !== undefined || filterState.totalTo !== undefined) {
            const from = filterState.totalFrom !== '' && !isNaN(parseFloat(filterState.totalFrom)) 
                ? parseFloat(filterState.totalFrom) 
                : undefined;
            const to = filterState.totalTo !== '' && !isNaN(parseFloat(filterState.totalTo)) 
                ? parseFloat(filterState.totalTo) 
                : undefined;
            
            if (from !== undefined || to !== undefined) {
                filterState.total = [from, to];
            }
            
            delete filterState.totalFrom;
            delete filterState.totalTo;
        }

        return data.filter(row => compare(row, filterState));
    };
}