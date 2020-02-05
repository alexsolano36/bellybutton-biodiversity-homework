d3.json("data/samples.json").then((data)=> {

  data.names.forEach(function(name) {
      d3.select("#selDataset").append("option").text(name).property("value");
  });

  // first default from dropdown
  let subjectID = d3.select('#selDataset option:checked').text();
  //console.log(data.samples.filter(subject => subject.id === subjectID)[0])
//});

  // plotly functions

  plotBar(subjectID, data);

  plotBubble(subjectID, data);

  displayData(subjectID, data);

  plotGague(subjectID, data);

});

//from activity done in class to get dropdown menu items on 'select'
let optionChanged = function(id) {

  // renaming function parameter
  let subjectID = id;

  d3.json("data/samples.json").then((data)=> {

    // Plot functions
    plotBar(subjectID, data);
    plotBubble(subjectID, data);
    displayData(subjectID, data);
    plotGauge(subjectID, data);

  });

};

// plotBar function filters data based on subject ID 
let plotBar = function(subjectID, data) {

  // Get data for subject selected in dropdown
  let subjectData = data.samples.filter(subject => subject.id === subjectID)[0];
  let sampleValues = subjectData.sample_values.slice(0, 10).reverse();
  let otuIDs = subjectData.otu_ids.slice(0, 10).reverse().map(otuid => `OTU ${otuid}`);
  let label = subjectData.otu_labels.slice(0, 10).reverse();

  let trace = [{
    x: sampleValues,
    y: otuIDs,
    type: "bar",
    orientation: "h",
    text: label,
    bgcolor: "red",
    marker: {
      color: "#133F8D"
    }
  }];
      
  let layout = {
    title: { text: `<b>Top 10 Microbial Species</b> <br> Found in Subject ${subjectID} ` },
    paper_bgcolor: "rgb(220, 220, 101)",
    plot_bgcolor: "#A4DAD0",
    font: { color: "black", family: "Arial", size: 12 }
  };
  let config = {responsive: true}


  Plotly.newPlot("bar", trace, layout, config);
};

// Bubble Chart function filters data on subject ID
let plotBubble = function(subjectID, data) {

  let subjectData = data.samples.filter(subject => subject.id === subjectID)[0];

  let trace = [{
    x: subjectData.otu_ids,
    y: subjectData.sample_values,
    mode: "markers",
    marker: {
      size: subjectData.sample_values,
      color: subjectData.otu_ids,
      colorscale: 'Blackbody'
    },
    text: subjectData.otu_labels,
    bgcolor: "red"
    
  }];

  let layout = {
    xaxis:{title: "OTU ID"},
    autosize: true,
    height: 700,
    plot_bgcolor: "#A4DAD0",
    paper_bgcolor: "rgb(220, 220, 101)",
    font: { color: "black", family: "Arial", size: 18}
  };

  let config = {responsive: true}

  Plotly.newPlot("bubble", trace, layout, config);
};

//demographics for subjectIDs
let displayData = function(subjectID, data) {
  // dropdown ID text
  let subjectData = data.metadata.filter(subject => subject.id == subjectID)[0];
  //clear out any existing html
  d3.select("#sample-metadata").html("");


  for (const [key, value] of Object.entries(subjectData)) {
    // repopulate list everytime on selected object
    if (key === "id") {
      d3.select('#sample-metadata').append("p").text(`${key}: ${value}`);
    } else {
      d3.select('#sample-metadata').append("hr")
      d3.select('#sample-metadata').append("p").text(`${key}: ${value}`);
    }
  };
};
