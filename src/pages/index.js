//Import CSS
import "./index.css";

//Import from utils.js
import Api from "../utils/api.js";
import { setButtonText } from "../utils/helpers.js";

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
const profileAvatarButton = profileAvatarCont.querySelector(
  ".profile__avatar-button"
);
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

// Edit Avatar Elements
const profileAvatarModal = document.querySelector("#avatar-modal");
const profileAvatarForm = profileAvatarModal.querySelector(
  "#profile-avatar-form"
);
const profileAvatarLinkInput = profileAvatarForm.querySelector(
  "#avatar-image-input"
);
const profileAvatarSubmitButton = profileAvatarModal.querySelector(
  ".modal__submit-button"
);
const profileAvatarCloseButton = profileAvatarModal.querySelector(
  ".modal__close-button"
);

// Edit Profile Elements
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
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

// New Post Elements
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector("#new-post-form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

// Card Related Elements
let selectedCard, selectedCardId;

// Delete Modal Elements
const deleteModal = document.querySelector("#delete-card-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__cancel-button"
);

// Preview Modal Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewImageElement = previewModal.querySelector(".modal__image");
const previewCaptionElement = previewModal.querySelector(".modal__caption");

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

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
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

profileAvatarButton.addEventListener("click", () => {
  openModal(profileAvatarModal);
});

profileAvatarCloseButton.addEventListener("click", () => {
  closeModal(profileAvatarModal);
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

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");

  api
    .editAvatarImage({
      avatar: profileAvatarLinkInput.value,
    })
    .then((data) => {
      if (data) {
        profileAvatarElement.src = data.avatar;

        disableButton(profileAvatarSubmitButton, settings);
        closeModal(profileAvatarModal);
        evt.target.reset();
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}
profileAvatarForm.addEventListener("submit", handleAvatarSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  // Change text content to "Saving..." or "Deleting..."
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      if (data) {
        profileNameElement.textContent = data.name;
        profileDescriptionElement.textContent = data.about;

        disableButton(editProfileSubmitButton, settings);
        closeModal(editProfileModal);
        evt.target.reset();
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");

  api
    .getNewCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      if (data) {
        const cardElement = getCardElement(data);
        cardsList.prepend(cardElement);

        disableButton(newPostSubmitButton, settings);
        closeModal(newPostModal);
        evt.target.reset();
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}
newPostForm.addEventListener("submit", handleNewPostSubmit);

function handleLikeCard(evt, id) {
  const button = evt.currentTarget;
  const isLiked = button.classList.contains("card__like-button_active");
  api
    .changeLike(id, isLiked)
    .then(() => {
      button.classList.toggle("card__like-button_active");
      console.log("It's working!");
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Delete", "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}
deleteForm.addEventListener("submit", handleDeleteSubmit);

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
  const cardLikeButtonElement = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonElement = cardElement.querySelector(
    ".card__delete-button"
  );

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeButtonElement.classList.add("card__like-button_active");
  } else {
    cardLikeButtonElement.classList.remove("card__like-button_active");
  }

  cardLikeButtonElement.addEventListener("click", (evt) =>
    handleLikeCard(evt, data._id)
  );
  cardDeleteButtonElement.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", function () {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}
