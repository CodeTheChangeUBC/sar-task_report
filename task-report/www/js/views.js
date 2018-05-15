// File with all 'Views' of the application

const Views = {
  Launch: function() {
    if (Views.State.Activity) {
      Views.Activities(Views.State.Activity);
    } else {
      Views.State.token = "ac58bc1485ef03d4e5a815a6785bc8f4feefe27a";
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


  // main views
  CreateAnIncident: function() {
    createNavbar({ incidentClass: "active", repairClass: "inactive", resourcesClass: "inactive" });
    return Views.Activities();
  },

  RepairForm: function() {
    createNavbar({ incidentClass: "inactive", repairClass: "active", resourcesClass: "inactive" });
    return Views.Repair();
  },

  FindResources: function() {
    createNavbar({ incidentClass: "inactive", repairClass: "inactive", resourcesClass: "active" });
    return Views.Resources();
  },

  // Views: this,
  Activities: function() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/incidents",
      param: { after: (new Date()).toISOString() },
      headers: { Authorization: "Bearer " + Views.State.token},
      success: (response) => {
        createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "activities" });
        buildHeader({ title: "Activities", hideBackButton: true });
        // buildTable({ DOMid: "activity-table", groupName: "act", inputType: "radio", "data-list": response.data.reverse().map( el => { return { id: el.id, content: el.ref_desc } } )});
        console.log(response);
        var t = function() {
          return Views.Attendees($('#form-activity-table input').filter( (index,input) => {return input.checked}).attr('data-id'));
        };
        // buildButton({ id: "button-get-attendees", text: "Select", target: t, parentSelector: ".app"});;
      },
      error: () => {
        console.log(err)
      }
    });
  },

  CreateActivity: function() {
    $.ajax({
      type: "POST",
      d
    });
  },

  Attendees: function(activityId) {
    Views.State.Activity = activityId;
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance?activity_id=" + activityId,
      headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
      success: (response) => {
        Views.State.allAttendanceRecords = response.data;
        buildHeader({ title: "Attendees", target: Views.Activities });
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
      }
    });
  },

  AttendeesConfirmed: function(confirmedAttendees) {
    Views.State.ConfirmedAttendees = confirmedAttendees;
    buildHeader({  title: "Confirmed Attendees", target: () => { Views.Attendees(Views.State.Activity) } });
    buildTable({ DOMid: "attendee-confirmed-table", "data-list": confirmedAttendees });
    $('#back-button').click(() => { Views.Attendees(Views.State.Activity)});
    scrollToTop()
    buildButton({ id: "button-confirm-attendees", text: "Lock In", target: sendToDatabase, parentSelector: ".app"});

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
          previous_form_values = Views.State.repair_form;
            previous_form_values.forEach(function(arrayItem){
              $("[name="+arrayItem.name+"]").val(arrayItem.value)
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
      Views.State.repair_form = $("#repair_form").serializeArray();
      $.ajax({
              type: "POST",
              url: "https://api.ca.d4h.org/v2/team/repairs",
              headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
              data: $("#repair_form :input").filter(function(index, element) {
                                          return $(element).val() != '';
                                                }).serialize(),
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

  Resources: function() {
    // do something
    createNavbar({ target1: Views.Activities, target2: Views.Repair, target3: Views.Resources, active: "resources" });
    buildHeader({ title: "Resources", hideBackButton: true });
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
