$(document).ready(function () {
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: "/word",
            type: "POST",
            data: $(this).serialize(),
            success: function (data) {
                var table_string_start = "<tr><td>";
                var table_string_end = "</td></tr>";
                var table_string = "";
                data_ = JSON.parse(data)
                var res=[]
                for(var i in data_)
                    res.push(data_[i]);
                for (var count = 1; count < res.length; count++) {
                    table_string += table_string_start + count + "</td><td>" + res[count-1][1] + "</td><td>" + res[count-1][0] + table_string_end;
                }
                $("#table-body").html(table_string);
                document.getElementById('table').style.visibility = "visible";
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});
