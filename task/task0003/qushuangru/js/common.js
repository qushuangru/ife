var defaltData = [{
        id: "20150504dddddddd",
        type: "list",
        topic: "百度IFE项目",
        list: [{
                id: "20150506qqqqqqqq",
                type: "item",
                topic: "task1",
                mission: [{
                    id: "d4DznDRcwXnKXwYK",
                    date: "2015-04-29",
                    topic: "to-do-4",
                    done: false,
                    content: "这个任务还没完成1"
                }, {
                    id: "MRKhFpbiGC2x43k5",
                    date: "2015-04-28",
                    topic: "to-do-1",
                    done: false,
                    content: "这个任务还没完成2"
                }, {
                    id: "CCceHrD5yNTNT7DX",
                    date: "2015-04-29",
                    topic: "to-do-2",
                    done: false,
                    content: "这个任务还没完成3"
                }, {
                    id: "reaJ3QTbPenjjaTr",
                    date: "2015-04-29",
                    topic: "to-do-3",
                    done: false,
                    content: "这个任务还没完成4"
                }]
            }, {
                id: "20150503wwwwwwww",
                type: "list",
                topic: "百度IFE项目",
                list: [{
                    id: "20150505eeeeeeee",
                    type: "item",
                    topic: "task1",
                    mission: [{
                        id: "c7syaFMpAGzaNwzP",
                        date: "2015-04-28",
                        topic: "to-do-1",
                        done: false,
                        content: "这个任务还没完成"
                    }, {
                        id: "bHYER6zDTdC6nfrR",
                        date: "2015-04-29",
                        topic: "to-do-2",
                        done: false,
                        content: "这个任务还没完成"
                    }]
                }]
            }

        ]
    }, {
        id: "20150510zzzzzzzz",
        type: "list",
        topic: "毕业设计",
        list: []
    }, {
        id: "20150511xxxxxxxx",
        type: "list",
        topic: "社团活动",
        list: []
    }, {
        id: "20150511tttttttt",
        type: "list",
        topic: "默认分类",
        list: []
    }

];

var oList = $("#mission-list");
var strListDom = "";
var oTodoList = $("#todo-list")
var aTodoList = [];
var missionDetail = $("#mission");
var missionTab = $("#mission-tab");
//正在编辑任务
var isEditing = false;
//一个临时的全局变量
var holder = "";

function getLocalData(key) {
    if (localStorage[key] && localStorage[key] != undefined) {
        return JSON.parse(localStorage[key]);
    }
    return false;
}

function setLocalData(key, value) {
    localStorage[key] = JSON.stringify(value);
}
if (!getLocalData("GDTData")) {
    setLocalData("GDTData", defaltData);
}

var GDTData = getLocalData("GDTData");


function initData(data) {
    for (var i = 0, l = data.length; i < l; i++) {
        if (data[i].type == "list") {
            strListDom += '<li class="list" data-id="' + data[i].id + '">'
            strListDom += '<h4><strong>' + data[i].topic + '</strong>(<span>' + data[i].list.length + '</span>)<a class="delete" href="#">&times;</a></h4>'
            strListDom += '<ul>';
            initData(data[i].list);
            strListDom += '</ul>';
        } else {
            strListDom += '<li class="item" data-id="' + data[i].id + '">'
            strListDom += '<strong>' + data[i].topic + '</strong>(<span>' + data[i].mission.length + '</span>)'
        }
        strListDom += '</li>';
    }
}

initData(GDTData)
oList.html(strListDom);

//要事件代理，还是想用下jquery T_T
//oList = $("#mission-list");

//操作localstorage


//getData

function getData(id, data, select) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].type === "item") {
            if (select == "content") {
                for (var j = data[i].mission.length - 1; j >= 0; j--) {
                    if (data[i].mission[j].id === id) {
                        holder = data[i].mission[j][select];
                        return;
                    }
                }
            }
            if (data[i].id === id) {
                holder = data[i][select];
                return;
            }
        } else {
            getData(id, data[i].list, select)
        }
    }
}

