function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function findAttendanceRecord(memberId) {
  var recordId;
  for (record of Views.State.allAttendanceRecords) {
    if (record.member.id == memberId) {
      recordId = record.id;
      break;
    }
  }
  return recordId;
}

function getDate() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + 'T' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute ;
  return output;
}

function getAndStoreMembersList() {
  if (!localStorage.getItem("members")) { //add or condition for when its X days old
    console.log("Making database call for members...");
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/members",
      headers: { Authorization: "Bearer " + Views.State.token },
      success: (response) => {
        lom1=response.data;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: "https://api.ca.d4h.org/v2/team/members?offset=250",
          headers: { Authorization: "Bearer " + Views.State.token },
          success: (response2) => {
            lom2 = response2.data;
            lom3 = $.merge(lom1, lom2);
            localStorage.setItem("members", JSON.stringify(lom3));
            return true;
            // var members = JSON.parse(localStorage.getItem("members"));
            // buildTable({ DOMid: "choose-attendees-table", inputType: "checkbox", "data-list": members.map(el => { return { id: el.id, content: el.name } }) });
          },
          error: (err) => {
            console.log(err);
            return false;
          }
        });
      },
      error: (err) => {
        console.log(err);
        return false;
      }
    });
  }
}

function getAndStoreIncidents() {
  if (!localStorage.getItem("incidents")) { //add or condition for when its X days old
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/incidents",
      param: { after: (new Date()).toISOString() },
      headers: { Authorization: "Bearer " + Views.State.token},
      success: (response) => {
        localStorage.setItem("incidents", JSON.stringify(response.data));
        return true;
      },
      error: () => {
        console.log(err);
        return false;
      }
    });
  }
}

function sendToDatabase() {
  for (attendee of Views.State.ConfirmedAttendees) {
    var aRecordId = findAttendanceRecord(attendee.id)
    // var formString = "activity_id=" + Views.State.Activity + "&member=" + attendee.id + "&status=attending";
    // building a mock-form (endpoint expects form-data)
    var formData = new FormData();
    formData.append("status", "attending");
    $.ajax({
      type: "PUT",
      url: "https://api.ca.d4h.org/v2/team/attendance/" + aRecordId,
      headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
      data: formData,
      processData: false, // need this or will return 'boundary not set' error (?)
      contentType: false, // same here - basically, we need jQuery to fall back to 'default'
      success: (response) => {
        alert("Sent successfully.");
      },
      error: (err) => {
        alert("Problem sending...");
      }
    });
  }
}

function testAPI() {
  for (attendee of Views.State.ConfirmedAttendees) {
    // var aRecordId = findAttendanceRecord(attendee.id);
    // var formString = "activity_id=" + Views.State.Activity + "&member=" + attendee.id + "&status=attending";
    // building a mock-form (endpoint expects form-data)

    var formData = new FormData();
    formData.append("attendance_id", attendee.id);
    formData.append("status", "attending");
    $.ajax({
      type: "PUT",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance",
      headers: { Authorization: "Bearer " + Views.State.token},
      data: formData,
      processData: false, // need this or will return 'boundary not set' error (?)
      contentType: false, // same here - basically, we need jQuery to fall back to 'default'
      success: (response) => {
        alert("Sent successfully.");
        console.log(response);
      },
      error: (err) => {
        alert("Problem sending...");
        console.log(err);
      }
    });
  }
}
