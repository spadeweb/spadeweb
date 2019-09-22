function createCharts(){
    Chart.defaults.global.defaultFontColor = "#000"
    fetch("./assets/data/chartTimeData.json")
    .then(res => res.json())
    .then(data => createTimeChart(data));
    
    
    
}

function createTimeChart(jsonData){
    for(feature in jsonData){
        fData = jsonData[feature]
        console.log(fData)
        var ctx = document.getElementById(feature+'TimeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: fData.uniqueLabels,
                  datasets: [
                    {
                      label: "Early-morning",
                      backgroundColor: "#ffcccc",
                      data: fData.earlyMorning,

                    },
                    {
                      label: "Morning",
                      backgroundColor: "#ffcce6",
                      data: fData.morning
                    },
                    {
                      label: "Afternoon",
                      backgroundColor: "#ddccff",
                      data: fData.afternoon
                    },
                    {
                      label: "Evening",
                      backgroundColor: "#cce6ff",
                      data: fData.evening
                    },
                    {
                      label: "Night",
                      backgroundColor: "#ccffeb",
                      data: fData.night
                    }
                  ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                          display: true ,
                          color: "#7d7d7d"
                        }
                        
                    }],
                    xAxes: [{
                        gridLines: {
                          display: true ,
                          color: "#7d7d7d"
                        }
                        
                    }]
                },
                title: {
                    display: true,
                    text: 'Opened by Time of Day',
                    fontStyle: 'bold',
                    fontSize: '16',
                    lineHeight: '0',
                    padding: '10'
                }
            }
        });
    }
}

function createStackedChart(feature, jsonData){
    var ctx = document.getElementById(feature+'StackedChart').getContext('2d');

    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Msg', 'Email'],
            datasets: [{
              label: 'Opened',
              backgroundColor: '#D6E9C6',
              data: [20, 5]
            }, {
              label: 'Dismissed',
              backgroundColor: '#EBCCD1',
              data: [30, 8]
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        min: 0
                    }
                }]
            },
            title: {
                display: true,
                text: 'App Engagements',
                fontStyle: 'bold',
                fontSize: '16',
                lineHeight: '0',
                padding: '10'
            }
        }
    });
}

createCharts();