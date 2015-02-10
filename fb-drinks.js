var FBdrinksList = fbRef.child("drinks");

FBdrinksList.push({
  
  Manhattan : {
    base : "whiskey",
    ingredients : [ "whiskey",
                    "vermouth",
                    "bitters"
                  ],
    instructions : "Place ice in a cocktail shaker. Add 2 parts whiskey to 1 part vermouth and 2 dashes of bitters. Rub orange peel around rim of the cocktail glass. Strain the drink into the glass. Add 1 to 2 maraschino cherries.",
    votes : 10
  } });

FBdrinksList.push({
  "Old Fashioned" : {
    base : "whiskey",
    ingredients : [ "whiskey",
                    "sugar",
                    "bitters"
                  ],
    instructions : "Place 1 teaspoon sugar in an old fashioned glass. Douse with bitters, add a few drops of water and stir until sugar is dissolved. Add 2 oz whiskey, stir. Add ice cubes. ",
    votes : 20
  } });

  FBdrinksList.push({
  Martinez :
  {
    base : "gin",
    ingredients : [ "gin",
                    "vermouth",
                    "maraschino liqueur",
                    "bitters"
                  ],
    instructions : "Place ice in cocktail shaker. Add 1 part gin to 1 part sweet vermouth, half part maraschino liquer, and 2 dashes orange bitters. Rub the lemon peel around rim of cocktail glass. Strain drink into the glass.",
    votes : 0
  } });

  FBdrinksList.push({
  Martini :
  {
    base : "gin",
    ingredients : [ "gin",
                    "vermouth",
                    "bitters"
                  ],
    instructions : "Place ice in cocktail shaker. Add 2 parts gin to 1 part dry vermouth and a dash of orange bitters. Strain drink into cocktail glass.",
    votes : 40
  } });

  FBdrinksList.push({
  Brooklyn :
  {
    base : "whiskey",
    ingredients : [ "whiskey",
                    "vermouth",
                    "maraschino liqueur",
                    "bitters"
                  ],
    instructions : "Place ice in cocktail shaker. Add 2 parts whiskey to 1 part dry vermouth, a quarter part maraschino liqueur, and a few dashes of orange or Angostura bitters. Strain drink into cocktail glass.",
    votes : 40
  } });

  FBdrinksList.push({
  Daiquiri :
  {
    base : "rum",
    ingredients : [ "rum",
                    "lime juice",
                    "sugar"
                  ],
    instructions : "Pour 1 teaspoon sugar and 3/4 oz lime juice into cocktail shaker and stir until sugar is dissolved. Add 2 oz rum and shake well. Strain drink into cocktail glass.",
    votes : 50
  } });

  FBdrinksList.push({
  Magarita :
  {
    base : "tequila",
    ingredients : [ "tequila",
                    "lime juice",
                    "lemon juice",
                    "triple sec",
                    "simple syrup"
                  ],
    instructions : "Combine 3/4 cup lemon juice, 3/4 cup lime juice, 3 1/2 cup tequila, 2 cups triple sec, 1/2 cup simple syrup and 2 quarts of ice cubes in a large pitcher. Serve in salt-rimmed glasses filled with ice. Makes 10.",
    votes : 10
  } });

  FBdrinksList.push({
  Sidecar :
  {
    base : "brandy",
    ingredients : [ "brandy",
                    "Cointreau",
                    "lemon juice"
                  ],
    instructions : "Combine 2 parts brandy, 1 part Cointreau, 3/4 parts lemon juice in a cocktail shaker and fill with ice. Shake well. Strain into glass.",
    votes : 100
  } });

  FBdrinksList.push({
  "French 75" :
  {
    base : "gin",
    ingredients : [ "gin",
                    "sugar",
                    "lemon juice",
                    "champagne"
                  ],
    instructions : "Fill cocktail shaker with ice. Shake 2 oz gin, 1 oz lemon juice, 2 teaspoons sugar in shaker until well-chilled. Strain into champagne flute. Top with champagne.",
    votes : 70
  } });

  FBdrinksList.push({
  Negroni :
  {
    base : "gin",
    ingredients : [ "gin",
                    "Campari",
                    "vermouth"
                  ],
    instructions : "Combine 1 part gin to 1 part Campari to 1 part sweet vermouth in a cocktail shaker filled with ice. Strain into a cocktail glass. ",
    votes : 50
  } });

  FBdrinksList.push({
  Sazerac :
  {
    base : "whiskey",
    ingredients : [ "whiskey",
                    "absinthe",
                    "bitters",
                    "sugar"
                  ],
    instructions : "Combine 1 teaspoon sugar, 3 dashes bitters, and a few drops of water in a cocktail shaker until sugar is dissolved. Add whiskey and plenty of ice. Stir. Pour 1 teaspoon absinthe into a cocktail glass, coat the sides, discard excess. Strain drink into the glass. Garnish with lemon peel.",
    votes : 60
  } });

  FBdrinksList.push({
  "Gin Fizz" :
  {
    base : "gin",
    ingredients : [ "gin",
                    "cream",
                    "egg white",
                    "lemon juice",
                    "lime juice",
                    "sugar",
                    "orange flower water",
                    "seltzer"
                  ],
    instructions : "Combine 2 oz gin, 1 oz cream, 1 egg white, 1/2 oz each lemon and lime juice, 2 teaspoons sugar, and 2-3 drops orange flower water in a cocktail shaker filled with ice. Shake hard for two minutes until foamy. Strain into a Collins glass and top with seltzer to taste.",
    votes : 20
  } });

  FBdrinksList.push({
  "Mint Julep" : 
  {
    base : "bourbon",
    ingredients : [ "bourbon",
                    "sugar",
                    "mint"
                  ],
    instructions : "Place 1 teaspoon sugar and 1 teaspoon water at bottom of a tall glass and stir until sugar is dissolve. Add 10 mint leaves and muddle, taking care not to overwork the leaves. Half-fill the glass with crushed ice. Add 2-3 oz bourbon. Add more crushed ice if needed to fill.",
    votes : 30
  } });

  FBdrinksList.push({
  "Mai Tai" :
  {
    base : "rum",
    ingredients : [ "rum",
                    "lime juice",
                    "curacao",
                    "orgeat",
                    "simple syrup"
                  ],
    instructions : "Pour 2 oz rum, 1 oz lime juice, 1/2 oz curacao, 1/4 oz orgeat, and 1/4 oz simple syrup into a cocktail shaker filled with ice. Shake well and strain into a double Old Fashioned glass filled with crushed ice. Garnish with mint.",
    votes : 0
  } });
