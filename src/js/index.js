import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
/**
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};


//Search controler//
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) new search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();
    } catch (error) {
      alert('Error processing search.');
      clearLoader();
    }

    // 5) render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchPagination.addEventListener('click', e => {
  const button = e.target.closest('.btn--inline');

  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
Recipe controller
*/

const controlRecipe = async () => {
  //get id from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    //prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //highlightSelected
    if (state.search) {
      searchView.highlightSelected(id);
    }

    //create new recipe object
    state.recipe = new Recipe(id);

    try{
      //get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();


      //calc servings and timeout
      state.recipe.calcServings();
      state.recipe.calcTime();

      //render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch(error) {
      alert('Error processing recipe.');
    }

  }
};

/**
Like controller
*/
const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }

  const currentId = state.recipe.id;

  //user has NOT liked recipe
  if (!state.likes.isLiked(currentId)) {
    //add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    //toggle like button
    likesView.toggleLikeBtn(true);
    likesView.toggleLikeMessage(state.likes.getNumLikes());

    //add like to the ui list
    likesView.renderLike(newLike);
    //user has liked recipe
  } else {
    //remove like from state
    state.likes.deleteLike(currentId);

    //toggle like button
    likesView.toggleLikeBtn(false);
    likesView.toggleLikeMessage(state.likes.getNumLikes());

    //remove like from ui list
    likesView.deleteLike(currentId);
  }
};

//restore liked recipes on page load
window.addEventListener('load', () => {
   state.likes = new Likes();
   state.likes.readStorage();
   likesView.toggleLikeMessage(state.likes.getNumLikes());
   state.likes.likes.forEach(like => likesView.renderLike(like));
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn--decrease-servings, .btn--decrease-servings *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn--increase-servings, .btn--increase-servings *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.btn--round, .btn--round *')) {
    //Like controller
    controlLike();
  }

});
