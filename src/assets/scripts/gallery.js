
function addImageGalleryListener() {
    // Find any containers with a class of "image-gallery",
    // And add the ability to click on images for a full-screen view of them with navigation
    for (let gallery of document.getElementsByClassName("image-gallery")) {
        for (let image of gallery.getElementsByTagName("img")) {
            image.addEventListener("click", (_) => {
                displayImageGallery(image, gallery)
            })
        }
    }

    // Setup keyboard event listener
    window.addEventListener("keydown", (e) => {
        let galleryView = document.getElementById("galleryView")
        if (galleryView !== null) {
            if (e.key == "ArrowLeft") {
                // Left key press
                document.getElementById("leftButton").click()
                e.preventDefault()
            }
            else if (e.key == "ArrowRight") {
                // Right key press
                document.getElementById("rightButton").click()
                e.preventDefault()
            }
            else if (e.key == "Escape") {
                // Escape key press
                document.getElementById("closeButton").click()
                e.preventDefault()
            }
        }
    })
}

function displayImageGallery(image, gallery) {
    // Display the image close up, with the ability to navigate left or right to adjacent images

    // Only run if a gallery doesn't exist yet
    if (document.getElementById("galleryView") == null) {
        let galleryView = document.createElement("div")
        galleryView.id = "galleryView"

        let galleryImageContainer = document.createElement("div")
        galleryView.appendChild(galleryImageContainer)
        galleryImageContainer.classList.add("imgContainer")

        let galleryImage = document.createElement("img")
        galleryImageContainer.appendChild(galleryImage)
        galleryImage.src = image.src

        let left = document.createElement("button")
        galleryView.appendChild(left)
        left.id = "leftButton"
        left.appendChild(document.createTextNode("←"))
        // If left is clicked, get the next image to the left
        left.addEventListener("click", (_) => {
            let imageLeft = image.previousElementSibling
            // If image is the leftmost image then imageLeft will be null
            if (imageLeft !== null) {
                // New image, update
                galleryImage.src = imageLeft.src
                image = imageLeft
            }
            else {
                // Rotate over to the right-most element
                let imageList = gallery.getElementsByTagName("img")
                let newImage = imageList[imageList.length - 1]
                galleryImage.src = newImage.src
                image = newImage
            }
        })

        let right = document.createElement("button")
        galleryView.appendChild(right)
        right.id = "rightButton"
        right.appendChild(document.createTextNode("→"))
        // If right is clicked, get the next image to the right
        right.addEventListener("click", (_) => {
            let imageRight = image.nextElementSibling
            // If image is the rightmost image then imageRight will be null
            if (imageRight !== null) {
                // New image, update
                galleryImage.src = imageRight.src
                image = imageRight
            }
            else {
                // Rotate over to the left-most element
                let imageList = gallery.getElementsByTagName("img")
                let newImage = imageList[0]
                galleryImage.src = newImage.src
                image = newImage
            }
        })

        let close = document.createElement("button")
        galleryView.appendChild(close)
        close.id = "closeButton"
        close.appendChild(document.createTextNode("✖"))
        // If X if clicked, remove the gallery
        close.addEventListener("click", (_) => {
            galleryView.remove()
        })

        document.body.appendChild(galleryView)
    }
}


// Run addImageGalleryListener() when page finishes loading
addEventListener("load", (_) => { addImageGalleryListener() })
