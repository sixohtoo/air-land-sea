/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * airlandseaelliotr implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * airlandseaelliotr.js
 *
 * airlandseaelliotr user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.airlandseaelliotr", ebg.core.gamegui, {
        constructor: function(){
            console.log('airlandseaelliotr constructor');
            this.cardwidth = 72;
            this.cardheight = 96;
            this.cardsInRow = 6;

            this.colorToRow = {
                'Face-Down': 0,
                'Air': 1,
                'Land': 2,
                'Sea': 3,
            }
            this.rowToColor = {
                '0': 'Face-Down',
                '1': 'Air',
                '2': 'Land',
                '3': 'Sea',
            }
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );
            console.log(gamedatas.order)
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            this.player_id = gamedatas.player_ids[0];
            // TODO: Set up your game interface here, according to "gamedatas"
 
            this.playerHand = new ebg.stock();
            this.playerHand.create(this, $('myhand'), this.cardwidth, this.cardheight);
            this.playerHand.image_items_per_row = 6;

            // create cards types
            // Air, Land, Sea
            for (let color = 1; color <= 3; color++) {
                for (let value = 1; value <= 6; value++) {
                    let card_type_id = this.getCardId(color, value);
                    this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.png', card_type_id);
                }
            }

            // debugger;
            for (let i in gamedatas.hand) {
                let card = gamedatas.hand[i];
                // let color = card.type;
                let color = this.rowToColor[card.type];
                let value = card.type_arg;
                let id = this.getCardUniqueId(color, value)
                this.playerHand.addToStockWithId(id, card.id);
            }

            this.table = {}
            for (let theatre in gamedatas.table) {
                this.table[theatre] = {}
                let players = gamedatas.table[theatre];
                for (let player in players) {
                    this.table[theatre][player] = []
                    let cards = players[player];
                    for (let i in cards) {
                        let card = cards[i];
                        this.playCardOnTable(theatre, card.type, card.type_arg, player)
                        // add_card()
                    }
                }
            }

            // let table = gamedatas.table;
            // for (let theatre in table) {
            //     for (let card in theatre) {
            //         let color = card.type;
            //         let value = card.type_arg;
            //         let player_id = card.location_arg;
            //         this.playCardOnTable(player_id, color, value, theatre, card.id)
            //     }
            // }
            // this.playerHand.addToStockWithId(this.getCardUniqueId(2, 3), 10)
            // this.playerHand.addToStockWithId(this.getCardUniqueId(3, 1), 1)

            dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged');
 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */
       // Get card unique identifier based on its color and value

        // color is an int this time
        getCardId: function(color, value) {
            return color * 6 + (value - 1);
        },

        getCardUniqueId : function(color, value) {
            return this.getRowFromColor(color) * 6 + (value - 1);
        },

        getCardFromUniqueId : function(id) {
            // note if id is 0, things go bad. pls dont do.
            let color = this.rowToColor[Math.floor(id / this.cardsInRow)]
            let number = id % this.cardsInRow + 1
            return {color, number}
        },

        getRowFromColor : function(color) {
            return this.colorToRow[color]
        },

        addCardToPlayer: function (theatre, color, number, playerId, divid) {
            
            // let mode = 'only';
            // debugger;
            const cards = this.table[theatre][playerId];
            // debugger;
            // make every card already placed in target theatre stacked
            for (let i in cards) {
                let target = cards[i];
                let cardDiv = $('theatre_cards_' + target.divid);
                if (!cardDiv.classList.contains('stacked')) {
                    cardDiv.classList.add('stacked')
                }
            }

            const card = {
                color, 
                number,
                id: this.getCardUniqueId(color, number),
                isFlipped: false,
                divid
            }
            // card = parseInt(card);
            // array_push(cards, card);
            cards.push(card);

            // 1 -> 0
            // 2 -> 20
            // 3 -> 40
            // 4 -> 60
            let to = 'theatre_cards_' + theatre + '_' + playerId;
            dojo.place(this.format_block('jstpl_placed_card', {
                y: this.colorToRow[card.color] * 33.33,
                x: (card.number - 1) * 20,
                z: cards.length, // TODO: Change when can remove cards
                CARD_ID: divid
                // CARD_ID: card.id
            }), to, 'last');


            // Opponent placed card
            if (playerId != this.player_id) {
                this.placeOnObject('theatre_cards_' + card.id, 'overall_player_board_' + playerId);
            }
            else {
                // TODO may need ot check if card came from hand for Land1s
                // this.placeOnObject('theatre_cards_' + card.id, 'myhand_item_' + divid)
                // debugger;
                this.placeOnObject('theatre_cards_' + divid, 'myhand_item_' + divid)
                this.playerHand.removeFromStockById(divid)
            }

            this.slideToObject('theatre_cards_' + divid, to).play()
            // this.slideToObject('theatre_cards_' + card.id, to).play()

        },


        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */

        onPlayerHandSelectionChanged: function() {
            // console.log('in hanging hands funciton');
            let items = this.playerHand.getSelectedItems();

            if (items.length > 0) {
                if (this.checkAction('playCard', true)) {
                    // can play a card
                    let card_id = items[0].id;
                    console.log(("on playCard " + card_id));
                    var id = items[0].type;
                    let {color, number} = this.getCardFromUniqueId(id)

                    debugger;
                    this.addCardToPlayer(color, color, number, this.player_id, card_id)
                    // addCardToPlayer: function (theatre, color, number, playerId) {
                    
                    // this.playCardOnTable(color, color, number, player)

                }
                else {
                    console.log('wot')
                }
                this.playerHand.unselectAll();
            }
        },
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/airlandseaelliotr/airlandseaelliotr/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your airlandseaelliotr.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
