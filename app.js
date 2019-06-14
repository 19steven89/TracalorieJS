// storage controller

// item controller IIFE
const ItemCtrl = (function(){
    console.log("item controller...");
    // item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // data structure / state
    const data = {
        items: [
            // {id: 0, name: "Steak Dinner", calories: 900},
            // {id: 1, name: "Cookie", calories: 350},
            // {id: 2, name: "Milkshake", calories: 450},
        ],
        currItem: null,
        totalCalories: 0
    };

    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let id;
            // create food ids
            if(data.items.length > 0){
                // make the first item id = 0, 2nd = 1 and so on...
                id = data.items[data.items.length - 1].id + 1;
            }else{
                id = 0;
            }

            // convert calories to int
            calories = parseInt(calories);
            // add the new food item to the data array 
            const newFoodItem = new Item(id, name, calories);
            data.items.push(newFoodItem);

            return newFoodItem;
            
        },
        //return the data object created above so that it can be accessed from outside the function 
        logData: function(){
            return data;
        }
    }   

    
})();

// UI controller IIFE
const UICtrl = (function(){
    console.log("UI controller...");

    //create an object which contains the itemList id name and addMealBtn classname, to make it more dynamic, rather than hard coding it in html
    const UIselectors = {
        itemList: "#item-list",
        addMealBtn: ".add-btn",
        foodItemName: "#item-name",
        foodCalories: "#item-calories"
    };

     // Public return method:
     return{
        populateItemList: function(items){
            let foodListItems = "";

            items.forEach((item) => {
                // add each food list item to the UI:
                foodListItems += `<li id="item-${item.id}" class="edit-item collection-item"><strong>${item.name}: </strong><em>${item.calories} Calories <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a></em></li>`;
            });

            //insert list items to UI
            document.querySelector(UIselectors.itemList).innerHTML = foodListItems;
        },
        // get the food item and calories input entered by the user
        getItemInput: function(){
            return {
                name: document.querySelector(UIselectors.foodItemName).value,
                calories: document.querySelector(UIselectors.foodCalories).value
            }
        },
        addListItem: function(newFoodItem){            
            document.querySelector(UIselectors.itemList).style.display = "block";
            //create li element:
            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${newFoodItem.id}`;
            // add new food item to the list 
            li.innerHTML = `<strong>${newFoodItem.name}: </strong><em>${newFoodItem.calories} Calories<a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a></em>`;
            //add to the UI
            document.querySelector(UIselectors.itemList).insertAdjacentElement("beforeend", li);
        },
        // return the list items 
        getSelectors: function(){
            return UIselectors;
        },
        clearInput: function(){
            document.querySelector(UIselectors.foodItemName).value = "";
            document.querySelector(UIselectors.foodCalories).value = "";
        },
        //hide the list from showing if the list is empty
        hideList: function(){
            document.querySelector(UIselectors.itemList).style.display = "none";
        }
     };
    
})();

// app controller IIFE. Used to initiate the app by first getting the items then adding them to the UI
const App = (function(itemCtrl, uICtrl){
    console.log("app controller...");

    // load event listeners:
    const loadEventListeners = function(){
        // get UI selectors
        const UIselectors = UICtrl.getSelectors();

        // Add Item event for add meal button:
        document.querySelector(UIselectors.addMealBtn).addEventListener("click", mealItemAdd);

    };

    const mealItemAdd = function(e){
        e.preventDefault();

        // get form input from UI controller:
        const userInput = UICtrl.getItemInput();
        
        // check for name and calorie input:
        if(userInput.name !== "" && userInput.calories !== ""){
            console.log("test");
            // add item 
            newFoodItem = ItemCtrl.addItem(userInput.name, userInput.calories);            
            UICtrl.addListItem(newFoodItem);

            // clear the form input fields:
            UICtrl.clearInput();
        }
    }

    // Public return method:
    return{
        init: function(){
            console.log("Initialising app...");
            // get the food items from the getItems function and ddisplay in the UI when the app loads
            const items = ItemCtrl.getItems();

            // check if any items exist:
            if(items.length === 0){
                UICtrl.hideList();
            }else{       
                // populate UI list with items
                UICtrl.populateItemList(items);
            }
            
            // load event listeners:
            loadEventListeners();
        }
    };

    
})(ItemCtrl, UICtrl);

App.init();