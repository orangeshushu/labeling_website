$(function () {
    window.searchFilter = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    }).search_model;
    newRequest(1);
});

function newRequest(page) {
    $.get("/tweets?page=" + page + "&search_model=" + window.searchFilter + "&page_model=history", function (data) {
        var list = JSON.parse(data)
        list_size = list.length;
        var inputId = document.getElementById("input-id");
        var table = document.getElementById("table-body");
        var stringinputId = '';
        var stringTable = '';
        for (var count = 1; count <= list.length; count++) {
            stringinputId += "<input type=\"hidden\" id=\"_id" + count + "\" value=\"" + list[count - 1]['_id'] + "\">";

            var text = list[count - 1]['text'];
            text = text.replace(/covid/ig, "<div class=\"yellow\">covid</div>");
            text = text.replace(/positive/ig, "<div class=\"red\">positive</div>");
            text = text.replace("I ", "<div class=\"deepskyblue\">I </div>");
            text = text.replace(/test/ig, "<div class=\"green\">test</div>");

            let model_label_result = list[count - 1]['model_label_result'];
            let model_confidence = list[count - 1]['model_confidence'];
            let remark = list[count - 1]['remark'];

            if (list[count - 1]['result'])
                stringTable += "<tr>" +
                    "<td>" + text + "</td>" +
                    "<td>" + model_label_result + "</td>" +
                    "<td>" + model_confidence + "</td>" +
                    "<td><input type=\"checkbox\" id=\"checkbox" + count + "\" checked></td>" +
                    "<td><input type=\"text\" id=\"remark" + count + "\" value=\"" + remark + "\"></td>" +
                    "</tr>";
            else
                stringTable += "<tr>" +
                    "<td>" + text + "</td>" +
                    "<td>" + model_label_result + "</td>" +
                    "<td>" + model_confidence + "</td>" +
                    "<td><input type=\"checkbox\" id=\"checkbox" + count + "\"></td>" +
                    "<td><input type=\"text\" id=\"remark" + count + "\" value=\"\"></td>" +
                    "</tr>";
        }
        inputId.innerHTML = stringinputId;
        table.innerHTML = stringTable;
    });
}

function submitForm() {
    event.preventDefault();
    let list = [];
    for (var count = 1; count <= list_size; count++) {
        list.push({
            "_id": document.getElementById("_id" + count).value,
            "result": document.getElementById("checkbox" + count).checked,
            "remark": document.getElementById("remark" + count).value
        })
    }
    $.post("/",
        {
            list: JSON.stringify(list),
            username: currentUser
        },
        function (data, status) {
            location.reload();
        });
}

function bar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function filterChange() {
    window.searchFilter = $('#filter option:selected')[0].value;
    window.location = "/history?search_model=" + window.searchFilter
}