let refNum = 0;
let varNum = 0;

function addReference(){
    refNum = refNum + 1;
    let refList = document.getElementById('refList');

    let newDiv = document.createElement('div');
    newDiv.className = 'form-group m-5 mt-3';
    newDiv.id = 'reference-' + refNum;

    // Append header
    headerElement = document.createElement('h2');
    headerElement.innerText = 'Reference ' + refNum;
    newDiv.append(headerElement);

    // Append Title
    titleElement = document.createElement('div');
    titleElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Title';
    labelElement.setAttribute('for', 'refTitle');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'refTitle';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    titleElement.append(labelElement);
    titleElement.append(divElement);
    newDiv.append(titleElement);


    // Append Authors
    authorElement = document.createElement('div');
    authorElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Authors (separated by commas)';
    labelElement.setAttribute('for', 'refAuthors');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'refAuthors';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    authorElement.append(labelElement);
    authorElement.append(divElement);
    newDiv.append(authorElement);

    // Append DOI
    doiElement = document.createElement('div');
    doiElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'DOI/link';
    labelElement.setAttribute('for', 'refDoi');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'refDoi';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    doiElement.append(labelElement);
    doiElement.append(divElement);
    newDiv.append(doiElement);
    refList.append(newDiv);


    // Append Year
    yearElement = document.createElement('div');
    yearElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Year';
    labelElement.setAttribute('for', 'refYear');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'refYear';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'number');
    divElement.append(inputElement);
    yearElement.append(labelElement);
    yearElement.append(divElement);
    newDiv.append(yearElement);

    refList.append(newDiv);
}

function addVariant(){
    varNum = varNum + 1;

    varList = document.getElementById('varList');

    varElement = document.createElement('div');
    varElement.className = 'form-group m-5 mt-3';
    varElement.id = 'variant-' + varNum;

    // Adding header
    headerElement = document.createElement('h2');
    if(varNum == 1){
        headerElement.innerText = 'Model';
    }   else{
        document.getElementById('variant-1').children[0].innerText = 'Variant 1';
        headerElement.innerText = 'Variant ' + varNum;
    }
    varElement.append(headerElement);

    // Append DFT File
    dftElement = document.createElement('div');
    dftElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Choose DFT file';
    labelElement.setAttribute('for', 'dftFile');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'dftFile';
    inputElement.className = 'form-control-file';
    inputElement.setAttribute('type', 'file');
    divElement.append(inputElement);
    dftElement.append(labelElement);
    dftElement.append(divElement);
    varElement.append(dftElement);

    // Append Variant Name
    varNameElement = document.createElement('div');
    varNameElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Variant Name';
    labelElement.setAttribute('for', 'variantName');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantName';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    varNameElement.append(labelElement);
    varNameElement.append(divElement);
    varElement.append(varNameElement);

    // Append Description
    descrElement = document.createElement('div');
    descrElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Description';
    labelElement.setAttribute('for', 'variantDescription');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantDescription';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    descrElement.append(labelElement);
    descrElement.append(divElement);
    varElement.append(descrElement);

    // Append OPT
    optElement = document.createElement('div');
    optElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Original Paper Title';
    labelElement.setAttribute('for', 'variantOrigTitle');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantOrigTitle';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    optElement.append(labelElement);
    optElement.append(divElement);
    varElement.append(optElement);


    // Append Authors
    varAuthElement = document.createElement('div');
    varAuthElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Authors (separated by commas)';
    labelElement.setAttribute('for', 'variantAuthor');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantAuthor';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    varAuthElement.append(labelElement);
    varAuthElement.append(divElement);
    varElement.append(varAuthElement);

    // Append doi
    doiElement = document.createElement('div');
    doiElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'DOI/link';
    labelElement.setAttribute('for', 'variantDOI');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantDOI';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'text');
    divElement.append(inputElement);
    doiElement.append(labelElement);
    doiElement.append(divElement);
    varElement.append(doiElement);

    // Append year
    yearElement = document.createElement('div');
    yearElement.className = 'form-group row';
    labelElement = document.createElement('label');
    labelElement.className = 'col-sm-2 col-form-label';
    labelElement.innerText = 'Year';
    labelElement.setAttribute('for', 'variantYear');
    divElement = document.createElement('div');
    divElement.className = 'col-sm-10';
    inputElement = document.createElement('input');
    inputElement.id = 'variantYear';
    inputElement.className = 'form-control';
    inputElement.setAttribute('type', 'number');
    divElement.append(inputElement);
    yearElement.append(labelElement);
    yearElement.append(divElement);
    varElement.append(yearElement);

    // Append result
    let resLink = document.createElement('a');
    resLink.href = 'javascript:;';
    resLink.onClick = 'addResult()';
    resLink.innerText = 'Add Result';
    varElement.append(resLink);

    varList.append(varElement);
}