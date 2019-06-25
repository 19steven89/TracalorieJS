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
        getItemById: function(id){
            let found = null;

            // loop through the items:
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        //return the data object created above so that it can be accessed from outside the function 
        logData: function(){
            return data;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories
            });

            // set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        setCurrentItem: function(item){
            // set the data.currItem to the item passed in, so that when an item is clicked, 
            //its that food item that can be edited
            data.currItem = item;
        },
        getCurrentFoodItem: function(){
            return data.currItem;
        },
        updateItem: function(name, calories){
            // convert cals to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item) => {
                if(item.id === data.currItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        }
    }   

    
})();

// UI controller IIFE
const UICtrl = (function(){
    console.log("UI controller...");

    //create an object which contains the itemList id name and addMealBtn classname, to make it more dynamic, rather than hard coding it in html
    const UIselectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addMealBtn: ".add-btn",
        updateButton: ".update-btn",
        deleteButton: ".delete-btn",
        backBtn: ".back-btn",
        foodItemName: "#item-name",
        foodCalories: "#item-calories",
        totalCals: ".total-calories"
    };

     // Public return method:
     return{
        populateItemList: function(items){
            let foodListItems = "";

            items.forEach((item) => {
                // add each food list item to the UI:
                foodListItems += `<li id="item-${item.id}" class="collection-item"><strong>${item.name}: </strong><em>${item.calories} Calories <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></em></li>`;
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
            li.innerHTML = `<strong>${newFoodItem.name}: </strong><em>${newFoodItem.calories} Calories<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></em>`;
            //add to the UI
            document.querySelector(UIselectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function(updatedItem){
            let listItems = document.querySelectorAll(UIselectors.listItems);
            // convert the listItems node list into an array so that a for each can be used on it:
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute("id");

                if(itemID === `item-${updatedItem.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${updatedItem.name}: </strong><em>${updatedItem.calories} Calories<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></em>`;
                }
            });


        },
        // return the list items 
        getSelectors: function(){
            return UIselectors;
        },
        clearInput: function(){
            document.querySelector(UIselectors.foodItemName).value = "";
            document.querySelector(UIselectors.foodCalories).value = "";
        },
        addItemToForm: function(){
            // add the food item the user clicks to edit to the text fields in the form so the user can edit them: 
            document.querySelector(UIselectors.foodItemName).value = ItemCtrl.getCurrentFoodItem().name;
            document.querySelector(UIselectors.foodCalories).value = ItemCtrl.getCurrentFoodItem().calories;
            UICtrl.showEditState();
        },
        //hide the list from showing if the list is empty
        hideList: function(){
            document.querySelector(UIselectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UIselectors.totalCals).textContent = totalCalories;
        },
        clearEditState: function(){
            // only show the addMealBtn to the user when in normal state
            UICtrl.clearInput();
            document.querySelector(UIselectors.updateButton).style.display = "none";
            document.querySelector(UIselectors.backBtn).style.display = "none";
            document.querySelector(UIselectors.deleteButton).style.display = "none";
            document.querySelector(UIselectors.addMealBtn).style.display = "inline";
        },
        showEditState: function(){
            // show the edit buttons such as update, back and delete to the user when in edit state
            document.querySelector(UIselectors.updateButton).style.display = "inline";
            document.querySelector(UIselectors.backBtn).style.display = "inline";
            document.querySelector(UIselectors.deleteButton).style.display = "inline";
            document.querySelector(UIselectors.addMealBtn).style.display = "none";
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

        document.addEventListener("keypress", function(e){
            // if user presses enter when in edit state, dont add the same meal item again
            if(e.keycode === 13 || e.which === 13){
                //disables the enter key when in edit state
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event, i.e event used when user clicks the pencil icon of a food item
        document.querySelector(UIselectors.itemList).addEventListener("click", itemEditClick);

        
        document.querySelector(UIselectors.updateButton).addEventListener("click", itemUpdateSubmit);

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

            // get total calories
            const totalCals = ItemCtrl.getTotalCalories();
            // add the total calories to the ui
            UICtrl.showTotalCalories(totalCals);

            // clear the form input fields:
            UICtrl.clearInput();
        }
    }

    // click edit item event function
    const itemEditClick = function(e){                      
        if(e.target.classList.contains("edit-item")){
            //get the list item id
            const listID = e.target.parentNode.parentNode.parentNode.id;

            //break ids into an array to get the numeric value for each list item. i.e: item-0, item-1...etc
            const listIDarray = listID.split("-");

            //get ID 
            const id = parseInt(listIDarray[1]);
        
            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        }        

        e.preventDefault();
    }

    const itemUpdateSubmit =  function(e){
        console.log("Update");
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updateditem = ItemCtrl.updateItem(input.name, input.calories);

        // update the UI with the new edited food item:
        UICtrl.updateListItem(updateditem);

         // get total calories
         const totalCals = ItemCtrl.getTotalCalories();
         // add the total calories to the ui
         UICtrl.showTotalCalories(totalCals);

         UICtrl.clearEditState();

        e.preventDefault();
    }

    // Public return method:
    return{
        init: function(){
            console.log("Initialising app...");
            //set initial state 
            UICtrl.clearEditState();

            // get the food items from the getItems function and ddisplay in the UI when the app loads
            const items = ItemCtrl.getItems();

            // check if any items exist:
            if(items.length === 0){
                UICtrl.hideList();
            }else{       
                // populate UI list with items
                UICtrl.populateItemList(items);
            }
            
             // get total calories
             const totalCals = ItemCtrl.getTotalCalories();
             // add the total calories to the ui
             UICtrl.showTotalCalories(totalCals);

            // load event listeners:
            loadEventListeners();
        }
    };

    
})(ItemCtrl, UICtrl);

App.init();