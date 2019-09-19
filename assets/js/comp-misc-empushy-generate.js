var model = null;
var contexts = []
var notifications = []
var currentIndex = 0
var custom = false;

var numToDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

async function loadModel() {
    model = await tf.loadLayersModel('./assets/models/model.json');
    console.log('Model loaded.');
    
    /*const input = tf.tensor2d([[-1.6409057e+00,  5.1516259e-01, -5.8204377e-01,  1.2617071e+00,
         1.4994451e-01,  1.1548576e+00,  1.1907161e+00, -1.7465304e+00,
         5.3549206e-01,  2.3530171e+00, -5.0620306e-01, -1.1069959e+00,
        -1.5593980e-01,  1.6317743e+00,  2.2143188e-01, -7.4718155e-02,
         1.3641529e+00,  1.5965505e+00, -6.5875274e-01, -6.3652553e-02,
         1.6023914e+00, -8.7063503e-01,  1.8281169e-01,  6.2679732e-01,
         7.1046788e-01, -1.5328580e-01, -1.3669978e+00,  3.1082368e-01,
         9.2475349e-01,  6.9715567e-02,  3.6560130e-01, -1.1672214e+00,
        -5.3513014e-01, -2.4484235e-01,  1.5549510e+00, -4.8040748e-01,
         2.7950820e-02, -7.2273836e-02,  1.3500378e+00, -8.9878345e-01,
         3.6573994e-01,  9.3480408e-01,  6.0584009e-01, -1.2002089e+00,
         2.6093729e+00, -6.1978668e-01,  1.0180953e+00, -1.2043651e+00,
         1.6439739e+00,  7.0507002e-01,  8.7430782e-04,  3.3351863e-03,
         3.3778339e-04,  8.1632650e-03,  2.5000000e-01,  0.0000000e+00,
         1.0000000e+00,  0.0000000e+00,  0.0000000e+00,  0.0000000e+00,
         1.0000000e+00,  0.0000000e+00,  0.0000000e+00,  0.0000000e+00,
         0.0000000e+00,  0.0000000e+00,  0.0000000e+00,  0.0000000e+00,
         1.0000000e+00,  0.0000000e+00,  1.0000000e+00,  0.0000000e+00,
         0.0000000e+00,  0.0000000e+00,  0.0000000e+00,  0.0000000e+00,
         0.0000000e+00]]);*/
    
    // Get the highest confidence prediction from our model
    //const result = model.predict(input);
    // console.log(Array.from(result.dataSync()));
}

function loadData(){
    fetch("./assets/data/feature_values.json")
    .then(res => res.json())
    .then(data => setFeatureValues(data));
    
    fetch("./assets/data/contexts.json")
    .then(res => res.json())
    .then(data => setContextData(data));
}

function setContextData(data){
    contexts = data
    
    // then get notification data
    fetch("./assets/data/notifications.json")
    .then(res => res.json())
    .then(data => setNotificationData(data));
}

function setNotificationData(data){
    notifications = data
    
    // then set initial values
    setContext()
    setCurrentNotification()
}

function setContext(){
    $('#dayCurrent').html(numToDay[contexts[currentIndex].dayOfWeek])
    $('#dayCurrent').css('color', 'white')
    $('#timeCurrent').html(contexts[currentIndex].timeOfDay)
    $('#timeCurrent').css('color', 'white')
    var unlocks = contexts[currentIndex].unlockCount_prev2.toFixed()
    $('#unlocksCurrent').html(unlocks>=0?unlocks+" times":'unknown')
    $('#unlocksCurrent').css('color', 'white')
    var usage =(contexts[currentIndex].phoneUsageTime_prev2/(1000*60)).toFixed(2)
    $('#usageCurrent').html(usage>=0?usage+" mins":'unknown')
    $('#usageCurrent').css('color', 'white')
    var clickCount = contexts[currentIndex].clickCount_prev2.toFixed(0)
    $('#interactionsCurrent').html(clickCount>=0?clickCount:'unknown')
    $('#interactionsCurrent').css('color', 'white')
    var launched =(contexts[currentIndex].uniqueAppsLaunched_prev2).toFixed(0)
    $('#launchedCurrent').html(launched>=0?launched:'unknown')
    $('#launchedCurrent').css('color', 'white')
}

