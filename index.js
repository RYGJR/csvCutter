
async function processCSV() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const rowsPerFile = parseInt(
    document.getElementById("rowsPerFileInput").value
  );
  const filenamePrefix = document
    .getElementById("filenamePrefix")
    .value.trim();
  const month = document.getElementById("month").value.trim();
  const day = document.getElementById("day").value.trim();
  const year = document.getElementById("year").value.trim();
  const suffixNumber = parseInt(
    document.getElementById("suffixNumber").value
  );

  if (!file) {
    alert("Please select a CSV file.");
    return;
  }

  if (isNaN(rowsPerFile) || rowsPerFile <= 0) {
    alert("Please enter a valid number of rows per CSV file.");
    return;
  }

  if (!filenamePrefix) {
    alert("Please enter a filename prefix.");
    return;
  }

  if (!month || !day) {
    alert("Please enter both month and day.");
    return;
  }

  if (isNaN(suffixNumber) || suffixNumber < 1) {
    alert(
      "Please enter a valid starting suffix number (must be 1 or more)."
    );
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (event) {
    const csv = event.target.result;
    const data = csv
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row !== "");

    if (data.length === 0) {
      alert("CSV file is empty or invalid.");
      return;
    }

    // Split data into chunks based on rowsPerFile
    const numParts = Math.ceil(data.length / rowsPerFile);
    const chunks = [];
    

    for (let i = 0; i < numParts; i++) {
      const start = i * rowsPerFile;
      const chunk = data.slice(start, start + rowsPerFile);
      chunks.push(chunk);
    }
    console.log(chunks)

    async function processChunks(){
      for(let i = 0; i < chunks.length; i++){
        const csvContent = chunks[i].join("\n");
        const filename = `${filenamePrefix} ${month} ${day} ${"-"} ${suffixNumber + i} ${year} .csv`;

        downloadCSV(csvContent,filename);

        //timeout to allow more than 10 downloads from chrome browser
        if((i+1) % 10 == 0){
          await new Promise(resolve => setTimeout(resolve,1000))
        }
      }
    }

    processChunks()

    alert("CSV processing complete.");
  };

  reader.readAsText(file);
}

function downloadCSV(content, filename) {
 
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

}

