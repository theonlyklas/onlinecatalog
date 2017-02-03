var PAGE;
var PAGES;
var CATALOG = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf');

window.onload = function() {
    PAGE = 1;

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, 1)
        PAGES = pdf.numPages;
    });
}

function delayedLoad(pdf, currentPage) {
    setTimeout(function() {
        var pageID = 'page-' + currentPage;

        pdf.getPage(currentPage).then(function(page) {
            // you can now use *page* here
            var scale = 2;
            var viewport = page.getViewport(scale);
            var canvas = document.createElement("canvas");
            canvas.id = pageID;
            canvas.className = "page";

            canvas.style.zIndex = 0 - currentPage;

            console.log(canvas);
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
            //console.log(pdf.numPages);
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
function nextPage() {
    flipLeft();
}

function prevPage() {
    flipRight();
}

function flipRight() {
    var pages = document.getElementById('book').childNodes;

    if (window.PAGE < pages.length) {
        for (var i = 1; i < pages.length; i++) {
            if (i == window.PAGE - 3) {
                pages[i].className = "page rightBackwardsPageFinal";
            } else if (i == window.PAGE - 4) {
                pages[i].className = "page rightPageFinal";
            } else if (i == window.PAGE) {
                pages[i].className = "page leftBackwardsPageFinal";
            } else if (i == window.PAGE + 2) {
                pages[i].className = "page leftPageFinal";
            } else {
                pages[i].className = "page";
            }
            pages[i].style.zIndex = "";
        }

        pages[window.PAGE - 1].className = "page animatedLeftPage";
        pages[window.PAGE - 2].className = "page animatedBackwardsLeftPage";

        PAGE -= 2;
    }
}

function flipLeft() {
    var pages = document.getElementById('book').childNodes;

    if (window.PAGE < pages.length) {
        for (var i = 1; i < pages.length; i++) {
            if (i == window.PAGE - 1) {
                pages[i].className = "page rightBackwardsPageFinal";
            } else if (i == window.PAGE - 2) {
                pages[i].className = "page rightPageFinal";
            } else if (i == window.PAGE + 2) {
                pages[i].className = "page leftBackwardsPageFinal";
            } else if (i == window.PAGE + 3) {
                pages[i].clasName = "page leftPageFinal";
            } else {
                pages[i].className = "page";
            }
            pages[i].style.zIndex = "";
        }

        pages[window.PAGE].className = "page animatedRightPage";
        pages[window.PAGE + 1].className = "page animatedBackwardsRightPage";

        PAGE += 2;
    }
}
