'use strict';
const picturesContainer = document.querySelector('.pictures');

const similarPhotoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const QUANTITY_LIKES_MIN = 15;
const QUANTITY_LIKES_MAX = 201;

const DESCRIPTIONS_PHOTO = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

const COMMENTS_PHOTO = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
  'Как можно было поймать такой неудачный момент?!'
];

const QUANTITY_LINE_COMMENT_MIN = 1;
const QUANTITY_LINE_COMMENT_MAX = 3;
const QUANTITY_COMMENTS_MIN = 1;
const QUANTITY_COMMENTS_MAX = 2;

const AMOUNT_PHOTOS = 25;


/**
 * @param {Array} array
 * @returns {Number}
 */
const getRandomIndex = function (array) {
  if (array.length === 0) {
    throw new Error('The `array` argument must contain at least one element');
  }
  return Math.floor(Math.random() * array.length);
};

/**
 * Рандомное число от min(включительно) до max(не включая)
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
const getRandomInteger = function (min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

/**
 * Создает рандомный комментарий из 1 или 2 строк
 */
const getComment = function () {
  let comment;
  if (getRandomInteger(QUANTITY_LINE_COMMENT_MIN, QUANTITY_LINE_COMMENT_MAX) > 1) {
    comment = COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)];
  } else {
    comment = COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)] + ' ' + COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)];
  }
  return comment;
};

/**
 * Создает массив с несколькими комментариями
 *
 * @return {Array}
 */
const getArrayComments = function () {
  const randomNumber = getRandomInteger(QUANTITY_COMMENTS_MIN, QUANTITY_COMMENTS_MAX);
  const comments = new Array(randomNumber);
  for (let i = 0; i < randomNumber; i++) {
    comments[i] = getComment();
  }
  return comments;
};


/**
 * @param {Number} index
 * @return {Object}
 */
const createPhoto = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    likes: getRandomInteger(QUANTITY_LIKES_MIN, QUANTITY_LIKES_MAX),
    comments: getArrayComments(),
    description: DESCRIPTIONS_PHOTO[getRandomIndex(DESCRIPTIONS_PHOTO)]
  };
};

/**
 * Функция заполнения данными из массива
 *
 * @param {Array} photo
 * @return {HTMLElement}
 */
const renderPhoto = function (photo) {
  const photoElement = similarPhotoTemplate.cloneNode(true);
  const pictureLikes = photoElement.querySelector('.picture__likes');
  const pictureComments = photoElement.querySelector('.picture__comments');

  pictureLikes.classList.add('picture__stat--likes');
  pictureComments.classList.add('picture__stat--comments');
  photoElement.querySelector('.picture__img').src = photo.url;
  pictureLikes.textContent = photo.likes;
  pictureComments.textContent = photo.comments.length;
  return photoElement;
};

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('.social__comments');

/**
 * @param {HTMLElement} elem
 */
const removeChildren = function (elem) {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
};

const comment = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

/**
 * @param {Array} photo
 */
const fillComments = function (photo) {
  removeChildren(socialComments);
  const commentElement = comment.cloneNode(true);
  photo.comments.forEach(function (comment) {
    commentElement.querySelector('.social__text').textContent = comment;
    commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(2, 6) + '.svg';
    socialComments.appendChild(commentElement.cloneNode(true));
  });
};

/**
 * @param {Array} photo
 * @return {HTMLElement}
 */
const showBigPhoto = function (photo) {
  // bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  fillComments(photo);
  return bigPicture;
};

const photos = Array.from({length: AMOUNT_PHOTOS});
const fragment = document.createDocumentFragment();

// Заполнение массива фотографий
photos.forEach(function (element, index, arr) {
  element = createPhoto(index);
  arr[index] = element;
  fragment.appendChild(renderPhoto(element));
});

picturesContainer.appendChild(fragment);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

/**
 *  Задание 2
 */
const uploadFileButton = picturesContainer.querySelector('#upload-file');
const windowEditingImg = picturesContainer.querySelector('.img-upload__overlay');
const closeEditingImgButton = windowEditingImg.querySelector('.cancel');
const scalePin = windowEditingImg.querySelector('.scale__pin');

const ESC_KEYCODE = 27;

const onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopupEdit();
    closePopupPicture();
  }
};

const addEvtListenerPopupEsc = function() {
  document.addEventListener('keydown', onPopupEscPress);
};

const removeEvtListenerPopupEsc = function() {
  document.removeEventListener('keydown', onPopupEscPress);
};

const openPopupEdit = function () {
  windowEditingImg.classList.remove('hidden');
  addEvtListenerPopupEsc();
};

const closePopupEdit = function () {
  windowEditingImg.classList.add('hidden');
  removeEvtListenerPopupEsc();
};

const openPopupPicture = function () {
  bigPicture.classList.remove('hidden');
  addEvtListenerPopupEsc();
};

