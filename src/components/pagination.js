import { getPages } from "../lib/utils.js";

export const initPagination = (elements, createPage) => {
  const { pages, fromRow, toRow, totalRows } = elements;

  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.innerHTML = "";

  return (data, state, action) => {
    const rowsPerPage = state.rowsPerPage || 10;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    let page = state.page || 1;

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    page = Math.min(Math.max(1, page), pageCount || 1);

    if (pageCount > 0) {
      const visiblePages = getPages(page, pageCount, 5);
      pages.innerHTML = "";
      visiblePages.forEach((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        pages.appendChild(createPage(el, pageNumber, pageNumber === page));
      });
    }

    const startRow = data.length > 0 ? (page - 1) * rowsPerPage + 1 : 0;
    const endRow = Math.min(page * rowsPerPage, data.length);

    if (fromRow) fromRow.textContent = startRow;
    if (toRow) toRow.textContent = endRow;
    if (totalRows) totalRows.textContent = data.length;

    const skip = (page - 1) * rowsPerPage;
    return data.slice(skip, skip + rowsPerPage);
  };
};
