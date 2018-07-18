

module.exports = class {

    constructor(title, userid, action) {
        this.title = title;
        this.userid = userid;
        this.action = action;

        this.html = `
        <!doctype html>
        <html>
            <head>
                <link rel="icon" type="image/png" href="https://corki.js.org/Corkiporo.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>Corki Portal ${this.title ? " - " + this.title : ""}</title>

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans" />
                <link rel="stylesheet" href="https://cdn.rawgit.com/Chalarangelo/mini.css/v2.3.7/dist/mini-default.min.css" />

                <style>

                    body {
                        padding: 0; margin: 0;
                        font-family: 'Open Sans', Helvetica, sans-serif;
                        background-color: #2b2b30; color: white;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Open Sans Light', 'Open Sans', sans-serif;
                        font-weight: 100;
                    }

                    div#topbar { background-color: #000;
                        padding: 5px; padding-right: 0; height: 60px;
                    }
                    div#topbar * { height: 100%; }
                    div#topbar > div > div { text-align: right; width: 100%; }
                    div#topbar img.profilepic { border-radius: 100%; }


                    div#user-dropdown { padding-left: 20px;
                        background-color: #e0e0e0; color: black; display: none;
                    }
                    div#user-dropdown button { background-color: #433233; color: white; }
                    div#user-dropdown button:hover { background-color: #a01212; }


                    form { background-color: #2b2b30; border: 0; }

                    #submit-box {
                        float: right; margin: 15px;
                        border-radius: 2px;
                        background-color: #476a8e;
                        box-shadow: 5px 10px #000;
                    }
                </style>

                <script>
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
                </script>

            </head>
            <body>
                <div class="row" id="topbar">
                    <div class="col-md-3">
                        <a href="/">
                            <img src="https://b.thumbs.redditmedia.com/V8fcjDBXCWzITicr1z71uNHIkvhTR8aL7u233v8mANA.png" />
                        </a>
                    </div>
                    <div class="col-md-6">
                        <h2>${ this.title || "Web Portal" }</h2>
                    </div>
                    <div class="col-md-3">
                        <div onclick="toggleUserDropdown()">
                            <img src="${
                                global.client.users.get(this.userid).avatar ?
                                    `https://cdn.discordapp.com/avatars/${this.userid}/${global.client.users.get(this.userid).avatar}`
                                    : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
                        }" class="profilepic" />
                        </div>
                    </div>
                </div>
                <div class="row" >
                    <div class="col-md-6 col-md-offset-6" id="user-dropdown">
                        Logged in as ${ global.client.users.get(this.userid).username }.
                        <button onclick="deleteAllCookies()" >Logout</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <form action="${ this.action }">

        `;

        this.end = `
                        </form>
                    </div>
                </div>
            </body>
        </html>
        `;
    }

    addScript(code, src) {
        if (!src)
            this.html += `<script>${code}</script>`;
        else
            this.html += `<script src=${src}>${code}</script>`;

        return this;
    }
    addStyle(code) {
        this.html += `<style>${code}</style>`;
        return this;
    }
    addRaw(code) {
        this.html += code;
        return this;
    }

    startFieldset(legend) {
        this.html += "<fieldset>\n";
        if (!!legend)
            this.html += `<legend>${legend}</legend>\n`;

        return this;
    }
    endFieldset() {
        this.html += "</fieldset>";
        return this;
    }

    addDataSelector(label, options) {

    }







    addSubmitBox() {
        this.html +=
            `<span id="submit-box" class="row">
                <div class="col-md-6">
                    <button type="reset">Reset</button>
                </div><div class="col-md-6">
                    <button type="submit">Apply</button>
                </div>
            </span>`;
            return this;
    }


    export() {
        return this.html + this.end;
    }

}
