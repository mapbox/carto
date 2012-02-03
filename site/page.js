if ("onhashchange" in window) {
    var hashHandler = function() {
        [].forEach.call(document.getElementsByClassName('hl'), function(e) {
          e.className = e.className.replace('hl', '');
        });
        var elem = document.getElementById(location.hash.substring(1));
        if (elem) {
            elem.className += ' hl';
        }
    };
    window.onhashchange = hashHandler;
    hashHandler();
}
