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

          // Update the reading time
          const rawTime = data.created_at;
          const localTime = rawTime ? formatToLocalTime(rawTime) : 'N/A';
          document.getElementById("reading-time").textContent = `${localTime}`;

          console.log(`Data successfully updated at ${new Date().toLocaleTimeString()}`);
          console.log(data)
        }
      } catch (error) {
        console.error("Error fetching latest reading:", error);
      }
    };

    const formatToLocalTime = (isoString) => {
      const date = new Date(isoString);
    
      // Format the updated time
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };
  
    // Fetch data initially and then every 30 minutes (1800000 milliseconds)
    fetchLatestReading();
    setInterval(fetchLatestReading, 1800000);
  });