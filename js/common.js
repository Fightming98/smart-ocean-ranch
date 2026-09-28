

var loadingMsgId = 0;

function showLoading(msg) {
    
    loadingMsgId = layer.msg(msg ? msg : '加载中...', {
          icon: 16
          ,shade: 0.2,
          time:0
        });
}

function hideLoading() {
    
    layer.close(loadingMsgId);
}

function showAlert(msg, func) {
    // alert(msg);
    if (func) {
        layer.alert(msg, function () {
            func();
            layer.closeAll();
        });
    } else {
        layer.alert(msg)
    }
}

function showConfirm(msg, func) {
    layer.confirm(msg, {
          btn: ['确定', '取消'] //按钮
        }, func, function(){

        });
}


var layerIndex;
var layerInitWidth;
var layerInitHeight;


function showDialog(title, content, btns, func) {

    if (!btns) {
        btns = ['确定', '取消'];
    }

    layer.open({
        type: 1,
        closeBtn: 1,
        area: [$(content).width(), 'auto'],
        fixed:true,
        shadeClose: false,
        title: title,
        btn: btns,
        content: $(content),
        yes: func,
        success: function (layero, index) {
          layerIndex      = index;
          layerInitWidth  = $("#layui-layer"+layerIndex).width();
          layerInitHeight = $("#layui-layer"+layerIndex).height();

          var docWidth = $(document).width();
          var docHeight = $("#layui-layer-shade" + layerIndex).height();
          
          if (layerInitHeight > docHeight) {
              var minHeight = layerInitHeight > docHeight ? docHeight : layerInitHeight;
              
              layer.style(layerIndex, {
                  top:0,
                  height:minHeight
              });
          }
          
          
          var ml = layerInitWidth / 2;

          layer.style(layerIndex, {
              left: "50%",
              marginLeft: -ml + "px"
          });
        }
    });
}

function toast(msg) {
    layer.msg(msg, {time:1000});
}

function showText(title, txt) {
    layer.open({
        type: 1
        ,title: title
        ,closeBtn: false
        ,area: ['600px', '500px']
        ,shade: 0.8
        ,btn: ["确定"]
        ,moveType: 1 
        ,content: "<p style='padding:10px;background:#f3f3f3;min-height:100%;'>" + txt.replace(/\n/g, '<br/>') + "</p>"
      });
}

var loading = false;

var async = function (url, data, callback, failed, msg) {
    if (loading && msg) {
        return;
    }
    loading = true;
    
    if (msg) {
        showLoading(msg);
    }

    $.ajax({
        url:url,
        type:'POST',
        dataType:"json",
        data:data,
        success:function (res) {
            loading = false;
            if (msg) {
                hideLoading();
            }

            if (res.status >= 0) {
                if (callback) {
                    callback(res);
                }
            } else {
                if (failed) {
                    failed(res);
                } else {
                    showAlert(res.result);
                }
            }
        },
        error:function () {
            loading = false;
            if (msg) {
                hideLoading();
            }
            showAlert("系统异常，请重试");
        }
    });
};

function formatTime(t, format) {
    if (!t) {
        return "";
    }
    var date = new Date(t);
    var param = {
        "M+" : date.getMonth() + 1,
        "d+" : date.getDate(),
        "h+" : date.getHours(),
        "m+" : date.getMinutes(),
        "s+" : date.getSeconds(),
        "q+" : Math.floor((date.getMonth() + 3) / 3),
        "S+" : date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in param) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? param[k] : ("00" + param[k]).substr(("" + param[k]).length));
        }
    }
    return format;
}

function nvl(str) {
    if (str) {
        return str;
    }
    
    return "";
}




function clearForm(id) {
    var form = $("#" + id);
    form.find("input,textarea").each(function () {
        var def = $(this).attr("data-default");
        
        if (def !== undefined) {
            $(this).val(def);
        } else {
            $(this).val('');
        }
    });
    form.find("select").each(function () {
        $(this).find("option:selected").attr("selected", false);
        $(this).find("option").first().attr("selected", true);
    });
}

function fillForm(obj) {
    for (var i in obj) {
        var field = $("#" + i);
        if(field.size() > 0) {
            if (field.attr("data-attr") == "true") {
                field.attr("data-val", obj[i]);
            } else {
                field.val(obj[i]);
            }
        }
    }
}

function getForm(id) {
    var obj = {};
    var form = $("#" + id);
    var flag = true;
    form.find("input,textarea,select").each(function () {
        var field = $(this);
        var attr = field.attr("id");
        if (attr) {
            var val = $.trim(field.val());
            if (field.parent().prev().size() > 0) {
                var label = field.parent().prev().text().replace(/[*：]/g, "");
            } else {
                var label = field.parent().parent().prev().text().replace(/[*：]/g, "");
            }

            if (field.hasClass("required") && val == "") {
                flag = false;
                showAlert("【" + label + "】不能为空");
                return false;
            } else if (field.attr("data-regexp") && !new RegExp(field.attr("data-regexp")).test(val)) {
                flag = false;
                showAlert("【" + label + "】格式不正确");
                return false;
            }
            
            if (attr.indexOf("q_") == 0) {
                attr = attr.substring(2);
            }
            
            obj[attr] = val;
        }
    });
    if (flag) {
        return obj;
    }
    
    return false;
}

