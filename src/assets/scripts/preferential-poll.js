function displayCurrentPolls() {
    // To run async code from non-async code
    // I can run an async function, and on it's promise,
    // add a callback with then()
    let url = API_ENDPOINT + "/get_polls"
    fetch(url)
        .then((response) => {
            return response.json()
        }, (error) => {
            // Unable to get the request, just display a "Server Error" message to user
            let display = document.getElementById("poll-container")
            let info = document.createElement("p")
            info.appendChild(document.createTextNode("Oopsie woopsie! Unable to contact the poll server."))
            display.replaceChildren(info)
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
                let button = document.createElement("button")
                button.classList.add("textbutton")
                button.appendChild(document.createTextNode(pollItem.election_name))
                htmlItem.appendChild(button)
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

            // Create buttons to Vote, View Results, or View all Votes
            // Button container
            let buttonRow = document.createElement("div")
            buttonRow.classList.add("row")
            children.push(buttonRow)

            let voteButton = document.createElement("button")
            voteButton.appendChild(document.createTextNode("Vote"))
            voteButton.onclick = () => { displayVoteMenu(pollData) }
            buttonRow.appendChild(voteButton)

            let resultsButton = document.createElement("button")
            resultsButton.appendChild(document.createTextNode("View Results"))
            resultsButton.onclick = () => { displayResults(pollData) }
            buttonRow.appendChild(resultsButton)

            // Create a back button to get back to the poll list
            let back = document.createElement("button")
            back.classList.add("textbutton")
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
    // Display a menu to allow choosing who to vote for
    let display = document.getElementById("poll-container")
    let title = document.createElement("h2")
    title.appendChild(document.createTextNode(`Casting vote in ${pollData.election_name}`))
    // Create voteContainer, which will display two lists
    // voteOrder, which contains the users votes in order
    // And uncastVotes, which contains everyone who isn't being ranked
    // uncastVotes starts off full of votes
    // and voteOrder starts empty
    let voteContainer = document.createElement("div")
    voteContainer.classList.add("voteContainer")
    let voteOrderContainer = document.createElement("div")
    voteContainer.appendChild(voteOrderContainer)
    voteOrderContainer.classList.add("light")
    let voteOrderTitle = document.createElement("h3")
    voteOrderContainer.appendChild(voteOrderTitle)
    voteOrderTitle.appendChild(document.createTextNode("Cast Votes:"))
    let voteOrder = document.createElement("ol")
    voteOrderContainer.appendChild(voteOrder)
    voteOrder.id = "voteOrder"
    let uncastVotesContainer = document.createElement("div")
    voteContainer.appendChild(uncastVotesContainer)
    uncastVotesContainer.classList.add("dark")
    let uncastVotesTitle = document.createElement("h3")
    uncastVotesContainer.appendChild(uncastVotesTitle)
    uncastVotesTitle.appendChild(document.createTextNode("Uncast Votes:"))
    let uncastVotes = document.createElement("ol")
    uncastVotesContainer.appendChild(uncastVotes)
    uncastVotes.id = "uncastVotes"

    // Now, fill uncastVotes with options
    let candidateList = pollData.candidate_names
    if (pollData.randomise_order) {
        // Randomise candidates order if needed
        // By copying it to a new list
        // And shuffling that list
        candidateList = Array.from(candidateList)
        shuffle(candidateList)
    }
    for (let candidate of candidateList) {
        let box = document.createElement("li")
        box.appendChild(document.createTextNode(candidate))
        // For accessibility, adding button characteristics to this li
        // (Would use a real button but that doesn't play nice style wise)
        box.setAttribute("role", "button")
        box.setAttribute("tabindex", 0)
        box.onclick = () => { swapItem(box) }
        box.addEventListener("keydown", (e) => {
            // Verify if keypress was enter or space
            if (e.key == "Enter" || e.key == " ") {
                // Trigger onclick event
                e.currentTarget.onclick()
            }
            // Allow using up and down to juggle items within list
            else if (e.key == "ArrowUp") {
                if (e.currentTarget.previousElementSibling !== null) {
                    e.currentTarget.parentElement.insertBefore(e.currentTarget, e.currentTarget.previousElementSibling)
                    e.preventDefault()
                    e.currentTarget.focus()
                }
            }
            else if (e.key == "ArrowDown") {
                if (e.currentTarget.nextElementSibling !== null) {
                    e.currentTarget.parentElement.insertBefore(e.currentTarget, e.currentTarget.nextElementSibling.nextElementSibling)
                    e.preventDefault()
                    e.currentTarget.focus()
                }
            }
        })
        uncastVotes.appendChild(box)
    }

    // Adding vote button
    let voteButton = document.createElement("button")
    voteButton.appendChild(document.createTextNode("Submit Vote"))
    voteButton.onclick = () => { submitVote(pollData) }

    // Create a back button to get back to the poll info
    let back = document.createElement("button")
    back.classList.add("textbutton")
    let backBold = document.createElement("b")
    back.appendChild(backBold)
    backBold.appendChild(document.createTextNode("Back"))
    back.onclick = () => { displayPoll(pollData.election_id) }


    // Adding everything to the page
    display.replaceChildren(title, voteContainer, voteButton, back)

    // And establishing SortableJS after creation
    // In case it doesn't like being initiated on something that doesn't exist yet
    new Sortable(voteOrder, {
        group: "shared",
        animation: 150
    })

    new Sortable(uncastVotes, {
        group: "shared",
        animation: 150
    })

    // Setting the height of the container as fixed
    // So that it doesn't shrink as votes are moved
    // Will look funny if page is resized but I'm not sure how to fix that
    let currentHeight = voteContainer.offsetHeight
    // Giving voteContainer a fixed height so it doesn't shrink
    voteContainer.setAttribute("style", `min-height: ${currentHeight}px`)
}

function submitVote(pollData) {
    // Gather up the vote order, and then submit it
    let voteOrder = document.getElementById("voteOrder")
    let userVotes = []

    // Checking for errors
    if (pollData.minimum_preferences > voteOrder.children.length) {
        alert(`At least ${pollData.minimum_preferences} votes required!`)
        return
    }
    if (pollData.minimum_preferences <= 0 && voteOrder.children.length != pollData.candidate_names.length) {
        alert(`Exactly ${pollData.candidate_names.length} names required!`)
        return
    }

    // Iterate through each vote in the list in order
    // And add the votes relevant index to userVotes
    for (let voteItem of voteOrder.children) {
        let name = voteItem.textContent
        // The text content of every item should match a candidate name perfectly
        userVotes.push(pollData.candidate_names.indexOf(name))
    }

    // Submitting vote
    let url = API_ENDPOINT + "/submit_vote"
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "election_id": pollData.election_id,
            "preferences": userVotes
        })
    })
        .then((response) => {
            if (response.status != 200) {
                // Server didn't accept submission, tell the user
                // Text isn't available yet, wait for the text
                response.text()
                    .then((text) => {
                        alert(`Error ${response.status} submitting poll: ${text}`)
                    })
            }
            else {
                // The response text will just be "OK" so we're good to go!
                // Return to looking at election
                console.log("Successfully submitted vote!")
                displayPoll(pollData.election_id)
            }
        })
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
                    // Lastly, include some advice on resolving the tie
                    let notice = document.createElement("p")
                    notice.innerHTML = "If a tie occurred in a real election, then the case would go to court and the election would likely have to be repeated. Since this is hopefully lower stakes, if the person who created the poll hasn't voted, they could choose a winner. Alternatively, <a href='https://pickerwheel.com/'>pick a random option from the tied options</a>! You could also use a different method of preferential voting on a different site like strawpoll but <a href='https://ncase.me/ballot/'>all of the options are at least a little bit flawed</a>."
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
                // If there are votes, give a percentage
                // If there are no votes, just give N/A%
                let votePercentage
                if (totalVotes != 0) {
                    votePercentage = (pollResults.first_preferences[i] / totalVotes * 100).toFixed(2)
                }
                else {
                    votePercentage = "N/A"
                }
                partyEntry.appendChild(document.createTextNode(
                    `${pollData.candidate_names[i]}: ${pollResults.first_preferences[i]} Votes (${votePercentage}%)`
                ))
                partyList.appendChild(partyEntry)
            }

            // Button container
            let buttonRow = document.createElement("div")
            buttonRow.classList.add("row")
            children.push(buttonRow)

            // Button to view all votes
            let allVotesButton = document.createElement("button")
            allVotesButton.appendChild(document.createTextNode("View All Votes"))
            allVotesButton.onclick = () => { viewAllVotes(pollData) }
            buttonRow.appendChild(allVotesButton)

            // Create a button to view how the results were calculated
            let viewDetailsButton = document.createElement("button")
            viewDetailsButton.appendChild(document.createTextNode("View election calculation details"))
            viewDetailsButton.onclick = () => { displayPollStages(pollData, pollResults) }
            buttonRow.appendChild(viewDetailsButton)
            
            // Create a back button to get back to the poll info
            let back = document.createElement("button")
            back.classList.add("textbutton")
            let backBold = document.createElement("b")
            back.appendChild(backBold)
            backBold.appendChild(document.createTextNode("Back"))
            back.onclick = () => { displayPoll(pollData.election_id) }
            children.push(back)

            // Display results
            display.replaceChildren(...children)
        })
}

