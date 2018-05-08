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
