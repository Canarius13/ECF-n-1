// Variables, tableaux de selects et tableaux nécessaires au dates des cards
let link = 'books.json',
    authorSel = document.querySelector('#authorSelect'),
    authorSelection = document.querySelectorAll('#authorOption'),
    categorySel = document.querySelector('#categorySelect'),
    categorieSelection = document.querySelectorAll('#categorieOption'),
    result = document.querySelector('#result'),

    array = [],
    authorArr = [],
    cOption,
    array2 = [],
    categoryArr = [],
    cOption2;

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ];



// Fonction pour la création d'éléments
function creating(element) {
    return document.createElement(element);
}

// Fonction pour l'ajout d'éléments
function append(parent, el) {
    return parent.appendChild(el);
}

// Event au chargement de la page
window.addEventListener('load', () => {

    // Requête du sélecteur d'auteurs et de catégories
    fetch(link)
        .then(res => res.json())
        .then((json) => {
            // Constitution des tableaux pour les selects
            json.forEach(element => {
                // Constitution du tableau des auteurs
                element.authors.forEach(author => {
                    if (!array.includes(author)) {
                        array.push(author)
                    }
                })
                // Constitution du tableau des catégories
                element.categories.forEach(categorie => {
                    if (!array2.includes(categorie)) {
                        array2.push(categorie)
                    }
                })

                // Appel, par défaut, de la fonction de création des cards 
                createCard(element);
            })

            // tri des selects
            array.sort();
            authorArr = [...new Set(array)]
            array2.sort();
            categoryArr = [...new Set(array2)]

            // création et injection HTML des options du sélecteur des auteurs
            for (count of authorArr) {
                cOption = creating('option');
                cOption.id = 'authorOption';
                cOption.value = count;
                cOption.innerHTML = count;
                append(authorSel, cOption);
            }

            // création et injection HTML des options du sélecteur des catégories
            for (count of categoryArr) {
                cOption2 = creating('option');
                cOption2.id = 'categorieOption';
                cOption2.value = count;
                cOption2.innerHTML = count;
                append(categorySel, cOption2);
            }

            // paramètre de visibilité "cachée" pour le spinner, une fois la page chargée
            document.querySelector('.spinner-border').style.visibility = "hidden";
        })
        // Renvoi d'erreur avec Catch
        .catch(
            function (error) {
                console.log(error);
            }
        )
})


///////////////////////////////////////////


// Event du select Auteurs, pour le filtrage par auteur
authorSel.addEventListener("change", () => {
    let mainDiv = document.getElementById('mainDiv');
    mainDiv.innerHTML = '';
    categorySel.selectedIndex = 0;

    // Requête pour match les livres correspondants à l'auteur sélectionné, et appeler ainsi la 
    // fonction de création de card
    fetch(link)
        .then(res => res.json())
        .then((json) => {
            json.forEach(element => {
                element.authors.forEach(author => {
                    if (authorSel.value === author) {
                        createCard(element);
                    }
                })
            })
        })
})

// Event du select Catégories, pour le filtrage par catégorie
categorySel.addEventListener("change", () => {
    let mainDiv = document.getElementById('mainDiv');
    mainDiv.innerHTML = '';
    authorSel.selectedIndex = 0;

    // Requête pour match les livres correspondants à la catégorie sélectionnée, et appeler ainsi la 
    // fonction de création de card
    fetch(link)
        .then(res => res.json())
        .then((json) => {
            json.forEach(element => {
                element.categories.forEach(categorie => {
                    if (categorySel.value === categorie) {
                        createCard(element);
                    }
                })
            })
        })
})


/////////////////////////////////////////////////


// Création de la div principale, accueillant les cards
let div = creating('div');
div.classList.add('row');
div.id = 'mainDiv';

// Fonction création de card
function createCard(element) {

    // Création des éléments du DOM avec la fonction creating()
    let article = creating('article');
    let card = creating('div');
    let thumb = creating('img');
    let title = creating('h1');
    let isbn = creating('p');
    let date = creating('p');
    let pages = creating('p');
    let desc = creating('p');

    // Ajout des classes et autres attributs à chaque élément créé
    article.classList.add("col-12");
    article.classList.add("col-sm-6");
    article.classList.add("col-md-4");
    article.classList.add("col-lg-3");
    card.classList.add("card");
    card.classList.add("my-3");
    card.classList.add("p-3");
    card.style.height = '500px';
    card.style.overflow = 'scroll';
    title.classList.add("title");
    isbn.classList.add("isbn");
    date.classList.add("date");
    pages.classList.add("pages");
    desc.classList.add("desc");

    // Ajout des différentes données demandées aux cards
    // Thumbnail
    if (element.thumbnailUrl) {
        thumb.src = `${element.thumbnailUrl}`;
    } else {
        thumb.src = "book.png";
    }

    // title
    title.innerHTML = `<span class="bold">${element.title}</span>`

    // isbn
    isbn.innerHTML = `<span class="bold">ISBN : </span>${element.isbn}`

    // Published date
    if (element.publishedDate) {
        let d = new Date(element.publishedDate.dt_txt);

        let actualDay = d.getDay();
        let dayNumber = d.getDate();
        let actualMonth = d.getMonth();
        let year = d.getFullYear();

        date.innerHTML = `<span class="bold" >Date de publication : </span> ${days[actualDay]} ${dayNumber} ${months[actualMonth]} ${year}`;
    } else {
        date.innerHTML = `<span class="bold" >Date de publication : </span>Non fournie.`
    }

    // Pages count
    if (element.pageCount != 0) {
        pages.innerHTML = `<span class="bold" >Nombre de pages : </span>${element.pageCount}`
    } else {
        pages.innerHTML = `<span class="bold" >Nombre de pages : </span>Non fourni`
    }

    // description
    if (element.shortDescription) {
        desc.innerHTML = `<span class="bold" >Description : </span>${element.shortDescription}`
    } else if (element.longDescription) {
        desc.innerHTML = `<span class="bold" >Description : </span>${element.longDescription}`
    } else {
        desc.innerHTML = `<span class="bold" >Description : </span>Non fournie.`
    }

    // Ajout élément enfant au parent avec la fonction append()
    append(card, thumb);
    append(card, title);
    append(card, isbn);
    append(card, date);
    append(card, pages);
    append(card, desc);
    append(article, card);
    append(div, article);
    // Injection de la div principale dans la section HTML
    append(result, div);
}