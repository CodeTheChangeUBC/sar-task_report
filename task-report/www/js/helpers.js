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
  if (!Views.State.getItem("members")) { //add or condition for when its X days old
    console.log("Making database call for members...");
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/members",
      headers: { Authorization: "Bearer " + Views.State.getItem('token') },
      success: (response) => {
        lom1=response.data;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: "https://api.ca.d4h.org/v2/team/members?offset=250",
          headers: { Authorization: "Bearer " + Views.State.getItem('token') },
          success: (response2) => {
            lom2 = response2.data;
            lom3 = $.merge(lom1, lom2);
            Views.State.setItem("members", lom3);
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
  if (!Views.State.getItem("incidents")) { //add or condition for when its X days old
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/incidents",
      param: { after: (new Date()).toISOString() },
      headers: { Authorization: "Bearer " + Views.State.getItem('token')},
      success: (response) => {
        Views.State.setItem("incidents", response.data);
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
  for (attendee of Views.State.getItem('ConfirmedAttendees')) {
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

function updateAttendanceRecords() {
  var status = true;
  for (attendee of Views.State.getItem('ConfirmedAttendees')) {
    // var aRecordId = findAttendanceRecord(attendee.id);
    // var formString = "activity_id=" + Views.State.Activity + "&member=" + attendee.id + "&status=attending";
    // building a mock-form (endpoint expects form-data)
    if (!status) {
      alert("There was an error updating attendance records. Please try again.");
      break;
    }

    var formData = new FormData();
    formData.append("status", "attending");
    console.log(formData)
    $.ajax({
      type: "PUT",
      dataType: "json",
      url: "https://api.ca.d4h.org/v2/team/attendance/" + attendee.id,
      headers: { Authorization: "Bearer " + Views.State.getItem('token')},
      data: formData,
      processData: false, // need this or will return 'boundary not set' error (?)
      contentType: false, // same here - basically, we need jQuery to fall back to 'default'
      success: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        status = false;
      }
    });
  }

  if (status) {
    alert("Successfully updated attendance records.");
    return Views.Attendance();
  }

}

function repairSave() {
  console.log("repair save")
  Views.State.setItem('repair_form', $("#repair_form").serializeArray());
}

function repairClear(){
  console.log("repair clear")
  $("#repair_form")[0].reset();
}

function repairSubmit(){
  Views.State.setItem('repair_form', $("#repair_form").serializeArray());
  //formData = $("#repair_form :input").filter(function(index, element) {return $(element).val() != ''}).serialize();

  var formData = new FormData();
  formData.append("equipment_id", $("#equipmentId").val());
  formData.append("title", $("#titleId").val());
  formData.append("caused_by", $("#causeId").val());
  formData.append("status",  $("#statusId").val());

  if ($("#memberId").val() != ""){
    formData.append("member_id",$("#memberId").val());
  }

  if ($("#costId").val() != ""){
    formData.append("repair_cost",$("#costId").val());
  }

  if ($("#dateId").val() != ""){
    formData.append("date_due",$("#dateId").val());
  }
  if ($("#descriptionId").val() != ""){
    formData.append("description",$("#descriptionId").val());
  }

  console.log(formData)

  $.ajax({
          type: "POST",
          url: "https://api.ca.d4h.org/v2/team/repairs",
          headers: { Authorization: "Bearer " + Views.State.getItem('token')},
          data: formData,
          processData: false, // need this or will return 'boundary not set' error (?)
          contentType: false, // same here - basically, we need jQuery to fall back to 'default'
          success: (response) => {
            console.log(response)
            alert("Form successfully submitted")
          },
          error: (err) => {
            console.log(err)
            if (err.statusText == "error"){
              alert("An error occured and the form was not submitted. Please check that you are online.")
            } else {
              alert("Form was not submitted: " + err.responseJSON.message);
            }

          }
        });
}

// Login Cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    return true;
  } else {
    return false;
  }
}
