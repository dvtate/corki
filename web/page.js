

module.exports = class Page {

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
                <title>Corki Portal${this.title ? " - " + this.title : ""}</title>

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans" />
                <link rel="stylesheet" href="https://cdn.rawgit.com/Chalarangelo/mini.css/v2.3.7/dist/mini-default.min.css" />

                <link rel="stylesheet" href="/resources/main.css" />
                <script src="/resources/main.js"></script>

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
                        ${this.userid ? `
                            <div onclick="toggleUserDropdown()">
                                <img src="${
                                    global.client.users.get(this.userid).avatar ?
                                        `https://cdn.discordapp.com/avatars/${this.userid}/${global.client.users.get(this.userid).avatar}`
                                        : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
                            }" class="profilepic" />
                            </div>
                            ` : ""
                        }
                    </div>
                </div>
                ${ this.userid ? `
                <div class="row" >
                    <div class="col-md-6 col-md-offset-6" id="user-dropdown">
                        Logged in as ${ global.client.users.get(this.userid).username }.
                        <button onclick="deleteAllCookies()" >Logout</button>
                    </div>
                </div>` : ""
                }
                <div class="row">
                    <div class="col-sm col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        ${this.action ? `<form action="${ this.action }">` : ""}
        `;

        this.end = `
                        ${this.action ? "</form>" :""}
                    </div>
                </div>
                <script src="/resources/dl_polyfill.js"></script>
            </body>
        </html>
        `;
    }

    static script(code, src) {
        if (!src)
            this.html += `<script>${code}</script>`;
        else
            this.html += `<script src=${src}>${code}</script>`;

    }
    addScript(code, src) {
        this.html += Page.script(code, src);
        return this;
    }

    static style(code) {
        return `<style>${code}</style>`;
    }
    addStyle(code) {
        this.html += Page.style(code);
        return this;
    }
    add(code) {
        this.html += code;
        return this;
    }
    addRaw(code)
        { return this.add(code); }

    static combine(items) {
        return arguments.join(' ');
    }

    static fieldset(body, legend) {
        let ret = "<fieldset>";
        if (legend)
            ret += `<legend>${legend}</legend>`;
        if (body)
            ret += body;
        return ret + "</fieldset>"
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

    static image(src, alt, height, width) {
        return `<img src="${src}" ${alt ? `alt="${alt}"` : ''} ${height ? `height="${height}"` : ''} ${width ? `width="${width}"` : ''} />`
    }
    addImage(src, alt, height, width) {
        this.html += Page.image(src, alt, height, width);
        return this;
    }

    static table(headers, body, caption) {
        let ret = "<table class=\"data-table\">";
        if (caption)
            ret += `\n<caption>${caption}</caption>`;

        if (headers) {
            ret += "<thead><tr>\n";
            headers.forEach(h => ret += `<th>${h}</th>`);
            ret += "\n</tr></thead>";
        }

        ret += "<tbody>";
        body.forEach(row => {
            ret += "<tr>\n";
            for (let i = 0; i < row.length; i++)
                ret += `<td data-label="${headers[i] || ""}">${row[i]}</td>`;
            ret += "</tr>";
        });
        ret += "\n</tbody>\n</table>";

        return ret;
    }
    addTable(headers, body, caption) {
        this.html += Page.table(headers, body, caption);
        return this;
    }


    static searchableSelector(options, label, id, name) {


        // static counter so that datalists have unique ids
        searchableSelector.datalistid = (searchableSelector.datalistid || 0) + 1;


        return `
            <input list="corki-page-ss-id-${searchableSelector.datalistid}"
            ${id ? `id="${id}"` : ""} ${name ? `name="${name}"` : ""}
            <datalist id="corki-page-ss-id-${searchableSelector.datalistid}">
                <option value="${options.join("\">\n<option value=\"")}">
            </datalist>`;
    }

    addSearchableSelector(options, label, id, name) {
        this.html += Page.searchableSelector(options, label, id, name);
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
