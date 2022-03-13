import { elements } from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-bookmark-fill' : 'icon-bookmark';
  document.querySelector('.btn--round use').setAttribute('href', `img/icons.svg#${iconString}`);
  // img/icons.svg#icon-bookmark-fill
};

export const toggleLikeMessage = numLikes => {
 numLikes > 0 ? elements.likesMessage.style.display = 'none' : elements.likesMessage.style.display = 'flex';
};

export const renderLike = like => {
  const markup = `
  <li class="preview">
    <a class="preview__link" href="#${like.id}">
      <figure class="preview__fig">
        <img src="${like.image}" alt="${like.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">
          ${limitRecipeTitle(like.title)}
        </h4>
        <p class="preview__publisher">${like.author}</p>
      </div>
    </a>
  </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
   const el = document.querySelector(`.preview__link[href*="${id}"]`).parentElement;
   if (el) el.parentElement.removeChild(el);
};
