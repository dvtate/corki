
function table(headers, body, caption) {
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

function redirect(dest) {
    window.location = dest;
}
