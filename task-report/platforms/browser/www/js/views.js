// File with all 'Views' of the application

const Views = {
  Launch: function() {
    if (Views.State.Activity) {
      Views.Activities(Views.State.Activity);
    } else {
      Views.State.token = "ac58bc1485ef03d4e5a815a6785bc8f4feefe27a";
      getAndStoreMembersList();
      Views.Activities();
    }
  },

  // Login : function(){
  //   $.get('../templates/login.mst', (template) => {
  //     var renderString = Mustache.render(template);
  //     $('.app').append(renderString);
  //     buildButton({ id: "button-get-attendees", text: "Login", target: t, parentSelector: ".app"});
  //   })
  //   var t = function(){
  //     $.ajax({
  //         type: "POST",
  //         url: "https://api.ca.d4h.org/v2/account/authenticate",
  //         data: $("form").serialize(),
  //         // processData: false, // need this or will return 'boundary not set' error (?)
  //         // contentType: false, // same here - basically, we need jQuery to fall back to 'default'
  //         success: (response) => {
  //           Views.State.token = response.data.token
  //           Views.Activities()
  //         },
  //         error: (err) => {
  //           alert("Login fail");
  //         }
  //       });
  //   }
  //
  // },

  // Views: this,
  Activities: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "activities" });
    buildHeader({ title: "Create Incident", hideBackButton: true });
    createIncident({startDate: getDate(), endDate: getDate()});
  },

  Members: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "activities" });
    buildHeader({ title: "Choose Attendees", target: Views.Activities });
    var lom1;
    var lom2;
    var lom3;
    if (localStorage.getItem("members")) {
      console.log("Retreiving stored members list...");
      var members = JSON.parse(localStorage.getItem("members"));
      buildTable({ DOMid: "choose-attendees-table", inputType: "checkbox", "data-list": members.map(el => { return { id: el.id, content: el.name } }) });
    } else {
      console.log("Epic fail!!!");
    }
    buildButton({ id: "button-show-attendees", text: "Continue", target: Views.Report, parentSelector: ".app"});
  },

  Report: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "activities" });
    buildHeader({ title: "Fill Report", target: Views.Members });
    buildButton({ id: "submit-incident", text: "Submit", target: Views.Activities, parentSelector: ".app"});
  },

  // CreateActivity: function() {
  //   $.ajax({
  //     type: "POST",
  //     d
  //   });
  // },
  //
  // Attendees: function(activityId) {
  //   Views.State.Activity = activityId;
  //   createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "activities" });
  //   buildHeader({ title: "Attendees", target: Views.Activities });
  //   $.ajax({
  //     type: "GET",
  //     dataType: "json",
  //     url: "https://api.ca.d4h.org/v2/team/attendance?activity_id=" + activityId,
  //     headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
  //     success: (response) => {
  //       Views.State.allAttendanceRecords = response.data;
  //       buildTable({ DOMid: "attendee-table", inputType: "checkbox", "data-list": response.data.map( el => { return { id: el.member.id, content: el.member.name, status: el.status === "attending" }})});
  //       scrollToTop();
  //       var t = function() {
  //         return Views.AttendeesConfirmed($('#form-attendee-table input')
  //           .filter( (index,input) => {return input.checked})
  //           .map( (i,el) => { return {id: $(el).attr('data-id'), content: $(el).parent().text() } })
  //           .toArray());
  //       };
  //       buildButton({ id: "button-show-attendees", text: "Confirm", target: t, parentSelector: ".app"});
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // },
  //
  // AttendeesConfirmed: function(confirmedAttendees) {
  //   Views.State.ConfirmedAttendees = confirmedAttendees;
  //   buildHeader({  title: "Confirmed Attendees", target: () => { Views.Attendees(Views.State.Activity) } });
  //   buildTable({ DOMid: "attendee-confirmed-table", "data-list": confirmedAttendees });
  //   $('#back-button').click(() => { Views.Attendees(Views.State.Activity)});
  //   scrollToTop()
  //   buildButton({ id: "button-confirm-attendees", text: "Lock In", target: sendToDatabase, parentSelector: ".app"});
  //
  // },

  Repair: function() {
    // do something
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "repairs" });
    buildHeader({ title: "Repair", hideBackButton: true });
  },

  // State: { Activity, ConfirmedAttendees}
  InitializeState: function() {
    Views.State = {}
    // var oldState = window.localStorage.getItem("sar-state");
    // if (oldState != "null" && oldState != undefined) {
    //   Views.State = JSON.parse(oldState);
    //   // alert('Previous state: ' + JSON.stringify(Views.State));
    // } else {
    //   Views.State = {}
    // }
    // window.setInterval(() => {
    //   if (Views.State != null) {
    //     window.localStorage.setItem("sar-state", JSON.stringify(Views.State))
    //     }
    //   }
    //   , 500);
  }
}
