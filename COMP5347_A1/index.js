const dataPath = "http://localhost:3000";
const getCategoriesPath = "/getCategories";

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

async function filterTable(event) {
    event.preventDefault();
    const e = document.getElementById("bookCategories");
    let filter = e.options[e.selectedIndex].text;
    if(filter != 'Category') {
        await generateTable(params={ filter });
    }

    return false;
}

function removeRows(tableID) {
    var table = document.getElementById(tableID);
    for(var i = table.rows.length - 1; i >= 0; i--)
    {
        table.deleteRow(i);
    }
}

async function generateTable(params={}) {
    const { search, filter } = params;
    let json_data = await loadData();
    const tableID = 'resultBody';
    let schema = ['checkbox', 'img', 'title','rating',  'authors', 'year', 'price',  'publisher', 'category' ]

    if(filter) {
        removeRows(tableID);
    }

    var table = document.getElementById(tableID);

    for (let i = 0; i < json_data.length; i++) {
        if(filter && filter != 'None' && json_data[i]['category'] != filter) {
            console.log(filter === 'None');
            continue;
        }
        var tr = document.createElement('tr');

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

window.addEventListener('load', async function() {

    document.getElementById('filterButton').addEventListener('click', filterTable);
    generateFilters();
    generateTable();

})




