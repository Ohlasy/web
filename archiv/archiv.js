function collectPropertyValues(objectList, propertyName) {
    var values = []
    objectList.forEach(function(obj) {
        values[obj[propertyName]] = 1
    })
    return Object.keys(values)
}

function buildComboBox(values, label) {
    var select = document.createElement('select')
    var noFilterOption = document.createElement('option')
    noFilterOption.innerHTML = label
    select.appendChild(noFilterOption)
    values.forEach(function(value) {
        var option = document.createElement('option')
        option.innerHTML = value
        select.appendChild(option)
    })
    return select
}

function applyAllFilters(filters, items) {
    var survivors = items
    for (var key in filters) {
        survivors = survivors.filter(filters[key])
    }
    return survivors
}

function buildPropertyFilter(propertyName, allFilters, allItems, callback) {
    return function() {
        if (this.selectedIndex > 0) {
            var selectedValue = this.options[this.selectedIndex].value
            if (selectedValue == "null") {
                selectedValue = null
            }
            allFilters[propertyName] = function(elem) {
                return elem[propertyName] == selectedValue
            }
            callback(applyAllFilters(allFilters, allItems))
        } else {
            delete allFilters[propertyName]
            callback(applyAllFilters(allFilters, allItems))
        }
    }
}
