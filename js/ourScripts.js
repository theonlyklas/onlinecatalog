window.CURRENT_PAGE;
window.PAGE_ASPECT_RATIO = 0.7;
window.ZOOMED = false;
window.PAGES = [];
window.MAX_PAGES;
window.PDF_SCALE = 2;
window.DESIRED_PAGE = 0;
window.FLIPPING_PAGES = 0;
window.FLIPPING_DIRECTION = "";

window.onload = function() {
    window.CURRENT_PAGE = 1;
    removeZoom();

    PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        window.MAX_PAGES = pdf.numPages;
        // if device is on iOS, change the scale of the rendered page to 1.5.  Otherwise, it crashes due to using too much memory.
        detectIPhone(1.5);

        var canvas = document.createElement("canvas");
        canvas.className = "page";
        canvas.setAttribute("id", "firstPage");
        window.PAGES.push(canvas);

        delayedLoad(pdf, 1);
    });
}

window.onresize = function() {
    fixAspectRatio();
}

window.onunload = function() {
    delete window.CURRENT_PAGE;
    delete window.PAGE_ASPECT_RATIO;
    delete window.ZOOMED;
    delete window.PAGES;
    delete window.MAX_PAGES;
    delete window.PDF_SCALE;
    delete window.DESIRED_PAGE;
    delete window.FLIPPING_PAGES;
    delete window.FLIPPING_DIRECTION;
}

window.addEventListener("keydown", function(e) {
    // space, page up, page down and arrow keys have their scroll actions disabled
    if ([32, 33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    // reassign left and right arrow keys to previousPage() and nextPage()
    if (e.keyCode == 37 && window.FLIPPING_DIRECTION != "right") {
        previousPage();
    } else if (e.keyCode == 39 && window.FLIPPING_DIRECTION != "left") {
        nextPage();
    }
}, false);

// do things if an iPhone is detected (may require changing of max pages depending on number of pages in catalog)
function detectIPhone(newScale) {
    var iPhone = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iPhone == true) {
        window.PDF_SCALE = newScale;
    }
}

// remove the zoom button if the user is on a mobile device
function removeZoom() {
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !window.MSStream;
    if (mobile) {
        var zoomButton = document.getElementById("zoom");
        zoomButton.parentNode.removeChild(zoomButton);
    }
}

// fixes aspect ratio of displayed pages
function fixAspectRatio() {
    var aspectRatio = window.PAGE_ASPECT_RATIO;
    var book = document.getElementById("book");
    var pageStyle = document.getElementsByTagName("head")[0].childNodes[1];

    if (window.ZOOMED == false) {
        var newPaddingBottom = "0px";
        var newPaddingRight = "0px";
        var overflowBehavior = "visible";
    } else {
        var newPaddingBottom = "calc(10vh + 15px)";
        var newPaddingRight = "17px";
        var overflowBehavior = "scroll !important";
    }

    pageStyle.innerHTML = "#bookWrapper { padding-bottom: " + newPaddingBottom + "; padding-right: " + newPaddingRight + "; overflow: " + overflowBehavior + ";}";

    var bookBoundingClientRect = book.getBoundingClientRect();

    if (window.ZOOMED == false) {
        var newBookWidth = "100%";

        if (bookBoundingClientRect.width * 0.9 > window.innerHeight) {
            var newHeight = bookBoundingClientRect.height;
            var newWidth = newHeight * aspectRatio;
            var newTop = 0;
        } else {
            var newWidth = bookBoundingClientRect.width / 2;
            var newHeight = newWidth / aspectRatio;
            var newTop = (bookBoundingClientRect.height - newHeight) / 2;
        }
    } else {
        var canvasWidth = document.getElementById("book").children[1].width;
        var newWidth = canvasWidth;
        var newHeight = canvasWidth / aspectRatio;

        if (canvasWidth * 2 > window.innerWidth) {
            var newBookWidth = canvasWidth * 2 + "px";
        } else {
            var newBookWidth = "100%";
        }
    }

    pageStyle.innerHTML += " #book {width: " + newBookWidth + " !important; }.page { width: " + newWidth + "px; height: " + newHeight + "px !important; top: " + newTop + "px !important;}";
}

// increases the size of the book when the user clicks the zoom button
function zoomIn() {
    if (window.ZOOMED == false) {
        window.ZOOMED = true;
        fixAspectRatio();
    } else {
        window.ZOOMED = false;
        fixAspectRatio();
    }
}

// adds navigation icons to the navigation bar at the bottom
function addNavigationIcon(currentPage) {
    var navIcon = document.createElement("div");
    var navBar = document.getElementById("navigationShown");

    navIcon.id = "navigationIcon";
    navIcon.setAttribute('onclick', 'loadPage(' + currentPage + ')');

    if (currentPage == 1) {
        navIcon.innerHTML = "<p>COVER</p>";
    } else if (currentPage == 3) {
        navIcon.style.lineHeight = "2.2vh";
        navIcon.innerHTML = "<p>INDEX<br>& 1</p>";
        navIcon.childNodes[0].style.paddingTop = "1.5vh";
    } else {
        navIcon.innerHTML = "<p>" + (currentPage - 3) + " & " + (currentPage - 2) + "</p>";
    }

    navBar.style.width = (Math.floor(currentPage / 2) + 1) * 10 + "vh";
    navBar.appendChild(navIcon);
}

// staggers the loading of the next page of the PDF
// NECESSARY, will load 0 pages without it
function delayedLoad(pdf, currentPage) {
    setTimeout(function() {
        pdf.getPage(currentPage).then(function(page) {
            // you can now use *page* here
            var scale = window.PDF_SCALE;
            var viewport = page.getViewport(scale);
            var canvas = document.createElement("canvas");
            var context = canvas.getContext('2d');

            // sharpens displayed PDF
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);

            canvas.className = "page";
            window.PAGES.push(canvas);

            console.log("page " + currentPage + " rendered");

            // set initial aspect ratio, add buttons to navigation bar
            if (currentPage == 1) {
                book.appendChild(window.PAGES[0]);
                book.lastChild.className = "page left";
                book.appendChild(window.PAGES[currentPage]);
                fixAspectRatio(1);
                addNavigationIcon(currentPage);
            } else if (currentPage % 2 == 1) {
                addNavigationIcon(currentPage);
            }

            currentPage++;

            if (currentPage < window.MAX_PAGES) {
                delayedLoad(pdf, currentPage);
            }
        });
    }, 50);
}

