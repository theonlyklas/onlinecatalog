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

            if (currentPage == 1) {
                canvas.className = "page leftBackwardsPageFinal"
            } else if (currentPage == 2) {
                canvas.className = "page leftPageFinal"
            } else {
                canvas.className = "page";
                canvas.style.zIndex = 0 - currentPage;
            }



            // console.log(canvas);
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

    if (window.PAGE > 2) {
        if (window.PAGE < pages.length - 2) {
          pages[window.PAGE + 1].style.setProperty("z-index", 0 - window.PAGE, "important");
          pages[window.PAGE + 2].style.setProperty("z-index", 0 - window.PAGE, "important");
        }
        if (window.PAGE > 4) {
          pages[window.PAGE - 3].style.setProperty("z-index", 2, "important");
          pages[window.PAGE - 4].style.setProperty("z-index", 1, "important");
        }

        pages[window.PAGE].style.setProperty("z-index", 2, "important");

        // begin animations
        pages[window.PAGE - 1].style.setProperty("z-index", "");
        pages[window.PAGE - 2].style.setProperty("z-index", "");
        pages[window.PAGE - 1].className = "page animated animatedLeftPage";
        pages[window.PAGE - 2].className = "page animated animatedBackwardsLeftPage";

        PAGE -= 2;
    }
}

function nextPage() {
    var pages = document.getElementById('book').childNodes;

    if (window.PAGE < pages.length) {
        if (window.PAGE > 4) {
          pages[window.PAGE - 3].style.setProperty("z-index", -100 + window.PAGE, "important");
          pages[window.PAGE - 4].style.setProperty("z-index", -100 + window.PAGE, "important");
        }
        if (window.page > 2) {
          pages[window.PAGE - 1].style.setProperty("z-index", 2, "important");
          pages[window.PAGE - 2].style.setProperty("z-index", 1, "important");
        }

        //
        pages[window.PAGE + 2].style.setProperty("z-index", 2, "important");

        // begin animations
        pages[window.PAGE].style.setProperty("z-index", "");
        pages[window.PAGE + 1].style.setProperty("z-index", "");
        pages[window.PAGE].className = "page animated animatedRightPage";
        pages[window.PAGE + 1].className = "page animated animatedBackwardsRightPage";

        PAGE += 2;
    }
}
