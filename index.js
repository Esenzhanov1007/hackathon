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
  fetch(`${API}?q=${searchVal}&_limit=9&_page=${currentPage}`).then((res) => {
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
  <div class="card main-card p-3 mb-4 col-4" style="border:none;">
  
    <div class="d-flex justify-content-start align-items-center ms-3">
    </div>


    <img src=${elem.image} class="card-img-top w-100 h-100" alt="${elem.nickname}">
    <div class="card-body">
      <div class="buttons d-flex justify-content-end">
        <a href="#" class="btn btn-info btn-edit mx-3" id="${elem.id}" data-bs-toggle="modal" data-bs-target="#exampleModal2">EDIT</a>
        <a href="#" class="btn btn-secondary btn-delete" id=${elem.id}>DELETE</a>
      </div>
    </div>
  </div>
  `;
}

search.on('input', function() {
  searchVal = search.val();
  render();
});

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
    pageTotalCount = Math.ceil(data.length/9);
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