function setCurrentNotification(){
    n = notifications[currentIndex]
    $('#appPackageCurrent').html(n.appPackage.replace('com.','').replace('.android.',' '))
    $('#appPackageCurrent').css('color', 'black')
    $('#categoryCurrent').html(n.category)
    $('#categoryCurrent').css('color', 'white')
    $('#subjectCurrent').html(n.subject)
    $('#subjectCurrent').css('color', 'white')
    $('#priorityCurrent').html(n.priority)
    $('#priorityCurrent').css('color', 'white')
    $('#ledARGBCurrent').html(n.ledARGB)
    $('#notificationCard').css('border-color', n.ledARGB)
    $('#ledARGBCurrent').css('color', 'white')
    $('#visibilityCurrent').html(n.visibility)
    $('#visibilityCurrent').css('color', 'white')
    $('#vibrateCurrent').html(n.vibrate)
    $('#vibrateCurrent').css('color', 'white')
    
}

function setFeatureValues(data){
    for(val of data){
        var option = document.createElement('option');
        option.innerHTML = val.value;
        option.setAttribute("style", "color: black;");
        document.getElementById(val.feature+'Select').appendChild(option);
    }
}

function setNotification(sel){
    notif_element = sel.id.replace('Select', 'Current')
    notif_value = sel.options[sel.selectedIndex].text
    elem = document.getElementById(notif_element)
    elem.innerHTML = notif_value.replace('com.','').replace('.android.', ' ')
    if(notif_element!="appPackageCurrent")
        elem.setAttribute("style", "color: white;")
    else{
        elem.setAttribute("style", "color: black; font-size:medium;") 
    }
    if(notif_element=='ledARGBCurrent')
        $('#notificationCard').css('border-color', notif_value!='unknown'?notif_value:'transparent')
}

function evaluateNotification(){
    if(!custom){
        result = contexts[currentIndex].action
        if(result){
            $('#openFail').hide()
            $('#openSuccess').show()
            $('#resultBackground').css('background', 'green')
        }
        else{
            
            $('#openFail').show()
            $('#openSuccess').hide()
            $('#resultBackground').css('background', 'red')
        }
    }
}

function randomPair(){
    currentIndex = (Math.random()*contexts.length).toFixed()
    setContext()
    setCurrentNotification()
}

function generateNotification(){
    custom = true
    $("#empushy-view").empty()
    encodeContext()
}

function empushyNotification(el){
    var n = { 
        appPackage: el.querySelector("#appPackage").innerHTML,
        category : el.querySelector("#category").innerHTML,
        subject : el.querySelector("#subject").innerHTML,
        priority : el.querySelector("#priority").innerHTML,
        ledARGB : el.querySelector("#ledARGB").innerHTML,
        visibility : el.querySelector("#visibility").innerHTML,
        vibrate : el.querySelector("#vibration").innerHTML
    }
    // set the notification values
    $.each( n, function( key, value ) {
        notif_element = key+'Current'
        notif_value = value
        elem = document.getElementById(notif_element)
        elem.innerHTML = notif_value
        if(notif_element!="appPackageCurrent")
            elem.setAttribute("style", "color: white;")
        else{
            elem.setAttribute("style", "color: black; font-size:medium;") 
            elem.innerHTML = notif_value.replace('com.','').replace('.android.', ' ')
        }
        if(notif_element=='ledARGBCurrent')
            $('#notificationCard').css('border-color', notif_value!='unknown'?notif_value:'transparent')
      
    });
}

