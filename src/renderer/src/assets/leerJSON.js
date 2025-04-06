/**
 * Opens a file dialog for the user to select a .json file,
 * reads its content, parses it as JSON, and returns the resulting object.
 *
 * @returns {Promise<object>} A promise that resolves with the parsed JSON object
 *                            or rejects with an error if something goes wrong.
 */
export function leerJSON() {
    // console.log("leerJSON function started"); // Log: Function entry
  
    return new Promise((resolve, reject) => {
      // 1. Create an invisible file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      // Make it visually hidden but accessible
      input.style.display = 'none';
  
      // Add to body temporarily to ensure it's part of the document,
      // sometimes required by browsers for programmatic clicks.
      document.body.appendChild(input);
  
      // console.log("Input element created and added to body (hidden)"); // Log: Input created
  
      // Cleanup function to remove the input
      const cleanup = () => {
        // console.log("Cleaning up input element"); // Log: Cleanup
        input.remove();
      };
  
      // 2. Define what happens when the user selects a file
      input.onchange = (event) => {
        // console.log("onChange event triggered"); // Log: onChange triggered
        const files = event.target.files;
  
        if (!files || files.length === 0) {
          console.log("No file selected by user (or cancelled)."); // Log: No file
          // Don't reject here immediately, let the user potentially try again
          // Or reject if you want cancellation to be an error:
          // reject(new Error('File selection cancelled or no file chosen.'));
          // cleanup(); // Clean up if rejecting
          // For now, let's assume cancelling isn't an immediate error state for the promise itself
          return; // Exit handler if no file
        }
  
        const file = files[0];
        // console.log(`File selected: ${file.name}, type: ${file.type}`); // Log: File info
  
        const fileName = file.name.toLowerCase();
        const fileType = file.type;
  
        if (!fileName.endsWith('.json') && fileType !== 'application/json') {
          //  console.error(`Invalid file type: ${file.name}`); // Log: Invalid type
          reject(new Error(`Invalid file type: "${file.name}". Please select a .json file.`));
          cleanup();
          return;
        }
  
        const reader = new FileReader();
  
        reader.onload = (e) => {
          try {
            const fileContent = e.target.result;
            // console.log("File read successfully."); // Log: File read
            const jsonObject = JSON.parse(fileContent);
            // console.log("JSON parsed successfully."); // Log: JSON parsed
            resolve(jsonObject); // Resolve the promise
          } catch (parseError) {
            // console.error("Error parsing JSON:", parseError); // Log: JSON parse error
            reject(new Error(`Error parsing JSON file "${file.name}": ${parseError.message}`));
          } finally {
            cleanup(); // Ensure cleanup happens
          }
        };
  
        reader.onerror = (e) => {
          // console.error("FileReader error:", reader.error); // Log: FileReader error
          reject(new Error(`Error reading file "${file.name}": ${reader.error}`));
          cleanup();
        };
  
        // console.log(`Reading file: ${file.name}`); // Log: Reading started
        reader.readAsText(file);
      };
  
      // Handle potential errors directly on the input element
      input.onerror = (err) => {
          //  console.error("Input element error event:", err); // Log: Input error
           reject(new Error("An error occurred with the file input element."));
           cleanup();
      };
  
      // Handle cancellation (less reliable across browsers)
      // 'cancel' event is not standard, often cancellation just means 'onchange' doesn't fire
      // input.oncancel = () => { ... }
  
  
      // 3. Programmatically click the hidden input element
      try {
        // console.log("Attempting to programmatically click the input..."); // Log: Click attempt
        input.click();
        // console.log("input.click() executed."); // Log: Click executed
        // DO NOT resolve/reject here. The promise settles in the event handlers (onchange, onerror).
      } catch (err) {
        //  console.error("Error triggering input.click():", err); // Log: Click error
         reject(new Error("Could not open file dialog."));
         cleanup(); // Clean up if click fails
      }
    });
  }