var drinksFB = new Firebase("https://shining-fire-3793.firebaseio.com/drinks");
console.log(drinksFB);

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
    var Drink = function(name, base, ingredients, instructions, votes, id){
      
      this.name = name;
      this.base = base;
      this.ingredients = ingredients;
      this.instructions = instructions;
      this.votes = votes || 0;
      console.log("THE ID:", id);
      this.id = id;
      console.log("This drink's ID:", this.id);

      // // Push to the database
      // var newFBdrink = drinksFB.push( {
      //       name          : this.name,
      //       base          : this.base,
      //       ingredients   : this.ingredients,
      //       instructions  : this.instructions,
      //       votes         : this.votes
      //   }
      // );

      
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

      this.$drinkEl = $('<div>');
      this.$drinkEl.addClass('drink')
              .attr('id', this.id);

      var ratingEl = $('<div>')
              .addClass('rating')
              .addClass('col-xs-2')
              .append('<span class="fui-triangle-up-small up"></span>')
              .append('<span class="votes">' + this.votes)
              .append('<span class="fui-triangle-down-small down"></span>');

      var nameEl = $('<div class="col-xs-10 drink-name">')
            .append('<a data-toggle="collapse" href="#collapse'+ this.id +'"><h4>' + this.name);

      var row = $('<div>')
            .addClass('row')
            .addClass('drink-header')
            .append(nameEl)
            .append(ratingEl);

      var ingreEls = $('<ul class="ingres">')
                  .append(_.map(this.ingredients, function(ingre){ return '<li>' + ingre; }) );      

      var collapse = $('<div class="instr collapse in" id="collapse'+ this.id +'">')
                    .append(ingreEls)
                    .append('<p class="instr">' + this.instructions);

      this.$drinkEl.append(row)
              .append(collapse);

      return this.$drinkEl;
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
              .append('<span class="votes">' + this.votes)
              .append('<span class="fui-triangle-down-small down"></span>');

      var nameEl = $('<div class="col-xs-10 drink-name">')
            .append('<a data-toggle="collapse" href="#collapse'+ this.id +'"><h4>' + this.name);

      var ingreEls = $('<ul class="ingres">')
                  .append(_.map(this.ingredients, function(ingre){ return '<li>' + ingre; }) );

      var row = $('<div>')
            .addClass('row')
            .addClass('drink-header')
            .append(nameEl)
            .append(ratingEl);

      var collapse = $('<div class="instr collapse" id="collapse'+ this.id +'">')
                    .append(ingreEls)
                    .append('<p class="instr">' + this.instructions);

      this.$drinkEl.append(row)
              .append(collapse);

      return this.$drinkEl;
    };

    /**
     * Create an accordioned drink DOM element with missing ingredients indication
     * @return {jQuery DOM el}     Drink DOM element, accordioned
     */
    Drink.prototype.createCollapsedMissing = function(){

      this.$drinkEl = $('<div>');
      this.$drinkEl.addClass('drink')
             .attr('id', this.id);

      var ratingEl = $('<div>')
              .addClass('rating')
              .addClass('col-xs-2')
              .append('<span class="fui-triangle-up-small up"></span>')
              .append('<span class="votes">' + this.votes)
              .append('<span class="fui-triangle-down-small down"></span>');

      var missingEl = $('<div>')
              .addClass('missing')
              .addClass('col-xs-1')
              .append('<span>+' + this.missing);

      var nameEl = $('<div class="col-xs-9 drink-name">')
            .append('<a data-toggle="collapse" href="#collapse'+ this.id +'"><h4>' + this.name);

      var row = $('<div>')
            .addClass('row')
            .addClass('drink-header')
            .append(missingEl)
            .append(nameEl)
            .append(ratingEl);

      var ingreEls = $('<ul class="ingres">')
                  .append(_.map(this.ingredients, function(ingre){ return '<li>' + ingre; }) );      

      var collapse = $('<div class="instr collapse col-xs-offset-1" id="collapse'+ this.id +'">')
                    .append(ingreEls)
                    .append('<p class="instr">' + this.instructions);

      this.$drinkEl.append(row)
              .append(collapse);

      return this.$drinkEl;
    };

    Drink.prototype.setMissing = function(missing){
      this.missing = missing;
    };


    /**
     * Drink rate method for changing votes 
     * @param  {number} delta         1 or -1 vote 
     */
    Drink.prototype.rate = function(delta){
      
      this.votes += Number(delta);
      console.log(this);
      drinksFB.child(this.id).update({ "votes" : this.votes }, function(error){
        if (error) {
          console.log("Something went wrong");
        }
        else {
          console.log("All went well");
        }
      });
      
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
    Cabinet.prototype.addDrink = function(name, base, ingredients, instructions, votes, id){

      // Add drink to the cabinet
      var newDrink = new Drink(name, base, ingredients, instructions, votes, id);
      this.drinks.push(newDrink);

      // Update the master list of ingredients
      _.union(this.ingredients, ingredients);
    };

    /**
     * Add an ingredient to the search criteria
     */
    Cabinet.prototype.addSearchItem = function(item){
      this.searchCriteria.push(item);
    };

    /**
     * Remove an ingredient from the search criteria
     * @param  {string} item        Ingredient to be removed
     */
    Cabinet.prototype.removeSearchItem = function(item){
      this.searchCriteria = _.filter(this.searchCriteria, function(ingre){
        return ingre !== item;
      })
    };

    /**
     * Reset search criteria
     */
    Cabinet.prototype.clearSearchItems = function(){
      this.searchCriteria = [];
    };

    /**
     * Create list of drinks from the cabinet per search filter
     * @return {jquery DOM}           array of jQuery DOM elements 
     */
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
      });

      matchedDrinks = _sortByVotes(matchedDrinks);

      return _.map(matchedDrinks,function(drink){
        return drink.createCollapsed();
      })      
    };

    /**
     * Create list of drinks from the cabinet that are missing ingredients per the search filter
     * @return {jquery DOM}           array of jQuery DOM elements 
     */
    Cabinet.prototype.createByMissingItems = function(){

      var missedDrinks = []
      var cabinet = this;

      _.each(this.drinks, function(drink){
        // 1. Get intersection of drink and ingredients
        var commonIngre = _.intersection(cabinet.searchCriteria, drink.ingredients);
        
        // 2. Drink - intersection = missing amount
        if (commonIngre.length < drink.ingredients.length) {
          drink.setMissing(drink.ingredients.length - commonIngre.length)
          missedDrinks.push(drink);
        }
      });

      // Sort the drinks by votes, and then by least number of missing items
      missedDrinks = _sortByVotes(missedDrinks);
      missedDrinks = _.sortBy(missedDrinks, function(drink){
        return drink.missing;
      })

      missedDrinks = _.map(missedDrinks, function(drink){
        return drink.createCollapsedMissing();
      })

      return missedDrinks;
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

    Cabinet.prototype.autoFBLoad = function(){
      var cabinet = this;
      drinksFB.on("child_added", function(snapshot){
        console.log(typeof snapshot.key());
        return cabinet.addDrink(snapshot.val().name, 
                                snapshot.val().base, 
                                snapshot.val().ingredients, 
                                snapshot.val().instructions, 
                                snapshot.val().votes, 
                                snapshot.key());
        
      })

      console.log()

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


    /**
     * Create an uncollapsed DOM element of the first element in the drinks array
     * @return {[type]} [description]
     */
    Cabinet.prototype.featureFirst = function(){
      return _.first(this.drinks).create();
    };

    /**
     * Create the 2nd to nth items of the drinks array as collapsed DOM elements
     * @return {[type]} [description]
     */
    Cabinet.prototype.createRemainder = function(){
      return _.map(_.rest(this.drinks),function(drink){
        return drink.createCollapsed();
      });
    };

    /**
     * Create collapsed DOM elements of all drinks
     * @return {[type]} [description]
     */
    Cabinet.prototype.create = function(){
      return _.map(this.drinks,function(drink){
        return drink.createCollapsed();
      });
    };

    /**
     * Get a list of unique ingredients used by all drinks in the cabinet
     * @return {array}                Array of all ingredients
     */
    Cabinet.prototype.getIngredients = function(){
      return _.chain(this.drinks).pluck("ingredients").flatten().uniq().value();
    };

    Cabinet.prototype.createCommonTags = function(n){
      var allIngredients = _.chain(this.drinks)
                            .pluck("ingredients")
                            .flatten()
                            .countBy()
                            .pairs()
                            .sortBy(1)
                            .reverse()
                            .first(n)
                            .value();
      var header = $('<h5>Common Ingredients');

      return _.map(allIngredients, function(ingre){
        var ingreEl = $('<span>')
              .addClass('common-ingre')
              .addClass('tag')
              .append('<span class="ingre-name">' + ingre[0] + '</span>' + ' (' + ingre[1] + ')' + '<span class="add">');
        return ingreEl;
      })

    };

    // Helper function to sort drink arrays by votes
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
myCabinet.autoFBLoad();


$(document).on('ready', function() {

  ///////////////////
  // RATING SYSTEM //
  ///////////////////
  
  $('body').on('click','.up', function(){
    var drinkID = $(this).closest('.drink').attr('id');
    var votesEl = $(this).siblings('.votes');
    var drink = _.find(myCabinet.drinks, function(drink){
      return drink.id === drinkID;
    });
    
    //Rate the drink
    drink.rate(1);

    //Update the DOM element
    votesEl.html(drink.votes);
  });

  $('body').on('click','.down', function(){
    var drinkID = $(this).closest('.drink').attr('id');
    var votesEl = $(this).siblings('.votes');
    var drink = _.find(myCabinet.drinks, function(drink){
      return drink.id === drinkID;
    });
    
    //Rate the drink
    drink.rate(-1);

    //Update the DOM element
    votesEl.html(drink.votes);
  });

  //////////
  // HOME //
  //////////

  var $jumbotron = $('.jumbotron').clone();

  /**
   * Go back home
   */
  $('.navbar-brand').on('click',function(){
    $('.main').empty()
              .append($jumbotron);

    $('.nav').children().removeClass('active');
  });

  /////////////
  // BY BASE //
  /////////////

  /**
   * Render mix by base "view"
   */
  $('body').on('click','.by-base', function(){
    
    $('.main').empty()
              .append(myCabinet.basesView());

    // Adjust navigation link
    $('#by-base').parent().addClass('active').siblings().removeClass('active');
  });


  /**
   * Render drinks by base
   */
  _.each(_.chain(myCabinet.drinks).pluck("base").uniq().value(),function(base){

    $('body').on('click','#'+base, function(){

      $('.main').empty()
                .append(myCabinet.createByBase(base));
    });
  });    

  /////////////////////
  // BY INGREDIENTS //
  ////////////////////
  


  // Initialise Bloodhound for typeahead
  var ingredientsList = new Bloodhound({
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.word); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 4,
    local: _.map(myCabinet.getIngredients(), function(ingredient) { return {word : ingredient}; })
   });  
  ingredientsList.initialize();


  var $alert = $('.alert').clone().removeClass('invisible');

  /**
   * Build mix by ingredient "view"
   */
  $('body').on('click','.by-ingre',function(){

    // Reset search criteria
    var $search = $('.search-wrapper').clone().removeClass('invisible');
    // Initialise typeahead
    $search.find('#ingredient-search').typeahead(null, {
      name: 'ingredientsList',
      displayKey: 'word',
      source: ingredientsList.ttAdapter()
    });

    $('.main').empty()
              .append($search);

    myCabinet.clearSearchItems();
    $('.search-criteria').empty();
    $('.results').empty();


    // Render common ingredients
    $('.common-tags-wrapper').empty().append('<h5>Common Ingredients').append(myCabinet.createCommonTags(5));

    // Adjust navigation link
    $('#by-ingre').parent().addClass('active').siblings().removeClass('active');

  });

  /**
   * Add ingredient criteria from search bar
   */
  $('body').on('click','.btn-add',function(e){
    var ingre = $('#ingredient-search').val();
    console.log("IS.val():",ingre);
    e.preventDefault();

    // Check if ingre is in the cabinet already
    if (_.contains(myCabinet.searchCriteria,ingre)){
      $('.warnings').append($alert);
    }
    else{
      myCabinet.addSearchItem(ingre);
      console.log("Search criteria:", myCabinet.searchCriteria);
      var ingreEl = $('<span>')
                    .addClass('ingre')
                    .addClass('tag')
                    .append(ingre + '<span class="remove">');

      $('.search-criteria').append(ingreEl);
      $('#ingredient-search').val("");
      $('.results').empty()
                  .append(myCabinet.createBySearchItems())
                  .append(myCabinet.createByMissingItems());
    }    
  });

  
  /**
   * Add ingredient criteria from common ingredients list
   */
  $('body').on('click','.common-ingre',function(){

    var ingre = $(this).find('.ingre-name').text();
    
    // Check if ingre is in the cabinet already
    if (_.contains(myCabinet.searchCriteria,ingre)){
      $('.warnings').append($alert);
    }
    else{
      // Add the item to the search
      myCabinet.addSearchItem(ingre);

      var ingreEl = $('<span>')
                    .addClass('ingre')
                    .addClass('tag')
                    .append(ingre + '<span class="remove">');

      $('.search-criteria').append(ingreEl);

      // Remove the tag from the list
      $(this).remove();

      // Update the results
      $('.results').empty()
                  .append(myCabinet.createBySearchItems())
                  .append(myCabinet.createByMissingItems());
    }  
  });


  // Remove ingredient criteria
  $('body').on('click','.remove',function(){
    var ingre = $(this).closest('.ingre').text();
    var ingreEl = $(this).closest('.tag');

    ingreEl.remove();

    myCabinet.removeSearchItem(ingre);
    

    $('.results').empty()
                .append(myCabinet.createBySearchItems())
                .append(myCabinet.createByMissingItems());
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