function appendEmpushyNotifications(notifications){
    var nTemplate = '<div class="row empushy-notification" style="margin: 2%;" onclick="empushyNotification(this)">'+
                        '<div class="col-md">'+
                            '<div class="card mb-6" style="18rem; background: transparent!important;">'+
                                '<div class="card-header" style="background: #9b1427; font-size: smaller;">'+
                                    '<strong id="appPackage" style="font-size: medium;">{{:appPackage}}</strong>'+
                                '</div>'+
                                '<div id="notificationCard" class="card-body" style="color: black; padding: 0.5rem; color:#7d7d7d; font-size:smaller; border-color: #7d7d7d; border-style: solid; border-width: 1px; border-top-style: none;">'+
                                    '<div class="row" style="font-size:smaller;">'+
                                        '<div class="col-md">'+
                                            '<img src="./assets/icons/notification.png" alt="Smiley face" style="padding-right:5%">'+
                                            '<i id="category">{{:category}}</i>'+
                                        '</div>'+
                                        '<div class="col-md-7">'+
                                            '<img src="./assets/icons/subject.png" alt="Smiley face" style="padding-right:5%">'+
                                            '<i id="subject">{{:subject}}</i>'+
                                        '</div>'+
                                    '</div>'+
                                    '<br>'+
                                    '<div class="row">'+
                                        '<div class="col-md">'+
                                            '<img src="./assets/icons/priority.png" alt="Smiley face" style="padding-right:5%">'+
                                            '<i id="priority">{{:priority}}</i>'+
                                        '</div>'+
                                        '<div class="col-md-7">'+
                                            '<img src="./assets/icons/led.png" alt="Smiley face" style="padding-right:5%">'+
                                            '<i id="ledARGB">{{:ledARGB}}</i>'+
                                        '</div>'+
                                    '</div>'+
                                    '<br>'+
                                    '<div class="row">'+
                                        '<div class="col-md">'+
                                            '<img src="./assets/icons/visibility.png" alt="Smiley face"style="padding-right:5%">'+
                                            '<i id="visibility">{{:visibility}}</i>'+
                                        '</div>'+
                                        '<div class="col-md-7">'+
                                            '<img src="./assets/icons/vibration.png" alt="Smiley face"style="padding-right:5%">'+
                                            '<i id="vibration">{{:vibration}}</i>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'

    // Store it as a named template
    $.templates("nTemplate", nTemplate);
    // Use the template
    var html = $.templates.nTemplate(notifications);
    $("#empushy-view").append(html)
    //$.tmpl("nTemplate", n).appendTo("#empushy-view");
}

/* Submit encode/decode request */
function encodeContext() {
    var demoUrl = "http://localhost:5000/misc/generator/encode";
    
    contextObj = {
        "clickCount_prev2": contexts[currentIndex].clickCount_prev2,
        "totalSignificantAppLaunchCount_prev2":contexts[currentIndex].totalSignificantAppLaunchCount_prev2,
        "phoneUsageTime_prev2": contexts[currentIndex].phoneUsageTime_prev2,
        "unlockCount_prev2": contexts[currentIndex].unlockCount_prev2,
        "uniqueAppsLaunched_prev2": contexts[currentIndex].uniqueAppsLaunched_prev2,
        "action": true,
        "timeAppLastUsed": contexts[currentIndex].timeAppLastUsed,
        "timeOfDay": contexts[currentIndex].timeOfDay,
        "dayOfWeek": contexts[currentIndex].dayOfWeek,
    }

    var formData = JSON.stringify({
        "context": contextObj         
    })

    $.ajax ({
        url: demoUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function(data) {
            // console.log(data["encoded"])
            makePrediction(data['encoded'])
        }
    });

};

function decodePredictions(context, predictions){
    var demoUrl = "http://localhost:5000/misc/generator/decode";
    
    encodedObj = {
        "encoded_n":predictions,
        "encoded_c":context
    }

    var formData = JSON.stringify(encodedObj)

    $.ajax ({
        url: demoUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function(data) {
            var notifications = []
            for(n of data.decoded){
                notifications.push({
                    appPackage: n[0],
                    category : n[1],
                    subject : n[6],
                    priority : n[3],
                    ledARGB : n[2],
                    visibility : n[5],
                    vibration : n[4]
                })
            }
            appendEmpushyNotifications(notifications)
            
        }
    });
}

async function makePrediction(encoded){
    const input = tf.tensor2d(encoded);
    const result = model.predict(input);
    // console.log(Array.from(result.dataSync()));
    console.log(encoded)
    // var predictions = Array.from(result.dataSync())
    // const preds = f(xs).dataSync();
    var predictions = Array.from(result.arraySync())
    console.log(predictions)
    decodePredictions(encoded, predictions)
}



// 1. on submission, API call to convert strings to encoded values

// 2. use model to predict values

// 3. API call to convert prediction back to string values to populate container

loadModel();
loadData();

