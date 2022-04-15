// Instagram проект

const API = "http://localhost:8000/posts";

//  переменные для инпутов(добавление поста)

let input = $('.input');
let avatar = $('#avatar')
let nickname = $('#nickname');
let image = $('#image');
let descr = $('#descr');
let btnAdd = $('#btn-add');

// Переменные для изменения поста

let editAvatar = $('#editAvatar')
let editNickname = $('#editNickname');
let editImage = $('#editImage');
let editDescr = $('#editDescr');
let btnEdit = $('#btn-save-edit');
let editFormModal = $('#exampleModal');
let editFormModal2 = $('#exampleModal2');

// Блок с постами

let list = $('#posts-list');

// Пагинация

let currentPage = 1;
let pageTotalCount = 1;

let prev = $('.prev');
let next = $('.next');

let paginationList = $('.pagination-list');

// Поисковик

let search = $('#search');
let searchVal = '';

// Логика

render();

btnAdd.on('click', function() {
  let obj = {
    avatar: avatar.val(),
    nickname: nickname.val(),
    image: image.val(),
    descr: descr.val(),
  };
  setItemToJson(obj);
  editFormModal.modal('hide');
  input.val('')
});

function setItemToJson(obj) {
  fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  }).then(() => {
    return render();
  });
}

function render() {
  fetch(`${API}?q=${searchVal}&_limit=8&_page=${currentPage}`).then((res) => {
    return res.json();
  }).then((data) => {
    list.html('');
    data.forEach((elem) => {
      let item = drawPostCard(elem);
      list.append(item);
    })
    drawPaginationButtons();
  });
}

function drawPostCard(elem) {
  return `
  <div class="card ms-3 mb-4" style="width: 47rem;">
  <div class="d-flex justify-content-start align-items-center ms-3">
    <div style="border-radius: 50%; background-image: url(${elem.avatar}); width: 50px; height: 50px; background-repeat: no-repeat; -moz-background-size: 100%; background-size: 100%; -o-background-size: 100%; -webkit-background-size: 100%;"></div>
    <div> 
      <h6 class="card-title mx-3 mb-0 mt-3">${elem.nickname}</h6>
      <p class="mx-3">Makers Bootcamp, Табышалиева 29</p>
    </div>
  </div>


  <img src=${elem.image} class="card-img-top img-fluid" alt="${elem.nickname}">
  <div class="card-body">
    <div class="d-flex mb-3">
    <svg aria-label="Нравится" class="_8-yf5 me-3 like-btn" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
    <svg aria-label="Комментировать" class="_8-yf5 me-3" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
    <svg aria-label="Поделиться публикацией" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
    </div>
    <div class="likes d-flex align-items-center"><h6 class="mb-0 me-1">${getRandomInt(10000)} </h6>отметок "Нравится"</div>
    <div class="d-flex mt-3 align-items-center">
      <h6 class="card-title me-2 mb-0" style="margin-bottom: 2px !important;">${elem.nickname}</h6><p class="card-text">${elem.descr}</p>
    </div>
    <div class="">
      <p class="mb-1" style="color: #8e8e8e">Посмотреть все комментарии (${getRandomInt(1000)})</p>
      <p class="mb-1" style="font-size: 14px; color: #8e8e8e">${getRandomInt(60)} минут назад</p>
    </div>
    <div class="buttons d-flex justify-content-end">
      <a href="#" class="btn btn-info btn-edit mx-3" id="${elem.id}" data-bs-toggle="modal" data-bs-target="#exampleModal2">EDIT</a>
      <a href="#" class="btn btn-secondary btn-delete" id=${elem.id}>DELETE</a>
    </div>
  </div>
  </div>
  `;
}

// DELETE

$('body').on('click', '.btn-delete', (e) => deleteProduct(e.target.id));

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  render();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// EDIT

$('body').on('click', '.btn-edit', function() {
  fetch(`${API}/${this.id}`).then((res) => {
    return res.json();
  }).then((data) => {
    editAvatar.val(data.avatar);
    editNickname.val(data.nickname);
    editDescr.val(data.descr);
    editImage.val(data.image);
    btnEdit.attr("id", data.id);
  });
});

btnEdit.on('click', function() {
  let id = this.id;
  let avatar = editAvatar.val();
  let nickname = editNickname.val();
  let descr = editDescr.val();
  let image = editImage.val();

  let editedPost = {
    avatar: avatar,
    nickname: nickname,
    descr: descr,
    image: image,
  };

  saveEdit(editedPost, id);
});

function saveEdit(editedPost, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedPost),
  }).then(() => {
  render();
  editFormModal2.modal('hide');
});
}

// SEARCH

search.on('input', function() {
  searchVal = search.val();
  render();
});

// PAGINATION

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`).then((res) => res.json()).then((data) => {
    pageTotalCount = Math.ceil(data.length/8);
    paginationList.html('');

    for(let i = 1; i <= pageTotalCount; i++) {
      if(currentPage == i) {
        paginationList.append(`<li class="page-item"><a class="page-link bg-dark text-white page-number active pagination-active-color-black pagingation-active-bg-light" href="#">${i}</a></li>`);
      } else {
          paginationList.append(`<li class="page-item"><a class="page-link bg-dark text-white page-number" href="#">${i}</a></li>`);
      }
    }
  });
}

$('body').on('click', '.page-number', function() {
  currentPage = this.innerText;
  render();
});

prev.on('click', function() {
  if (currentPage <= 0) {
    return;
  } else {
    currentPage--;
    render();
  }
})

next.on('click', function() {
  if (currentPage >= pageTotalCount) {
    return;
  } else {
    currentPage++;
    render();
  }
})
