
let verList = null;
let sortBy = "releaseTime";
let reverseSort = true;

function versionSort(element, byWhat) {
    if(sortBy === byWhat) {
        reverseSort = !reverseSort;
    } else {
        reverseSort = true;
        sortBy = byWhat;
    }
    refreshVersions();
}

function createElement(version, isHeader) {
    const entry = document.createElement("div");
    const ahref = document.createElement(isHeader ? "b" : "a");
    ahref.className = "version";
    const span1 = document.createElement(isHeader ? "b" : "span");
    span1.className = "type";
    const span2 = document.createElement(isHeader ? "b" : "span");
    span2.className = "datetime";
    const span3 = document.createElement(isHeader ? "b" : "span");
    span3.className = "datetime";
    const span4 = document.createElement(isHeader ? "b" : "span");
    span4.className = "hash";
    const id = document.createTextNode(isHeader ? "Version" : version.id + ".json");
    const type = document.createTextNode(isHeader ? "Type" : version.type);
    const time = document.createTextNode(isHeader ? "Release time" : version.releaseTime);
    const updateTime = document.createTextNode(isHeader ? "Update time" : version.time);
    const sha1 = document.createTextNode(isHeader ? "SHA1 hash" : version.sha1);
    if(!isHeader) {
        ahref.href = version.url;
        ahref.download = version.id + ".json";
    } else {
        ahref.onclick = () => versionSort(ahref, "version");
        if(sortBy === "version") {
            ahref.className += reverseSort ? " sort-reverse" : " sort"
        }
        span1.onclick = () => versionSort(span1, "type");
        if(sortBy === "type") {
            span1.className += reverseSort ? " sort-reverse" : " sort"
        }
        span2.onclick = () => versionSort(span2, "releaseTime");
        if(sortBy === "releaseTime") {
            span2.className += reverseSort ? " sort-reverse" : " sort"
        }
        span3.onclick = () => versionSort(span3, "time");
        if(sortBy === "time") {
            span3.className += reverseSort ? " sort-reverse" : " sort"
        }
        span4.onclick = () => versionSort(span4, "sha1");
        if(sortBy === "sha1") {
            span4.className += reverseSort ? " sort-reverse" : " sort"
        }
    }
    ahref.appendChild(id);
    span1.appendChild(type);
    span2.appendChild(time);
    span3.appendChild(updateTime);
    span4.appendChild(sha1);
    entry.appendChild(ahref);
    entry.appendChild(span1);
    entry.appendChild(span2);
    entry.appendChild(span3);
    entry.appendChild(span4);
    entry.className = isHeader ? "header" : "entry";
    return entry;
}

function refreshVersions() {
    const versionsDiv = document.getElementById("jsonlist");
    versionsDiv.innerHTML = "";
    if(verList == null) {
        return;
    }
    versionsDiv.appendChild(createElement(null, true));
    verList.sort((verA, verB) => {
        let compare = 0;
        switch (sortBy) {
            case "version":
                compare = verA.id.localeCompare(verB.id);
                break;
            case "type":
                compare = verA.type.localeCompare(verB.type);
                break;
            case "releaseTime":
                compare = verA.releaseTime.localeCompare(verB.releaseTime);
                break;
            case "time":
                compare = verA.time.localeCompare(verB.time);
                break;
            case "sha1":
                compare = verA.sha1.localeCompare(verB.sha1);
                break;
        }
        return reverseSort ? compare * -1 : compare;
    })
    verList.forEach(version => {
        versionsDiv.appendChild(createElement(version, false));
    });
}

function init() {
    const versionsDiv = document.getElementById("jsonlist");
    fetch('version_manifest_v2.json').then((response) => response.json()).then((json) => {
        verList = json.versions;
        refreshVersions();
    }).catch((err) => {
        versionsDiv.innerHTML = "<b>" + err.message + "</b>";
    })
}

init();