// essentially indexOf for NodeList type objects
function findFirstMatchingNode(nodeList, searchString) {
    var node;
    var found = false;

    for (var i = 0; i < nodeList.length && found == false; i++) {
        if (nodeList[i].className == searchString) {
            node = nodeList[i];
            found = true;
        }
    }
    return node;
}

// displays a specific two pages when the user selects
function loadPage(desiredPage) {
    var book = document.getElementById('book');
    var pages = book.childNodes;
    var currentPage = window.CURRENT_PAGE;
    var navBar = document.getElementById("navigationHidden");

    if (desiredPage > currentPage) {
        var currentRightPage = findFirstMatchingNode(pages, "page");
        var disabledArrow = document.getElementById("left");

        currentRightPage.addEventListener("animationend", hidePage);
        currentRightPage.className = "page animated animatedRightPage";

        book.appendChild(window.PAGES[desiredPage]);
        book.lastChild.className = "page";

        window.CURRENT_PAGE = desiredPage;
        window.DESIRED_PAGE = desiredPage - 1;
        window.FLIPPING_DIRECTION = "right";
    } else if (desiredPage < currentPage) {
        var currentLeftPage = findFirstMatchingNode(pages, "page left");
        var disabledArrow = document.getElementById("right");

        currentLeftPage.addEventListener("animationend", hidePage);
        currentLeftPage.className = "page left animated animatedLeftPage";

        book.appendChild(window.PAGES[desiredPage - 1]);
        book.lastChild.className = "page left";

        window.CURRENT_PAGE = desiredPage;
        window.DESIRED_PAGE = desiredPage;
        window.FLIPPING_DIRECTION = "left";
    } else {
        return;
    }

    // Disable any other user navigation
    navBar.style = "pointer-events: none;";
    disabledArrow.setAttribute("onclick", "");

    window.FLIPPING_PAGES += 1;
}

