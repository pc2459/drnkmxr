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


    /**
     * Create a drink DOM element, without accordioning.
     * @return {jQuery DOM el}      Drink DOM element
     */
    Drink.prototype.create = function(){

      var drinkEl = $('<div>');
      drinkEl.addClass('drink')
              .attr('id', this.id);

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


    /**
     * Create an accordioned drink DOM element
     * @return {jQuery DOM el}     Drink DOM element, accordioned
     */
    Drink.prototype.createCollapsed = function(){

      this.$drinkEl = $('<div>');
      this.$drinkEl.addClass('drink')
             .attr('id', this.id);

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

      this.$drinkEl.append(row)
              .append('<p class="instr collapse" id="collapse'+ this.id +'">' + this.instructions);

      return this.$drinkEl;
    };


    /**
     * Drink rate method for changing votes 
     * @param  {number} delta         1 or -1 vote 
     */
    Drink.prototype.rate = function(delta){
      
      this.votes += Number(delta);
      this.$drinkEl = this.createCollapsed();
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
      this.searchCriteria = [];

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

    Cabinet.prototype.addSearchItem = function(item){
      this.searchCriteria.push(item);
    };

    Cabinet.prototype.removeSearchItem = function(item){
      this.searchCriteria = _.filter(this.searchCriteria, function(ingre){
        return ingre !== item;
      })
    };

    Cabinet.prototype.clearSearchItems = function(){
      this.searchCriteria = [];
    };

    Cabinet.prototype.createBySearchItems = function(){

      // Filter down to a list of drinks whose ingredients list is a subset of the 
      // search criteria
      
      var matchedDrinks = [];
      var cabinet = this;
      
      _.each(this.drinks, function(drink){

        // 1. Get intersection of the two arrays
        var commonIngre = _.intersection(cabinet.searchCriteria, drink.ingredients);
        // 2. If the common ingredients are the same length as the drink,
        // then the drink is a subset
        if (commonIngre.length === drink.ingredients.length) {
          matchedDrinks.push(drink);
        }
      })

      matchedDrinks = _sortByVotes(matchedDrinks);

      return _.map(matchedDrinks,function(drink){
        return drink.createCollapsed();
      })      


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


    /**
     * Create bases "view" as a DOM element
     * @return {jQuery DOM el}         Bases view DOM element
     */
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

    /**
     * Render a cabinet filtered according to a given base
     * @param  {string} base          Base alcohol to filter by
     * @return {jQuery DOM el}        Cabinet DOM element
     */
    Cabinet.prototype.createByBase = function(base){
      // Get all drinks of a certain base
      var baseDrinks = _.filter(this.drinks, function(drink){
        return drink.base === base;
      });

      baseDrinks = _sortByVotes(baseDrinks);

      var featured = _.first(baseDrinks).create();
      var remainder =  _.map(_.rest(baseDrinks), function(drink){
        return drink.createCollapsed();
      });

      return featured.append(remainder);


    };



    Cabinet.prototype.featureFirst = function(){
      return _.first(this.drinks).create();
    };

    Cabinet.prototype.createRemainder = function(){
      var drinkEls = _.map(_.rest(this.drinks),function(drink){
        return drink.createCollapsed();
      });

      return drinkEls;
    };

    Cabinet.prototype.create = function(){

      var drinkEls = _.map(this.drinks,function(drink){
        return drink.createCollapsed();
      });

      return drinkEls;
    };

    Cabinet.prototype.getIngredients = function(){
      return _.chain(this.drinks).pluck("ingredients").flatten().uniq().value();
    };

    var _sortByVotes = function(array){
      return _.sortBy(array, function(drink){
        return -(drink.votes);
      })
    }

    return Cabinet;

  })(); //end Cabinet

  /////////////////////////////////
  // Return all the constructors //
  /////////////////////////////////

  var DrnkMxr = {
    Drink   : Drink,
    Cabinet : Cabinet,
    
  };

  return DrnkMxr;

})();

var myCabinet = new DrnkMxr.Cabinet();

myCabinet.autoLoad(drinksList);


