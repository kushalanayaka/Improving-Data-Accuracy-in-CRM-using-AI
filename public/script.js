document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded. Fetching prediction data...');
  fetchPredictionData();
});

async function fetchPredictionData() {
  try {
    const response = await fetch('/predict');  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Prediction data fetched:', data);

    if (data && data.predictions && data.predictions[0].values.length > 0) {
      const predictionValues = data.predictions[0].values;

      // Display the first prediction result (for example purposes)
      const predictionData = predictionValues[0][0];  
      document.getElementById('predictionResult').innerHTML = `
        <strong>Prediction Result:</strong> ${predictionData === 1 ? "Positive Outcome [1]" : "Negative Outcome [0]"}
      `;

      let positiveOutcome = 0;
      let negativeOutcome = 0;

      // Count the number of positive and negative outcomes
      predictionValues.forEach(value => {
        if (value[0] === 1) {
          positiveOutcome++;
        } else if (value[0] === 0) {
          negativeOutcome++;
        }
      });

      console.log('Positive Outcomes:', positiveOutcome);
      console.log('Negative Outcomes:', negativeOutcome);

      // Render charts with the outcome counts
      renderLineChart(positiveOutcome, negativeOutcome);
      renderPieChart(positiveOutcome, negativeOutcome);
      renderBarChart(positiveOutcome, negativeOutcome);
    } else {
      console.error('No valid predictions found in the API response.');
      document.getElementById('predictionResult').innerText = 'No prediction data available.';
    }
  } catch (error) {
    console.error('Error fetching prediction data:', error);
    document.getElementById('predictionResult').innerText = 'Failed to fetch prediction.';
  }
}

function renderLineChart(positive, negative) {
  const ctx = document.getElementById('lineChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Positive Outcome', 'Negative Outcome'],
      datasets: [{
        label: 'Prediction Outcomes',
        data: [positive, negative],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderPieChart(positive, negative) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Positive Outcome', 'Negative Outcome'],
      datasets: [{
        data: [positive, negative],
        backgroundColor: ['#36A2EB', '#FF6384']
      }]
    },
    options: {
      responsive: true
    }
  });
}

function renderBarChart(positive, negative) {
  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Positive Outcome', 'Negative Outcome'],
      datasets: [{
        label: 'Prediction Count',
        data: [positive, negative],
        backgroundColor: ['#4BC0C0', '#FF9F40'],
        borderColor: ['#4BC0C0', '#FF9F40'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
