var PAGE;

window.onload = function() {
    PAGE = 0;
    loadPage(PAGE);

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


//////////////////////////////////////////////////////
//Helper Functions//

//function to render the Iframe
//with the desired catalog page
//num is an int
function loadPage(num) {
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
  document.getElementById('book').childNodes[1].className += " rightPage";

  window.setTimeout(function() {
    document.getElementById('book').childNodes[1].className += " rightFinal";
  }, 1000);
}
