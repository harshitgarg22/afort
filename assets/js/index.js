function getData(data, gateList, BEList){
    console.log("Loading " + toString(data.length) + " models...");
    for(let i = 0; i < data.length; ++i){
        generateSub(data[i], gateList[i], BEList[i]);
        console.log(data[i]);
    }

    // each file associated with a var has a corresponding BEList and gateList. each variant has a dft file.
    // This means the number of BE and gates is same and is equal to number of variants.
}

function toggleSub(modName){
    let modelContent = document.getElementById(modName).nextSibling;

    if(modelContent.style.display === "none"){
        modelContent.style.display = "block";
    }   else{
        modelContent.style.display = "none";
    }
}

function toggleVar(modName){
    let varContent = document.getElementById(modName + '_varContent');

    if(varContent.style.display === "none"){
        varContent.style.display = "block";
    }   else{
        varContent.style.display = "none";
    }
}

function toggleResult(myVarID){
    let resultContent = document.getElementById(myVarID);

    if(resultContent.style.display === "none"){
        resultContent.style.display = "block";
    }   else{
        resultContent.style.display = "none";
    }
}

function toggleVarDescr(myVarID){
    let myVar = document.getElementById(myVarID + '_varDescr');

    if(myVar.style.display == 'none'){
        myVar.style.display = 'block';
    }   else{
        myVar.style.display = 'none';
    }
}

function generateVar(variants, modName){
    let varContent = document.getElementById(modName + '_varContent');
    result = [];
    for(let eachVarIndex in variants){
        let eachVar = variants[eachVarIndex];
        thisVar = varContent.insertRow();
        thisVarContent = varContent.insertRow();
        thisVarContent.id = modName + "_varContent_" + toString(eachVarIndex);

        generateResults(eachVar, thisVarContent.id);

        let varNameCol = varContent.insertCell();
        let nBEs = varContent.insertCell();
        let nGates = varContent.insertCell();
        let Distr = varContent.insertCell();
        let gateTypes = varContent.insertCell();
        let repair = varContent.insertCell();
        let dftURLCol = varContent.insertCell();
        let resultsCol = varContent.insertCell();

        let varName = document.createElement('a');
        varNameCol.append(varName);
        varName.innerText = eachVar.varName;
        varName.href = 'javascript:;';
        varName.onclick = 'toggleVarDescr(thisVarContent.id)';

        generateVarDescr(eachVar, thisVarContent.id);

        nBEs.innerText = BEs[eachVarIndex].length;
        nGates.innerText = gates[eachVarIndex].length;
        Distr.innerText = generateDistr();

        let gateSet = [].concat.apply([], gates[eachVarIndex]); // flatten the gates array into a single list
        gateSet = outUnique(gateSet);
        gateTypes.innerText = toString(gateSet);

        repair.innerText = generateRepair();

        let dftLink = document.createElement('a');
        dftLink.href = '/data/' + eachVar.dftFileURL;
        initials = []
        for(word in modelName.split(' ')){
            initials.push(word[0]);
        }
        initials = initials.join('').toLowerCase();
        dftLink.text = initials + '/' + dftLink.split('.')[0];
        dftURLCol.append(dftLink);

        eachVar.results.type = outUnique(eachVar.results.type);
        let resultsLink = document.createElement('a');
        resultsLink.text = toString(eachVar.results.type);
        resultsLink.href = 'javascript:;';
        resultsLink.onclick = 'toggleResult(thisVarContent.id)';
        resultsCol.append(resultsLink);

        result.append(toString(eachVar.results.type));
    }
    document.getElementById(modName + '_resultsCol').createTextNode(toString(result));
}

function generateVarDescr(variant, myVarID){

    let varDescr = document.createElement('div');
    varDescr.id = myVarID + '_varDescr';

    let descr = document.createElement('p');
    if(variant.varDescription == ''){
        descr.innerHTML = '<i>(No Description)</i>';
    }   else{
        descr.innerText = variant.varDescription;
    }
    varDescr.append(descr);

    let cite = document.createElement('p');
    cite.innerText = 'From: ' + toString(variant.varAuthors) + ': ';

    let doilink = document.createElement('a');
    doilink.text = variant.varTitle;
    doilink.href = variant.varDoi;
    cite.appendChild(doilink);
    cite.append(', '+ variant.varYear);

    varDescr.append(cite);

    document.getElementById(myVarID).append(varDescr);
}

function generateResults(variant, myVarID){
    let myVar = document.getElementById(myVarID);

    let thisResultContent = document.createElement('table');
    thisResultContent.class = ''
    myVar.append(thisResultContent);

    let thead = thisResultContent.createTHead();

    let metric = thead.insertCell();
    metric.innerText = 'Metric';
    let value = thead.insertCell();
    value.innerText = 'Value';
    let tool = thead.insertCell();
    tool.innerText = 'Tool';
    let link = thead.insertCell();
    link.innerText = 'Link';
    let comment = thead.insertCell();
    comment.innerText = 'Comment';

    for(let eachResult of variant.results){
        let eachResRow = thisResultContent.insertRow();

        let eachMetric = eachResRow.insertCell();
        eachMetric.innerText = eachResult.type;
        if(eachResult.time != ''){
            eachMetric.innerText += ' @ t = ' + eachResult.time;
        }
        let eachValue = eachResRow.insertCell();
        eachValue.innerText = eachResult.value;
        let eachTool = eachResRow.insertCell();
        eachTool.innerText = eachResult.tool;
        let eachLink = eachResRow.insertCell();
        eachLink.innerText = eachResult.resultDoi;
        let eachComment = eachResRow.insertCell();
        eachComment.innerText = eachResult.resultComment;
    }
}


function generateDistr(){
    return "Exp";
}

