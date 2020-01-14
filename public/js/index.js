$("#search-btn").on("click", event => {
  var eid = $('#input-box').val();
  $.ajax({
    url: "/view",
    type: "POST",
    dataType: "json",
    data: { engineId: eid },
    success: function(res) {
    //   showTable(res);
    console.log(res);
    }
  });
});

var showTable = function(res) {
  var entries = Object.entries(res);
  var c = 1;
  $("#placeholder").empty();
  for (const [key, val] of entries) {
    var x = `<tr><td>${c++}</td><td>${key}</td><td>${val.played}</td><td>${
      val.win
    }</td><td>${val.draw}</td><td>${val.loss}</td><td>${val.pts}</td></tr>`;
    $("#placeholder").append(x);
  }
};
