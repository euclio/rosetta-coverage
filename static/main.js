document.addEventListener('DOMContentLoaded', function() {
  var tasksTemplate = Handlebars.compile(document.getElementById('tasks-template').textContent);
  var firebase = new Firebase("https://rosetta-coverage.firebaseio.com/");
  firebase.child("tasks").once("value", function(snapshot) {
    var html = tasksTemplate(snapshot.val());
    document.getElementById('tasks').innerHTML = html;

    var taskList = new List('tasks', {
      valueNames: [
        'name',
        { 'name': 'title', 'attr': 'data-title' },
        { 'name': 'local', 'attr': 'title' },
        { 'name': 'remote', 'attr': 'title' },
      ]
    });

    var radioButtons = document.querySelectorAll('input[type=radio');

    [].forEach.call(radioButtons, function(element) {
      element.addEventListener('click', function(event) {
        taskList.filter();

        var filter = (event.srcElement || event.target).value;
        taskList.filter(function(item) {
          if (filter === 'local') {
            return item.values().local === 'Yes' && item.values().remote === 'No';
          } else if (filter === 'remote') {
            return item.values().remote === 'Yes' && item.values().local === 'No';
          } else if (filter === 'unimplemented') {
            return item.values().remote === 'No' && item.values().local === 'No';
          }

          return true;
        });
      })
    });
  });
});