function generateRepair(){
    return "No";
}

function generateModel(sub){
    let tbody = document.getElementById('disp-data-body');

    let modelContent = tbody.insertRow();
    modelContent.class = "mx-2";

    modelContent.style.display = "none";

    let yourName = sub.yourName;
    let yourEmail = sub.yourEmail;

    let submitMeta = document.createElement('p');
    submitMeta.style.fontStyle = 'italic';
    submitMeta.appendChild(document.createTextNode('Submitted by: '));
    let mailLink = document.createElement('a');
    mailLink.text = yourName;
    if(yourEmail != ''){
        mailLink.href = 'mailto:' + yourEmail;
    }
    submitMeta.appendChild(mailLink);
    submitMeta.appendChild(document.createTextNode('.'));
    modelContent.append(submitMeta);

    let description = sub.description;
    let descrpContent = document.createElement('p');
    descrpContent.text = description;
    modelContent.append(descrpContent);

    let authors = sub.authors;
    let origPaperTitle = sub.origPaperTitle;
    let year = sub.year;
    let doi = sub.doi;

    let authContent = document.createElement('p');
    authContent.text = 'From: ';

    let authList = document.createElement('span');
    authList.style.fontStyle = 'italic';
    authList.text = authors + ':';
    authContent.appendChild(authList);

    let opt = document.createElement('a');
    opt.text = origPaperTitle;
    opt.href = doi;
    opt.style.fontStyle = 'italic';
    authContent.appendChild(opt);
    authContent.appendChild(document.createTextNode(', ' + toString(year)));

    modelContent.append(authContent);

    refList = document.createElement('div');
    let ref = sub.ref;
    for(let i = 0; i < ref.length; ++i){
        refContent = document.createElement('p');
        refContent.text = '[' + toString(i+1) + ']: ';

        refAuthList = document.createElement('span');
        refAuthList.style.fontStyle = 'italic';
        refAuthList.text = ref.refTitle;
        refContent.appendChild(refAuthList);

        refTitle = document.createElement('a');
        refTitle.href = ref.refDoi;
        refTitle.text = ref.refTitle;
        refContent.appendChild(refTitle);

        refContent.appendChild(', ' + ref.refYear);
    }

    modelContent.append(refList);

    let imageFileURL = sub.imageFileURL;
    img = document.createElement('img');
    img.src = imageFileURL;

    modelContent.append(img);

}

function outUnique(inpList){
    // Outputs unique element list from inputted list
    let outList = [];
    outList = inpList.filter((v,i) => inpList.indexOf(v) == i); // create a unique elements list
    return outList;
}

function generateSub(sub, gates, BEs){
    let tbody = document.getElementById('disp-data-body');

    let newRow = tbody.insertRow(); // Inserts row at the end index
    modName = sub.modelName.split(' ').join('_');
    newRow.id = modName;
    newRow.class = "sub-row";

    let modelNameCol = newRow.insertCell();
    let modelName = document.createElement('a');
    modelNameCol.append(modelName);
    modelName.innerText = sub.modelName;
    modelName.href = 'javascript:;';
    modelName.onclick = 'toggleSub(modName)';

    generateModel(sub);

    let variants = sub.variants;
    let nBEs = newRow.insertCell();
    let nGates = newRow.insertCell();
    let BE;

    /* CREATE A FUNCTION HERE */
    let Distr = newRow.insertCell();
    Distr.innerText = 'Exp.';

    let gateTypes = newRow.insertCell();

    /* CREATE A FUNCTION HERE */
    let repair = newRow.insertCell();
    repair.innerText = 'No';

    let modelCol = newRow.insertCell();
    let resultsCol = newRow.insertCell();

    if(variants.length == 1){
        let variant = variants[0];
        BE = BEs[0];
        gate = gates[0];

        nBEs.innerText = BE.length;
        nGates.innerText = gate.length;
        gateTypes.innerText = toString(gate);

        let dftLink = document.createElement('a');
        dftLink.href = '/data/' + variant.dftFileURL;
        initials = []
        for(word in modelName.split(' ')){
            initials.push(word[0]);
        }
        initials = initials.join('').toLowerCase();
        dftLink.text = initials + '/' + dftLink.split('.')[0];

        modelCol.append(dftLink);

        variant.results.type = outUnique(variant.results.type);
        resultsCol.append(toString(variant.results.type));

    }   else if(variants.length == 0){
        return;
    }   else{
        resultsCol.id = modName + '_resultsCol';
        let lengths = [];
        for(let i = 0; i < BEs.length; ++i){
            lengths.push(BEs[i].length);
        }
        let min = arr.reduce(function(a, b){
            return Math.min(a, b);
        });
        let max = arr.reduce(function(a, b){
            return Math.max(a, b);
        });
        nBEs.innerText = toString(min) + "-" + toString(max);

        lengths = [];
        for(let i = 0; i < gates.length; ++i){
            lengths.push(gates[i].length);
        }
        min = arr.reduce(function(a, b){
            return Math.min(a, b);
        });
        max = arr.reduce(function(a, b){
            return Math.max(a, b);
        });
        nGates.innerText = toString(min) + "-" + toString(max);

        let gateSet = [].concat.apply([], gates); // flatten the gates array into a single list
        gateSet = outUnique(gateSet);
        gateTypes.innerText = toString(gateSet);

        let showVarLink = document.createElement('a');
        showVarLink.text = '[toggle variations]';
        showVarLink.href = 'javascript:;';
        showVarLink.onclick = 'toggleVar(variants, modName)';
        modelCol.append(showVarLink);

        let varContent = document.createElement('table');
        varContent.id = modName + '_varContent';
        varContent.style.display = 'none';
        varContent.class = 'mx-2';

        generateVar(variants, modName);
    }

}