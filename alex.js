var PAGE;

window.onload = function() {
    PAGE = 0;
    loadPage(PAGE);

    var left = document.getElementById('left');
    var right = document.getElementById('right');
    left.onclick = function() {
        prevPage();
    };
    right.onclick = function() {
        nextPage();
    };
}



//Helper Functions//

//function to render the Iframe
//with the desired catalog page
//num is an int
function loadPage(num) {
    var book = document.getElementById('book');
    book.innerHTML += `<img class="page" src="pdf\\book-` + num + `.png"/>`;
}

function open() {
    var book = document.getElementById('book');
    book.className = "openBook";
    book.innerHTML = "";
    PAGE = 2;
    loadPage(PAGE - 1);
    loadPage(PAGE);

}

//function to get next page
function nextPage() {
    document.getElementById('book');
    if (book.className != "openBook") {
        open();
    } else {
        book.innerHTML = "";
        PAGE += 2;
        loadPage(PAGE - 1);
        loadPage(PAGE);
    }
}

function prevPage() {
    document.getElementById('book');
    if (book.className == "openBook") {
        book.innerHTML = "";
        PAGE -= 2;
        if (PAGE <= 0) {
          PAGE = 0;
          loadPage(0);
          book.className = "";
        } else {
            loadPage(PAGE - 1);
            loadPage(PAGE);
        }
    }
}

//function to release the frame from memory
//num is an int
function clearPage(num) {

}
