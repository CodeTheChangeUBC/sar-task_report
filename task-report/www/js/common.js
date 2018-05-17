// Commonly shared elements/tasks

function createNavbar(navbar) {
  $.get('../templates/navbar.mst', (template) => {
    var nav = Mustache.render(template, navbar);
    $('.app').html(nav);
    $('#activities').click(navbar.target1);
    $('#attendance').click(navbar.target2);
    $('#repairs').click(navbar.target3);
    $('#' + navbar.active).addClass("active");
  });
}

function buildHeader(headerObject) {
  $.get('../templates/header.mst', (template) => {
    var header = Mustache.render(template, headerObject );
    $('.app').append(header); // wipe all previous
    if (!headerObject.hideBackButton) {
      $('#back-button').click(headerObject.target)
    } else {
      $('#back-button').hide();
    }
  });
}

function createIncident(incidentObject) {
  $.get('../templates/create-activity-form.mst', (template) => {
    var form = Mustache.render(template, incidentObject);
    $('.app').append(form);
    if (localStorage.getItem("incidentTitle")) {
      $('#incidentTitle').val(localStorage.getItem("incidentTitle"));
    }
    if (localStorage.getItem("incidentStartDate")) {
      $('#incidentStartDate').val(localStorage.getItem("incidentStartDate"));
    }
    if (localStorage.getItem("incidentEndDate")) {
      $('#incidentEndDate').val(localStorage.getItem("incidentEndDate"));
    }
  });
}

function myFunction() {
  var incidentTitle = document.getElementById("incidentTitle");
  var incidentStartDate = document.getElementById("incidentStartDate");
  var incidentEndDate = document.getElementById("incidentEndDate");
  localStorage.setItem("incidentTitle", incidentTitle.value);
  localStorage.setItem("incidentStartDate", incidentStartDate.value);
  localStorage.setItem("incidentEndDate", incidentEndDate.value);
  Views.Members();
}

function buildTable(tableObject) {
  // tableObject = { DOMid: ...., title: ... , data-list: [...]}
  $.get('../templates/table.mst', (template) => {
    var table = Mustache.render(template, tableObject );
    $('.app').append(table);
  });
};

function buildButton(buttonObject) {
  $.get('../templates/button.mst', (template) => {
    var button = Mustache.render(template, buttonObject );
    $(buttonObject.parentSelector).append(button);
    $('#' + buttonObject.id).click(buttonObject.target);
    $('#submit-incident').click(function() {
      localStorage.removeItem("incidentTitle");
      localStorage.removeItem("incidentStartDate");
      localStorage.removeItem("incidentEndDate");
    });
  });
};

function createErrorMessage(messageObject) {
  $.get('../templates/error-message.mst', (template) => {
    var message = Mustache.render(template, messageObject);
    $('.app').append(message);
  });
}

function searchBarUpdate() {
    var input, filter, table, tr, label, i;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    table= document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        label = tr[i].getElementsByTagName("label")[0];
        if (label.textContent.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";

        }
    }
}

function repairSave() {
  console.log("repair save")
  Views.State.repair_form = $("#repair_form").serializeArray();
}

function repairClear(){
  console.log("repair clear")
  $("#repair_form")[0].reset();
}

function repairSubmit(){
  console.log("repair submit")
  Views.State.repair_form = $("#repair_form").serializeArray();
  formData = $("#repair_form :input").filter(function(index, element) {return $(element).val() != ''}).serialize();
  $.ajax({
          type: "POST",
          url: "https://api.ca.d4h.org/v2/team/repairs",
          headers: { Authorization: "Bearer ac58bc1485ef03d4e5a815a6785bc8f4feefe27a"},
          data: formData,
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
