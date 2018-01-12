var initialCats = [
    {
        clickCount : 0,
        name : 'Tabby',
        imgSrc : 'img/1413379559_412a540d29_z.jpg',
        imgAttr: 'https://www.flicker.com/',
        nickName: ['Tabtab', 'T-bone', 'Mr.T', 'Tabitha Tab']
    },
    {
        clickCount : 0,
        name : 'Tiger',
        imgSrc : 'img/22252709_010df3379e_z.jpg',
        imgAttr: 'https://www.flicker.com/',
        nickName: ['Tigger']
    },
    {
        clickCount : 0,
        name : 'Scaredy',
        imgSrc : 'img/4154543904_6e2428c421_z.jpg',
        imgAttr: 'https://www.flicker.com/',
        nickName: ['Ghost', 'Reaper']
    },
]

var Cat = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttr);
    this.level = ko.computed(function() {
        var count = this.clickCount();
        if (count == 0) {
            return "Newborn";
        } 
        if (count < 10) {
            return "Infant";
        }
        if (count < 100) {
            return "Teen";
        }
        return "Adult";
    }, this);
    this.nickname = ko.observable(data.nickName);
}

var ViewModel = function() {
    var self = this;
    this.catList = ko.observableArray([]);

    initialCats.forEach(function(cat) {
        self.catList().push(new Cat(cat));
    })
    this.currentcat = ko.observable(this.catList()[0]);
    this.incrementCounter = function() {
        self.currentcat().clickCount(self.currentcat().clickCount() + 1);
    };
    this.selectcat = function(data) {
        self.currentcat(data); 
    }
}

ko.applyBindings(new ViewModel());
