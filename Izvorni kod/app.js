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

function fetchData() {
    const ref = database.ref("data");
    // Listen for new data at the last entry in the database
    ref.limitToLast(1).on('child_added', function(snapshot) {
        const data = snapshot.val();
        console.log("Received data:", data);
        // Update display with the new data
        updateDisplay(data);
    }, function(error) {
        console.error("Error fetching data", error);
        // Display error message or indication when an error occurs
        updateDisplay();
    });
}

const containers = {}; // Object to store containers by uredjajID

function updateDisplay(data) {
    if (data && data.vlaznost != null && data.uredjaj) {
        const uredjajID = data.uredjaj;
        
        // Create a new container if it doesn't exist for this uredjajID
        if (!containers[uredjajID]) {
            containers[uredjajID] = document.createElement('div');
            containers[uredjajID].id = `container-${uredjajID}`;
            containers[uredjajID].classList.add('container');
            
            // Create data display and bulb container inside the new container
            const dataDisplay = document.createElement('div');
            dataDisplay.classList.add('data-display');
            dataDisplay.innerHTML = `
                <p>Uredjaj: <span id="uredjaj_id_${uredjajID}">${uredjajID}</span><br>Vlaznost vazduha: <span id="vlaznost-display_${uredjajID}">${data.vlaznost}</span></p>
            `;
            containers[uredjajID].appendChild(dataDisplay);
            
            const bulbContainer = document.createElement('div');
            bulbContainer.classList.add('bulb-container');
            bulbContainer.innerHTML = `
                <div class="bulb" id="bulb_${uredjajID}"></div>
            `;
            containers[uredjajID].appendChild(bulbContainer);
            
            // Append the new container to the document body
            document.body.appendChild(containers[uredjajID]);
        } else {
            // Update existing data display with new data
            document.getElementById(`vlaznost-display_${uredjajID}`).textContent = data.vlaznost;
        }
        
        // Update bulb color based on humidity
        const bulb = document.getElementById(`bulb_${uredjajID}`);
        if (data.vlaznost < 320) {
            bulb.style.background = 'radial-gradient(circle at 20% 20%, #ccebc5, #5ab4ac)'; // Green gradient for normal humidity
        } else {
            bulb.style.background = 'radial-gradient(circle at 20% 20%, #fbb4ae, #d73027)'; // Red gradient for high humidity
        }
    }
}

// Initialize data fetching when the window loads
window.onload = function() {
    fetchData();
};
