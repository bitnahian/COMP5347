const dataPath = "http://localhost:3000";
const getCategoriesPath = "/getCategories";
let cachedCategory = 'None';
let cachedPattern = '';
let checkboxHash = undefined;

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

function processKey(key, value, title) {
    if (key == 'checkbox') {
        return `<input id=${hashCode(title)} type='checkbox'></input>`
    } else if (key == 'img') {
        return `<img width='150px' height='150px' src=${value} />`
    } else if (key == 'rating') {
        html = '<div class="star">';
        value = parseInt(value);
        for(var i = 0; i < value; ++i) {
            html += `<span><img src="images/star-16.ico"/></span>`
        }
        var j = value;
        for(j; j < 5; j++) {
            html += `<span><img src="images/outline-star-16.ico"/></span>`
        }
        html += '</div>';
        return html;
    } 
    else {
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
            td.innerHTML = processKey(schema[j], json_data[i][schema[j]], json_data[i]['title']);
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }

    // Remember which item was selected previously
    let c = document.getElementById(checkboxHash);
    if(c) {
        c.checked = true;
    }

    createCheckBoxEventListeners();
    

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

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
  }

function createCheckBoxEventListeners() {
    let checkbox = document.querySelectorAll("input[type=checkbox]");
    checkbox.forEach((box) => {
        box.addEventListener( 'change', function() {
            if(this.checked) {
                // Checkbox is checked..
                checkboxHash = this.id;
                let checked = this;
                checkbox.forEach((b) => {
                    if(b != checked) {
                        b.checked = false;
                    }
                });
            } 
        });
    })

}

/** cart.js **/

function addNumber(n) {
    let elm = document.getElementById("numItems");
    let c = elm.innerHTML;
    let oldNum = c.substring(1, c.length-1);
    let num = parseInt(oldNum) + parseInt(n);
    elm.innerHTML = `(${num})`;
}

function clearChecks() {
    let c = document.getElementById(checkboxHash);
    c.checked = false;
    checkboxHash = undefined;
}

async function addToCart(event) {
    event.preventDefault();
    let c = document.getElementById(checkboxHash);
    if(!c) {
        alert("No item was checked.");
        return false;
    }
    else {
        let number = prompt(`How many item(s) do you want to add?`);
        if(number){
            alert(`Added ${number} item(s) to cart.`)
            clearChecks();
            addNumber(number);
        }
        else {
            alert('No item(s) were added to cart.')
        }
    }
    return false;    
}

async function resetCart(event) {
    event.preventDefault();
    if(confirm("Reset the cart?")) {
        document.getElementById("numItems").innerHTML="(0)";
        alert("Cart has been reset.");
    }
    else {
        alert("Nothing was changed.");
    }
    return false;
}

/** index.js **/

window.addEventListener('load', async function() {

    document.getElementById('filterButton').addEventListener('click', filterTable);
    document.getElementById('searchButton').addEventListener('click', searchTable);
    document.getElementById('addToCartButton').addEventListener('click', addToCart);
    document.getElementById('resetCartButton').addEventListener('click', resetCart);
    generateFilters();
    generateTable();
})




