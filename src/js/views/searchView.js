import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () =>  {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchPagination.innerHTML = '';
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.preview__link'));
  resultsArr.forEach(e => e.classList.remove('preview__link--active'));
  document.querySelector(`.preview__link[href="#${id}"]`).classList.add('preview__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li class="preview">
      <a class="preview__link" href="#${recipe.recipe_id}">
        <figure class="preview__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${limitRecipeTitle(recipe.title)}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated">
            <svg>
              <use href="./img/icons.svg#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) =>
`<button class="btn--inline pagination__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
  <svg class="search__icon">
    <use href="/img/icons.svg#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
  </svg>
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults/resPerPage);
  let button;

  if ( page === 1 && pages > 1 ) {
    //next page button
    button = createButton(page, 'next');
  } else if ( page < pages ) {
    //both buttons
    button = `${createButton(page, 'prev')}${createButton(page, 'next')}`;
  } else if ( page === pages && pages > 1 ) {
    //prev page button
    button = createButton(page, 'prev');
  }

  elements.searchPagination.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);
};
