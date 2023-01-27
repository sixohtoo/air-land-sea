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
            console.log(gamedatas)

            // this.counter = ebg.counter()
            this.counters = {}

            // let theatres = gamedatas.order.sort9)
            // let colors = ['⚪', '🟢', '🔵']
            let colors = {
                'Air': '⚪',
                'Land': '🟢',
                'Sea': '🔵'
            }
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                this.counters[player_id] = {}
                var player = gamedatas.players[player_id];
                for (let index in gamedatas.order) {
                    let theatre = gamedatas.order[index]
                    console.log(theatre)
                    let color = colors[theatre]
                    let player_board_div = $('player_board_' + player_id)
                    let score = gamedatas.scores[player_id][theatre]
                    dojo.place(this.format_block('jstpl_player_board', {player: player_id, theatre, color}), player_board_div)
                    this.counters[player_id][theatre] = new ebg.counter()
                    this.counters[player_id][theatre].create(`score_${theatre}_${player_id}`)
                    this.counters[player_id][theatre].setValue(score)
                    // this.counter.create(`score_${theatre}_${player_id}`)
                }
                
                // TODO: Setting up players boards if needed
            }
            
            // this.player_id = this.get;
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
            // debugger;
            this.table = {}
            for (let theatre in gamedatas.table) {
                this.table[theatre] = {}
                let players = gamedatas.table[theatre];
                for (let player in players) {
                    this.table[theatre][player] = []
                    let cards = Object.values(players[player]);
                    cards.sort(function(a, b) {return a['position'] - b['position']})
                    for (let i in cards) {
                        let card = cards[i];
                        console.log(card.type_arg, card.face_up);

                        this.addCardToTheatre(theatre, card.type, card.type_arg, player, card.id, parseInt(card.face_up))
                    }
                }
            }

            this.theatres = gamedatas.order;
            console.log(gamedatas.players)
            // gamedatas.order.forEach(theatre => {
            //     $(`theatre_picture_${theatre}`).onclick = (e) => this.onClickTheatre(e)
            //     $(`theatre_cards_${theatre}_${this.player_id}`).onclick = (e) => this.onClickTheatre(e)
            // })

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
            case 'playerTurn':
                this.theatres.forEach(theatre => {
                    $(`theatre_picture_${theatre}`).onclick = (e) => this.onClickTheatre(e)
                    $(`theatre_cards_${theatre}_${this.player_id}`).onclick = (e) => this.onClickTheatre(e)
                });
                break;

            case 'flipCard':
                console.log("args is args", args);
                args.args.players.forEach(player => {
                    args.args.theatres.forEach(theatre => {
                        area = document.getElementById(`theatre_cards_${theatre}_${player}`)
                        children = area.children;
                        if (children.length) {
                            last = children[children.length - 1]
                            last.onclick = (e) => this.flipCard(e)
                            last.classList.add('clickable')
                            last.classList.add('flip')
                        }

                    })
                })
                break;
            case 'moveCard':
                console.log('this is the args', args);
                this.theatres.forEach(src_theatre => {
                    // theatre = document.getElementById(`theatre_${theatre}`);
                    id = this.getActivePlayerId()
                    cards = document.getElementById(`theatre_cards_${src_theatre}_${id}`).childNodes
                    for (let i = 0; i < cards.length; i++) {
                        card = cards[i];
                        card.classList.add('clickable')
                        card.classList.add('move')
                        card.onclick = (e) => {
                            console.log('clicked on da card')
                            this.theatres.forEach(dest_theatre => {
                                $(`theatre_picture_${dest_theatre}`).onclick = (e) => {
                                    console.log('clicked on theatre in moveCard')
                                    this.moveCard(src_theatre, dest_theatre, i)
                                }
                            });
                        };
                    }
                    // cards = lis
                })
                // list = document.getElementsByClassName('theatre_cards_card');
                // for (let i = 0; i < list.length; i++) {
                //     debugger;
                //     let elem = list[i];
                //     elem.classList.add('clickable')
                //     elem.classList.add('move')
                //     let elem_theatre = elem.parentNode.id.split('_')[2]
                //     elem.onclick = (e) => {
                //         this.theatres.forEach(theatre => {
                //             $(`theatre_picture_${theatre}`).onclick = (e) => this.moveCard(elem_theatre, theatre, i)
                //         });
                //     };
                // }
                // document.getElementsByClassName('theatre_cards_card').forEach(elem => {
                //     elem.classList.add('clickable')
                //     elem.onclick = (e) => this.moveCard(e)
                // })
            
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
           
            case 'playerTurn':
                this.theatres.forEach(theatre => {
                    $(`theatre_picture_${theatre}`).onclick = () => {}
                    $(`theatre_cards_${theatre}_${this.player_id}`).onclick = () => {}
                });
                break;
            case 'flipCard':
                let clickables = document.getElementsByClassName('clickable');
                for (let i = 0; i < clickables.length; i++) {
                    let elem = clickables[i];
                    elem.classList.remove('clickable')
                    elem.classList.remove('flip')
                    elem.onclick = () => {}
                }
                break;
            case 'moveCard':
                let cards = document.getElementsByClassName('clickable');
                for (let i = 0; i < cards.length; i++) {
                    let elem = cards[i];
                    elem.classList.remove('clickable')
                    elem.classList.remove('move')
                    elem.onclick = () => {}
                }
                break;
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
                        break;
                    case 'flipCard':
                        this.addActionButton('dont_flip', _('Don\'t flip anything'), 'button_noFlip');
                        break;
                    case 'moveCard':
                        this.addActionButton('dont_move', _('Don\'t move anything'), 'button_noMove');
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


        addCardToTheatre: function (theatre, color, number, playerId, divid, faceUp, fromHand) {

            console.log(theatre, color, number, playerId, divid, faceUp, fromHand);
            const cards = this.table[theatre][playerId];
            // debugger;
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

            cards.push(card);

            let to = 'theatre_cards_' + theatre + '_' + playerId;
            // debugger;
            let y = faceUp ? parseInt(card.color) * 33.33 : 0;
            let x = faceUp ? (card.number - 1) * 20 : 0;
            dojo.place(this.format_block('jstpl_placed_card', {
                y,
                x,
                z: cards.length, // TODO: Change when can remove cards
                CARD_ID: divid
            }), to, 'last');

            // console.log("div id is", divid)
            // Opponent placed card
            if (playerId != this.player_id && fromHand) {
                this.placeOnObject('theatre_cards_' + divid, 'overall_player_board_' + playerId);
            }
            else if (fromHand) {
                // TODO may need ot check if card came from hand for Land1s
                this.placeOnObject('theatre_cards_' + divid, 'myhand_item_' + divid)
                this.playerHand.removeFromStockById(divid)
            }

            this.slideToObject('theatre_cards_' + divid, to).play()
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
          
        playCard : function(faceUp, theatre, card_id) {
            console.log(faceUp, theatre, card_id)
            let action = 'playCard'
            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                id : card_id,
                theatre: this.colorToRow[theatre],
                faceUp: faceUp,
                lock : true
            }, this, this.playCardAjaxSuccessful, this.playCardAjaxFail);
            
        },
            
            
        flipCard : function(target) {
            console.log(target)
            let action = 'flipCard'
            let parent = target.target.parentNode; // target.target.parentNode.id.split('_')[2]
            let parent_id = parent.id.split('_');
            let theatre = parent_id[2];
            let player_id = parent_id[3];
            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                theatre: this.colorToRow[theatre],
                player_id,
                lock : true
            }, this, this.flipCardAjaxSuccessful, this.flipCardAjaxFail);
            
        },

        moveCard : function(src_theatre, dest_theatre, position) {
            // return
            debugger;
            // console.log("move card target", target)
            // let parent = target.target.parentNode;
            // let parent_id = parent.id.split('_');
            // let theatre = parent_id[2];
            // let player_id = parent_id[3];
            action = 'moveCard'
            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                src_theatre,
                dest_theatre,
                position,
                lock : true
            }, this, this.moveCardAjaxSuccessful, this.moveCardAjaxFail);
        },

        // TODO: bug! have to already have selected a card. will fix later
        onClickTheatre : function(event) {
            let theatre = event.target.id.split('_')[2]
            console.log(theatre)
            let items = this.playerHand.getSelectedItems()
            let action = 'playCard'
            if (this.checkAction(action, true) && items.length) {
                let card_id = items[0].id
                this.removeActionButtons()
                this.addActionButton('playCardUp_button', _('Play face up'), () => this.playCard(true, theatre, card_id));
                this.addActionButton('playCardDown_button', _('Play face down'), () => this.playCard(false, theatre, card_id));
            }

        },

        playCardAjaxSuccessful : function(result) {
            console.log('successful playcard ajax wop wop')
            console.log(result)
        },

        playCardAjaxFail : function(is_error) {
            console.log('rip playcard ajax failed wop wop')
            console.log(is_error)
        },

        flipCardAjaxSuccessful : function(result) {
            console.log('successfulflipCard ajax wop wop')
            console.log(result)
        },

        flipCardAjaxFail : function(is_error) {
            console.log('ripflipCard ajax failed wop wop')
            console.log(is_error)
        },

        moveCardAjaxSuccessful : function(result) {
            console.log('successful moveCard ajax wop wop')
            console.log(result)
        },

        moveCardAjaxFail : function(is_error) {
            console.log('rip moveCard ajax failed wop wop')
            console.log(is_error)
        },

        onPlayerHandSelectionChanged : function() {
            var items = this.playerHand.getSelectedItems();
            if (!this.checkAction('playCard', true)) {
                this.playerHand.unselectAll();
            }
        },

        button_noFlip : function() {
            let action = 'flipCard';
            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                lock : true
            }, this, this.flipCardAjaxSuccessful, this.flipCardAjaxFail);

        },

        button_noMove : function() {
            let action = 'moveCard';
            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                lock : true
            }, this, function() {}, function() {});

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
        setupNotifications : function() {
            console.log('notifications subscriptions setup');

            dojo.subscribe('newHand', this, "notif_newHand");
            dojo.subscribe('playCard', this, "notif_playCard");
            dojo.subscribe('newTheatreScore', this, "notif_newTheatreScore");
            dojo.subscribe('recycledDeck', this, "notif_recycledDeck");
            dojo.subscribe('theatreOrder', this, 'notif_theatreOrder')
            dojo.subscribe('updateScore', this, 'notif_updateScore');
            dojo.subscribe('flipCard', this, "notif_flipCard");
            dojo.subscribe('destroyCard', this, 'notif_destroyCard');
            dojo.subscribe('moveCard', this, 'notif_moveCard');
        },

        notif_newHand : function(notif) {
            // We received a new full hand of 13 cards.
            this.playerHand.removeAll();

            // debugger;
            for ( let i in notif.args.cards ) {
                var card = notif.args.cards[i];
                var color = card.type;
                var value = card.type_arg;
                this.playerHand.addToStockWithId(this.getCardId(color, value), card.id);
            }
        },

        notif_playCard : function(notif) {
            // Play a card on the table
            theatre = this.rowToColor[notif.args.theatre]
            color = notif.args.color
            number = notif.args.value
            player_id = notif.args.player_id
            card_id = notif.args.card_id
            face_up = notif.args.faceUp
            this.addCardToTheatre(theatre, color, number, player_id, card_id, face_up, true)
        },

        notif_newTheatreScore : function(notif) {
            console.log('in newTheatreScore', notif)
            let scores = notif.args.scores;

            for (let player_id in scores) {
                for (let theatre in scores[player_id]) {
                    let score = scores[player_id][theatre]
                    this.counters[player_id][theatre].toValue(score)
                }
            }
        },

        notif_recycledDeck : function(notif)  {
            console.log("in recycled deck");
            console.log(notif)
            dojo.query(".theatre_cards_card").forEach(dojo.destroy);
            for (let theatre in this.table) {
                for (let player_id in this.table[theatre]) {
                    this.table[theatre][player_id] = [];
                }
            }
        },

        notif_theatreOrder : function(notif) {
            // debugger;
            let new_order = notif.args.order;
            let last = new_order[0];
            // $(`theatre_${last}`).prependTo('#theatres');
            let content = document.getElementById(`theatre_${last}`);
            let parent = content.parentNode;
            parent.insertBefore(content, parent.firstElementChild);


        },

        notif_updateScore : function(notif) {
            let winner = notif.args.winner;
            let current = this.scoreCtrl[winner].current_value;
            this.scoreCtrl[winner].toValue(current + 6);
        },

        notif_flipCard : function(notif) {
            console.log('in notif_flipCard', notif)
            let area = document.getElementById(`theatre_cards_${notif.args.theatre}_${notif.args.player_id}`);
            let target = area.children[area.children.length - 1];
            let {x, y} = notif.args
            target.style.backgroundPosition = `${x}% ${y}%`
        },

        notif_destroyCard : function(notif) {
            let area = document.getElementById(`theatre_cards_${notif.args.theatre}_${notif.args.player_id}`);
            let target = area.children[area.children.length - 1];
            target.remove();
            // document.removeChild()
        },

        notif_moveCard : function(notif) {
            console.log('moving card', notif.args);
            let area = document.getElementById(`theatre_cards_${notif.args.src_theatre}_${notif.args.player_id}`);
            let card = area.childNodes[notif.args.index];
            card.remove()

            let {dest_theatre, color, value_displayed, player_id, card_id, face_up} = notif.args
            // dest_theatre = notif.args.dest_theatre
            // color = notif.args.color
            // value_displayed = notif.args.value_displayed
            // player_id = notif.args.player_id
            // card_id = notif.args.card_id
            this.addCardToTheatre(dest_theatre, color, value_displayed, player_id, card_id, face_up, false)
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
