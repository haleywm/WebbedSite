let showCache = {}

async function pickEpisode(dataSource, formId) {
    // Get show json
    let episodes = null
    if(dataSource in showCache) {
        episodes = showCache[dataSource]
    }
    else {
        let response = await fetch(dataSource)
        episodes = await response.json()
        showCache[dataSource] = episodes
    }

    /* Check what categories need to be used
     * This is done by iterating through the elements in the form
     * and first checking if they're a checkbox,
     * and if they are then checking if they're also checked
     * and adding only the names of those to the category list
    */
    let categories = []
    for(box of document.getElementById(formId).elements) {
        if(box.type == "checkbox" && box.checked) {
            categories.push(box.name)
        }
    }

    if(categories.length == 0) {
        // No categories were selected, exit early
        return {
            "title": "No categories selected",
            "description": ""
        }
    }

    let choices = []
    for(cat of categories) {
        choices = choices.concat(episodes[cat])
    }

    return choices[Math.floor(Math.random() * choices.length)]
}

function showEpisode(dataSource, formId, outputId) {
    pickEpisode(dataSource, formId)
        .then((episode) => {
            let out = document.getElementById(outputId)
            out.innerHTML = `<h3>${episode.title}</h3>\n<p>${episode.description}</p>`
        })
}