$(document).on('ready', function() {

  ///////////////////
  // RATING SYSTEM //
  ///////////////////
  
  $('body').on('click','.up', function(){
    var drinkID = $(this).closest('.drink').attr('id');
    var drinkEl = $(this).closest('.drink');
    var drink = _.find(myCabinet.drinks, function(drink){
      return drink.id === drinkID;
    });
    
    //Rate the drink
    drink.rate(1);

    //Update the DOM element
    drinkEl.empty().append(drink.$drinkEl);

  });

  $('body').on('click','.down', function(){
    var drinkID = $(this).closest('.drink').attr('id');
    var drinkEl = $(this).closest('.drink');
    var drink = _.find(myCabinet.drinks, function(drink){
      return drink.id === drinkID;
    });
    
    //Rate the drink
    drink.rate(-1);

    //Update the DOM element
    drinkEl.empty().append(drink.$drinkEl);

  });


  //////////
  // HOME //
  //////////

  var $jumbotron = $('.jumbotron').clone();

  // Go back home
  $('.navbar-brand').on('click',function(){
    $('.main').empty()
              .append($jumbotron);

    $('.nav').children().removeClass('active');
  });

  /////////////
  // BY BASE //
  /////////////

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

  /////////////////////
  // BY INGREDIENTS //
  ////////////////////
  
  var $search = $('.search-wrapper').clone().removeClass('invisible');

  // Initialise Bloodhound for typeahead
  var ingredientsList = new Bloodhound({
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.word); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 4,
    local: _.map(myCabinet.getIngredients(), function(ingredient) { return {word : ingredient}; })
   });  
  ingredientsList.initialize();


  // Mix by ingredient view
  $('body').on('click','.by-ingre',function(){

    $('.main').empty()
              .append($search);

    // Initialise typeahead
    $('#ingredient-search').typeahead(null, {
      name: 'ingredientsList',
      displayKey: 'word',
      source: ingredientsList.ttAdapter()
    });

  });

  $alert = $('.alert').clone().removeClass('invisible');
  // Add ingredient criteria
  $('body').on('click','.btn-add',function(e){
    var ingre = $('#ingredient-search').val();
    e.preventDefault();

    // Check if ingre is in the cabinet already
    if (_.contains(myCabinet.searchCriteria,ingre)){
      $('.warnings').append($alert);
    }
    else{
      myCabinet.addSearchItem(ingre);

      var ingreLi = $('<span>')
                    .addClass('ingre')
                    .addClass('tag')
                    .append(ingre + '<span class="remove">');

      $('.search-criteria').append(ingreLi);
      $('#ingredient-search').val("");
      $('.results').empty()
                  .append(myCabinet.createBySearchItems());
    }    
  });

  // $('body').on('keyup','#ingredient-search', function(e){
  //   e.preventDefault();
  //   if (e.keyCode == 13 && $('#ingredient-search').val()){
  //     var ingre = $('#ingredient-search').val();
  //     myCabinet.addSearchItem(ingre);

  //     var ingreLi = $('<span>')
  //                   .addClass('ingre')
  //                   .addClass('tag')
  //                   .append(ingre + '<span class="remove">');

  //     $('.search-criteria').append(ingreLi);
  //     $('#ingredient-search').val("");
  //     $('.results').empty()
  //                 .append(myCabinet.createBySearchItems());
  //   }
  // })

  // Remove ingredient criteria
  $('body').on('click','.remove',function(){
    var ingre = $(this).closest('.ingre').text();
    var ingreEl = $(this).closest('.tag');

    ingreEl.remove();

    myCabinet.removeSearchItem(ingre);
    console.log("Search criteria:", myCabinet.searchCriteria);

  }); 
  

  ////////////////
  // TOP DRINKS //
  ////////////////

  // Get top drinks
  $('body').on('click','.top-drinks',function(){
    console.log("Clicked on top drinks");

    myCabinet.drinks = myCabinet.sortBy("votes");
    
    $('.main').empty()
              .append(myCabinet.featureFirst())
              .append(myCabinet.createRemainder());

    // Adjust navigation link
    $('#top-drinks').parent().addClass('active').siblings().removeClass('active');

  });
  
});