function getForm3(id) {
    var obj = {};
    var form = $("#" + id);
    var flag = true;
    form.find("input,textarea,select").each(function () {
        var field = $(this);
        var attr = field.attr("id");
        if (attr) {
            var val = $.trim(field.val());
            var label = field.prev().text().replace(/[*：]/g, "");
            if (field.hasClass("required") && val == "") {
                flag = false;
                showAlert("【" + label + "】不能为空");
                return false;
            } else if (field.attr("data-regexp") && !new RegExp(field.attr("data-regexp")).test(val)) {
                flag = false;
                showAlert("【" + label + "】格式不正确");
                return false;
            }
            
            obj[attr] = val;
        }
    });
    if (flag) {
        return obj;
    }
    
    return false;
}


function getForm2(id) {
    var obj = {};
    var form = $("#" + id);
    var flag = true;
    form.find("input,textarea,select").each(function () {
        var field = $(this);
        
        var attr = field.attr("id");
        if (attr) {
            var val = $.trim(field.val());
            
            if (field.attr("type") == "checkbox" && !field[0].checked) {
                val = "";
            }
            
            if (field.hasClass("required") && val == "") {
                flag = false;

                var label = field.attr("placeholder");
                
                if (field[0].tagName == "SELECT") {
                    label = field.find("option").eq(0).text();
                }
                
                showAlert(label);
                return false;
            }

            obj[attr] = val;
        }
    });
    if (flag) {
        return obj;
    }
    
    return false;
}

function buildQuery(url, obj) {
    var param = [];
    for (var i in obj) {
        param.push(i + "=" + encodeURIComponent(obj[i]));
    }
    
    if (url.indexOf("?") > 0) {
        return BASE_URL + url + "&" + param.join("&");
    } else {
        return BASE_URL + url + "?" + param.join("&");
    }
}

function fillView(obj, ctx) {
    for (var i in obj) {
        var field = ctx ? $(ctx).find("#v_" + i) : $("#v_" + i);
        if(field.size() > 0) {
            field.text(nvl(obj[i]));
        }
    }
}

function dictDecode(i) {
    if (i.hasOwnProperty('gender')) {
        i.gender = i.gender == 1 ? '男' : '女';
    }
    if (i.hasOwnProperty('ifVip')) {
        i.ifVip = i.ifVip == 1 ? '是' : '否';
    }
    if (i.hasOwnProperty('subject')) {
        i.subject = i.subject == 1 ? '理科' : '文科';
    }
    if (i.hasOwnProperty('createTime')) {
        i.createTime = formatTime(i.createTime, 'yyyy-MM-dd hh:mm:ss');
    }

    if (i.hasOwnProperty('batch')) {
        i.batch = i.batch == 1 ? '本科' : '专科';
    }
}





var lastDay = 0;
var lastMin = 0;

function refreshMin(d) {
    var h = d.getHours();
    var m =  d.getMinutes();
    h = h > 9 ? h : ('0' + h);
    m = m > 9 ? m : ('0' + m);
    $(".date-time").text(h + ":" + m);
    lastMin = d.getMinutes();
}

function refreshDate(d) {
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    month ++;

    var lunar = sloarToLunar(year, month, day);
    $(".date-lunar").text(lunar.lunarMonth + "月" + lunar.lunarDay);
    lastDay = d.getDate();


    month = month > 9 ? month + "" : "0" + month;
    day = day > 9 ? day + "" : "0" + day;
    year = year + "";

    $(".date-year").each(function (i) {
        $(this).text(year[i]);
    });

    $(".date-month").each(function (i) {
        $(this).text(month[i]);
    });

    $(".date-day").each(function (i) {
        $(this).text(day[i]);
    });
    
}


function getLastDates(cnt) {
    var d = new Date();

    var dates = [];

    for (var i = 0; i < cnt; i++) {
        d = new Date(d.getTime() - 86400000);
        dates.push(formatTime(d, 'MM-dd'));
    }

    return dates.reverse();
}

function getHours() {
    var t = [];
    for (var i = 0; i < 24; i++) {
        t.push((i > 9 ? i : '0' + i) + ":00");
    }

    return t;
}

function getLastMonth(cnt) {
    var m = new Date().getMonth() + 1;

    var arr = [];

    var d = new Date();
    for (var i = 0; i < cnt; i++) {
        if (m == 0) {
            m = 12;
            d.setFullYear(d.getFullYear() - 1);
        }
        d.setMonth(m - 1);
        arr.push(formatTime(d, 'yy-MM'));
        m--;

    }
    arr.reverse();
    return arr;
}


$(function () {


    $(document).click(function () {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    });


    $(".tabs a").click(function (e) {
        e.stopPropagation();
    });

    var d = new Date();


    refreshMin(d);
    refreshDate(d);

    setInterval(function () {
        var d = new Date();
        if (d.getMinutes() != lastMin) {
            refreshMin(d);
        }

        if (d.getDate() != lastDay) {
            refreshDate(d);
        }
    }, 1000);
});