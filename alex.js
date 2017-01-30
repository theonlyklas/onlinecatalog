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

function delayedLoad(pdf) {
  setTimeout(function () {
    var pageID = 'page-' + PAGE;
    //book.innerHTML += '<div id="test" style="z-index:-' + PAGE + '"><canvas class="rightBehind" id="' + pageID + '"></canvas></div>';

    pdf.getPage(PAGE).then(function(page) {
        // you can now use *page* here
        var scale = 2;
        var viewport = page.getViewport(scale);
        var canvas = document.createElement("canvas");
        canvas.id = pageID;
        canvas.className = "rightBehind";
        canvas.style.zIndex = 0 - PAGE;
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

        document.getElementById("rightBook").appendChild(canvas);
        console.log("page " + PAGE + " rendered");
        console.log(pdf.numPages);
        PAGE++;

        if (PAGE < 9) {
          delayedLoad(pdf, PAGE);
        }
    });
  }, 1000);
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

    window.setTimeout(function() {
        if (!(book.className.includes("openBook"))) {
            open();
        } else {
            PAGE += 2;
            loadPage(PAGE - 1);
            loadPage(PAGE);
        }
    }, 1000);
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
    document.getElementById('book').childNodes[0].className += " leftPage";

    window.setTimeout(function() {
        document.getElementById('book').childNodes[0].className += " leftFinal";
    }, 1000);
}

function flipLeft() {
    document.getElementById('rightBook').childNodes[1].className += " rightPage";
    document.getElementById('rightBook').childNodes[2].className += " rightPage";

    window.setTimeout(function() {
        document.getElementById('rightBook').childNodes[1].className += " rightFinal";
        document.getElementById('rightBook').childNodes[2].className += " rightPage";
    }, 1000);
}