function setData(id, data, select, content) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].type === "item") {
            if (select != "topic") {
                for (var j = data[i].mission.length - 1; j >= 0; j--) {
                    if (data[i].mission[j].id === id) {
                        data[i].mission[j][select] = content;
                        return;
                    }
                }
            }
            if (data[i].id === id) {
                data[i][select] = content;
                return;
            }
        } else {
            setData(id, data[i].list, select, content)
        }
    }
}

function addnewData(id, data, select, add) {
    if (select == "mission") {
        for (var j = data.length - 1; j >= 0; j--) {
            if (data[j].type === "item") {
                if (data[j].id === id) {
                    data[j].mission.push(add);
                    return;
                }
            } else {
                addnewData(id, data[j].list, select, add);
            }
        }
    } else {
        for (var i = data.length - 1; i >= 0; i--) {
            if (data[i].type === "list") {
                if (data[i].id === id) {
                    data[i].list.push(add);
                    return;
                } else {
                    addnewData(id, data[i].list, select, add);
                }
            }
        }
    }
}

function deletData(id, data, select) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].id === id) {
            data.splice(i,1);
            return;
        } else {
            if (data[i].type === "list") {
                deletData(id, data[i].list, select);
            }
        }
    }
}

function getMissionList(id, data, done) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].type === "item") {
            if (data[i].id === id) {
                if (done == "all") {
                    aTodoList = data[i].mission;
                } else {
                    aTodoList = [];
                    for (var j = data[i].mission.length - 1; j >= 0; j--) {
                        if (data[i].mission[j].done == done) {
                            aTodoList.push(data[i].mission[j]);
                        }
                    }
                }


                return;
            }
        } else {
            getMissionList(id, data[i].list, done);
        }
    }
}

function initMissionList(list) {
    var str = "",
        dd = "";
    list.sort(function(a, b) {
        if (a.date > b.date) {
            return 1;
        } else {
            return -1;
        }
    })

    for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].date != dd) {
            dd = list[i].date;
            str += '<dt>' + list[i].date + '</dt>'
        }
        var classname = list[i].done ? 'finished' : '';
        str += '<dd class="' + classname + '" data-id="' + list[i].id + '" data-date="' + list[i].date + '" data-done="' + list[i].done + '">' + list[i].topic + '</dd>';
    }
    return str;
}

//取到某mission
function getMission(id) {
    getData(id, GDTData, 'content');
}

//根据数据修改misson页面的值
function initmission(data) {
    data = data || {
        id: "",
        topic: "",
        done: true,
        content: "",
        date: ""
    };
    missionDetail.attr('data-id', data.id);
    missionDetail.find('nav h2').html(data.topic);
    missionDetail.find('.mission-date').html(data.date);
    missionDetail.find('.text-area').html(data.content);
    if (data.done) {
        missionDetail.find('nav h2').css("color", "#238c00");
        $("#finished").hide();
        $("#edit").hide();
    } else {
        missionDetail.find('nav h2').css("color", "#000");
        $("#finished").show();
        $("#edit").show();
    }
    //console.log(data);
}

//储存mission的内容
function setMissionData(id, content) {
    setData(id, GDTData, 'content', content)
}


//时间格式化函数
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//生成16位随机字符串
function randomString(len) {　　
    len = len || 32;　　
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
    var maxPos = $chars.length;　　
    var pwd = '';　　
    for (i = 0; i < len; i++) {　　　　
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
    }　　
    return pwd;
}



//点击任务标题
oList.delegate('.item', 'click', function() {
    $('.current').removeClass("current");
    $(this).addClass("current");
    var id = $(this).data("id");
    getMissionList(id, GDTData, "all");
    missionTab.find('li').removeClass('active');
    missionTab.find('li').eq(0).addClass('active');
    $("#todo-list").html(initMissionList(aTodoList));
    $("#todo-list").attr("data-id", id);
    initmission();
});

//点击文件夹名称
oList.delegate('h4', 'click', function() {
    $('.current').removeClass("current");
    $(this).parent().toggleClass("active");
    $(this).parent().addClass("current");
});

//点击todolist内列表项
oTodoList.delegate('dd', 'click', function() {
    oTodoList.find('dd').removeClass('active');
    var _this = $(this);
    _this.addClass('active');
    var mission = {};
    //修改右侧的数据模型。
    mission.id = _this.data('id');
    mission.topic = _this.html();
    mission.date = _this.data('date');
    mission.done = _this.data('done');

    getMission(_this.data('id'));
    mission.content = holder;
    //根据数据修改dom树    
    initmission(mission);
})

