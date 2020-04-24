function updateATs() {
    let atTable = document.getElementById('disp-data');
    while (atTable.row > 1) {
        atTable.deleteRow(-1);
    }

    let filteredData = filterData(list_submissions, gateList, BEList);
    filteredATs = filteredData[0];
    filteredGates = filteredData[1];
    filteredBEs = filteredData[2];

    getData(filteredATs, filteredGates, filteredBEs);
}

function filterData(list_submissions, gateList, BEList) {
    list_submissions = Object.assign({}, list_submissions);
    gateList = Object.assign({}, gateList);
    BEList = Object.assign({}, BEList);

    let filterByName = document.getElementById('filter-name');
    let filterByinputState = document.getElementById('inputState');
    let filterByDescription = document.getElementById('filter-description');
    let filterByGates = document.getElementsByName("gatetype")
    let filterByResult = document.getElementsByName('ResultType');
    let filterBymaxBE = document.getElementById('minBE');
    let filterByminBE = document.getElementById('maxBE');
    let filterByminGate = document.getElementById('minGate');
    let filterBymaxGate = document.getElementById('maxGate');
    let filterByAuthor = document.getElementById('author');
    let filterBypubYearRel = document.getElementById('publishYearRel');
    let filterBypubYear = document.getElementById('publishYear');
    let filterByaddedYearRel = document.getElementById('addedYearRel');
    let filterByaddedDate = document.getElementById('addedYear');

    let subName = filterByName.value;
    let inputState = filterByinputState.value;
    let subDescription = filterByDescription.value;
    let author = filterByAuthor.value;
    let pubYearRel = filterBypubYearRel.value;
    let pubYear = filterBypubYear.value;
    let addedYearRel = filterByaddedYearRel.value;
    let addedDate = filterByaddedDate.value;


    let filterGateList = [];
    for (let i = 0; i < filterByGates; i++) {
        if (filterByGates[i].checked) {
            filterGateList.push(filterByGates[i].value.toLowerCase());
        }
    }

    let resultList = [];
    for (let i = 0; i < filterByResult; i++) {
        if (filterByResult[i].checked) {
            resultList.push(filterByResult[i].value.toLowerCase());
        }
    }

    let finalList = [];
    let finalBEList = [];
    let finalGateList = [];

    for (let eachSubIndex in list_submissions) {
        let eachSub = list_submissions[eachSubIndex];
        let subGates = gateList[eachSubIndex];
        let subBE = BEList[eachSubIndex];

        let thisSubGate = []
        let thisSubBE = []

        if (subName != '') {
            if (!eachSub.modelName.toLowerCase().includes(subName.toLowerCase())) {
                continue;
            }
        }
        if (subDescription != '') {
            if (!eachSub.description.toLowerCase().includes(subDescription.toLowerCase())) {
                continue;
            }
        }

        if (addedDate != '') {
            if (addedYearRel == 'after') {
                if (addedDate >= eachSub.dateAdded) {
                    continue;
                }
            } else if (addedYearRel == 'before') {
                if (addedDate <= eachSub.dateAdded) {
                    continue;
                }
            }
        }

        let filteredSub = Object.assign({}, eachSub);
        filteredSub.variant = [];

        for (let eachVarIndex in eachSub.variant) {
            let eachVar = eachSub.variant[eachVarIndex];
            let varGates = subGates[eachVarIndex];
            let varBE = subBE[eachVarIndex];


            if (minGate != '') {
                let minGate = Number(filterByminGate.value);
                if (varGates.length < minGate) {
                    continue;
                }
            }

            if (maxGate != '') {
                let maxGate = Number(filterBymaxGate.value);
                if (varGates.length > maxGate) {
                    continue;
                }
            }

            if (minBE != '') {
                let minBE = Number(filterByminBE.value);
                if (varBE.length < minBE) {
                    continue;
                }
            }

            if (maxBE != '') {
                let maxBE = Number(filterBymaxBE.value);
                if (varBE.length > maxBE) {
                    continue;
                }
            }

            if (!eachVar.varAuthors.toLowerCase().includes(author)) {
                continue;
            }

            if (pubYear != '') {
                if (pubYearRel == 'after') {
                    if (pubYear >= eachVar.varYear) {
                        continue;
                    }
                } else if (pubYearRel == 'before') {
                    if (pubYear <= eachVar.varYear) {
                        continue;
                    }
                } else {
                    if (pubYear != eachVar.varYear) {
                        continue;
                    }
                }
            }

            let flag = true;
            for (eachGate of filterGateList) {
                if (varGates.includes(eachGate)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                continue;
            }

            flag = true;
            for (eachResult of resultList) {
                flag2 = false;
                for (eachResult of eachVar.results) {
                    if (eachResult.type == 'eachResult') {
                        flag2 = true;
                        break;
                    }
                    if (flag2) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                continue;
            }

            // It has stood the test of time
            filteredSub.append(eachVar);
            thisSubGate.append(varGates);
            thisSubBE.append(varBE);
        }

        // For all those subs who stand the test of time
        if (filteredSub.variant != []) {
            finalList.append(filteredSub);
            finalGateList.append(thisSubGate);
            finalBEList.append(thisSubBE);
        }
    }

    return [finalList, finalGateList, finalBEList];
}