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
        buildTable({ DOMid: "activity-table", groupName: "act", inputType: "radio", title: "Select Activity", "data-list": response.data.map( el => { return { id: el.id, content: el.ref_desc } } )});
        var t = function() {
          return Views.Attendees($('#form-activity-table input').filter( (index,input) => {return input.checked})[0].id);
        };
        buildButton({ id: "button-get-attendees", text: "Select", target: t, parentSelector: ".app"});
      },
      error: () => {
        console.log(err)
      }
    });
  },

  Attendees: function(activityId) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance",
      param: { activity_id: activityId },
      headers: { Authorization: "Bearer 65dbc92f80012cdbc4e556806adef646e8b8fa98"},
      success: (response) => {
        buildTable({ DOMid: "attendee-table", inputType: "checkbox", title: "Attendees", "data-list": response.data.map( el => { return { id: el.member.id, content: el.member.name}})});
        scrollToTop();
        var t = function() {
          return Views.AttendeesConfirmed($('#form-attendee-table input').filter( (index,input) => {return input.checked}).map( (i,el) => { return {id: el.id, content: $(el).parent().text() } }).toArray());
        };
        buildButton({ id: "button-show-attendees", text: "Confirm", target: t, parentSelector: ".app"});
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  AttendeesConfirmed: function(confirmedAttendees) {
    buildTable({ DOMid: "attendee-confirmed-table", title: "Confirmed Attendees", "data-list": confirmedAttendees});
    scrollToTop()
  }
}

function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}