const closePopupPicture = function () {
  bigPicture.classList.add('hidden');
  removeEvtListenerPopupEsc();
};

const previewImg = function () {
  const picture = picturesContainer.querySelector('.img-upload__preview img');//повторяется
  const uploadFile = uploadFileButton.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    picture.src = reader.result;
  };

  if (uploadFile) {
    reader.readAsDataURL(uploadFile);
  } else {
    picture.src = "";
  }
};

const calcPositionPinProcent = function () {
  const widthPinParent = scalePin.offsetParent.offsetWidth;
  const positionPin = scalePin.offsetLeft;
  const positionPinProcent = Math.round(positionPin * 100 / widthPinParent);
};

const linksToPhoto = picturesContainer.querySelectorAll('a');
const closeBigPicture = bigPicture.querySelector('.big-picture__cancel');

const hashtagsTextInput = windowEditingImg.querySelector('.text__hashtags');
const descriptionTextarea = windowEditingImg.querySelector('.text__description');

const verificationHashtagsInput = function () {
  const hashtagsString = hashtagsTextInput.value.split(' ');
  const hash = '#';
  let textCustomValidity = '';

  if (hashtagsString.length > 5) {
    textCustomValidity += 'Хэштегов не должно быть больше 5. ';
  }

  hashtagsString.forEach(function (element, index) {
      if (element[0] != hash) {
        textCustomValidity += 'Хэштег должен начинаться с #. ';
      }
      for (let j = index + 1; j < element.length; j++) {
        if (element[0] === element[j])
          textCustomValidity += 'Хэштеги должны быть разделены пробелами. ';
      }

      if (element.length < 2 || element.length > 20) {
        textCustomValidity += 'Хэштег должен быть больше 2 и меньше 20 символов включая #. ';
      }
      for (let j = index + 1; j < hashtagsString.length; j++) {
        if (element.toLowerCase() === hashtagsString[j].toLowerCase())
          textCustomValidity += 'Хэштеги не должны повторяться. ';
      }

      hashtagsTextInput.setCustomValidity(textCustomValidity);
    }
  );
};

const showEffect = function () {
  const effectsInput = windowEditingImg.querySelectorAll('.effects__radio');
  const picture = picturesContainer.querySelector('.img-upload__preview img');//повторяется
  const effectsPreview = windowEditingImg.querySelectorAll('.effects__preview');

  effectsInput.forEach(function (element, index) {
    element.addEventListener('click',function () {
      const pictureClass = picture.className;
      const effectPreview = effectsPreview[index].className.split(' ');

      if (pictureClass) {
        picture.classList.remove(pictureClass);
      }
      picture.classList.add(effectPreview[2]);

    });
  });
};

// увеличение масштаба фото
const changingScale = function () {
  const picture = picturesContainer.querySelector('.img-upload__preview img');//повторяется
  const decreaseScaleBatton = windowEditingImg.querySelector('.scale__control--smaller');
  const increaseScaleBatton = windowEditingImg.querySelector('.scale__control--bigger');
  const valueScale = windowEditingImg.querySelector('.scale__control--value');

  const percentChangeStep = 25;
  const percentMin = '25%';
  const percentMax = '100%';

  const changeScaleValue = function () {
    valueScale.value = numericalValueScale + '%';
    picture.style.transform = 'scale(' + numericalValueScale/100 + ')';
  };

  valueScale.value = percentMax;

  let numericalValueScale = Number((valueScale.value.replace('%','')));
  picture.style.transform = 'scale(' + numericalValueScale/100 + ')';

  decreaseScaleBatton.addEventListener('click', function () {
    if (valueScale.value !== percentMin) {
      numericalValueScale = numericalValueScale - percentChangeStep;
      changeScaleValue();
    }
  });
  increaseScaleBatton.addEventListener('click', function () {
    if (valueScale.value !== percentMax) {
      numericalValueScale = numericalValueScale + percentChangeStep;
      changeScaleValue();
    }
  });
};

changingScale();

uploadFileButton.addEventListener('change', function () {
  openPopupEdit();
  previewImg();
});

closeEditingImgButton.addEventListener('click', function () {
  closePopupEdit();
  uploadFileButton.value = '';
});

closeBigPicture.addEventListener('click', closePopupPicture);

scalePin.addEventListener('mouseup', calcPositionPinProcent);

linksToPhoto.forEach(function (element, index) {
  element.addEventListener('click', function () {
    openPopupPicture();
    showBigPhoto(photos[index]);
  });
});

hashtagsTextInput.addEventListener('focus', removeEvtListenerPopupEsc);
hashtagsTextInput.addEventListener('blur', addEvtListenerPopupEsc);
descriptionTextarea.addEventListener('focus', removeEvtListenerPopupEsc);
descriptionTextarea.addEventListener('blur', addEvtListenerPopupEsc);

verificationHashtagsInput();

showEffect();
