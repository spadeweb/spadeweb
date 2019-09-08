var model = null;

async function loadModel() {
    model = await tf.loadLayersModel('./assets/models/model.json');
    console.log('Model loaded.');
    
    const input = tf.tensor2d([[-1.6409057e+00,  5.1516259e-01, -5.8204377e-01,  1.2617071e+00,
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
         0.0000000e+00]]);
    
    // Get the highest confidence prediction from our model
    const result = model.predict(input);
    console.log(Array.from(result.dataSync()));
}

fetch("./assets/data/feature_values.json")
    .then(res => res.json())
    .then(data => setFeatureValues(data));


function setFeatureValues(data){
    for(val of data){
        addRow(val)
        // append value to drop down for given feature
    }
}

function addRow(fv) {
  var option = document.createElement('option');

  option.innerHTML = fv.value;
  option.setAttribute("style", "color: black;");

  document.getElementById(fv.feature+'Select').appendChild(option);
}

function setNotification(sel){
    notif_element = sel.id.replace('Select', 'Current')
    notif_value = sel.options[sel.selectedIndex].text
    elem = document.getElementById(notif_element)
    elem.innerHTML = notif_value
    elem.setAttribute("style", "color: black;")
}

function evaluateNotification(){
    console.log('test notification for open/dismiss')
}

function changeContext(){
    console.log('move to next context')
}

function generateNotification(){
    console.log('get notification values and pass to api for encoding')
    console.log('on return, send to model for evaluation')
    console.log('on evaluation send to api for decoding')
    console.log('update the ui with generated notifications returned')
}



// 1. on submission, API call to convert strings to encoded values

// 2. use model to predict values

// 3. API call to convert prediction back to string values to populate container

loadModel();

