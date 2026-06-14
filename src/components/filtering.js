import {createComparison} from "../lib/compare.js";

const defaultRules = ['skipEmptyTargetValues', 'caseInsensitiveStringIncludes'];

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

        return data.filter(row => compare(row, state));
    };
}