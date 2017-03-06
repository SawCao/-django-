    /**
 * Created by icmonkeypc on 2016/12/19.
 */
setInterval("reload_table()",5000);
 $(document).ready(
     function () {


            $("#btnAdd").click(
                    function () {
                        save_method = 'add';
                        $('#form')[0].reset(); // 重置form

                        $('#modal_form').modal('show'); // 显示modal
                        $('.modal-title').text('添加设备'); // 设置title
                    }
            ),
            $("#btnSave").click(
                    function () {
                        var url;
                        if (save_method == 'add') {
                            url = "/api/add/";
                        }
                        else {
                            url = "/api/update/";
                        }
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: $('#form').serialize(),
                            dataType: "JSON",
                            success: function (data) {
                                //如果成功，隐藏弹出框并重新加载数据
                                $('#modal_form').modal('hide');
                                reload_table();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert('编辑或添加错误！');
                            }
                        })
                    }
            ),
            $("#displayTable").on('click', ".btnEdit", function () {
                        save_method = 'update';
                        $('#form')[0].reset();
                        $('[name="id"]').val($(this).parent("td").siblings("td.hidden").text());
                        $('[name="sn"]').val($(this).parent("td").next().next().text());
                        $('[name="namee"]').val($(this).parent("td").next().next().next().text());
                        $('#modal_form').modal('show');
                        $('.modal-title').text('修改设备信息');

                    }
            ),
            $("#displayTable").on('click', ".btnDel", function () {
                        $.ajax({
                            url: "/api/del/",
                            type: "GET",
                            data: {"id": $(this).parent("td").siblings("td.hidden").text()},
                            dataType: "JSON",
                            success: function (data) {
                                //如果成功，隐藏弹出框并重新加载数据
                                $('#modal_form').modal('hide');
                                reload_table();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert('删除错误！');
                            }
                        })
                    }
            ),
            $("#displayTable").on('click', ".btnClear", function () {
                        $.ajax({
                            url: "/api/clear/",
                            type: "GET",
                            data: {"id": $(this).parent("td").siblings("td.hidden").text()},
                            dataType: "JSON",
                            success: function (data) {
                                //如果成功，隐藏弹出框并重新加载数据
                                $('#modal_form').modal('hide');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert('清理历史记录错误！');
                            }
                        })
                    }
            ),
            $("#displayTable").on('click',".btnDetail",function () {
                        $.ajax({
                            url: "/api/detail/",
                            type: "GET",
                            data: {"id": $(this).parent("td").siblings("td.hidden").text()},
                            dataType: "JSON",
                            success:function (data) {
                                len = data.details.length
                                var datas = [];
                                for (var i = 0; i < len; i++){
                                    datas[i]=[i,data.details[i]]
                                 }
                                 var options = {
                                 series: {
                                     lines: { show: true },
                                     points: { show: true },
                                     label: "温度变化曲线",
                                     labelWidth: 5
                                 },
                                 grid:{
                                     clickable: true
                                 },
                                 yaxis: {
                                     min: 0,
                                     max: 100,
                                     labelWidth: 5,
                                     position: "left"
                                 },
                                };
                                $.plot($("#flotcontainer"),
                                [
                                    datas
                                ],
                                options);
                                $('#modal_form_detail').modal('show');
                            }
                        })
            }),
            $("#displayTable").on('click','.btnOpen',function () {
                        $.ajax({
                            url: "/api/open/",
                            type: "GET",
                            data: {"id": $(this).parent("td").siblings("td.hidden").text()},
                            dataType: "JSON",
                            success: function (data) {
                                //如果成功，隐藏弹出框并重新加载数据
                                $('#modal_form').modal('hide');
                                reload_table();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert('开关错误！');
                            }
                        })

            })
            reload_table()
         }
    )



    function reload_table() {
        $.ajax({
            url: "/api/display/",
            type: "get",
            dataType: "JSON",
            success: function (data) {
                $("#displayTable").children("tbody").empty()
                var htmlstr = ""
                var states = ""
                var states_safe = 0
                var states_dangerous = 0
                var states_opem = 0
                var states_close = 0
                for (var i = 0; i < data.equilist.length; i++) {
                    if (data.equilist[i].state === true){
                        states = "开启"
                        states_opem++
                    }else{
                        states = "关闭"
                        states_close++
                    }
                    if (data.equilist[i].errors == "安全"){
                        states_safe++
                    }else {
                        states_dangerous++
                    }
                    htmlstr = htmlstr + "<tr>" +
                            "<td class='hidden'>" + data.equilist[i].id + "</td>" +
                            "<td>" + (i + 1) + "</td>" +
                            "<td>" + data.equilist[i].sn + "</td>" +
                            "<td>" + data.equilist[i].namee + "</td>" +
                            "<td>" + data.equilist[i].temperature + "</td>" +
                            "<td>" + data.equilist[i].times + "</td>" +
                            "<td>" + states + "</td>" +
                            "<td>" + data.equilist[i].errors + "</td>" +
                            "<td class='text-center'>" +
                            "<a type='button' class='btn btn-xs btn-success btnEdit'>编辑</a>" +
                            "<a type='button' class='btn btn-xs btn-info btnDetail'>查看</a>" +
                            "<a type='button' class='btn btn-xs btn-warning btnClear'>清除</a>" +
                            "<a type='button' class='btn btn-xs btn-danger btnDel'>删除</a>" +
                            "<a type='button' class='btn btn-xs btn-default btnOpen'>开关</a>" +
                            "</td>"
                            "</tr>";
                }

                $("#displayTable").children("tbody").html(htmlstr);
                var dataSet = [
                    {label: "安全", data: states_safe, color: "#005CDE" },
                    {label: "危险", data: states_dangerous, color: "#DE000F" },
                ];


var options = {
    series: {
        pie: {
            show: true,
            label: {
                show: true,
                radius: 180,
                formatter: function (label, series) {
                    return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
                    label + ' : ' +
                    Math.round(series.percent) +
                    '%</div>';
                },
                background: {
                    opacity: 0.8,
                    color: '#000'
                }
            }
        }
    },
    legend: {
        show: false
    },
    grid: {
        hoverable: true
    }
};
$.plot($("#flot-placeholder"), dataSet, options);


$.fn.showMemo = function () {
    $(this).bind("plothover", function (event, pos, item) {
        if (!item) { return; }
        console.log(item.series.data)
        var html = [];
        var percent = parseFloat(item.series.percent).toFixed(2);

        html.push("<div style=\"border:1px solid grey;background-color:",
             item.series.color,
             "\">",
             "<span style=\"color:white\">",
             item.series.label,
             " : ",
             $.formatNumber(item.series.data[0][1], { format: "#,###", locale: "us" }),
             " (", percent, "%)",
             "</span>",
             "</div>");
        $("#flot-memo").html(html.join(''));
    });
}
$("#flot-placeholder1").showMemo();
$("#flot-placeholder").showMemo();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('获取数据错误');
            }
        })


    }
    function reload_table1() {
        $.ajax({
            type: "get",
            dataType: "JSON",
            success: function (data) {
                $("#displayTable").children("tbody").empty()
                var htmlstr = ""
                for (var i = 0; i < data.equilist.length; i++) {
                    htmlstr = htmlstr + "<tr>" +
                            "<td class='hidden'>" + data.equilist[i].id + "</td>" +
                            "<td>" + (i + 1) + "</td>" +
                            "<td>" + data.equilist[i].sn + "</td>" +
                            "<td>" + data.equilist[i].namee + "</td>" +
                            "<td>" + data.equilist[i].temperature + "</td>" +
                            "<td>" + data.equilist[i].times + "</td>" +
                            "<td>" + data.equilist[i].errors + "</td>" +
                            "<td class='text-center'>" +
                            "<a type='button' class='btn btn-xs btn-success btnEdit'>编辑</a>" +
                            "<a type='button' class='btn btn-xs btn-danger btnDel'>删除</a>" +
                            "</td>"
                            "</tr>";
                }

                $("#displayTable").children("tbody").html(htmlstr);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('获取数据错误');
            }
        })


    }