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
            // Get the container
            let display = document.getElementById("poll-container")

            // Add a header
            let pollHeader = document.createElement("h2")
            pollHeader.appendChild(document.createTextNode("Current Polls:"))

            // Create a list of every poll
            // Polls should be given in order of newest first
            let pollListHTML = document.createElement("ul")
            for (const pollItem of pollList) {
                let htmlItem = document.createElement("li")
                htmlItem.classList.add("clickable")
                let text = document.createTextNode(pollItem.election_name)
                htmlItem.appendChild(text)
                htmlItem.setAttribute("onclick", `displayPoll(${pollItem.election_id})`)
                pollListHTML.appendChild(htmlItem)
            }

            let createButton = document.createElement("button")
            createButton.appendChild(document.createTextNode("Create New Poll"))
            createButton.setAttribute("onclick", "createNewPoll()")

            display.replaceChildren(pollHeader, pollListHTML, createButton)
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
        .then((pollData) => {
            // Get the container
            let display = document.getElementById("poll-container")
            // Make a children list and add the poll title and a hr
            let children = []
            let pollName = document.createElement("h2")
            pollName.appendChild(document.createTextNode(pollData.election_name))
            children.push(pollName)
            children.push(document.createElement("hr"))
            // For every candidate, add their name and description
            for (let i = 0; i < pollData.candidate_names.length; i++) {
                let name = pollData.candidate_names[i]
                let description = pollData.candidate_descriptions[i]
                let nameHtml = document.createElement("h3")
                nameHtml.appendChild(document.createTextNode(name))
                let descHtml = document.createElement("p")
                let italicDesc = document.createElement("a")
                descHtml.appendChild(italicDesc)
                italicDesc.appendChild(document.createTextNode(description))

                children.push(nameHtml)
                children.push(descHtml)
            }

            // Create buttons to Vote or to View Results
            let voteButton = document.createElement("button")
            voteButton.appendChild(document.createTextNode("Vote"))
            voteButton.onclick = () => { displayVoteMenu(pollData) }
            children.push(voteButton)

            let resultsButton = document.createElement("button")
            resultsButton.appendChild(document.createTextNode("View Results"))
            resultsButton.onclick = () => { displayResults(pollData) }
            children.push(resultsButton)

            // Create a back button to get back to the poll list
            let back = document.createElement("p")
            back.classList.add("clickable")
            let backBold = document.createElement("b")
            back.appendChild(backBold)
            backBold.appendChild(document.createTextNode("Back"))
            back.setAttribute("onclick", "displayCurrentPolls()")
            children.push(back)

            // Use apply to provide every item in children as an argument to replaceChildren
            display.replaceChildren(...children)
        })

}

function displayVoteMenu(pollData) {
    alert("TODO")
}