//todolist上的tab按钮
missionTab.delegate("li", 'click', function() {
    missionTab.find('li').removeClass('active');
    $(this).addClass('active');

    var list = []
    var id = $("#todo-list").attr("data-id");
    switch ($(this).attr('id')) {
        case 'all':
            getMissionList(id, GDTData, "all");
            list = aTodoList;
            break;
        case 'done':
            getMissionList(id, GDTData, true);
            list = aTodoList;
            break;
        case 'doing':
            getMissionList(id, GDTData, false);
            list = aTodoList;
            break;
    }
    oTodoList.html(initMissionList(list));
    initmission();
})



//点击编辑按钮
$("#edit").click(function() {
    if (isEditing) {
        isEditing = false;
        $("#edit").text("编辑");
        missionDetail.find('.text-area').attr('contentEditable', 'false').blur().removeClass('editing');
        var content = missionDetail.find('.text-area').html();
        var id = missionDetail.data('id');
        setMissionData(id, content);
        setLocalData("GDTData", GDTData);
    } else {
        isEditing = true;
        $("#edit").text("保存");
        missionDetail.find('.text-area').attr('contentEditable', 'true').focus().addClass('editing');
    }

})

//点击完成按钮
$("#finished").click(function() {
    if (isEditing) {
        alert("请保存后再更改状态哟~");
        return;
    }
    var r = confirm("完成之后将不可修改");
    if (r) {
        //操作DOM
        $(this).hide();
        $("#edit").hide();
        var id = $("#mission").attr("data-id");
        oTodoList.find("[data-id='" + id + "']").addClass("finished");
        //更改数据

        setData(id, GDTData, "done", true);
        setLocalData("GDTData", GDTData);
    }
})

//新增分类按钮
$("#newlist").click(function() {
    var title = prompt("请输入分类名称", "未命名")
    if (title != null) {
        console.log(title);
    }
    //修改数据
    var newId = randomString(16);
    var newData = {
        id: newId,
        type: "list",
        topic: title,
        list: []

    };

    //修改dom
    if ($(".current>ul").length != 0) {
        addnewData($(".current").data("id"), GDTData, "list", newData);
        $(".current>ul").append('<li class="list" data-id="' + newId + '"><h4><strong>' + title + '</strong>(<span>' + 0 + '</span>)<a class="delete" href="#">&times;</a></h4><ul></ul></li>');
        console.log(GDTData);
        setLocalData("GDTData", GDTData);
    } else {
        addnewData($(".current").parents("li").eq(0).data("id"), GDTData, "list", newData);
        $(".current").closest("ul").append('<li class="list" data-id="' + newId + '"><h4><strong>' + title + '</strong>(<span>' + 0 + '</span>)<a class="delete" href="#">&times;</a></h4><ul></ul></li>');
        setLocalData("GDTData", GDTData);
    }
})

//删除分类
oList.delegate('.delete', 'click', function() {
    //console.log($(this).siblings("strong").text());
    var r = confirm('确定要删除 "' + $(this).siblings("strong").text() + '" 吗？删除后子分类将同时删除。此操作不可恢复。')
    var id = $(this).closest("li").data("id");
    if (r) {
        //修改数据
        deletData(id, GDTData, "list");
        setLocalData("GDTData",GDTData);
        //修改dom
        $(this).closest("li").remove();
    }
})


//新增任务按钮
$("#newmission").click(function() {
    var title = prompt("请输入任务标题", "未命名");
    var id = $("#todo-list").data("id");
    var data = {
        id: randomString(16),
        date: new Date().pattern("yyyy-MM-dd"),
        topic: title,
        done: false,
        content: ""
    };

    addnewData(id, GDTData, "mission", data);
    setLocalData("GDTData",GDTData);
    //修改dom
    getMissionList(id, GDTData, "all");
    missionTab.find('li').removeClass('active');
    missionTab.find('li').eq(0).addClass('active');
    $("#todo-list").html(initMissionList(aTodoList));
    $("#todo-list").attr("data-id", id);
    initmission();

})
