var PAGE;
var CATALOG = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf');

window.onload = function() {
    PAGE = 1;

    var pdf = PDFJS.getDocument('http://files.ramcomputers.uri.edu/bookstore/catalog/files/a.pdf').then(function(pdf) {
        delayedLoad(pdf, PAGE)
    });

    PAGE = 1;

    //loadPage(PAGE);

    /*
    var left = document.getElementById('left');
    var right = document.getElementById('right');
    left.onclick = function() {
      prevPage();
    };
    right.onclick = function() {
        nextPage();
    }; */
}

function delayedLoad(pdf, currentPage) {
  setTimeout(function () {
    var pageID = 'page-' + currentPage;

    pdf.getPage(currentPage).then(function(page) {
        // you can now use *page* here
        var scale = 2;
        var viewport = page.getViewport(scale);
        var canvas = document.createElement("canvas");
        canvas.id = pageID;
        canvas.className = "page";
        canvas.style.zIndex = 0 - currentPage;

        if (currentPage % 2 == 0) {
          canvas.className += " backwardsPage";
        }

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
        }
        else {
          PAGE = 1;
        }
    });
  }, 500);
}

//////////////////////////////////////////////////////
//Helper Functions//

//function to render the Iframe
//with the desired catalog page
//num is an int
function loadPage(num) {
    // Initialize necessary variables
    /*
    var leftBehindCanvas = document.getElementById("leftBehind");
    var leftBehindContext = leftBehindCanvas.getContext('2d');
    var leftFrontCanvas = document.getElementById("leftFront");
    var leftFrontContext = leftFrontCanvas.getContext('2d');
    var rightBehindCanvas = document.getElementById("rightBehind");
    var rightBehindContext = rightBehindCanvas.getContext('2d');
    var rightFrontCanvas = document.getElementById("rightFront");
    var rightFrontContext = rightFrontCanvas.getContext('2d');

    var scale = 1.5;

    if (num == 0) {
        CATALOG.getPage(1).then(function(page) {
            // you can now use *page* here

            var viewport = page.getViewport(scale);

            var renderContext = {
              rightFrontContext: context,
              viewport: viewport
            };
        });
    }


    var odd = false;
    var book = document.getElementById('book');
    //clear inner html if odd number
    if (num % 2 != 0) {
        odd = true;
    }
    if (odd) {
        book.innerHTML = "";
        var pageSide = "leftPage";
    }
    else {
      var pageSide = "rightPage";
    }
    var imgReady = false;
    var img = new Image();
    img.onload = function() {
        imgReady = true;
    }
    img.src = `pdf\\book-` + num + `.png`;
    setTimeout(function() {
        if (imgReady) {
            book.innerHTML += `<img class="page" src="pdf\\book-` + num + `.png"/>`;
        } else {
            if (odd) {
                prevPage();
            } else {
                if (!book.className.includes("last")) {
                    book.className += " last";
                }
            }
        }
    }, 1000)
    */
}

function open() {
    var book = document.getElementById('book');
    book.className = "openBook";
    PAGE = 2;
    loadPage(PAGE - 1);
    loadPage(PAGE);
    if (book.offsetWidth > window.innerWidth) {
        book.className += " scale";
    }
}

//function to get next page
function nextPage() {
    flipLeft();
}

function prevPage() {
    flipRight();
    window.setTimeout(function() {

        if (book.className.includes("openBook")) {
            book.innerHTML = "";
            PAGE -= 2;
            if (PAGE <= 0) {
                PAGE = 0;
                loadPage(0);
                book.className = "";
            } else {
                if (book.className.includes('last')) {
                    book.className = book.className.replace(/last/g, '');
                }
                loadPage(PAGE - 1);
                loadPage(PAGE);
            }
        }
    }, 1000);
}

function flipRight() {
  var pages = document.getElementById('book').childNodes;
  pages[PAGE - 1].className += " animatedLeftPage";
  pages[PAGE - 2].className += " animatedBackwardsLeftPage";

  window.setTimeout(function() {
    pages[PAGE - 1].style.zIndex = PAGE;
  }, 250);

  window.setTimeout(function() {
      document.getElementById('book').childNodes[PAGE - 1].className = "page leftPageFinal";
      document.getElementById('book').childNodes[PAGE - 2].className = "page backwardsLeftPageFinal";
      PAGE -= 2;
  }, 1000);
}

function flipLeft() {
    var pages = document.getElementById('book').childNodes;
    pages[PAGE].className += " animatedRightPage";
    pages[PAGE + 1].className += " animatedBackwardsRightPage";

    window.setTimeout(function() {
      pages[PAGE + 1].style.zIndex = PAGE;
    }, 250);

    window.setTimeout(function() {
        document.getElementById('book').childNodes[PAGE].className = "page rightPageFinal";
        document.getElementById('book').childNodes[PAGE + 1].className = "page backwardsRightPageFinal";
        PAGE += 2;
    }, 1000);
}
