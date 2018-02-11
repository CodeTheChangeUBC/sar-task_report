// Commonly shared elements/tasks

function buildTable(tableObject) {
  // tableObject = { DOMid: ...., title: ... , data-list: [...]}
  $.get('../templates/table.mst', (template) => {
    var table = Mustache.render(template, tableObject );
    $('.app').html(table);
  })
};

function buildButton(buttonObject) {
  $.get('../templates/button.mst', (template) => {
    var button = Mustache.render(template, buttonObject );
    $(buttonObject.parentSelector).append(button);
    $('#' + buttonObject.id).click(buttonObject.target);
  })
};