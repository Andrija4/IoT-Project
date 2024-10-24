const firebaseConfig = {
    authDomain: "raspberry-pi-pico-w-01.firebaseapp.com",
    databaseURL: "https://raspberry-pi-pico-w-01-default-rtdb.firebaseio.com",
    projectId: "raspberry-pi-pico-w-01",
    storageBucket: "raspberry-pi-pico-w-01.appspot.com",
    messagingSenderId: "154988708812",
    appId: "1:154988708812:web:821684e70928904bb1d369",
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(fetchData);
function fetchData() {
    const ref = database.ref("data").limitToLast(1000); 
    ref.on('value', function(snapshot) {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Time');
        dataTable.addColumn('number', 'Vlaznost');
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const vlaznostValue = data.vlaznost;
            const time = data.time; // Use client-side timestamp
            dataTable.addRow([time, vlaznostValue]);
        });
        drawChart(dataTable);
    }, function(error) {
        console.error("Error fetching data", error);
        drawChart(null);
    });
}
function drawChart(dataTable) {
    var options = {
        title: 'Vlaznost vazduha',
        curveType: 'function',
        legend: { position: 'bottom' }
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    if (dataTable) {
        chart.draw(dataTable, options);
    } else {
        // Display default message if no data available
        document.getElementById('chart_div').innerHTML = 'No data available';
    }
}
