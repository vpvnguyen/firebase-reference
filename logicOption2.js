/* global moment firebase */

// Initialize Firebase
  // Your web app's Firebase configuration
  var config = {
    apiKey: "AIzaSyBOn9yi3quxffGn_i_k3P-ve1Qs5j75xA4",
    authDomain: "test-project-f40d0.firebaseapp.com",
    databaseURL: "https://test-project-f40d0.firebaseio.com",
    projectId: "test-project-f40d0",
    storageBucket: "",
    messagingSenderId: "374051288399",
    appId: "1:374051288399:web:5d70ef7cc0069a71"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  
  // Create a variable to reference the database
  var database = firebase.database();
  
  // Initial Values
  var highPrice = 0;
  var highBidder = "No one :-(";
    
  function getTimeStamp() {
    var timeInMs = Date.now();
    var date = new Date(timeInMs);
    return date = JSON.stringify(date);
  }
  // At the initial load and subsequent value changes, get a snapshot of the stored data.
  // This function allows you to update your page in real-time when the firebase database changes.
  database.ref('highest-bidder').on("value", function(snapshot) {
  
    // If Firebase has a highPrice and highBidder stored, update our client-side variables
    if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {
      // Set the variables for highBidder/highPrice equal to the stored values.
      highBidder = snapshot.val().highBidder;
      highPrice = Number(snapshot.val().highPrice);
    }
  
    // If Firebase does not have highPrice and highBidder values stored, they remain the same as the
    // values we set when we initialized the variables.
    // In either case, we want to log the values to console and display them on the page.
    console.log(highBidder);
    console.log(highPrice);
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text(highPrice);
  
    // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
  // Whenever a user clicks the submit-bid
  $("#submit-bid").on("click", function(event) {
    event.preventDefault();
    // Get the input values
    var bidderName = $("#bidder-name").val().trim();
    var bidderPrice = parseInt($("#bidder-price").val().trim());
    var date = getTimeStamp();
  
    // Log the Bidder and Price (Even if not the highest)
    console.log(`=bidderName: ${bidderName}`);
    console.log(`bidderPrice: ${bidderPrice}`);
    console.log(`timeStamp: ${date}`);
    console.log(`timeStamp: ${typeof date}`);

  
    // save to all-bidders
    database.ref('all-bidders').set({
        bidderName: bidderName,
        bidderPrice: bidderPrice,
        date: date
    });

    if (bidderPrice > highPrice) {
  
      // Alert
      alert("You are now the highest bidder.");
  
      // Save the new price in Firebase. This will cause our "value" callback above to fire and update
      // the UI.
      database.ref('highest-bidder').set({
        highBidder: bidderName,
        highPrice: bidderPrice,
        date: date
      });

      // Log the new High Price
      console.log("New High Price!");
      console.log(`bidderName: ${bidderName}`);
      console.log(`bidderPrice: ${bidderPrice}`);
    }
    else {
      // Alert
      alert("Sorry that bid is too low. Try again.");
    }
  });
  
  $('#clear').on('click', function() {
      $('#bidder-name').text('');
      $('#bidder-price').text('');
    database.ref('highest-bidder').set({
        // clear out highest bidder
    });
  });