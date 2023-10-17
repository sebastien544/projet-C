async function fetchData() {
    const response = await fetch('https://floating-headland-70705-e822ca18013b.herokuapp.com//get-crypto-data');
    if (!response.ok) {
        console.error('Failed to fetch:', response.statusText);
        return [];
    }
    const data = await response.json();
    return data;  // Ensure you are returning the data here
}


async function getAllData() {
    return await fetchData();
}

// Define a function to process and sort the data
function processAndSortData(data) {
    // Flatten, filter, and sort the data
    const processedData = data
        .filter(coin => coin.cmc_rank <= 500)
        .filter(coin => coin.quote.USD.percent_change_7d >= 10)
        .filter(coin => coin.quote.USD.volume_24h >= (coin.quote.USD.market_cap * 0.10))
        .sort((a, b) => b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d);  // Sort by price variation

    return processedData;
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
}

// Define a function to render the data
function renderData(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.quote.USD.percent_change_7d.toFixed(2)}%</td>
            <td>$${coin.quote.USD.price.toFixed(2)}</td>
            <td>$${formatNumber(coin.quote.USD.market_cap)}</td>
            <td>$${formatNumber(coin.quote.USD.volume_24h)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Render data initially when the page loads
window.onload = async function() {
    const allData = await getAllData();
    const processedData = processAndSortData(allData);
    renderData(processedData);
};

