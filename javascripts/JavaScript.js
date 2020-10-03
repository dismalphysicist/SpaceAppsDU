"use strict";

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj) {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

function formhandler() {
    var u = $("#username").val().trim();

    $.get("http://localhost:1337/people/" + u, "",
        function (data) {
            if (data.username !== undefined) {
                $('#searchresult').html(data.forename + " " + data.surname);
            }
            else {
                $('#searchresult').html(" This user does not exist");
            }
        });

    return false;
}

//function allHandler() {
//    $.get("http://localhost:1337/people", "",
//        function (data) {
//            console.log(data);
//            $('#writein').append(data);
//        });
//    return false;
//}

function add() {

    //console.log($("#DoB").val()); //debugging 

    if ($("#addPerson1").val() == "" | $("#addPerson2").val() == "" | $("#addPerson3").val() == "" | $("#DoB").val() == "") {
        $("#added").html("Please fill in all fields.");
        return false;
    }
    else {
        var sex, disability;
        if ($("#sexF").is(":checked")) {
            sex = "F";
        }
        else {
            sex = "M";
        }

        if ($("#addPersonDisability").is(":checked")) {
            disability = true;
        }
        else {
            var disability = false;
        }

        $.post("http://localhost:1337/people",
            {
                username: $("#addPerson1").val(),
                forename: $("#addPerson2").val(),
                surname: $("#addPerson3").val(),
                dob: $("#DoB").val(),
                sex: sex,
                disability: disability,
                access_token: "concertina"
            },
            function (data) {
                if (data.status == "400") {
                    //bad request
                    console.log("That username is taken.");
                    $("#added").html("That username is taken.");
                }
                else {
                    $("#added").html(data);
                    document.getElementById("addform").reset();
                }
            })

        $("#searchresult").html(""); //clear search results when person is added
        document.getElementById("searchform").reset();
        update();
        return false;
    }
}

function createAccount() {
    if ($("#createaccountusername").val() == "" | $("#createaccountforename").val() == "" | $("#createaccountsurname").val() == "" | $("#indexDoB").val() == "" | $("#password").val() == "") {
        $("#createdaccount").html("Please fill in all fields.");
        return false;
    }
    else {
        var sex, disability;

        if ($("#index_sexF").is(":checked")) {
            sex = "F";
        }
        else {
            sex = "M";
        }

        if ($("#indexaddPersonDisability").is(":checked")) {
            disability = true;
        }
        else {
            var disability = false;
        }

        $.post("http://localhost:1337/people",
            {
                username: $("#createaccountusername").val(),
                forename: $("#createaccountforename").val(),
                surname: $("#createaccountsurname").val(),
                dob: $("#indexDoB").val(),
                sex: sex,
                disability: disability,
                access_token: $("#password").val()
            },
            function (data) {
                if (data.status == "400") {
                    //bad request
                    console.log("That username is taken.");
                    $("#createdaccount").html("That username is taken.");
                }
                else {
                    $("#createdaccount").html(data);
                    document.getElementById("indexaddform").reset();
                }
            })

        //this is create an account 
        $("#indexcreateaccount").collapse();
        update();
        return false;
    }
}

function eventsearch() {
    var n_formatted = $("#event_search").val();

    if (n_formatted !== "") {
        $.get("http://localhost:1337/events/" + n_formatted, "",
            function (data) {
                if (data.name !== undefined) {
                    $("#eventsearchresult").html(data.name + ": " + data.date
                        + '<br><button id="registerinterest">Register</button>'
                        + '<br><button id="cleareventsearch">Clear search</button>');

                    $("#registerinterest").click(function () {
                        $("#eventsearchresult").append('<div id="showwhenregistering"> <form id="registerforeventform"> Username: <input type="text" id="uname" /><br> Password:  <input type="text" id="password1" />  <button id="reg">Register</button></form></div>');
                        $("#reg").click(register);
                    });

                    $("#cleareventsearch").click(reseteventform);
                }
                else {
                    $("#eventsearchresult").html("This event does not exist");
                }
            });
    }

    return false;
}


function register() {
    $.post("http://localhost:1337/addtoevent/", {
        username: $("#uname").val(),
        event: $("#event_search").val(),
        access_token: $("#password1").val()
    },
        function (data) {
            $('#eventsearchresultextended').html("\n" + data);
        })
    //update();
    return false;
}



function addtoevent() {
    $.post("http://localhost:1337/addtoevent", {
        username: $("#user").val(),
        event: $("#event").val(),
        access_token: "concertina"
    },
        function (data) {
            $("#addedtoevent").html(data);
        })
    $("#searchresult").html(""); //clear search result 
    $("#added").html("");
    //update();
    return false;
}

function addevent() {
    if ($("#evntname").val() == "" | $("#evntdate").val() == "") {
        $("#addedEvent").html("Please fill in all fields.");
        return false;
    }
    else {
        $.post("http://localhost:1337/addevent", {
            eventname: $("#evntname").val(),
            date: $("#evntdate").val(),
            access_token: "concertina"
        },
            function (data) {
                $("#addedEvent").html(data);
            })
        update();
        return false;
    }
}

function update() {

    $.get("http://localhost:1337/people", "",
        function (data) {
            var options = '<select id="user">';
            for (var i = 0; i < data.length; i++) {
                var person = data[i];
                options += '<option value=' + person.username + '>' + person.forename + " " + person.surname + '</option>';
            }
            options += '</select>';
            $("#useroptions").html(options);
        });

    $.get("http://localhost:1337/events", "",
        function (data) {
            var options = "<select id='event'>";
            var options2 = "<select id='event_search'>";
            for (var i = 0; i < data.length; i++) {
                var event = data[i];
                var event_name_formatted = event.name.replace(/ /gi, "%20")
                console.log(event_name_formatted); //debugging 
                options += "<option value=" + event.date + ">" + event.name + " " + event.date + "</option>";
                options2 += "<option value=" + event_name_formatted + ">" + event.name + " " + event.date + "</option>";
            }
            options += "</select>";
            options2 += "</select>";
            $("#eventoptions").html(options);
            $("#events_search").html(options2);
        });
}

function reseteventform() {
    document.getElementById("eventsearchform").reset();
    $("#eventsearchresult").html("");
}

function imageZoom() {
    var img, lens, result, cx, cy;
    img = document.getElementById("myimage");
    result = document.getElementById("myresult");
    /* Create lens: */
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /* Insert lens: */
    img.parentElement.insertBefore(lens, img);
    /* Calculate the ratio between result DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /* Set background properties for the result DIV */
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /* And also for touch screens: */
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
        var pos, x, y;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        /* Get the cursor's x and y positions: */
        pos = getCursorPos(e);
        /* Calculate the position of the lens: */
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
        if (x < 0) { x = 0; }
        if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
        if (y < 0) { y = 0; }
        /* Set the position of the lens: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /* Display what the lens "sees": */
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}

window.onload = update();
window.onload = $("#showwhenregistering").hide();

imageZoom();

$("#submitButton").click(formhandler);
$("#myform").submit(formhandler);
// $("#allthesongs").click(allHandler);
$("#addButton").click(add);
$("#addform").submit(add);

$("#createButton").click(createAccount);
$("#indexaddform").submit(createAccount);

$("#eventsubmitButton").click(eventsearch);
$("#eventsearchform").submit(eventsearch);

$("#eventaddperson").click(addtoevent);
$("#eventaddpersonform").submit(addtoevent);

$("#addEventButton").click(addevent);
$("#addeventform").submit(addevent);