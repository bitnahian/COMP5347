const dataPath = "http://localhost:3000";
const getCategoriesPath = "/getCategories";
let cachedCategory = 'None';
let cachedPattern = '';

/** api.js **/

const getAndParseJSONObject = async path => {
    const data = await fetch(path);
    // instad of returning, you can assign this to a global variable
    return await data.json();
};

async function loadData(parameter="/") {
    let data = await getAndParseJSONObject(`${dataPath}${parameter}`); 
    return data;
}

function processKey(key, value) {
    if (key == 'checkbox') {
        return "<input type='checkbox'></input>"
    } else if (key == 'img') {
        return `<img width='150px' height='150px' src=${value} />`
    } else {
        return value;
    }
}

/** searchAndFilter.js **/


async function filterTable(event) {
    event.preventDefault();
    const e = document.getElementById("bookCategories");
    let filter = e.options[e.selectedIndex].text;
    cachedCategory = filter;
    
    // pass None if default value for Category
    await generateTable({
        filter: (filter === 'Category') ? 'None' : filter, 
        pattern: (cachedPattern === '') ? undefined : cachedPattern, 
    });

    return false;
}

async function searchTable(event) {
    event.preventDefault();
    let pattern = document.getElementById('searchInput').value;
    cachedPattern = pattern;

    // Pass None if default value for Category
    await generateTable({
        filter: (cachedCategory === 'Category') ? 'None' : cachedCategory, 
        pattern: (pattern === '') ? undefined : pattern, 
    });

    return false;
}

function removeRows(tableID) {
    var table = document.getElementById(tableID);
    for(var i = table.rows.length - 1; i >= 0; i--)
    {
        table.deleteRow(i);
    }
}

function findMatch(pattern, title) {
    // Split on spaces and commas
    patterns = pattern.split(/[ ,]+/).filter(Boolean);
    let found = false;
    patterns.forEach((p) => {
        if(title.match(new RegExp(p, 'gi'))) {
            found = true;
        }
    })
    return found;
}

async function generateTable(params={filter:'None', pattern:''}) {
    const { pattern, filter } = params;
    let json_data = await loadData();
    const tableID = 'resultBody';
    let schema = ['checkbox', 'img', 'title','rating',  'authors', 'year', 'price',  'publisher', 'category' ]

    if(filter) {
        removeRows(tableID);
    }

    var table = document.getElementById(tableID);

    for (let i = 0; i < json_data.length; i++) {
        if(filter && filter != 'None' && json_data[i]['category'] != filter) {
            continue;
        }
        let highlight = false;
        if(pattern && findMatch(pattern, json_data[i]['title'])) { // Matches Regexp Pattern
            highlight = true;
        }
        var tr = document.createElement('tr');
        (highlight) ? tr.className = 'highlighted' : undefined;

        for (let j = 0; j < schema.length; j++) {
            var td = document.createElement('td');
            td.innerHTML = processKey(schema[j], json_data[i][schema[j]]);
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }
}

async function generateFilters(){ 
    let json_data = await loadData("/getCategories")
    var dropdown = document.getElementById('bookCategories')
    json_data.forEach((category) => {
        var option = document.createElement('option');
        option.value = category;
        option.innerHTML = category;
        dropdown.appendChild(option);
    })
   
}

/** checkbox-utils.js **/

async function createCheckBoxEventListeners() {
    let checkbox = document.querySelectorAll("input[name=checkbox]");
    console.log(checkbox);
    checkbox.forEach((box) => {
        box.addEventListener( 'change', function() {
            if(this.checked) {
                // Checkbox is checked..
                console.log('ok');
            } 
        });
    })

}



/** index.js **/

window.addEventListener('load', async function() {

    document.getElementById('filterButton').addEventListener('click', filterTable);
    document.getElementById('searchButton').addEventListener('click', searchTable);
    generateFilters();
    generateTable();
    createCheckBoxEventListeners();

})




