function updateVisitorCount() {
    fetch("/connectiondata.json")
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            // Make both numbers at least 1 if the current count hasn't updated in time
            let current_visitors = Math.max(data.current_visitors, 1)
            let total_visitors = Math.max(data.total_visitors, 1)
            document.getElementById("currentVisitors").innerText = current_visitors.toString()
            document.getElementById("totalVisitors").innerText = total_visitors.toString()
        })
}

addEventListener("load", (_) => { updateVisitorCount() })
