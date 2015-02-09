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
      this.id = _.uniqueId();
    };


    /**
     * Return string describing name and base of a drink
     */
    Drink.prototype.toString = function(){

      return this.name + " (" + this.base + ")";
    };

    Drink.prototype.create = function(){

      var drinkEl = $('<div>');
      drinkEl.addClass('drink');

      var ratingEl = $('<div>')
              .addClass('rating')
              .addClass('col-xs-2')
              .append('<span class="fui-triangle-up-small up"></span>')
              .append(this.votes)
              .append('<span class="fui-triangle-down-small down"></span>');

      var nameEl = $('<div class="col-xs-10 drink-name">')
            .append('<h2>' + this.name);

      var row = $('<div>')
            .addClass('row')
            .addClass('drink-header')
            .append(nameEl)
            .append(ratingEl);

      drinkEl.append(row)
              .append('<p class="instr">' + this.instructions);

      return drinkEl;
    };


    Drink.prototype.createCollapsed = function(){

      var drinkEl = $('<div>');
      drinkEl.addClass('drink');

      var ratingEl = $('<div>')
              .addClass('rating')
              .addClass('col-xs-2')
              .append('<span class="fui-triangle-up-small up"></span>')
              .append(this.votes)
              .append('<span class="fui-triangle-down-small down"></span>');

      var nameEl = $('<div class="col-xs-10 drink-name">')
            .append('<a data-toggle="collapse" href="#collapse'+ this.id +'"><h2>' + this.name);

      var row = $('<div>')
            .addClass('row')
            .addClass('drink-header')
            .append(nameEl)
            .append(ratingEl);

      drinkEl.append(row)
              .append('<p class="instr collapse" id="collapse'+ this.id +'">' + this.instructions);

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
     * Sort a cabinet based on a property and direction
     * @param  {string} property      name, base, votes
     * @param  {string} direction     asc or desc; defaults to desc if no arg given
     * @return {array}                sorted drinks array
     */
    Cabinet.prototype.sortBy = function(property, direction){
      if (direction && direction.toLowerCase() === "asc"){
        return  _.sortBy(this.drinks, function(drink){
                return drink[property];
              });
      } 
      else {
        return _.sortBy(this.drinks, function(drink){
          return -(drink[property]);
        });
      }
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

    Cabinet.prototype.basesView = function(){
      // Get array of unique bases from all the drinks in the cabinet
      var allBases = _.pluck(this.drinks, "base");

      var uniqueBases = _.uniq(allBases);

      var countedBases = _.countBy(allBases);

      return _.map(uniqueBases,function(base){
          //for each base...
          var wrapper = $('<div>')
                .addClass('option')
                .addClass('col-sm-6');
          var inner = $('<a href="#" id="'+ base +'">')
                .addClass('btn-circle')
                .append(base)
                .append(' (' + countedBases[base] + ')');

          return wrapper.append(inner);

      });
    };

    Cabinet.prototype.createByBase = function(base){
      // Get all drinks of a certain base
      var baseDrinks = _.filter(this.drinks, function(drink){
        return drink.base === base;
      });

      return _.map(baseDrinks, function(drink){
        return drink.createCollapsed();
      });


    };

    Cabinet.prototype.create = function(){

      var drinkEls = _.map(this.drinks,function(drink){
        return drink.createCollapsed();
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

// console.log(myCabinet.toString());



$(document).on('ready', function() {

  var $jumbotron = $('.jumbotron').clone();

  // Go back home
  $('.navbar-brand').on('click',function(){
    $('.main').empty()
              .append($jumbotron);

  $('.nav').children().removeClass('active');


  });

  // Get drinks by base 
  $('body').on('click','.by-base', function(){
    console.log("Clicked on by base");
    
    $('.main').empty()
              .append(myCabinet.basesView());

    // Adjust navigation link
    $('#by-base').parent().addClass('active').siblings().removeClass('active');
  });


  // Render each base list
  _.each(_.chain(myCabinet.drinks).pluck("base").uniq().value(),function(base){

    $('body').on('click','#'+base, function(){
      console.log("This can't have worked");

      $('.main').empty()
                .append(myCabinet.createByBase(base));


    });

  });           



  // Get top drinks
  $('body').on('click','.top-drinks',function(){
    console.log("Clicked on top drinks");

    myCabinet.drinks = myCabinet.sortBy("votes");
    
    $('.main').empty()
              .append(myCabinet.create());

    // Adjust navigation link
    $('#top-drinks').parent().addClass('active').siblings().removeClass('active');

  });
  
});