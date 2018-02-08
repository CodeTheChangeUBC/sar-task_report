$(document).ready(() => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://api.ca.d4h.org/v2/team/activities",
    param: { after: (new Date()).toISOString() },
    headers: { Authorization: "Bearer 65dbc92f80012cdbc4e556806adef646e8b8fa98"},
    success: (response) => {
      data = response["data"];
      buildTable({ DOMid: 'activity-table', title: 'Select an acitivitiy', data: data.map( el => { return el.ref_desc})})
    },
    error: (err) => {
      console.log("ERROR:\n" + err);
    }
  });
});

