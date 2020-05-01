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
