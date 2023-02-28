(function () {
  let listArray = [],
    keyList = '';
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    // можно использовать textContent
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    button.disabled = true;

    input.addEventListener('input', function () {
      if (!input.value == '') {
        button.disabled = false;
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm')
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    item.id = obj.id;

    if (obj.done) item.classList.add('list-group-item-success');

    // item.id = obj.id;

    // добавляем обработчики на кнопки
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const item of listArray) {
        if (item.id == obj.id) {
          item.done = !item.done;
        }
        saveList(listArray, keyList);
      }
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) {
            listArray.splice(i, 1);
          }
          saveList(listArray, keyList);
        }
      }
    });
    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  function saveList(arr, key) {
    //  JSON.stringify(arr) преобразуем наш массив в строку
    localStorage.setItem(key, JSON.stringify(arr))
  }

  function createTodoApp(container, title = 'Список дел', key, defArr) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    keyList = key;

    let localDate = localStorage.getItem(keyList);
    if (localDate !== null && localDate !== '') {
      listArray = JSON.parse(localDate)
    }
    else {
      listArray = defArr;
      saveList(listArray, keyList);
    }

    for (const item of listArray) {
      let todoItem = createTodoItem(item);
      todoList.append(todoItem.item);
    }

    // браузер создает событие submit по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагрузажалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      // пустой return отменяет дальшнейший код в функции
      if (!todoItemForm.input.value) {
        return;
      }

      let newTodo = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(newTodo);

      listArray.push(newTodo);

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      saveList(listArray, keyList);
      todoItemForm.button.disabled = true;
      let todoItems = document.getElementsByName('list-group');

      // обнуляем значение в поле, чтобы не пришлось стирать его в вручную
      todoItemForm.input.value = '';
    });
  }

  // document.addEventListener('DOMContentLoaded', function() {
  //   createTodoApp(document.getElementById('my-todos'), 'Мои дела');
  //   createTodoApp(document.getElementById('mom-todos'), 'Дела для мамы');
  //   createTodoApp(document.getElementById('dad-todos'), 'Дела для папы');
  // });

  // записываем метод createTodoApp в глобальный объект window
  window.createTodoApp = createTodoApp;

})();