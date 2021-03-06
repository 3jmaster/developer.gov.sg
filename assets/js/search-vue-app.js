const vm = new Vue({
    el: '#terms',
    delimiters: ["((", "))"], // {{}} clashes with jekyll's templating, must change
    data: {
        terms: [],
        search: '',
        displaySearchResults: false,
        searchBarStyles: {
            display: 'flex'
        },
        filteredTermStyle: {

        }
    },
    computed: {
        filteredTerms: function() {
            const vm = this;
            if (vm.terms.length > 0) {
                return vm.terms.filter(function(term) {
                    const searchLowercase = vm.search.toLowerCase();
                    const name = term.name.toLowerCase();
                    const fullName = term.fullName.toLowerCase();
                    const description = term.description.toLowerCase();
                    const link = term.link.toLowerCase();
                    return name.indexOf(searchLowercase) !== -1 ||
                        fullName.indexOf(searchLowercase) !== -1 ||
                        description.indexOf(searchLowercase) !== -1 || 
                        link.indexOf(searchLowercase) !== -1 ||
                        term.category.indexOf(searchLowercase) !== -1;
                })
            }
        }
    },
    methods: {
        searchAndDisplayTerms: function() {
            console.log('searching!')
        }
    },
    created: function() {
        const vm = this;
        loadJson('/terms.json', function(err, data) {
            if (err) {
                console.error(err);
                return;
            }
            sortLoadedTerms(data);
            vm.terms = data;
        })
    }
});
function sortLoadedTerms(terms) {
    terms.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    })
}
function loadJson(location, callback) {
    const xhr = getXHR()
    xhr.open('GET', location, true)
    xhr.onreadystatechange = createStateChangeListener(xhr, callback)
    xhr.send()
}
function getXHR() {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
}
function createStateChangeListener(xhr, callback) {
    return function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                callback(null, JSON.parse(xhr.responseText))
            } catch (err) {
                callback(err, null)
            }
        }
    }
}