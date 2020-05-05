/*

This file defines the functions, the panel page will call the functions with it's set parameters.

*/

let localTasks = [];

class Task {
  constructor(name, desc, status, id) {
    this.name = name;
    this.desc = desc;
    this.status = status;
    this.id = id;
  }

  upgrade() {

    //Remove element
    $(`#${this.id}`).remove();

    this.status += 1;

    let append = `
    <li class="task-item" id="${this.id}">
      <h2 class="task-name">${this.name}</h2>
      <div class="task-desc">${this.desc}</div>
      <button class="btn btn-primary mt-4 mb-3" onclick="upgrade('${this.id}')">Next</button>
    </li>
    `;

    //Remove element
    switch (this.status) {

      //Removed case 0 because nothing gets advance to 0/

      case 1:
        $("#inprogress").append(append);
        break;

      case 2:
        $("#finished").append(append);
        break;

      case 3 || 4 || 5:
        $(`#${this.id}`).remove();

        //TODO DELETE FROM SERVER

        $.get(`/api/tasks/delete/${this.id}`, function(code) {
          if (code == 0 || code.toLowerCase() == "ok") {
            swal({
              title: "Deleted",
              text: 'Task deleted',
              icon: 'success',
              button: 'Ok'
            })
          }
        })

        break;
    }

  }

}

function upgrade(taskId) {
  for (var i = 0; i < localTasks.length; i++) {
    let task = localTasks[i];

    if (task.id == taskId) {
      task.upgrade();
    }

  }
}

function getServerTasks(rank) {
  $(function () {
    $.get(`/api/tasks/${rank}`, function (tasks) {
      tasks.forEach( function(task) {

        let append = `
        <li class="task-item" id="${task[3]}">
          <h2 class="task-name">${task[0]}</h2>
          <div class="task-desc">${task[1]}</div>
          <button class="btn btn-primary mt-4 mb-3" onclick="upgrade('${task[3]}')">Next</button>
        </li>
        `;

        let newTask = new Task(task[0], task[1], task[2], task[3]);
        localTasks.push(newTask);

        switch (task[2]) {

          case 0:
            $("#notstarted").append(append);
            break;

          case 1:
            $("#inprogress").append(append);
            break;

          case 2:
            $("finished").append(append);
            break;

          default:
            console.log(`!!ERROR!!\nUnexpected status code, task:\n${task}`);
            break;
        }
      });

    })
  })
}

function refreshTasks() {

}

function getStaff() {
  $(function () {
    $.get('/api/staff', function(members) {
      members.forEach( function(member) {
        let card = `
          <div class="col-sm-6 mt-3">
            <div class="p-3 border-${member[1].toLowerCase()}">
              <h1 class="title-staff mb-1 pb-2">${member[0]}</h1>
              Rank: ${member[1].toUpperCase()}
            </div>
          </div>
          `;

        $('#staff').append(card);
      })
    })
  })
}
