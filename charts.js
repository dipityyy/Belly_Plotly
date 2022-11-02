function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(data);

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
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];


    // 3. Create a variable that holds the samples array. 
    var Sample = data.samples;
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = Sample.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var neededInfo = sampleArray[0];
    // created a new object 
    var newerX = JSON.parse(JSON.stringify(sampleArray[0].otu_ids));
    var  newY =  JSON.parse(JSON.stringify(sampleArray[0].sample_values));
    var newLabels =  JSON.parse(JSON.stringify(sampleArray[0].otu_labels));

    // console.log(neededInfo);
    console.log(newerX);
    console.log(newY);
    console.log(newLabels);


    var sampleNumber = [];
    var labels = [];
    

    index = [];
    newX = neededInfo.otu_ids;
    // retrieve the top ten otu_ids and then put them in descending order
    var topTen=((newX.sort((a,b) => b - a)).slice(0,10)).sort((a,b) => a-b);

        // Find topTen's original place (index) within the original data set 
        for (let i = 0; i < topTen.length; i++) {
          index.push(neededInfo.otu_ids.indexOf(topTen[i]));
        }
        // use that index to retrieve the according samples 
        index.forEach(findSample)
          function findSample(index_) {
            sampleNumber.push(neededInfo.sample_values[index_]);
          }
        // use that index to retrieve the according lables
          index.forEach(findName)
          function findName(index_) {
            labels.push(neededInfo.otu_labels[index_]);
          }

          console.log(newX);
          console.log(topTen);
       

      
        
            
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids =topTen


    // console.log(neededInfo.slice(otu_ids));



    var otu_labels = labels;
    var sample_values = sampleNumber;

    // 7. Create the yticks for the bar chart.
 

    var yticks =otu_ids.map(sampleObj => "OTU " + sampleObj);

    // 8. Create the trace for the bar chart. 
    var data = {
      x: sample_values, 
      y: yticks,
      type:'bar',
      orientation:'h'
      
    };
    console.log(data);
    // 9. Create the layout for the bar chart. 
    var layout = {
      title:'Top 10 Bacteria Cultures Found',
     

    };
   
    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar",[data],layout);


    // Bar and Bubble charts
        // let newerX = sampleArray[0].otu_ids;
        // let newY = sampleArray[0].sample_values;
        // let newLabels = sampleArray[0].otu_labels;
        var desired_maximum_marker_size = 40;

        console.log(newerX);
        console.log(newY);
        console.log(newLabels);
        
        // 1. Create the trace for the bubble chart.
        var size = newY;

        var bubbleData = [{
  
          y: newY, // sample values 
          x: newerX,//otu ids
          text: `(${newerX},${newY})\n ${newLabels}`,
          mode: 'markers',
          marker:{
            color: newerX,
            colorscale: "rdpu",
            size: size,
            sizeref: 2.0 * Math.max(...size) / (desired_maximum_marker_size*120),
            sizemode: 'area',
            
              
            }
          
            

          }]
    
      
      
      

        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          
        title: 'Bacteria Cultures Per Sample',
        showlegend: false
        // height: 600,
        // width: 600
          
        };
          // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble",bubbleData,bubbleLayout); 


       
        var wFreq =result.wfreq;

        //create a variable to get the washing frequency 
            // 4. Create the trace for the gauge chart.
        var gaugeData = [{
          // {domain: { x: [0, 1], y: [0, 1] },
          value: wFreq,
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number+delta",
          gauge: {
            axis: { range: [null, 10], dtick:'2' },
            bar: { color: "black" },
            steps: [
              { range: [0, 2], color: "red", text:'2' },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lightgreen" },
              { range: [8, 10], color: "green" }
            ]}
        
                }]
        
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = { 
          width: 600, 
          height: 500, 
          tickvals: [2,4,6,8,10],
          ticktext: ['2','4','6','8','10'],
          margin: { r: 20, o: 20, y: 20, l: 20, g:20 },

        
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge",gaugeData );

        
  });









    
  };
