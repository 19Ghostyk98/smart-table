import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData, cloneTemplate} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";


const {data, ...indexes} = initData(sourceData);

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, null);

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const span = el.querySelector('span');
        if (input) input.value = page;
        if (span) span.textContent = page;
        if (input && isCurrent) input.checked = true;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);


function collectState() {
    const formData = new FormData(sampleTable.container);
    const state = processFormData(formData);
    
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page) || 1;
    
    return { ...state, rowsPerPage, page };
}

function render(action) {
    const state = collectState();
    let result = [...data];
    
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    
    sampleTable.render(result);
}

sampleTable.container.addEventListener('change', () => render());
sampleTable.container.addEventListener('reset', () => setTimeout(() => render(), 0));
sampleTable.container.addEventListener('submit', (e) => {
    e.preventDefault();
    render(e.submitter);
});

render();