var PAGE;
var PREVIOUS_DIRECTION;
var PAGE_ASPECT_RATIO = 0.7;
var ZOOMED = false;

window.onload = function() {
    PAGE = 1;

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, 1)
    });
}

window.onresize = function() {
    fixAspectRatio(window.PAGE);
}

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

function loadPage(desiredPage) {
  var pages = document.getElementById('book').childNodes;
  var currentPage = window.PAGE;

  if (desiredPage > currentPage) {

    pages[currentPage].className = "page animated animatedRightPage";
    pages[desiredPage - 1].className = "page animated animatedBackwardsRightPage";

    pages[desiredPage].className = "page zIndex1";

    window.setTimeout(function() {
      pages[currentPage - 1].className = "page hidden";
    }, 450);

    window.PREVIOUS_DIRECTION = "next";
    window.PAGE = desiredPage;

  } else if (desiredPage < currentPage) {

    pages[currentPage - 1].className = "page animated animatedLeftPage";
    pages[desiredPage].className = "page animated animatedBackwardsLeftPage";

    pages[desiredPage - 1].className = "page left zIndex1";

    window.setTimeout(function() {
      pages[currentPage - 1].className = "page hidden";
    }, 250);

    window.setTimeout(function() {
      pages[currentPage].className = "page hidden";
    }, 450)

    window.PREVIOUS_DIRECTION = "back"
    window.PAGE = desiredPage;
  }
}

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
                canvas.className = "page hidden";
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

//////////////////////////////////////////////////////
//Helper Functions//

//function to get next page
function prevPage() {
    var pages = document.getElementById('book').childNodes;
    var currentPage = window.PAGE;
    var previousDirection = window.PREVIOUS_DIRECTION;

    if (currentPage > 2) {
        if (currentPage < pages.length) {
            if (previousDirection == "back") {
                window.setTimeout(function() {
                    pages[currentPage].className = "page hidden";
                }, 450);
            } else {
                pages[currentPage].className = "page zIndex1";

                window.setTimeout(function() {
                    pages[currentPage].className = "page hidden";
                }, 450);
            }
        }

        // begin animations
        pages[currentPage - 1].className = "page animated animatedLeftPage";
        pages[currentPage - 2].className = "page animated animatedBackwardsLeftPage";

        if (currentPage > 3) {
            pages[currentPage - 3].className = "page left zIndex1";
        }

        window.setTimeout(function() {
            pages[currentPage - 1].className = "page hidden";
        }, 250)

        PREVIOUS_DIRECTION = "back";
        PAGE -= 2;
    }
}

function nextPage() {
    var pages = document.getElementById('book').childNodes;
    var currentPage = window.PAGE;
    var previousDirection = window.PREVIOUS_DIRECTION;

    if (currentPage < pages.length - 2) {
        if (currentPage > 2) {
            if (previousDirection == "next") {
                window.setTimeout(function() {
                    pages[currentPage - 1].className = "page hidden";
                }, 500);
            } else {
                pages[currentPage - 1].className = "page left zIndex1";

                window.setTimeout(function() {
                    pages[currentPage - 1].className = "page hidden";
                }, 500);
            }
        }

        // begin animations
        pages[currentPage].className = "page animated animatedRightPage";
        pages[currentPage + 1].className = "page animated animatedBackwardsRightPage";

        pages[currentPage + 2].className = "page zIndex1";

        window.setTimeout(function() {
            pages[currentPage].className = "page hidden";
        }, 250)

        PREVIOUS_DIRECTION = "next";
        PAGE += 2;
    }
}
