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

    for (var i = 1; i < pages.length; i++) {
        pages[i].style.zIndex = 0 - i;
    }

    pages[window.PAGE - 1].style.zIndex = "";
    pages[window.PAGE - 2].style.zIndex = "";
    pages[window.PAGE - 1].className = "page animatedLeftPage";
    pages[window.PAGE - 2].className = "page animatedBackwardsLeftPage";
    pages[window.PAGE - 3].style.zIndex = 2;
    pages[window.PAGE - 4].style.zIndex = 1;

    PAGE -= 2;
}

function flipLeft() {
    var pages = document.getElementById('book').childNodes;

    if (window.PAGE < pages.length) {
        for (var i = 1; i < pages.length; i++) {
            pages[i].style.zIndex = 0 - i;
        }

        pages[window.PAGE].style.zIndex = "";
        pages[window.PAGE + 1].style.zIndex = "";
        pages[window.PAGE].className = "page animatedRightPage";
        pages[window.PAGE + 1].className = "page animatedBackwardsRightPage";
        pages[window.PAGE + 2].style.zIndex = 2;
        pages[window.PAGE + 3].style.zIndex = 1;

        PAGE += 2;
    }
}
