// todo object
const todo = {
    action(e) {
        const target = e.target;
        if (target.classList.contains('todo__action')) {
            const action = target.dataset.todoAction;
            const elemItem = target.closest('.todo__item');
            const subTask = target.closest(".subtask__item");
            // delete main task
            if (action === 'deleted' || elemItem.dataset.todoState === 'deleted') {
                elemItem.remove();
            }
            // delete the subtask
            else if(action === 'sub-deleted' || elemItem.dataset.todoState === 'sub-deleted') {
                //elemItem.querySelector(".subtask__item").remove();
                subTask.remove();
            }
            // logic if subtask is completed
            else if(action === 'sub_completed' || elemItem.dataset.todoState === 'sub_completed') {
                subTask.dataset.todoState = action;
                subTask.style.background = "var(--subtask-complete-bg)";
                const complStatus = {
                    sub_completed: "Выполнена"
                };
                const currentAddDate = subTask.querySelector('.subtask_add-date');
                const insertAddDate = `<br><span class="subtask_completed-date">${complStatus[action]}: ${new Date().toLocaleString()}</span>`;
                currentAddDate.insertAdjacentHTML("beforeend", insertAddDate);
            }
            // add subtask before click "add" btn in main task
            else if(action === "add_subtask" || elemItem.dataset.todoState === "add_subtask") {
                elemItem.querySelector(".insert__subtask").style.display = "flex";
                //elemItem.querySelector(".subtask__items").insertAdjacentHTML("beforeend", this.subtask());
                elemItem.insertAdjacentHTML("beforeend", this.subtaskModal());
            }
            // create a subtask enter modal window and create subtask element with text in modal window
            else if(action === 'subtask-stat-input' || elemItem.dataset.todoState === "subtask-stat-input") {
                const subtaskEnterText = elemItem.querySelector(".subtask_text-inp").value;
                //alert(subtaskEnterText);
                if(subtaskEnterText != "") {
                    elemItem.querySelector('.subtask__items').insertAdjacentHTML("beforeend", this.subtask(subtaskEnterText));
                    elemItem.querySelector(".subtask__modal_wrapper").remove();
                }
                else {
                    elemItem.querySelector(".subtask__modal_wrapper").remove();
                }
            }
            // set task "Main" state
            else if(action === 'set_not_main' || elemItem.dataset.todoState === 'set_not_main') {
                elemItem.querySelector(".task_main_set").classList.add("task_main");
                elemItem.querySelector(".task_main_set").dataset.todoAction = 'set_main';
                elemItem.querySelector(".task__block").style.background = "var(--main-task-bg)";
            }
            // set task "not Main" state
            else if(action === 'set_main' || elemItem.dataset.todoState === 'set_main') {
                elemItem.querySelector('.task_main_set').classList.remove('task_main');
                elemItem.querySelector('.task_main_set').classList.add("task_is_not_main");
                elemItem.querySelector('.task_main_set').dataset.todoAction = 'set_not_main';
                elemItem.querySelector(".task__block").style.background = "var(--task-bg)";
            }
            // update the task & subtask statuses
            else {
                elemItem.dataset.todoState = action;
                const complStatus = {
                    active: 'Восстановлена',
                    completed: 'Завершена',
                    deleted: 'Удалена'
                };
                const currentAddDate = elemItem.querySelector('.todo__date');
                const insertAddDate = `<span>${complStatus[action]}: ${new Date().toLocaleString().slice(0, -3)}</span>`;
                currentAddDate.insertAdjacentHTML('beforeend', insertAddDate);
            }
            this.save();
        } 
        else if (target.classList.contains('todo__add')) {
            this.add();
            this.save();
        }
    },
    // method of add all
    add() {
        const elemText = document.querySelector('.todo__text');
        if (elemText.disabled || !elemText.value.length) {
            return;
        }
        document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
        elemText.value = '';
    },
    // method of create a subtask
    subtask(text) {
        const date = new Date().toLocaleDateString();
        return `
            <li class="subtask__item">
                <div class="subtask_content">
                    ${text} <br>
                    <span class="subtask_add-date">Добавлена: ${date}</span>
                </div>
                <div class="subtask_settings">
                    <span class="todo__action todo__action_complete" data-todo-action="sub_completed"></span>
                    <span class="todo__action todo__action_delete" data-todo-action="sub-deleted">
                </div>
            </li>
        `;
    },
    // method of create a subtask add modal window
    subtaskModal() {
        //return this.subtask();
        return `
            <div class="subtask__modal_wrapper">
                <div class="modal-content">
                    <label for="subtaskEnterText">Текст подзадачи</label>
                    <input id="subtaskEnterText" class="todo__text subtask_text-inp" type="text">
                    <button class="todo__action subtask_text_save-btn" data-todo-action="subtask-stat-input">Добавить</button>
                </div>
                <div class="modal-fade"></div>
            </div>
        `;
    },
    // method of create a main task
    create(text) {
        const date = JSON.stringify({ add: new Date().toLocaleString().slice(0, -3) });
        return `
        <li class="todo__item" data-todo-state="active">
            <div class="task__block">
                <div>
                    <span class="todo__task">
                        <span class="theme_name">Тема</span>
                        <span class="task_theme">${text}</span>
                        <span class="todo__date" data-todo-date="${date}">
                        <span>Добавлена: ${new Date().toLocaleString().slice(0, -3)}</span>
                        </span>
                    </span>
                    <span class="todo__action task_main_set task_is_not_main" data-todo-action="set_not_main"></span>
                </div>
                <div>
                    <span class="todo__action todo__action_restore" data-todo-action="active"></span>
                    <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
                    <span class="todo__action todo__action_delete" data-todo-action="deleted"></span>
                    <span class="todo__action todo__action_add" data-todo-action="add_subtask"></span>
                </div>
            </div>
            <div class="insert__subtask">
                <ul class="subtask__items"></ul>
            </div>
        </li>`;
    },
    // initialisation of todo
    init() {
        const fromStorage = localStorage.getItem('todo');
        if (fromStorage) {
        document.querySelector('.todo__items').innerHTML = fromStorage;
        }
        document.querySelector('.todo__options').addEventListener('change', this.update);
        document.addEventListener('click', this.action.bind(this));
    },
    // update the changes
    update() {
        const option = document.querySelector('.todo__options').value;
        document.querySelector('.todo__items').dataset.todoOption = option;
        document.querySelector('.todo__text').disabled = option !== 'active';
    },
    // save data to local storage
    save() {
        localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
    }
};
// start todo
todo.init();
  