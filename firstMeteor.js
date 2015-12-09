tasksData = new Meteor.Collection("tasksData");
History = new Meteor.Collection("history");

if (Meteor.isClient) {

  Meteor.subscribe("allTasks");
  Meteor.subscribe("history");

  Template.tasks.helpers({
      user: function () {
        var item =  tasksData.findOne();  
        if(!item) {
            item = {
              userId: Meteor.userId(),
              total: 0,
              must: 300
            };
            tasksData.insert(item);
        }
        return item;
      }
  });
    
  Template.history.helpers({
      taskItem: function () {
        return History.find({}, {sort: { date: -1}}, {});   
      }
  });

  Template.tasks.events({
      "click #taskButton": function (e) {
          e.preventDefault();
          var alerted = localStorage.getItem('alerted') || '';
          var valOfTask = $("#taskName").val();
          if (valOfTask) {
            tasksData.update(this._id, {$inc: { total: 1}});
            tasksData.update(this._id, {$inc: { must: -1}});
            var newDate = new Date();
            History.insert({
              value: valOfTask,
              date: newDate.getHours() + ":" + newDate.getMinutes(),
              userId: this.userId
            });
          }
          else {
            if (alerted != 'yes') {
             alert("Please enter task to apply!");
             localStorage.setItem('alerted','yes');
            }
          }
      }
  });
}

if (Meteor.isServer) {

  Meteor.publish("allTasks", function (){
    return tasksData.find({ userId: this.userId });
  });

  Meteor.publish("history", function (){
    return History.find({ userId: this.userId });
  });

  Meteor.startup(function () {
    // code to run on server at startup
      
  });
}
