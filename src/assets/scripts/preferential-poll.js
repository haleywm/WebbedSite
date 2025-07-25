function displayCurrentPolls() {
    // To run async code from non-async code
    // I can run an async function, and on it's promise,
    // add a callback with then()
    let url = API_ENDPOINT + "/get_polls"
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((pollList) => {
            let display = document.getElementById("poll-container")
            let pollHeader = document.createElement("h2")
            pollHeader.appendChild(document.createTextNode("Current Polls:"))
            let pollListHTML = document.createElement("ul")
            for (pollItem of pollList.reverse()) {
                let htmlItem = document.createElement("li")
                htmlItem.classList.add("clickable")
                let text = document.createTextNode(pollItem.election_name)
                htmlItem.appendChild(text)
                htmlItem.setAttribute("onclick", `displayPoll(${pollItem.election_id})`)
                pollListHTML.appendChild(htmlItem)
            }

            display.replaceChildren(pollHeader, pollListHTML)
        })
}

function displayPoll(pollId) {
    let url = API_ENDPOINT + "/get_poll_details"
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ election_id: pollId })
    })
        .then((response) => {
            if (response.status != 200) {
                response.text()
                    .then(handleError)
            }
            return response.json()
        })
        .then((response) => {
            let display = document.getElementById("poll-container")
            let children = []
            let pollName = document.createElement("h2")
            pollName.appendChild(document.createTextNode(response.election_name))
            children.push(pollName)
            children.push(document.createElement("hr"))
            for (let i = 0; i < response.candidate_names.length; i++) {
                let name = response.candidate_names[i]
                let description = response.candidate_descriptions[i]
                let nameHtml = document.createElement("h3")
                nameHtml.appendChild(document.createTextNode(name))
                let descHtml = document.createElement("p")
                let italicDesc = document.createElement("a")
                descHtml.appendChild(italicDesc)
                italicDesc.appendChild(document.createTextNode(description))

                children.push(nameHtml)
                children.push(descHtml)
            }
            // Create a back button to get back to the poll list
            let back = document.createElement("p")
            back.classList.add("clickable")
            let backBold = document.createElement("b")
            back.appendChild(backBold)
            backBold.appendChild(document.createTextNode("Back"))
            back.setAttribute("onclick", "displayCurrentPolls()")
            children.push(back)
            let voteButton = document.createElement("button")
            voteButton.appendChild(document.createTextNode("Vote"))
            voteButton.setAttribute("onclick", `displayVoteMenu(${response.election_id})`)
            children.push(voteButton)
            
            let resultsButton = document.createElement("button")
            resultsButton.appendChild(document.createTextNode("View Results"))
            resultsButton.setAttribute("onclick", `displayResults(${response.election_id})`)
            children.push(resultsButton)
            // Use apply to provide every item in children as an argument to replaceChildren
            display.replaceChildren(...children)
        })

}

function displayVoteMenu(pollId) {
    alert("TODO")
}

function displayResults(pollId) {
    alert("TODO")
}

function handleError(errorResponse) {
    // For now just log the error message
    console.log("Error from endpoint:" + errorResponse)
}

displayCurrentPolls()