// function to display previous 2 pages
function previousPage() {
    var currentPage = window.CURRENT_PAGE;

    if (currentPage > 2) {
        var book = document.getElementById('book');
        var pages = book.childNodes;
        var currentLeftPage = findFirstMatchingNode(pages, "page left");
        var disabledArrow = document.getElementById("right");
        var navBar = document.getElementById("navigationHidden");

        // Disable opposite direction navigation
        disabledArrow.setAttribute("onclick", "");
        navBar.style = "pointer-events: none;";

        // begin animations
        currentLeftPage.addEventListener("animationend", hidePage);
        currentLeftPage.className = "page left animated animatedLeftPage";
        book.appendChild(window.PAGES[currentPage - 3]);
        book.lastChild.className = "page left";

        window.CURRENT_PAGE -= 2;
        window.FLIPPING_PAGES += 1;
        window.FLIPPING_DIRECTION = "left";
    }
}

// function to display next two pages
function nextPage() {
    var currentPage = window.CURRENT_PAGE;

    if (currentPage < window.PAGES.length - 2) {
        var book = document.getElementById('book');
        var pages = book.childNodes;
        var currentRightPage = findFirstMatchingNode(pages, "page");
        var disabledArrow = document.getElementById("left");
        var navBar = document.getElementById("navigationHidden");

        // Disable opposite direction navigation
        disabledArrow.setAttribute("onclick", "");
        navBar.style = "pointer-events: none;";

        // begin animations
        currentRightPage.addEventListener("animationend", hidePage);
        currentRightPage.className = "page animated animatedRightPage";

        book.appendChild(window.PAGES[currentPage + 2]);
        book.lastChild.className = "page";

        window.CURRENT_PAGE += 2;
        window.FLIPPING_PAGES += 1;
        window.FLIPPING_DIRECTION = "right";
    }
}

// used to hide pages after their animation is complete
function hidePage(e) {
    var book = document.getElementById("book");
    var pages = book.childNodes;
    var finishedAnimation = e.animationName;

    if (finishedAnimation == "flipLeft") {
        var flippedPageClassName = "page animated animatedRightPage";
        var nextPageClassName = "page left animated animatedBackwardsRightPage";
        var appendedPageClassName = "page";
        var indexModifier = 1;
    } else {
        var flippedPageClassName = "page left animated animatedLeftPage";
        var nextPageClassName = "page animated animatedBackwardsLeftPage";
        var appendedPageClassName = "page left";
        var indexModifier = -1;
    }

    var flippedPage = findFirstMatchingNode(pages, flippedPageClassName);
    var flippedPageIndex = window.PAGES.indexOf(flippedPage);
    flippedPage.removeEventListener("animationend", hidePage);
    book.removeChild(flippedPage);

    if (window.DESIRED_PAGE == 0) {
        var nextPageIndex = flippedPageIndex + indexModifier;
    } else {
        var nextPageIndex = window.DESIRED_PAGE;
        window.DESIRED_PAGE = 0;
    }

    book.appendChild(window.PAGES[nextPageIndex]);
    book.lastChild.addEventListener("animationend", showPage);
    book.lastChild.className = nextPageClassName;
}

// used to show the next page after a page's animation is complete
function showPage(e) {
    var book = document.getElementById("book");
    var pages = book.childNodes;
    var finishedAnimation = e.animationName;
    var navBar = document.getElementById("navigationHidden");

    if (finishedAnimation == "backwardsFlipLeft") {
        var flippedPageClassName = "page left animated animatedBackwardsRightPage";
        var newClassName = "page left";
        var disabledArrow = document.getElementById("left");
        var disabledArrowOnClick = "previousPage()";
    } else {
        var flippedPageClassName = "page animated animatedBackwardsLeftPage";
        var newClassName = "page";
        var disabledArrow = document.getElementById("right");
        var disabledArrowOnClick = "nextPage()";
    }

    var flippedBackwardsPage = findFirstMatchingNode(pages, flippedPageClassName);
    flippedBackwardsPage.className = newClassName;
    flippedBackwardsPage.removeEventListener("animationend", showPage);


    var previousPage = findFirstMatchingNode(pages, newClassName);
    book.removeChild(previousPage);

    window.FLIPPING_PAGES -= 1;

    if (window.FLIPPING_PAGES == 0) {
        disabledArrow.setAttribute("onclick", disabledArrowOnClick);
        navBar.style = "";
        window.FLIPPING_DIRECTION = "";
    }
}
