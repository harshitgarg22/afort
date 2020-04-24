function getData(data, gateList, BEList) {
    // This receives a filtered list of data and gates and BEs
    // We must generate the chart data again
    console.log("Loading " + toString(data.length) + " models...");
    updateDisp(data, gateList);
    // each file associated with a var has a corresponding BEList and gateList. each variant has a dft file.
    // This means the number of BE and gates is same and is equal to number of variants.
}


var dynamicColors = function () {
    // returns r,g,b
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return r + "," + g + "," + b;
}

function updateDisp(data, gateList) {

    let numFam = document.getElementById('numFam');
    let numVar = document.getElementById('numVar');

    numFam.innerText = toString(data.length);

    let varCount = 0;
    for (let eachModel of data) {
        varCount += eachModel.variant.length;
    }

    numVar.innerText = toString(varCount);

    let uniqueGates = [].concat.apply([], gateList);
    uniqueGates = gateList.filter((v, i) => gateList.indexOf(v) == i); // generates a array of unique elements of gates

    let gateData = [];
    let backColorData = [];
    let borderColorData = [];

    let whatChecked = document.querySelector('input[name=statByGroup]:checked').value;

    if (whatChecked == 'family') {
        for (let eachModelIndex in data) {
            let thisGate = gateList[eachModelIndex];

            thisGate = [].concat.apply([], thisGate); // flatten the list
            thisGate = thisGate.filter((v, i) => thisGate.indexOf(v) == i); // unique
            gateData.append(thisGate);
        }
    } else {
        for (let eachModelIndex in data) {
            let eachModel = data[eachModelIndex];

            let thisModelGate = gateList[eachModelIndex];
            for (let eachVarIndex in eachModel.variant) {
                let thisGate = thisModelGate[eachVarIndex];
                thisGate = thisGate.filter((v, i) => thisGate.indexOf(v) == i); // unique
                gateData.append(thisGate);
            }
        }
    }

    let chartData = [];
    let avgdata = [];

    for (eachGate of uniqueGates) {
        let thisColor = dynamicColors();
        backColorData.append("rgba(" + thisColor + ",0.2)")
        borderColorData.append("rgba(" + thisColor + ",1)");

        let thisGateCount = 0;
        for (everyGate of gateData) {
            if (everyGate.includes(eachGate)) {
                thisGateCount += 1;
                continue;
            }
        }

        thisGateCount = 0;
        let flattend = [].concat.apply([], gateList);
        for (i = 0; i < flattend.length; i++) {
            if (flattend[i] == eachGate) {
                thisGateCount += 1;
                continue;
            }
        }
        if (whatChecked == 'family') {
            avgdata.append(thisGateCount / numFam);
        } else {
            avgdata.append(thisGateCount / numVar);
        }
        chartData.append(thisGateCount);
    }

    let ctx = document.getElementById('gateTypeChart');
    let gateTypeChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: uniqueGates,
            datasets: [{
                label: 'Trees Containing Gates',
                data: chartData,
                backgroundColor: backColorData,
                borderColor: borderColorData,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Gate Types'
            }
        }
    });



    let cty = document.getElementById('gateAvgChart');
    let gateAvgChart = new Chart(cty, {
        type: 'horizontalBar',
        data: {
            labels: uniqueGates,
            datasets: [{
                label: 'Trees Containing Gates',
                data: avgData,
                backgroundColor: backColorData,
                borderColor: borderColorData,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Gates per Tree'
            }
        }
    });


}