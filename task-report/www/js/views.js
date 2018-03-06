// File with all 'Views' of the application

const Views = {
  // Views: this,
  Activities: function() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/activities",
      param: { after: (new Date()).toISOString() },
      headers: { Authorization: "Bearer 65dbc92f80012cdbc4e556806adef646e8b8fa98"},
      success: (response) => {
        buildHeader({ title: "Select Activity", hideBackButton: true });
        buildTable({ DOMid: "activity-table", groupName: "act", inputType: "radio", "data-list": response.data.map( el => { return { id: el.id, content: el.ref_desc } } )});
        var t = function() {
          return Views.Attendees($('#form-activity-table input').filter( (index,input) => {return input.checked})[0].id);
        };
        buildButton({ id: "button-get-attendees", text: "Select", target: t, parentSelector: ".app"});;
      },
      error: () => {
        console.log(err)
      }
    });
  },

  Attendees: function(activityId) {
    Views.State.Activity = activityId;
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance",
      param: { activity_id: activityId },
      headers: { Authorization: "Bearer 65dbc92f80012cdbc4e556806adef646e8b8fa98"},
      success: (response) => {
        buildHeader({ title: "Attendees", target: Views.Activities });
        buildTable({ DOMid: "attendee-table", inputType: "checkbox", "data-list": response.data.map( el => { return { id: el.member.id, content: el.member.name}})});
        scrollToTop();
        var t = function() {
          return Views.AttendeesConfirmed($('#form-attendee-table input')
            .filter( (index,input) => {return input.checked})
            .map( (i,el) => { return {id: el.id, content: $(el).parent().text() } })
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
    buildTable({ DOMid: "attendee-confirmed-table", "data-list": confirmedAttendees});
    $('#back-button').click(() => { Views.Attendees(Views.State.Activity)});
    scrollToTop()
  },

  // State: { Activity, ConfirmedAttendees}
  State: {}
}

function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}