function displayResults(pollData) {
    let url = API_ENDPOINT + "/get_poll_results"
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ election_id: pollData.election_id })
    })
        .then((response) => {
            if (response.status != 200) {
                response.text()
                    .then(handleError)
            }
            return response.json()
        })
        .then((pollResults) => {
            // First, do the usual of getting the output area and creating a title
            let display = document.getElementById("poll-container")
            let children = []
            let title = document.createElement("h2")
            title.appendChild(document.createTextNode(`${pollData.election_name} Results:`))
            children.push(title)

            let resultsInfo = document.createElement("p")
            children.push(resultsInfo)
            // Depending on if there was a tie or not, output different info
            if (pollResults.tied_winners.length == 0) {
                // Poll was successful and winners exist!
                resultsInfo.appendChild(document.createTextNode("The election has been won by:"))
                if (pollResults.winners.length == 1) {
                    // Just one winner, lets give them a nice big name
                    let winnerName = document.createElement("h1")
                    winnerName.appendChild(document.createTextNode(pollData.candidate_names[pollResults.winners[0]]))
                    children.push(winnerName)
                }
                else {
                    // More than one winner, just put them in an ordered list
                    let winnerList = document.createElement("ol")
                    children.push(winnerList)
                    for (const winnerIndex of pollResults.winners) {
                        let winnerName = document.createElement("li")
                        winnerName.appendChild(document.createTextNode(pollData.candidate_names[winnerIndex]))
                        winnerList.appendChild(winnerName)
                    }
                }
            }
            else {
                // Poll was tied, some winners may exist, but not as many as are needed
                resultsInfo.appendChild(document.createTextNode("The election was a tie ☹️"))
                // If there were some unambiguous winners, print them
                if (pollResults.winners.length > 0) {
                    let winnerTitle = document.createElement("p")
                    winnerTitle.appendChild(document.createTextNode("Winning parties (just not enough of them):"))
                    children.push(winnerTitle)
                    let winnerList = document.createElement("ol")
                    children.push(winnerList)
                    for (const winnerIndex of pollResults.winners) {
                        let winnerName = document.createElement("li")
                        winnerName.appendChild(document.createTextNode(pollData.candidate_names[winnerIndex]))
                        winnerList.appendChild(winnerName)
                    }
                }
                // Now print everyone who was tied for the win
                let runnerUpTitle = document.createElement("p")
                runnerUpTitle.appendChild(document.createTextNode("Tied parties:"))
                children.push(runnerUpTitle)
                let runnerList = document.createElement("ul")
                children.push(runnerList)
                for (const runnerIndex of pollResults.tied_winners) {
                    let runnerName = document.createElement("li")
                    runnerName.appendChild(document.createTextNode(pollData.candidate_names[runnerIndex]))
                    runnerList.appendChild(runnerName)
                }
                // I could now append the losing parties here if needed
                // But I won't for now unless users would prefer that they are also printed
            }
            // And now, lastly, regardless of who won, if anyone,
            // Lets print party names and how many first preferences they got
            // Plus a percentage
            // If a user wants me to add two party preferred vote
            // Or three
            // Then they can give me the maths equation to determine when those are needed and to who
            let preferenceTitle = document.createElement("h3")
            preferenceTitle.appendChild(document.createTextNode("First preferences:"))
            children.push(preferenceTitle)
            let partyList = document.createElement("ul")
            children.push(partyList)

            let totalVotes = pollResults.first_preferences.reduce((total, current) => {
                return total + current
            }, 0)
            for (let i = 0; i < pollResults.first_preferences.length; i++) {
                let partyEntry = document.createElement("li")
                partyEntry.appendChild(document.createTextNode(
                    `${pollData.candidate_names[i]}: ${pollResults.first_preferences[i]} Votes (${(pollResults.first_preferences[i] / totalVotes * 100).toFixed(2)}%)`
                ))
                partyList.appendChild(partyEntry)
            }

            // Create a back button to get back to the poll list
            let back = document.createElement("p")
            back.classList.add("clickable")
            let backBold = document.createElement("b")
            back.appendChild(backBold)
            backBold.appendChild(document.createTextNode("Back"))
            back.setAttribute("onclick", "displayCurrentPolls()")
            children.push(back)

            // Display results
            display.replaceChildren(...children)
        })
}

