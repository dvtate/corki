// used to log user off
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.location.reload();
}

// show/hide user dropdown menu
function toggleUserDropdown() {
    document.getElementById("user-dropdown").style.display =
        document.getElementById("user-dropdown").style.display == "block" ?
            "none" : "block";
}

function redirect(dest) {
    window.location = dest;
}
