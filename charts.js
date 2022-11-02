function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;

    // Create a variable that filters the samples and metadata 
    //for the object with the desired sample number.
    var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variables that holds the first sample and metadata in the array.
    var samplesResult = samplesResultArray[0];
    var result = resultArray[0];
    
    // Create variables that hold the otu_ids, otu_labels, sample_values, and washing frequency.
    var otuIds = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;
    var washingFreq = parseFloat(result.wfreq);

    // Create the yticks for the bar chart.
    var yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var xticks = sampleValues.slice(0,10).reverse();
    var labels = otuLabels.slice(0, 10).reverse();

    // Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks,
        y: yticks,
        text: labels,
        orientation: 'h',
        type: 'bar',
        marker: {
          color: 'darkslategray'
        }
      }
    ];

    // Create the layout for the bar chart. 
    var barLayout = {
     title: 'Top 10 Bacterial Cultures Found',
     width: 500,
     paper_bgcolor: 'darkcyan',
     plot_bgcolor: 'darkcyan',
     font: {color: 'white'},
     xaxis:{
      gridcolor: 'lightslategrey',
      zerolinecolor: 'white'
     }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    
  // Create the trace for the bubble chart.
    var bubbleData = [
      {
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
            size: sampleValues,
            color: otuIds,
            sizemode: 'diameter',
            colorscale: 'Rainbow'
        }
      }
    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      showledgend: false,
      hovermode: 'closest',
      margin: {t:100},
      height: 600,
      width: 1200,
      paper_bgcolor: 'darkcyan',
      plot_bgcolor: 'darkcyan',
      font: {color: 'white'},
      xaxis:{
        gridcolor: 'lightslategrey',
        zerolinecolor: 'white'
       },
       yaxis:{
        gridcolor: 'lightslategrey',
        zerolinecolor: 'white'
       }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        type: 'indicator',
        mode: 'gauge+number',
        title: {text: 'Belly Button Washing Frequency<br> Scrubs per Week'},
        gauge: {
          axis: { range: [null, 10], tickcolor: 'white'},
          bar: {color: 'black'},
          bordercolor: 'white',
          steps: [
          { range: [0, 2], color: 'red'},
          { range: [2, 4], color: 'orange'},
          { range: [4, 6], color: 'yellow'},
          { range: [6, 8], color: 'lightgreen'},
          { range: [8, 10], color: 'green'}
          ]
        }
      }
    ];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500,
     margin: { t: 0, b: 0 },
     paper_bgcolor: 'darkcyan',
     font: {color: 'white'}
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
   }); 
  };



