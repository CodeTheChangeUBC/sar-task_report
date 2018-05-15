// File with all 'Views' of the application

const Views = {
  Launch: function() {
    // if (Views.State.Activity) {
      // Views.Activities(Views.State.Activity);
    // } else {
      Views.State.token = "ac58bc1485ef03d4e5a815a6785bc8f4feefe27a";
      getAndStoreMembersList();
      getAndStoreIncidents();
      Views.Activities();
    // }
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
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "activities" });
    buildHeader({ title: "Create Incident", hideBackButton: true });
    createIncident({startDate: getDate(), endDate: getDate()});
  },

  Members: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "activities" });
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
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "activities" });
    buildHeader({ title: "Fill Report", target: Views.Members });
    buildButton({ id: "submit-incident", text: "Submit", target: Views.Activities, parentSelector: ".app"});
  },

  Attendance: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "attendance" });
    buildHeader({ title: "Select Activity", hideBackButton: true });
    if (localStorage.getItem("incidents")) {
      console.log("Retreiving stored incidents...");
      var incidents = JSON.parse(localStorage.getItem("incidents"));
      buildTable({ DOMid: "activity-table", groupName: "act", inputType: "radio", "data-list": incidents.map( el => { return { id: el.id, content: el.ref_desc } } )});
      var t = function() {
        if(!$('#form-activity-table input').filter( (index,input) => {return input.checked}).attr('data-id')) {
          alert("Please select an activity.");
          return false;
        } else {
          return Views.Attendees($('#form-activity-table input').filter( (index,input) => {return input.checked}).attr('data-id'));
        }
      };
      buildButton({ id: "button-get-attendees", text: "Select", target: t, parentSelector: ".app"});;
    } else {
      console.log("Epic fail!!!");
    }
  },

  Attendees: function(activityId) {
    Views.State.Activity = activityId;
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "attendance" });
    buildHeader({ title: "Attendees", target: Views.Attendance });
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance?activity_id=" + activityId,
      headers: { Authorization: "Bearer " + Views.State.token},
      success: (response) => {
        Views.State.allAttendanceRecords = response.data;
        buildTable({ DOMid: "attendee-table", inputType: "checkbox", "data-list": response.data.map( el => { return { id: el.member.id, content: el.member.name, status: el.status === "attending" }})});
        scrollToTop();
        var t = function() {
          return Views.AttendeesConfirmed($('#form-attendee-table input')
            .filter( (index,input) => {return input.checked})
            .map( (i,el) => { return {id: $(el).attr('data-id'), content: $(el).parent().text() } })
            .toArray());
        };
        buildButton({ id: "button-show-attendees", text: "Confirm", target: t, parentSelector: ".app"});
      },
      error: (err) => {
        console.log(err);
        createErrorMessage({message: "Check internet connection and try again."});
      }
    });
  },

  AttendeesConfirmed: function(confirmedAttendees) {
    Views.State.ConfirmedAttendees = confirmedAttendees;
    createNavbar({ target1: Views.Activities, target2: Views.Attendance, target3: Views.Repair, active: "attendance" });
    buildHeader({  title: "Confirmed Attendees", target: () => { Views.Attendees(Views.State.Activity) } });
    buildTable({ DOMid: "attendee-confirmed-table", "data-list": confirmedAttendees });
    // $('#back-button').click(() => { Views.Attendees(Views.State.Activity)});
    // scrollToTop()
    buildButton({ id: "button-confirm-attendees", text: "Lock In", target: Views.Activities, parentSelector: ".app"});

  },

  Repair: function() {
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "repairs" });
    buildHeader({ title: "Submit a Request to Repair a Resource", hideBackButton: true });
    $.get('../templates/repair_form.mst', (template) => {
      empty_form_object = {equipment_id_value : "", title_value: "", member_id_value: "", repair_cost_value: "", date_due_value: "", activity_id_value:"", description_value: ""};
      var renderString = Mustache.render(template,empty_form_object);
      $('.app').append(renderString);
      buildButton({ id: "repair_resource_submit", text: "Submit", target: repair_submit, parentSelector: ".app"});
      buildButton({ id: "repair_resource_save", text: "Save All Changes", target: repair_save, parentSelector: ".app"});
      buildButton({ id: "repair_resource_clear", text: "Clear All", target: repair_clear, parentSelector: ".app"});

        if (Views.State.repair_form) {
          console.log("trying to restore previous values")
          previous_form_values = Views.State.repair_form;
          console.log(previous_form_values);
            previous_form_values.forEach(function(arrayItem){
              $("[name="+arrayItem.name+"]").val(arrayItem.value)
              console.log($("[name="+arrayItem.name+"]"));
            })
        }
      })

    var repair_clear = function(){
      $("#repair_form")[0].reset();
    }

    var repair_save = function(){
      Views.State.repair_form = $("#repair_form").serializeArray();
    }


    var repair_submit = function(){
      console.log($("#repair_form").serialize());
      Views.State.repair_form = $("#repair_form").serializeArray();
      console.log("stored the array" + Views.State.repair_form)
      $.ajax({
              type: "POST",
              url: "https://api.ca.d4h.org/v2/team/repairs",
              headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
              data: $("form").serialize(),
              success: (response) => {
                console.log(response)
                alert("Form successfully submitted")
              },
              error: (err) => {
                console.log(err)
                alert("Form was not submitted: " + err.responseJSON.message);
              }
            });
    }
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
