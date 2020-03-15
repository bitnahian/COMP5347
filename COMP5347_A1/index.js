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
    console.log('here');
    const e = document.getElementById("bookCategories");
    let filter = e.options[e.selectedIndex].text;
    await generateTable(params={ filter: filter === 'Category' ? undefined : filter});

    return false;
}

async function generateTable(params={}) {
    let json_data = await loadData();
    const { search, filter } = params;

    let schema = ['checkbox', 'img', 'title','rating',  'authors', 'year', 'price',  'publisher', 'category' ]

    var table = document.getElementById('resultBody');
    console.log(filter);
    for (let i = 0; i < json_data.length; i++) {
        if(filter && json_data[i]['category'] != filter) {
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
    console.log(json_data);
    var dropdown = document.getElementById('bookCategories')
    json_data.forEach((category) => {
        var option = document.createElement('option');
        option.value = category;
        option.innerHTML = category;
        dropdown.appendChild(option);
    })
   
}

window.addEventListener('load', async function() {

    document.getElementById('filterButton').addEventListener('click', (event) => filterTable, false);
    generateFilters();
    generateTable();

})