function viewAllVotes(pollData) {
    // Views all votes for a given poll
    // First, fetch the raw CSV file
    let url = API_ENDPOINT + "/download_all_votes"
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
            return response.text()
        })
        .then((response) => {
            // Before parsing text, first prepare DOM
            let display = document.getElementById("poll-container")
            let title = document.createElement("h2")
            title.appendChild(document.createTextNode(`All Votes: ${pollData.election_name}`))
            let disclaimer = document.createElement("p")
            disclaimer.appendChild(document.createTextNode("Please note that this is primarily for testing or educational purposes. Reading raw votes can be difficult to parse, and votes are anonymized with no further information collected."))
            let voteContainer = document.createElement("div")

            // Now parse the data
            // Response is CSV encoded vote indexes
            // Parse that:
            const lines = response.split("\n")
            for (let line of lines) {
                // Ignore empty lines
                if (line.length > 0) {
                    // Separate votes with a line
                    voteContainer.appendChild(document.createElement("hr"))
                    let voteList = document.createElement("ol")
                    voteContainer.appendChild(voteList)
                    const indexes = line.split(",")
                    for (strIndex of indexes) {
                        let vote = document.createElement("li")
                        voteList.appendChild(vote)
                        vote.appendChild(document.createTextNode(
                            pollData.candidate_names[parseInt(strIndex)]
                        ))
                    }
                }
            }

            // Add a back button
            let back = document.createElement("button")
            back.classList.add("textbutton")
            let backBold = document.createElement("b")
            back.appendChild(backBold)
            backBold.appendChild(document.createTextNode("Back"))
            back.onclick = () => { displayPoll(pollData.election_id) }

            display.replaceChildren(title, disclaimer, voteContainer, back)
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
    pollTitleDiv.classList.add("form-row-double")
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

    // Number of winners
    let winnerCountDiv = document.createElement("div")
    formContainer.appendChild(winnerCountDiv)
    winnerCountDiv.classList.add("form-row-double")
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
    minimumPrefDiv.classList.add("form-row-double")
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
    randomiseBeforeDiv.classList.add("form-row-double")
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
    randomiseAfterDiv.classList.add("form-row-double")
    let randomiseAfterLabel = document.createElement("label")
    randomiseAfterDiv.appendChild(randomiseAfterLabel)
    randomiseAfterLabel.appendChild(document.createTextNode("Shuffle order of Candidates displayed to each voter:"))
    randomiseAfterLabel.setAttribute("for", "randomise_order")
    let randomiseAfterInput = document.createElement("input")
    randomiseAfterDiv.appendChild(randomiseAfterInput)
    randomiseAfterInput.setAttribute("type", "checkbox")
    randomiseAfterInput.setAttribute("name", "randomise_order")
    randomiseAfterInput.setAttribute("id", "randomise_order")

    // Container for all candidate info
    let candidatesContainer = document.createElement("div")
    formContainer.appendChild(candidatesContainer)
    candidatesContainer.id = "candidatesContainer"

    // Button to add additional candidates
    let addCandidateButton = document.createElement("button")
    formContainer.appendChild(addCandidateButton)
    addCandidateButton.classList.add("little")
    addCandidateButton.appendChild(document.createTextNode("+"))
    addCandidateButton.setAttribute("onclick", "addCandidateToPoll()")
    addCandidateButton.setAttribute("type", "button")

    // Line break
    formContainer.appendChild(document.createElement("hr"))

    // Submit Button
    let submitButton = document.createElement("button")
    formContainer.appendChild(submitButton)
    submitButton.appendChild(document.createTextNode("Submit"))
    submitButton.setAttribute("onclick", "submitPoll()")
    submitButton.setAttribute("type", "button")

    // Create a back button to get back to the poll list
    let back = document.createElement("button")
    back.classList.add("textbutton")
    let backBold = document.createElement("b")
    back.appendChild(backBold)
    backBold.appendChild(document.createTextNode("Back"))
    back.setAttribute("onclick", "displayCurrentPolls()")

    display.replaceChildren(title, formContainer, back)

    // Create an initial candidate
    addCandidateToPoll()

}

function addCandidateToPoll() {
    let candidateList = document.getElementById("candidatesContainer")
    let candidateId = candidateList.childElementCount

    let candidateContainer = document.createElement("div")
    candidateContainer.id = `candidate-${candidateId}`
    candidateContainer.classList.add("candidate")


    // Candidate Name
    let candidateNameDiv = document.createElement("div")
    candidateContainer.appendChild(candidateNameDiv)
    candidateNameDiv.classList.add("form-row-triple")
    let candidateNameLabel = document.createElement("label")
    candidateNameDiv.appendChild(candidateNameLabel)
    candidateNameLabel.appendChild(document.createTextNode("Candidate Name:"))
    let formId = `candidate-name-${candidateId}`
    candidateNameLabel.setAttribute("for", formId)
    let candidateNameInput = document.createElement("input")
    candidateNameDiv.appendChild(candidateNameInput)
    candidateNameInput.setAttribute("type", "text")
    candidateNameInput.setAttribute("required", true)
    candidateNameInput.setAttribute("name", formId)
    candidateNameInput.setAttribute("id", formId)
    // Also have a remove button next to candidate name
    let removeCandidateButton = document.createElement("button")
    candidateNameDiv.appendChild(removeCandidateButton)
    removeCandidateButton.appendChild(document.createTextNode("X"))
    removeCandidateButton.classList.add("little")
    removeCandidateButton.onclick = () => {
        candidateContainer.remove()
    }

    // Poll Description
    let candidateDescriptionDiv = document.createElement("div")
    candidateContainer.appendChild(candidateDescriptionDiv)
    candidateDescriptionDiv.classList.add("form-row-double")
    let candidateDescriptionLabel = document.createElement("label")
    candidateDescriptionDiv.appendChild(candidateDescriptionLabel)
    candidateDescriptionLabel.appendChild(document.createTextNode("Candidate Description:"))
    formId = `candidate-description-${candidateId}`
    candidateDescriptionLabel.setAttribute("for", formId)
    let candidateDescriptionInput = document.createElement("textarea")
    candidateDescriptionDiv.appendChild(candidateDescriptionInput)
    candidateDescriptionInput.setAttribute("name", formId)
    candidateDescriptionInput.setAttribute("id", formId)

    // Add the two items to the list
    candidateList.appendChild(candidateContainer)
}

function submitPoll() {
    // Gathering data for poll
    let formIds = ["election_name", "minimum_preferences", "winner_amount", "randomise_before", "randomise_order"]
    // Checking validity
    let all_valid = true
    // Going through all main form elements
    for (let id of formIds) {
        if (!document.getElementById(id).reportValidity()) {
            // Invalid contents, this should popup with error
            all_valid = false
        }
    }
    // Going through however many candidate names are in the candidate list
    // Candidate descriptions can be empty so that's fine
    let candidateList = document.getElementById("candidatesContainer")
    for (let candidate of candidateList.getElementsByTagName("input")) {
        if (!candidate.reportValidity()) {
            all_valid = false
        }
    }
    if (!all_valid) {
        // Wait for user to fix errors
        return
    }

    // Gathering data to object
    let pollData = {
        "election_name": document.getElementById("election_name").value,
        "minimum_preferences": parseInt(document.getElementById("minimum_preferences").value),
        "winner_amount": parseInt(document.getElementById("winner_amount").value),
        "candidate_names": [],
        "candidate_descriptions": [],
        "randomise_order": document.getElementById("randomise_order").checked
    }
    // Checking side value
    let randomiseBefore = document.getElementById("randomise_before").checked
    // Getting candidate details
    let candidateChildren = Array.from(candidateList.children)
    // Shuffling if requested
    if (randomiseBefore) {
        shuffle(candidateChildren)
    }
    // Going through the list, either in order or shuffled,
    // And for each entry grabbing the name and description and adding it to the end of the list
    for (let candidate of candidateChildren) {
        let name = candidate.getElementsByTagName("input")[0].value
        let description = candidate.getElementsByTagName("textarea")[0].value
        pollData["candidate_names"].push(name)
        pollData["candidate_descriptions"].push(description)
    }

    // Lastly, submitting the created JSON
    let url = API_ENDPOINT + "/submit_poll"
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pollData)
    })
        .then((response) => {
            if (response.status != 200) {
                // Server didn't accept submission, tell the user
                // Text isn't available yet, wait for the text
                response.text()
                    .then((text) => {
                        alert(`Error ${response.status} submitting poll: ${text}`)
                    })
            }
            // Response code was 200 so let's act on the json which will have new poll id
            return response.json()
        })
        .then((response) => {
            // Response was successful and json has been decoded
            let pollId = response["election_id"]
            console.log(`Successfully created poll ${pollId}!`)
            displayPoll(pollId)
        })
}

