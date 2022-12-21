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
            this.playerHand.setSelectionMode(1) // only 1 card can be selected at a time

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
                        this.addCardToTheatre(theatre, card.type, card.type_arg, player, card.id, false)
                        // add_card()
                    }
                }
            }

            console.log(gamedatas.players)
            // console.log('here')
            // console.log($('.elliot'))
            let theatres = ['Air', 'Land', 'Sea']
            theatres.forEach(theatre => {
                // console.log($(`theatre_picture_${theatre}`))
                // $(`theatre_picture_${theatre}`).onclick = this.onClickTheatre
                $(`theatre_picture_${theatre}`).onclick = (e) => this.onClickTheatre(e)
                // console.log($(`theatre_cards_${theatre}_${this.player_id}`))
                $(`theatre_cards_${theatre}_${this.player_id}`).onclick = (e) => this.onClickTheatre(e)
                // $(`theatre_picture_${theatre}`).onclick = onClickTheatre

            })
            // debugger;
            // $('myhand').each(function() {
            //     console.log('jo')
            // })
            // $('div').each(function() {
            //     console.log('hello')
            // })

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
                console.log('in thingo state is', stateName)
                switch( stateName )
                {
                    case 'playerTurn':
                        this.addActionButton('playCardUp_button', _('Play face up'), 'playCardFaceUp');
                        this.addActionButton('playCardDown_button', _('Play face down'), 'playCardFaceDown');
                        this.addActionButton('cancel_button', _('Cancel'), 'cancelAction');
                        this.addActionButton('forfeit_button', _('Forfeit'), 'forfeitRound', null, false, 'red');
                        break;
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

        addCardToTheatre: function (theatre, color, number, playerId, divid, fromHand) {
            
            // let mode = 'only';
            debugger;
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
            debugger;
            dojo.place(this.format_block('jstpl_placed_card', {
                y: parseInt(card.color) * 33.33,
                x: (card.number - 1) * 20,
                z: cards.length, // TODO: Change when can remove cards
                CARD_ID: divid
                // CARD_ID: card.id
            }), to, 'last');

            console.log("div id is", divid)
            // Opponent placed card
            if (playerId != this.player_id && fromHand) {
                this.placeOnObject('theatre_cards_' + divid, 'overall_player_board_' + playerId);
            }
            else if (fromHand) {
                // TODO may need ot check if card came from hand for Land1s
                // this.placeOnObject('theatre_cards_' + card.id, 'myhand_item_' + divid)
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
       /**
        * plan
        * * when clicking card
        *       * if 0 cards selected, select card
        *       * if 1 card selected, select new card, unselect old card
        * 
        */
        playCardFaceUp : function() {
            console.log("playing face up");
        },

        playCardFaceDown : function() {
            console.log("playing face down");
        },

        cancelAction : function() {
            console.log("cancelling action");
        },

        forfeitRound : function() {
            console.log('forfeitting');
        },

        onClickTheatre : function(event) {
            debugger;
            let theatre = event.target.id.split('_')[2]
            console.log(theatre)
            let items = this.playerHand.getSelectedItems()
            let action = 'playCard'
            if (this.checkAction(action, true) && items.length) {
                let card_id = items[0].id;                    
                this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                    id : card_id,
                    theatre: this.colorToRow[theatre],
                    lock : true
                }, this, function(result) {
                }, function(is_error) {
                });
            }
        },

        onPlayerHandSelectionChanged : function() {
            var items = this.playerHand.getSelectedItems();

            // if (items.length == 1) {
            //     var action = 'playCard';
            //     if (this.checkAction(action, true)) {
            //         // Can play a card
            //         var card_id = items[0].id;                    
            //         this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
            //             id : card_id,
            //             lock : true
            //         }, this, function(result) {
            //         }, function(is_error) {
            //         });

            //         this.playerHand.unselectAll();
            //     } else {
            //         this.playerHand.unselectAll();
            //     }
            // }
        },
        // onPlayerHandSelectionChanged: function() {
        //     // console.log('in hanging hands funciton');
        //     let items = this.playerHand.getSelectedItems();

        //     if (items.length > 0) {
        //         if (this.checkAction('playCard', true)) {
        //             // can play a card
        //             let card_id = items[0].id;
        //             console.log(("on playCard " + card_id));
        //             var id = items[0].type;
        //             let {color, number} = this.getCardFromUniqueId(id)

        //             debugger;
        //             this.addCardToTheatre(color, color, number, this.player_id, card_id)
        //             // addCardToTheatre: function (theatre, color, number, playerId) {
                    
        //             // this.playCardOnTable(color, color, number, player)

        //         }
        //         else {
        //             console.log('wot')
        //         }
        //         this.playerHand.unselectAll();
        //     }
        // },
        
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
        setupNotifications : function() {
            console.log('notifications subscriptions setup');

            dojo.subscribe('newHand', this, "notif_newHand");
            dojo.subscribe('playCard', this, "notif_playCard");

        },

        notif_newHand : function(notif) {
            // We received a new full hand of 13 cards.
            this.playerHand.removeAll();

            for ( let i in notif.args.cards ) {
                var card = notif.args.cards[i];
                var color = card.type;
                var value = card.type_arg;
                this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
            }
        },

        notif_playCard : function(notif) {
            // Play a card on the table
            // this.playCardOnTable(notif.args.player_id, notif.args.color, notif.args.value, notif.args.card_id);
            theatre = this.rowToColor[notif.args.theatre]
            color = notif.args.color
            number = notif.args.value
            player_id = notif.args.player_id
            card_id = notif.args.card_id
            this.addCardToTheatre(theatre, color, number, player_id, card_id, true)
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
