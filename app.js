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
            {id: 0, name: "Steak Dinner", calories: 900},
            {id: 1, name: "Cookie", calories: 350},
            {id: 2, name: "Milkshake", calories: 450},
        ],
        currItem: null,
        totalCalories: 0
    };

    return {
        getItems: function(){
            return data.items;
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

    //create an object which contains the itemList id name, to make it more dynamic, rather than hard coding it in html
    const UIselectors = {
        itemList: "#item-list"
    };

     // Public return method:
     return{
        populateItemList: function(items){
            let html = "";

            items.forEach((item) => {
                // add each food list item to the UI:
                html += `<li id="item-${item.id}" class="edit-item collection-item"><strong>${item.name}: </strong><em>${item.calories} Calories <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a></em></li>`;
            });

            //insert list items to UI
            document.querySelector(UIselectors.itemList).innerHTML = html;
        }
     };
    
})();

// app controller IIFE. Used to initiate the app by first getting the items then adding them to the UI
const App = (function(itemCtrl, uICtrl){
    console.log("app controller...");

    // Public return method:
    return{
        init: function(){
            console.log("Initialising app...");
            // get the food items from the getItems function and ddisplay in the UI when the app loads
            const items = ItemCtrl.getItems();
            
            // populate UI list with items
            UICtrl.populateItemList(items);
            
        }   
    }

    
})(ItemCtrl, UICtrl);

App.init();