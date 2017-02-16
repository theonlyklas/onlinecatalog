var PAGE;
var PREVIOUS_DIRECTION;
var PAGE_ASPECT_RATIO = 0.7;
var ZOOMED = false;
var PAGES_TO_HIDE = [];
var PAGES_TO_MAKE_LEFT = [];

window.onload = function() {
    PAGE = 1;

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, 1)
    });
}

window.onresize = function() {
    fixAspectRatio(window.PAGE);
}

window.addEventListener("keydown", function(e) {
    // space, page up, page down and arrow keys:
    if ([32, 33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    if (e.keyCode == 37) {
        previousPage();
    } else if (e.keyCode == 39) {
        nextPage();
    }


}, false);

// fixes aspect ratio of displayed pages
function fixAspectRatio(currentPage) {
    var aspectRatio = window.PAGE_ASPECT_RATIO;
    var book = document.getElementById("book");
    var bookBoundingClientRect = book.getBoundingClientRect();
    var pageStyle = document.getElementsByTagName("head")[0].childNodes[1];

    if (bookBoundingClientRect.width > window.innerHeight) {
        newHeight = bookBoundingClientRect.height;
        newWidth = newHeight * aspectRatio;
        newTop = 0;
    } else {
        newWidth = bookBoundingClientRect.width / 2;
        newHeight = newWidth / aspectRatio;
        newTop = (bookBoundingClientRect.height - newHeight) / 2;
    }

    pageStyle.innerHTML = ".page { width: " + newWidth + "px !important; height: " + newHeight + "px !important; top: " + newTop + "px !important;}";
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
            var scale = 2.5;
            var viewport = page.getViewport(scale);
            var canvas = document.createElement("canvas");

            if (currentPage == 1) {
                canvas.className = "page"
            } else {
                canvas.className = "hidden";
            }

            var context = canvas.getContext('2d');

            // sharpens displayed PDF
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
            document.getElementById("book").appendChild(canvas);
            console.log("page " + currentPage + " rendered");

            // set initial aspect ratio, add buttons to navigation bar
            if (currentPage == 1) {
                fixAspectRatio(currentPage);
                addNavigationIcon(currentPage);
            } else if (currentPage % 2 == 1) {
                addNavigationIcon(currentPage);
            }

            currentPage++;

            if (currentPage < pdf.numPages) {
                delayedLoad(pdf, currentPage);
            }
        });
    }, 50);
}

// displays a specific two pages when the user selects
function loadPage(desiredPage) {
    var pages = document.getElementById('book').childNodes;
    var currentPage = window.PAGE;

    if (desiredPage > currentPage) {

        pages[currentPage].className = "page animated animatedRightPage";
        pages[desiredPage - 1].className = "page animated animatedBackwardsRightPage";

        pages[desiredPage].className = "page zIndex1";

        window.setTimeout(function() {
            pages[currentPage - 1].className = "hidden";
        }, 450);

        window.PREVIOUS_DIRECTION = "next";
        window.PAGE = desiredPage;

    } else if (desiredPage < currentPage) {

        pages[currentPage - 1].className = "page animated animatedLeftPage";
        pages[desiredPage].className = "page animated animatedBackwardsLeftPage";

        pages[desiredPage - 1].className = "page left zIndex1";

        window.setTimeout(function() {
            pages[currentPage - 1].className = "hidden";
        }, 250);

        window.setTimeout(function() {
            pages[currentPage].className = "hidden";
        }, 450)

        window.PREVIOUS_DIRECTION = "back"
        window.PAGE = desiredPage;
    }
}


// function to display previous 2 pages
function previousPage() {
    var pages = document.getElementById('book').childNodes;
    var currentPage = window.PAGE;
    var previousDirection = window.PREVIOUS_DIRECTION;

    if (currentPage > 2) {
      /*
        if (currentPage < pages.length) {
            if (previousDirection == "back") {
                pages[currentPage].addEventListener("animationend", function() {
                    pages[currentPage].className = "hidden";
                });
            } else {
                pages[currentPage].className = "page zIndex1";

                pages[currentPage].addEventListener("animationend", function() {
                    pages[currentPage].className = "hidden";
                });
            }
        } */

        // begin animations
        window.PAGES_TO_HIDE.push(currentPage - 2);
        pages[currentPage - 2].addEventListener("animationend", hidePage);
        pages[currentPage - 1].className = "page animated animatedLeftPage";
        pages[currentPage - 2].className = "page animated animatedBackwardsLeftPage";

        if (currentPage > 3) {
            pages[currentPage - 3].className = "page left zIndex1";
        }
        PREVIOUS_DIRECTION = "back";
        PAGE -= 2;
    }
}

// function to display next two pages
function nextPage() {
    var pages = document.getElementById('book').childNodes;
    var currentPage = window.PAGE;
    var previousDirection = window.PREVIOUS_DIRECTION;
    if (currentPage < pages.length - 2) {
        // begin animations
        window.PAGES_TO_HIDE.push(currentPage + 1);
        pages[currentPage + 1].addEventListener("animationend", hidePage);
        pages[currentPage].className = "page animated animatedRightPage";
        pages[currentPage + 1].className = "page animated animatedBackwardsRightPage";

        pages[currentPage + 2].className = "page";

        PREVIOUS_DIRECTION = "next";
        PAGE += 2;
    }
}

// used to hide pages after their animation is complete
function hidePage() {
    var pages = document.getElementById("book").childNodes;
    var page = window.PAGES_TO_HIDE.shift();

    if (pages[page].className == "page animated animatedBackwardsRightPage") {
        pages[page].className = "page left";

        if (page > 2) {
            pages[page - 2].className = "hidden";
        }

        pages[page - 1].className = "hidden";
    } else {
        pages[page].className = "page";

        pages[page + 2].className = "hidden"
    }

    pages[page].removeEventListener("animationend", hidePage);
}
