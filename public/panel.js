/*

This file defines the functions, the panel page will call the functions with it's set parameters.

*/

function getTasks(rank) {
  $(function () {
    $.get(`/api/tasks/${rank}`, function (tasks) {
      tasks.forEach( function(task) {

      });

    })
  })
}

function getStaff() {
  $(function () {
    $.get('/api/staff', function(members) {
      members.forEach( function(member) {
        let card = `
          <div class="col-sm-6 mt-3">
            <div class="p-3 border-${member[1].toLowerCase()}">
              <h1 class="title-staff mb-1 pb-2">${member[0]}</h1>
              Rank: ${member[1]}
            </div>
          </div>
          `;
      })
    })
  })
}
