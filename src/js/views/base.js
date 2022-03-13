export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResList: document.querySelector('.results'),
  searchRes: document.querySelector('.search-results'),
  searchPagination: document.querySelector('.pagination'),
  recipe: document.querySelector('.recipe'),
  likesList: document.querySelector('.bookmarks__list'),
  likesMessage: document.querySelector('.bookmarks__list .message')
};

export const elementStrings = {
  loader: 'spinner'
}

export const renderLoader = parent => {
  const loader = `
  <div class="${elementStrings.loader}">
    <svg>
      <use href="./img/icons.svg#icon-loader"></use>
    </svg>
  </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
