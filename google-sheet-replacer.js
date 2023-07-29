var GoogleSheetReplacer = (function () {
  // Create an object to encapsulate the functionality
  var cachedGoogleSheetsData = {}; // Store fetched Google Sheets data

  var CSVToArray = function (e, r) {
    // ... (your CSVToArray implementation)
  };

  var fetchGoogleSheetAsArray = function (googleSheetURL, callback) {
    // Check if the data is already cached
    if (cachedGoogleSheetsData[googleSheetURL]) {
      callback(cachedGoogleSheetsData[googleSheetURL]);
    } else {
      var googleSheetRequest = new XMLHttpRequest();
      googleSheetRequest.addEventListener('load', function () {
        var rawCSVText = googleSheetRequest.responseText;
        var googleSheetArray = CSVToArray(rawCSVText);
        // Cache the fetched data
        cachedGoogleSheetsData[googleSheetURL] = googleSheetArray;
        // Invoke the provided callback with the fetched data
        callback(googleSheetArray);
      });
      googleSheetRequest.addEventListener('error', function () {
        console.error('Google Sheet Replacer had trouble fetching the Google Sheet at: ' + googleSheetURL);
      });
      googleSheetRequest.open('GET', googleSheetURL);
      googleSheetRequest.send();
    }
  };

  var processAllGoogleSheetReplacerElements = function () {
    var googleSheetElements = document.querySelectorAll('[data-google-sheet-url]');
    googleSheetElements.forEach(function (googleSheetElement) {
      var googleSheetURL = googleSheetElement.getAttribute('data-google-sheet-url');
      var googleSheetColumn = parseInt(googleSheetElement.getAttribute('data-google-sheet-column'), 10);

      // Input validation
      if (isNaN(googleSheetColumn) || googleSheetColumn < 1) {
        console.error('Invalid data-google-sheet-column attribute.');
        return;
      }

      // Create a dropdown list of rows
      var dropdown = document.createElement('select');
      var defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a Row';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      dropdown.appendChild(defaultOption);

      // Fetch the Google Sheet data and populate the dropdown
      fetchGoogleSheetAsArray(googleSheetURL, function (googleSheetArray) {
        for (var i = 0; i < googleSheetArray.length; i++) {
          var option = document.createElement('option');
          option.textContent = 'Row ' + (i + 1);
          option.value = i + 1;
          dropdown.appendChild(option);
        }

        // Event listener for the dropdown
        dropdown.addEventListener('change', function () {
          var selectedRow = parseInt(this.value, 10);
          if (!isNaN(selectedRow)) {
            // The Google Sheet specified rows and columns are one-based,
            // while the array is zero-based, so we're accounting for that below.
            var googleSheetRow = selectedRow - 1;
            googleSheetElement.innerHTML = googleSheetArray[googleSheetRow][googleSheetColumn - 1];
          }
        });

        // Append the dropdown to the Google Sheet element
        googleSheetElement.appendChild(dropdown);
      });
    });
  };

  return {
    processAllGoogleSheetReplacerElements: processAllGoogleSheetReplacerElements,
  };
})();

// Process all Google Sheet Replacer elements
GoogleSheetReplacer.processAllGoogleSheetReplacerElements();
