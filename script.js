$(function() {
    class Cat {
        constructor(name, counter, filename) {
            this.name = name;
            this.counter = counter;
            this.filename = filename;
        }
        clicked(){
            this.counter += 1;
            return this.counter;
        }
    }
    var model = {
        init: function() {
            var cats = new Map();
            cats.set("Bolly", new Cat("Bolly", 0, "img/cat1.jpg"));
            cats.set("Dolly", new Cat("Dolly", 0, "img/cat2.jpg"));
            cats.set("Folly", new Cat("Folly", 0, "img/cat3.jpg"));
            cats.set("Golly", new Cat("Golly", 0, "img/cat4.jpg"));
            cats.set("Molly", new Cat("Molly", 0, "img/cat5.jpg"));
            //console.log(cats);
            var serializedCats = JSON.stringify(Array.from(cats.entries())); 
            localStorage.cats = serializedCats;
            //console.log(serializedCats);
            this.currentlySelected = "Bolly";
            this.adminMenuToggle = false;
        },
        getCats: function() {
            if (!localStorage.cats) {
                return Map.empty();
            } else {
                return new Map(JSON.parse(localStorage.cats)); 
            }
        },
        setCats: function(cats) {
            localStorage.cats = JSON.stringify(Array.from(cats.entries()));
        },
        selectACat: function(catName) {
            this.currentlySelected = catName;
        },
        getSelectedCat: function() {
            return this.getCats().get(this.currentlySelected);
        },
        getSelectedCatName: function() {
            return this.currentlySelected;
        },
        getSelectedCatCount: function() {
            return this.getSelectedCat().counter; 
        },
        getSelectedCatImage: function() {
            return this.getSelectedCat().filename;
        },
        selectedCatClicked: function() {
            var cats = this.getCats();
            var catObj = cats.get(this.currentlySelected);
            var cat = new Cat(catObj.name, catObj.counter, catObj.filename);
            cat.clicked();
            cats.set(this.currentlySelected, cat);
            this.setCats(cats); 
        },
        cats: function() {
            var cats = new Map(JSON.parse(localStorage.cats));
            //console.log(cats);
            return Array.from(cats.keys());
        },
        adminMenuToggled: function() {
            this.adminMenuToggle = !this.adminMenuToggle;
        },
        getAdminMenuToggle: function() {
            return this.adminMenuToggle;
        },
        updateSelectedCat: function(catName, img, count) {
            var cats = this.getCats();
            var catObj = cats.delete(this.currentlySelected);
            var cat = new Cat(catName, count, img);
            cats.set(catName, cat);
            this.setCats(cats);
            this.selectACat(catName);
        }
    };

    var octopus = {
        init: function() {
            model.init();
            sidebarView.init();
            contentView.init();
            adminView.init();
        },
        selectCat: function(catName) {
            model.selectACat(catName);
            contentView.render();
            console.log(catName + " selected");
            adminView.render();
        },
        getCatNames: function() {
            return model.cats();
        },
        getSelectedCatName: function() {
            return model.getSelectedCatName(); 
        },
        getSelectedCatCount: function() {
            return model.getSelectedCatCount(); 
        },
        getSelectedCatImage: function() {
            return model.getSelectedCatImage(); 
        },
        selectedCatClicked: function() {
            model.selectedCatClicked();
            contentView.render();
        },
        adminToggled: function() {
            model.adminMenuToggled();
            adminView.render();
        },
        getAdminMenuToggle: function() {
            return model.getAdminMenuToggle();
        },
        updateCat: function(catName, img, count) {
            model.updateSelectedCat(catName, img, count);
            sidebarView.render();
            contentView.render();
            adminView.render();
        }
    };

    var sidebarView = {
        init: function() {
            this.sidebarElem = document.getElementById('sidebar-view');
            sidebarView.render();
        },
        render: function() {
            //console.log(this.catElems);
            this.sidebarElem.innerHTML = '';
           
            var titleElem = document.createElement('a');
            titleElem.href = '#';
            titleElem.textContent = 'Here are your Cats';
            var brandElem = document.createElement('li');
            brandElem.classList.add('sidebar-brand');
            brandElem.appendChild(titleElem);
            this.sidebarElem.appendChild(brandElem);
            var sidebar = this.sidebarElem;
            octopus.getCatNames().forEach(function(catName) {
                var elem = document.createElement('li');
                var catElem = document.createElement('a');
                catElem.href = '#';
                catElem.textContent = catName;
                //console.log(catName);
                catElem.addEventListener('click', (function(cat) {
                    return function() {
                        console.log(cat + " selected in the view");
                        octopus.selectCat(cat);
                    };
                })(catName));
                elem.appendChild(catElem);
                sidebar.appendChild(elem);
            });
        }
    };

    var contentView = {
        init: function() {
            this.contentElem = document.getElementById('content');
            this.catNameElem = document.getElementById('cat-name');
            this.catImgElem = document.getElementById('cat-img');
            this.catCountElem = document.getElementById('cat-count');
            this.catImgElem.addEventListener('click', function(e) {
                octopus.selectedCatClicked();
            });
            contentView.render();
        },
        render: function() {
            this.contentElem.innerHtml = '';
            var catName = octopus.getSelectedCatName();
            var catCount = octopus.getSelectedCatCount();
            var catImg = octopus.getSelectedCatImage();
            this.catNameElem.textContent = 'Hello! This is ' + catName;
            this.catCountElem.textContent = 'You clicked ' + catName + ' ' + 
                catCount.toString() + ' times.';
            this.catImgElem.src = catImg;
        }
    }

    var adminView = {
        init: function() {
            this.adminToggleElem = document.getElementById('admin-toggle');
            this.adminMenuElem = document.getElementById('admin-menu');
            this.nameInputElem = document.getElementById('name-input');
            this.imgInputElem = document.getElementById('img-input');
            this.countInputElem = document.getElementById('count-input');
            this.menuCancelElem = document.getElementById('menu-cancel');
            this.menuSaveElem = document.getElementById('menu-save');
            this.adminToggleElem.addEventListener('click', function(e) {
                octopus.adminToggled();
            });
            this.menuCancelElem.addEventListener('click', function(e) {
                adminView.render();
            });
            this.menuSaveElem.addEventListener('click', (function(nameInput, imgInput, countInput) {
                return function() {
                    octopus.updateCat(nameInput.value, imgInput.value, parseInt(countInput.value));
                } 
            })(this.nameInputElem, this.imgInputElem, this.countInputElem));
            adminView.render();
        },
        
        render: function() {
            if (!octopus.getAdminMenuToggle()) {
                this.adminMenuElem.style.display = 'none';
                return;
            }
            var catName = octopus.getSelectedCatName();
            var catCount = octopus.getSelectedCatCount();
            var catImg = octopus.getSelectedCatImage();
            this.nameInputElem.value = catName;
            this.countInputElem.value = catCount;
            this.imgInputElem.value = catImg;
            this.adminMenuElem.style.display = 'block';
            
        }
        
    }

    octopus.init();
});

