go = function() {
  choices = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  old_choices = [];
  twenty_fifty_emissions_as_a_percent_of_ninteen_ninety = 1;
  
  modelWorker = new Worker('javascripts/modelresult.js')

  modelWorker.addEventListener("message", function(event) {
    data = JSON.parse(event.data);
    twenty_fifty_emissions_as_a_percent_of_ninteen_ninety = 1 - (+data.percent_reduction);
    console.log(data, twenty_fifty_emissions_as_a_percent_of_ninteen_ninety);
    updateBar();
  });

  updateControls = function() {
    choices.forEach(function(choice, index) {
      if(choice == old_choices[index]) { return false; };
      old_selected = "a.choiceLink#c"+index+"l"+old_choices[index];
      new_selected = "a.choiceLink#c"+index+"l"+choices[index];
      d3.select(old_selected).classed("selected",false);
      d3.select(new_selected).classed("selected",true);
    });
  };

  d3.selectAll("a.choiceLink")
    .datum(function() { return this.dataset; })
    .on('click', function(d,i) {
      d3.event.preventDefault();
      old_choices = choices.slice(0);
      choices[+d.choicenumber] = +d.choicelevel;
      updateControls()
      modelWorker.postMessage(choices.join(''));
    });

  
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain([0,1]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

  var svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  updateBar = function() {
    console.log("updating the bar");
    console.log(twenty_fifty_emissions_as_a_percent_of_ninteen_ninety);

    bars = svg.selectAll(".bar")
        .data([twenty_fifty_emissions_as_a_percent_of_ninteen_ninety])

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return x("0"); })
        .attr("width", x.rangeBand())

    bars.transition()
      .attr("y", function(d) { return y(+d); })
      .attr("height", function(d) { return height - y(+d); });
  };


  updateControls();
  modelWorker.postMessage(choices.join(''));
}
