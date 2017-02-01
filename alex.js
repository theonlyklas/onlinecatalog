var PAGE;
var CATALOG = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf');

window.onload = function() {
    PAGE = 1;

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, 1)
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

            // canvas.style.zIndex = 0 - currentPage;
            /*
            if (currentPage % 2 == 0) {
                canvas.className += " backwardsPage";
            }*/

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
            console.log(pdf.numPages);
            currentPage++;

            if (currentPage < pdf.numPages) {
                delayedLoad(pdf, currentPage);
            } else {
                PAGE = 1;
            }
        });
    }, 500);
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
    pages[PAGE - 1].className = "page animatedLeftPage";
    pages[PAGE - 2].className = "page animatedBackwardsLeftPage";

    PAGE -= 2;
}

function flipLeft() {
    var pages = document.getElementById('book').childNodes;
    pages[PAGE].className = "page animatedRightPage";
    pages[PAGE + 1].className = "page animatedBackwardsRightPage";

    PAGE += 2;
}
