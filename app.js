//Storage Controller

//Item Controller

const ItemCtrl = (function() {
    //Item constructon

    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Strucutre / State

    const data = {
        items: [
            { id: 0, name: "Steak Dinner", calories: 1200 },
            { id: 1, name: "Cookie", calories: 400 },
            { id: 2, name: "Eggs", calories: 300 },
        ],
        currentItem: null,
        totalCalories: 0,
    };

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;

            //create id

            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Calories to number

            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //Push items to data object

            data.items.push(newItem);

            return newItem;
        },
        logData: function() {
            return data;
        },
    };
})();

//UI Controller

const UICtrl = (function() {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCalorieInput: "#item-calories",
    };
    //Public methods

    return {
        populateListItem: function(items) {
            let html = "";

            items.forEach((item) => {
                html += ` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //Insert Item list

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalorieInput).value,
            };
        },
        addListItem: function(item) {
            //create li element

            const li = document.createElement("li");
            //Add class

            li.className = "collection-item";

            //Add id

            li.id = `item-${item.id}`;
            //Add HTML

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            //Insert the HTML

            document
                .querySelector(UISelectors.itemList)
                .insertAdjacentElement("beforeend", li);
        },
        getSelectors: function() {
            return UISelectors;
        },
    };
})();

//App Controller
const App = (function(ItemCtrl, UICtrl) {
    //Load event Listeners
    const loadEventListeners = function() {
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener("click", itemAddSubmit);
    };

    //Add item submit

    const itemAddSubmit = function(e) {
        //Get form input from UI controller

        const input = UICtrl.getItemInput();

        //Check for name and calorie input

        if (input.name !== "" && input.calories !== "") {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
        }
        e.preventDefault();
    };
    //Public Methods
    return {
        init: function() {
            //Fetch Items from data structures
            const items = ItemCtrl.getItems();

            //Populate list with items

            UICtrl.populateListItem(items);

            //Load event listener

            loadEventListeners();
        },
    };
})(ItemCtrl, UICtrl);

//Initialize App

App.init();