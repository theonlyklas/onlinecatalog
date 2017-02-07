var PAGE;
var PREVIOUS_DIRECTION;
var PAGE_ASPECT_RATIO = 0.7;

window.onload = function() {
    PAGE = 1;

    // dynamically create CSS rules for z-index
    // was necessary when I was using 30+ z-indexes inefficiently
    /*
    var style = document.createElement('style');
    style.type = 'text/css';
    for (var i = 1; i < 3; i++) {
      style.innerHTML += '.zIndex' + i.toString() + ' { z-index: ' + i.toString() + ' !important } \n';
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    */

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, 1)
    });
}

// fixes aspect ratio of displayed pages
function fixAspectRatio(currentPage) {
    var page = document.getElementById("book").childNodes[currentPage];
    page.style.width = "50%";
    page.style.height = "90%";
    var pageBoundingClientRect = page.getBoundingClientRect();
    var aspectRatio = window.PAGE_ASPECT_RATIO;

    if (pageBoundingClientRect.width / pageBoundingClientRect.height > aspectRatio) {
        var newWidth = pageBoundingClientRect.height * aspectRatio;
        var newHeight = newWidth / aspectRatio;
        // var heightPadding = (window.innerHeight - newHeight) / 2;
        page.style.width = newWidth + "px";
        page.style.height = newHeight + "px";
    } else {
        var newHeight = pageBoundingClientRect.width / aspectRatio;
        var newWidth = newHeight * aspectRatio;
        page.style.height = newHeight + "px";
        page.style.width = newWidth + "px";
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

            // add buttons to navigation bar
            var navButton = document.createElement("div");

            if (currentPage == 1) {
                fixAspectRatio(currentPage);
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
                }, 460);
            } else {
                pages[currentPage].className = "page zIndex1";

                window.setTimeout(function() {
                    pages[currentPage].className = "page hidden";
                }, 460);
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

window.onresize = function() {
    fixAspectRatio(window.PAGE);
}
