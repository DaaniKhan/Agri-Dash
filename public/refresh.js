// public/refresh.js
document.addEventListener("DOMContentLoaded", () => {
    const fetchLatestReading = async () => {
      try {
        const response = await fetch('/api/latest-reading/2'); // Replace `1` with dynamic user_id as needed
        const data = await response.json();
  
        if (response.ok && data) {
          document.getElementById("ph").textContent = data.pH || 'N/A';
          document.getElementById("nitrogen").textContent = data.nitrogen || 'N/A';
          document.getElementById("phosphorus").textContent = data.phosphorus || 'N/A';
          document.getElementById("potassium").textContent = data.potassium || 'N/A';
          document.getElementById("temperature").textContent = data.temperature || 'N/A';
          document.getElementById("moisture").textContent = data.moisture || 'N/A';
          document.getElementById("conductivity").textContent = data.conductivity || 'N/A';

          console.log(`Data successfully updated at ${new Date().toLocaleTimeString()}`);
          console.log(`Data: ${data}`)
        }
      } catch (error) {
        console.error("Error fetching latest reading:", error);
      }
    };
  
    // Fetch data initially and then every 30 minutes (1800000 milliseconds)
    fetchLatestReading();
    setInterval(fetchLatestReading, 60000);
  });  