function displayPollStages(pollData, pollResults) {
    let display = document.getElementById("poll-container")

    let info = document.createElement("p")
    info.appendChild(document.createTextNode("Curious how the outcome of the election was calculated? Here's the step-by-step process of eliminating candidates and allowing preferences to flow on until winners are found, if possible.\n\nThis process is how elections counted with preferential polling generally work. If you find that this process doesn't produce a successful result in your situation (Such as if there are only a small number of votes), then a different voting method may work better for your situation."))

    let quota = document.createElement("p")
    quota.appendChild(document.createTextNode(`The quota for this election, based on the number of voters and the number of candidates needed, is: ${pollResults.quota}`))

    let stageContainer = document.createElement("div")

    // Data used throughout processing
    let ignoredParties = []
    // Iterate through each stage of the election
    for (let i = 0; i < pollResults.election_stages.length; i++) {
        // Header
        let stageHeader = document.createElement("h2")
        stageContainer.appendChild(stageHeader)
        stageHeader.appendChild(document.createTextNode(`Round ${i + 1}:`))
        let tableHeader = document.createElement("h3")
        stageContainer.appendChild(tableHeader)
        tableHeader.appendChild("Current vote totals:")
        // Print the counted votes from this round, excluded any eliminated parties
        // Creating a table and head
        let voteTable = document.createElement("table")
        let tableHead = document.createElement("thead")
        voteTable.appendChild(tableHead)
        let headRow = document.createElement("tr")
        tableHead.appendChild(headRow)
        let firstLabel = document.createElement("th")
        headRow.appendChild(firstLabel)
        firstLabel.setAttribute("scope", "row")
        firstLabel.appendChild(document.createTextNode("Party Name:"))
        // Add all current party names
        for(let partyIndex = 0; partyIndex < pollData.candidate_names.length; partyIndex++) {
            // Only print if not ignored
            if (ignoredParties.indexOf(partyIndex) != -1) {
                let newLabel = document.createElement("th")
                headRow.appendChild(newLabel)
                newLabel.setAttribute("scope", "col")
                newLabel.appendChild(document.createTextNode(pollData.candidate_names[partyIndex]))
            }
        }
        // Next add the vote row
        let tableBody = document.createElement("tbody")
        voteTable.appendChild(tableBody)
        let bodyRow = document.createElement("tr")
        tableBody.appendChild(bodyRow)
        let secondLabel = document.createElement("th")
        bodyRow.appendChild(secondLabel)
        secondLabel.setAttribute("scope", "row")
        secondLabel.appendChild(document.createTextNode("Votes this round:"))

        // And add all current party totals
        for(let partyIndex = 0; partyIndex < pollData.candidate_names.length; partyIndex++) {
            // Only print if not ignored
            if (ignoredParties.indexOf(partyIndex) == -1) {
                let newLabel = document.createElement("td")
                // Highlight the number if that vote is getting that candidate elected or eliminated
                if (pollResults.election_stages[i][1].indexOf(partyIndex) != -1) {
                    newLabel.classList.add("bold")
                }
                bodyRow.appendChild(newLabel)
                newLabel.appendChild(document.createTextNode(
                    pollResults.votes_per_stage[i][partyIndex].toFixed(1)
                ))
            }
        }

        // Next, print the results of this round
        let resultDiscussion = document.createElement("p")
        stageContainer.appendChild(resultDiscussion)
        let listHeader = document.createElement("h3")
        stageContainer.appendChild(listHeader)
        let partyList = document.createElement("ul")
        stageContainer.appendChild(partyList)
        
        switch(pollResults.election_stages[i][0]) {
            case "success":
                // Final stage of a successful election, we're all done!
                resultDiscussion.appendChild(document.createTextNode(
                    `Having achieved more than ${pollResults.quota} votes, a winner has been elected. The number of elected parties has been achieved and the election has now been called using all winners (or just one if only one winner was needed.)`
                ))
                listHeader.appendChild(document.createTextNode("Elected:"))
                break
            case "eliminated":
                // 1 or more parties has been eliminated for not enough votes
                resultDiscussion.appendChild(document.createTextNode(
                    `No candidate has managed to achieve at least ${pollResults.quota} votes. Therefore, the least popular ${pollResults.election_stages[i][1].length > 1 ? "candidates" : "candidate"} will be eliminated, and votes for them will flow on to the next highest preference for all voters.`
                ))
                listHeader.appendChild(document.createTextNode("Eliminated:"))
                break
            case "elected":
                // 1 or more parties has been elected and removed from the count, but we need more
                resultDiscussion.appendChild(document.createTextNode(
                    `Having achieved more than ${pollResults.quota} votes, ${pollResults.election_stages[i][1].length > 1 ? "candidates are" : "a candidate is"} elected!\nEvery vote which contributed to the candidates election is multiplied by a transfer value of ${pollResults.election_stages[i][2]}, which will allow additional votes beyond the minimum number required to go towards additional candidates.`
                ))
                listHeader.appendChild(document.createTextNode("Elected:"))
                break
            case "electedwithoutquota":
                // Secret election rule
                resultDiscussion.appendChild(document.createTextNode(
                    "In a special case to avoid unnecessary ties, candidates were elected without meeting quota. This is a special rule that should only occur if too many votes were exhausted.\nIn an election where voters aren't required to preference every candidate, if every candidate given a position on a vote is eliminated, then that vote will be exhausted, meaning that it doesn't contribute to anybodies vote total. It still counts towards the quota however, and in some cases such as the Australian 2016 election this can result in there simply not being enough votes to meet the recognised quota.\nTo prevent an additional election being called, candidates can be elected without meeting quota, if either the number of remaining candidates is equal to the number of candidates needed, or if only one position and two candidates remain, in which case the higher ranked candidate is chosen."
                ))
                listHeader.appendChild(document.createTextNode("Elected without quota:"))
                break
            case "randomlychosen":
                // Secret election rule
                resultDiscussion.appendChild(document.createTextNode(
                    "As a very rare measure to prevent a tie, the AEC has a rule which allows for a candidate to be randomly selected, if, and only if, there are two remaining candidates, one remaining position, and the candidates are equally matched. In real life the AEC would draw one of two numbered balls to randomly pick. I'm just a tool on the internet so I just used a pseudo-random number generator."
                ))
                listHeader.appendChild(document.createTextNode("Randomly Chosen:"))
                break
            case "tie":
                // A tie has occurred, no more election
                resultDiscussion.appendChild(document.createTextNode(
                    `Unfortunately, a tie has occurred. This typically occurs when there are not enough votes for any remaining candidate to be elected (because they have fewer votes than the quota of ${pollResults.quota}), but another round of eliminations would result in all remaining candidates being disqualified.\nGenerally, this happens when either votes are perfectly split between more than two candidates.`
                ))
                listHeader.appendChild(document.createTextNode("Tied for election:"))
                break
        }
        
        // Add the parties from this round to the list regardless of context
        for (const partyIndex of pollResults.election_stages[i][1]) {
            let listItem = document.createElement("li")
            partyList.appendChild(listItem)
            listItem.appendChild(document.createTextNode(pollData.candidate_names[partyIndex]))
        }

        // Add parties from this round to ignored party list
        ignoredParties = ignoredParties.concat(pollResults.election_stages[i][1])
    }

    // Create a back button to get back to the poll list
    let back = document.createElement("button")
    back.classList.add("textbutton")
    let backBold = document.createElement("b")
    back.appendChild(backBold)
    backBold.appendChild(document.createTextNode("Back"))
    back.setAttribute("onclick", "displayCurrentPolls()")

    display.replaceChildren(info, quota, stageContainer, back)
}

function handleError(errorResponse) {
    // For now just log the error message
    console.log("Error from endpoint:" + errorResponse)
}

function swapItem(box) {
    // Swaps an li item between the two lists
    // Figure out where the box needs to go based on it's current parent
    let targetParentId
    if (box.parentElement.id == "uncastVotes") {
        targetParentId = "voteOrder"
    }
    else {
        targetParentId = "uncastVotes"
    }

    // Move it
    // This automatically removes box from the old parent
    document.getElementById(targetParentId).appendChild(box)
    box.focus()
}


// This function is taken from https://stackoverflow.com/a/2450976
// Thanks to coolaj86
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

displayCurrentPolls()