function createNewPoll() {
    // For once I don't actually have to fetch anything before displaying that's fun
    // First, do the usual of getting the output area and creating a title
    let display = document.getElementById("poll-container")
    let title = document.createElement("h2")
    title.appendChild(document.createTextNode("Create a new Poll:"))
    let formContainer = document.createElement("form")
    formContainer.classList.add("formContainer")

    // Form Content:
    // Poll title
    let pollTitleDiv = document.createElement("div")
    formContainer.appendChild(pollTitleDiv)
    let pollTitleLabel = document.createElement("label")
    pollTitleDiv.appendChild(pollTitleLabel)
    pollTitleLabel.appendChild(document.createTextNode("Election Name:"))
    pollTitleLabel.setAttribute("for", "election_name")
    let pollTitleInput = document.createElement("input")
    pollTitleDiv.appendChild(pollTitleInput)
    pollTitleInput.setAttribute("type", "text")
    pollTitleInput.setAttribute("required", true)
    pollTitleInput.setAttribute("name", "election_name")
    pollTitleInput.setAttribute("id", "election_name")

    // Poll Description
    let pollDescriptionDiv = document.createElement("div")
    formContainer.appendChild(pollDescriptionDiv)
    let pollDescriptionLabel = document.createElement("label")
    pollDescriptionDiv.appendChild(pollDescriptionLabel)
    pollDescriptionLabel.appendChild(document.createTextNode("Election Description:"))
    pollDescriptionLabel.setAttribute("for", "election_description")
    let pollDescriptionInput = document.createElement("textarea")
    pollDescriptionDiv.appendChild(pollDescriptionInput)
    pollDescriptionInput.setAttribute("name", "election_description")
    pollDescriptionInput.setAttribute("id", "election_description")

    // Number of winners
    let winnerCountDiv = document.createElement("div")
    formContainer.appendChild(winnerCountDiv)
    let winnerCountLabel = document.createElement("label")
    winnerCountDiv.appendChild(winnerCountLabel)
    winnerCountLabel.appendChild(document.createTextNode("Number of winners:"))
    winnerCountLabel.setAttribute("for", "winner_amount")
    let winnerCountInput = document.createElement("input")
    winnerCountDiv.appendChild(winnerCountInput)
    winnerCountInput.setAttribute("type", "number")
    winnerCountInput.setAttribute("required", true)
    winnerCountInput.setAttribute("name", "winner_amount")
    winnerCountInput.setAttribute("id", "winner_amount")
    // Default value
    winnerCountInput.setAttribute("value", "1")
    winnerCountInput.setAttribute("min", "1")
    winnerCountInput.setAttribute("max", "100")

    // Minimum required preferences
    let minimumPrefDiv = document.createElement("div")
    formContainer.appendChild(minimumPrefDiv)
    let minimumPrefLabel = document.createElement("label")
    minimumPrefDiv.appendChild(minimumPrefLabel)
    minimumPrefLabel.appendChild(document.createTextNode("Minimum preferences for each vote:\n(leave at 0 for all required)"))
    minimumPrefLabel.setAttribute("for", "minimum_preferences")
    let minimumPrefInput = document.createElement("input")
    minimumPrefDiv.appendChild(minimumPrefInput)
    minimumPrefInput.setAttribute("type", "number")
    minimumPrefInput.setAttribute("required", true)
    minimumPrefInput.setAttribute("name", "minimum_preferences")
    minimumPrefInput.setAttribute("id", "minimum_preferences")
    // Default value
    minimumPrefInput.setAttribute("value", "0")
    minimumPrefInput.setAttribute("min", "0")
    minimumPrefInput.setAttribute("max", "100")

    // Randomise Order before submission
    let randomiseBeforeDiv = document.createElement("div")
    formContainer.appendChild(randomiseBeforeDiv)
    let randomiseBeforeLabel = document.createElement("label")
    randomiseBeforeDiv.appendChild(randomiseBeforeLabel)
    randomiseBeforeLabel.appendChild(document.createTextNode("Shuffle order of Candidates before submission:"))
    randomiseBeforeLabel.setAttribute("for", "randomise_before")
    let randomiseBeforeInput = document.createElement("input")
    randomiseBeforeDiv.appendChild(randomiseBeforeInput)
    randomiseBeforeInput.setAttribute("type", "checkbox")
    randomiseBeforeInput.setAttribute("name", "randomise_before")
    randomiseBeforeInput.setAttribute("id", "randomise_before")

    // Randomise Order after submission
    let randomiseAfterDiv = document.createElement("div")
    formContainer.appendChild(randomiseAfterDiv)
    let randomiseAfterLabel = document.createElement("label")
    randomiseAfterDiv.appendChild(randomiseAfterLabel)
    randomiseAfterLabel.appendChild(document.createTextNode("Shuffle order of Candidates displayed to each voter:"))
    randomiseAfterLabel.setAttribute("for", "randomise_order")
    let randomiseAfterInput = document.createElement("input")
    randomiseAfterDiv.appendChild(randomiseAfterInput)
    randomiseAfterInput.setAttribute("type", "checkbox")
    randomiseAfterInput.setAttribute("name", "randomise_order")
    randomiseAfterInput.setAttribute("id", "randomise_order")


    display.replaceChildren(title, formContainer)
}

function handleError(errorResponse) {
    // For now just log the error message
    console.log("Error from endpoint:" + errorResponse)
}

displayCurrentPolls()
