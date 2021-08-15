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
            // { id: 0, name: "Steak Dinner", calories: 1200 },
            // { id: 1, name: "Cookie", calories: 400 },
            // { id: 2, name: "Eggs", calories: 300 },
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
        getItemById: function(id) {
            let found = null;

            //Loop through the item
            data.items.forEach(function(item) {
                found = item;
            });

            return found;
        },
        updatedItem: function(name, calories) {
            //calories to number

            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id) {
            // GET ids

            const ids = data.items.map(function(item) {
                return item.id;
            });

            //Get index

            const index = ids.indexOf(id);

            //Remove item

            data.items.splice(index, 1);
        },

        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            data.items.forEach(function(item) {
                total += item.calories;
            });
            data.totalCalories = total;

            //return total

            return data.totalCalories;
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
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCalorieInput: "#item-calories",
        totalCalories: ".total-calories",
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
            //Show item list

            document.querySelector(UISelectors.itemList).style.display = "block";
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
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node into list array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute("id");

                if (itemID === `item-${item.id}`) {
                    document.querySelector(
                        `#${itemID}`
                    ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
                }
            });
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCalorieInput).value = "";
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value =
                ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalorieInput).value =
                ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node into array

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                listItem.remove();
            });
        },
        hideItem: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent =
                totalCalories;
        },

        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
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

        //Disable submit on enter

        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // Edit item event

        document
            .querySelector(UISelectors.itemList)
            .addEventListener("click", itemEditClick);
        // Update item event

        document
            .querySelector(UISelectors.updateBtn)
            .addEventListener("click", itemUpdateSubmit);

        // Delete item event

        document
            .querySelector(UISelectors.deleteBtn)
            .addEventListener("click", itemDeleteSubmit);

        // Back button event

        document
            .querySelector(UISelectors.backBtn)
            .addEventListener("click", UICtrl.clearEditState);

        //Clear items event

        document
            .querySelector(UISelectors.clearBtn)
            .addEventListener("click", clearAllItemsClick);
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

            //Get total calories

            const totalCalories = ItemCtrl.getTotalCalories();

            //Show total calories to UI

            UICtrl.showTotalCalories(totalCalories);
            //clear fields

            UICtrl.clearInput();
        }
        e.preventDefault();
    };

    //Item edit click

    const itemEditClick = function(e) {
        if (e.target.classList.contains("edit-item")) {
            //Get list item (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            //Break into array

            const listIdArr = listId.split("-");

            //Get the actual id

            const id = parseInt(listIdArr[1]);

            //Get item

            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    // Update item submit

    const itemUpdateSubmit = function(e) {
        //Get item input

        const input = UICtrl.getItemInput();

        //Update item

        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

        //Update the UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories

        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories to UI

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();
        e.preventDefault();
    };

    //Delete item submit

    const itemDeleteSubmit = function(e) {
        //Get current item

        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from datastructure

        ItemCtrl.deleteItem(currentItem.id);

        //Delete from  UI

        UICtrl.deleteListItem(currentItem.id);

        //Get total calories

        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories to UI

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    //Clear items event

    const clearAllItemsClick = function() {
        //Delete all items from  data structure

        ItemCtrl.clearAllItems();

        //Get total calories

        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories to UI

        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI

        UICtrl.removeItems();

        //Hide UL

        UICtrl.hideItem();
    };
    //Public Methods
    return {
        init: function() {
            //Clear the edit state
            UICtrl.clearEditState();
            //Fetch Items from data structures
            const items = ItemCtrl.getItems();

            //Check if any

            if (items.length === 0) {
                UICtrl.hideItem();
            } else {
                //Populate list with items

                UICtrl.populateListItem(items);
            }

            //Load event listener

            loadEventListeners();
        },
    };
})(ItemCtrl, UICtrl);

//Initialize App

App.init();