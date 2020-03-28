$("#search-btn").on("click", event => {
  var eid = $("#input-box").val();
  $.ajax({
    url: "/view",
    type: "POST",
    dataType: "json",
    data: { engineId: eid },
    success: function(res) {
      if (typeof res.idErr === "undefined") {
        showTable(res);
      }
    }
  });
});

var showTable = function(res) {
  var currentEngineData = {
    engineId: "",
    dieselFlow: [],
    massFlow: [],
    noxFlow: [],
    temperature: [],
    efficiency: [],
    date: []
  };
  var entries = Object.entries(res);
  var c = 1;
  $("#placeholder").empty();
  for (const [key, val] of entries) {
    var elem = val.elem;
    var x = `<tr><td>${c++}</td><td>${elem.engineId}</td><td>${
      elem.dieselFlow
    }</td><td>${elem.massFlow}</td><td>${elem.nox}</td><td>${
      elem.temperature
    }</td><td>${elem.efficiency}</td></tr>`;
    $("#placeholder").append(x);
    currentEngineData.engineId = elem.engineId;
    currentEngineData.dieselFlow.push(elem.dieselFlow);
    currentEngineData.massFlow.push(elem.massFlow);
    currentEngineData.noxFlow.push(elem.nox);
    currentEngineData.temperature.push(elem.temperature);
    currentEngineData.efficiency.push(elem.efficiency);
    currentEngineData.date.push(
      new Date(val.date).toLocaleDateString() +
        " " +
        new Date(val.date).toLocaleTimeString()
    );
  }
  createCharts(currentEngineData);
};

var createCharts = function(currentEngineData) {
  $("#charts").empty();
  showChart(
    "diesel-flow",
    currentEngineData.date,
    currentEngineData.dieselFlow
  );
  showChart("mass-flow", currentEngineData.date, currentEngineData.massFlow);
  showChart("nox", currentEngineData.date, currentEngineData.noxFlow);
  showChart(
    "temperature",
    currentEngineData.date,
    currentEngineData.temperature
  );
  showChart("efficiency", currentEngineData.date, currentEngineData.efficiency);
};

var showChart = function(label, time, data) {
  $("#charts").append(
    `<canvas id="${label}" width="400" height="400"></canvas>`
  );
  var ctx = document.getElementById(label).getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: "rgb(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132, 0.5)"
        }
      ]
    }
  });
};
