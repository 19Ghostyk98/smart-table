import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    if (before && before.length) {
        [...before].reverse().forEach(templateName => {
            const cloned = cloneTemplate(templateName);
            root[templateName] = cloned;
            root.container.prepend(cloned.container);
            if (cloned.elements) {
                Object.assign(root.elements, cloned.elements);
            }
        });
    }

    if (after && after.length) {
        after.forEach(templateName => {
            const cloned = cloneTemplate(templateName);
            root[templateName] = cloned;
            root.container.append(cloned.container);
            if (cloned.elements) {
                Object.assign(root.elements, cloned.elements);
            }
        });
    }

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        if (root.elements.rows) {
            root.elements.rows.replaceChildren(...nextRows);
        }
    }

    return {...root, render};
}