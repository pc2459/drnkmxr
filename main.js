var DrnkMxr = (function(){

  /////////////////
  // DRINK CLASS //
  /////////////////

  var Drink = (function(){

    /**
     * Drink class constructor
     * @param {string} name           Name of drink
     * @param {string} base           Drink base liquor
     * @param {array} ingredients     Array of ingredients
     * @param {string} instructions   Full-text instructions
     * @param {number} votes          Votes
     */
    var Drink = function(name, base, ingredients, instructions, votes){
      
      this.name = name;
      this.base = base;
      this.ingredients = ingredients;
      this.instructions = instructions;
      this.votes = votes || 0;
    };


    /**
     * Return string describing name and base of a drink
     */
    Drink.prototype.toString = function(){

      return this.name + " (" + this.base + ")";
    };

    Drink.prototype.create = function(){

      var drinkEl = $('<div>');
      drinkEl.addClass('drink')
              .append('<h2>' + this.name)
              .append('<p class="instr">' + this.instructions);

      return drinkEl;
    };


    /**
     * Drink rate method for changing votes 
     * @param  {number} delta         +1 or -1 vote 
     */
    Drink.prototype.rate = function(delta){
      
      this.votes += Number(delta);
    };

    return Drink;

  })(); //end Drink


  ///////////////////
  // CABINET CLASS //
  ///////////////////

  var Cabinet = (function(){

    /**
     * Cabinet class constructor
     */
    var Cabinet = function(){      
      this.drinks = [];
      this.ingredients = [];

    };

    /**
     * Add a drink to a cabinet
     * @param {string} name           Name of drink
     * @param {string} base           Drink base liquor
     * @param {array} ingredients     Array of ingredients
     * @param {string} instructions   Full-text instructions
     * @param {number} votes          Votes
     */
    Cabinet.prototype.addDrink = function(name, base, ingredients, instructions, votes){

      // Add drink to the cabinet
      var newDrink = new Drink(name, base, ingredients, instructions, votes);
      this.drinks.push(newDrink);

      // Update the master list of ingredients
      _.union(this.ingredients, ingredients);
    };

    /**
     * Cabinet toString method
     * @return {string}               List of drinks with their bases
     */
    Cabinet.prototype.toString = function(){
      return  _.map(this.drinks, function(drink){ return drink.toString(); }).join("\n");
    };

    /**
     * Load in a series of drinks from a properly-defined array of objects
     * @param  {array} array         Array of drink objects
     */
    Cabinet.prototype.autoLoad = function(array){
      var cabinet = this;
      _.each(array, function(drinkObj){
       return cabinet.addDrink(drinkObj.name, drinkObj.base, drinkObj.ingredients, drinkObj.instructions, drinkObj.votes);
      });
    };

    Cabinet.prototype.create = function(){

      var drinkEls = _.map(this.drinks,function(drink){
        return drink.create();
      });

      return drinkEls;

    };




    return Cabinet;


  })(); //end Cabinet



  /////////////////////////////////
  // Return all the constructors //
  /////////////////////////////////

  var DrnkMxr = {
    Drink   : Drink,
    Cabinet : Cabinet
  };

  return DrnkMxr;

})();

var myCabinet = new DrnkMxr.Cabinet();

myCabinet.autoLoad(drinksList);

console.log(myCabinet.toString());



$(document).on('ready', function() {

  var $jumbotron = $('.jumbotron').clone();

  // Go back home
  $('.navbar-brand').on('click',function(){
    $('.main').empty()
              .append($jumbotron);

  $('.nav').children().removeClass('active');


  });

  // Get top drinks
  $('body').on('click','.top-drinks',function(){
    console.log("Clicked on top drinks");
    
    $('.main').empty()
              .append(myCabinet.create());

    $('#top-drinks').parent().addClass('active').siblings().removeClass('active');

  });
  
});