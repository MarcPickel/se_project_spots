//Import CSS
import "./index.css";

//Import from api.js
import Api from "../utils/api.js";

//Imports from constants.js
import { settings } from "../utils/constants.js";

//Imports from validation.js
import {
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
enableValidation(settings);

// Profile Elements
const profileAvatarCont = document.querySelector(".profile__avatar-container");
const profileAvatarElement =
  profileAvatarCont.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

// Edit Avatar
const profileAvatarButton = profileAvatarCont.querySelector(
  ".profile__avatar-button"
);
const profileAvatarModal = document.querySelector("#avatar-modal");
const profileAvatarForm = profileAvatarModal.querySelector(
  "#profile-avatar-form"
);
const profileAvatarLinkInput = profileAvatarForm.querySelector(
  "#avatar-image-input"
);

// Edit Profile
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector("#edit-profile-form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// New Post
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector("#new-post-form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5ef325c5-f7c1-4719-bb32-13415ad57957",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    if (profileAvatarElement) {
      profileAvatarElement.src = user.avatar;
      profileAvatarElement.alt = user.name;
    }
    profileNameElement.textContent = user.name;
    profileDescriptionElement.textContent = user.about;
    console.log(user);
  })
  .catch((err) => {
    console.error(err);
  });

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  modal.addEventListener("mousedown", modalOverlayClose);
  document.addEventListener("keydown", handleEscapeClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("mousedown", modalOverlayClose);
  document.removeEventListener("keydown", handleEscapeClose);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

//function handleAvatarSubmit(evt) {
//  evt.preventDefault();
//}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      if (data) {
        profileNameElement.textContent = data.value;
        profileDescriptionElement.textContent = data.value;
        closeModal(editProfileModal);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  api
    .getNewCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      if (data) {
        const inputValues = {
          name: data.value,
          link: data.value,
        };

        const cardElement = getCardElement(inputValues);
        cardsList.prepend(cardElement);

        disableButton(newPostSubmitButton, settings);
        closeModal(newPostModal);
        evt.target.reset();
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewImageElement = previewModal.querySelector(".modal__image");
const previewCaptionElement = previewModal.querySelector(".modal__caption");
previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

// modalOverlayClose feature
function modalOverlayClose(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

// handleEscapeClose feature
function handleEscapeClose(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_is-opened");
    if (modal) {
      closeModal(modal);
    }
  }
}

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const cardLikeButtonElement = cardElement.querySelector(".card__like-button");
  cardLikeButtonElement.addEventListener("click", () => {
    cardLikeButtonElement.classList.toggle("card__like-button_active");
  });

  const cardDeleteButtonElement = cardElement.querySelector(
    ".card__delete-button"
  );
  cardDeleteButtonElement.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", function () {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}
