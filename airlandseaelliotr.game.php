<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * airlandseaelliotr implementation : © Elliot Rotenstein elliot@balgara.com
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * airlandseaelliotr.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 *
 */


require_once(APP_GAMEMODULE_PATH . 'module/table/table.game.php');


class airlandseaelliotr extends Table
{
    function __construct()
    {
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();

        self::initGameStateLabels(
            array(
                "first_player" => 10,
                //    "my_first_global_variable" => 10,
                //    "my_second_global_variable" => 11,
                //      ...
                //    "my_first_game_variant" => 100,
                //    "my_second_game_variant" => 101,
                //      ...

            )
        );

        $this->cards = self::getNew("module.common.deck");
        $this->cards->init("card");
    }

    protected function getGameName()
    {
        // Used for translations and stuff. Please do not modify.
        return "airlandseaelliotr";
    }

    /*
    setupNewGame:
    
    This method is called only once, when a new game is launched.
    In this method, you must setup the game according to the game rules, so that
    the game is ready to be played.
    */
    protected function setupNewGame($players, $options = array())
    {
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('" . $player_id . "','$color','" . $player['player_canal'] . "','" . addslashes($player['player_name']) . "','" . addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode($values, ',');
        self::DbQuery($sql);
        self::reattributeColorsBasedOnPreferences($players, $gameinfos['player_colors']);
        self::reloadPlayersBasicInfos();


        $sql = "INSERT INTO `theatres` (`theatre`, `order`) VALUES ";
        $values = array();
        $theatres = array('Air', 'Land', 'Sea');
        $orders = array(0, 1, 2);
        shuffle($orders);


        foreach ($theatres as $theatre) {
            $order = array_pop($orders);
            $values[] = "('" . $theatre . "', '" . $order . "')";
        }

        $sql .= implode($values, ',');
        self::DbQuery($sql);


        // Create cards
        $cards = array();
        // $theatres = array('Air', 'Land', 'Sea');
        $theatres = array(1, 2, 3);
        foreach ($theatres as $theatre) {
            for ($value = 1; $value <= 6; $value++) {
                $cards[] = array('type' => $theatre, 'type_arg' => $value, 'nbr' => 1);
            }
        }

        $this->cards->createCards($cards, 'deck');

        // Shuffle deck
        // $this->cards->shuffle('deck');
        // // Deal 13 cards to each players
        // $players = self::loadPlayersBasicInfos();
        // foreach ($players as $player_id => $player) {
        //     $cards = $this->cards->pickCards(6, 'deck', $player_id);
        // }



        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here

        // self::trace("In setupnewgame");
        // shuffle($this->theatres);
        // $this->theatres = array('Sea', 'Land', 'Air');
        // self::trace($this->theatres);

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();
        self::setGameStateInitialValue('first_player', self::getActivePlayerId());
        self::DbQuery(sprintf("UPDATE player SET player_1 = 1 where player_id = %d", self::getActivePlayerId()));

        /************ End of the game initialization *****/
    }

    /*
    getAllDatas: 
    
    Gather all informations about current game situation (visible by the current player).
    
    The method is called each time the game interface is displayed to a player, ie:
    _ when the game starts
    _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();

        $current_player_id = self::getCurrentPlayerId(); // !! We must only return informations visible by this player !!

        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb($sql);

        $result['hand'] = self::getCardsInLocation('hand', $current_player_id);

        $player_ids = self::get_player_ids();
        $result['player_ids'] = $player_ids;
        // $players = self::get_player_ids();
        $result['table'] = array(
            'Air' => array(
                $player_ids[0] => self::getCardsInLocation('Air', $player_ids[0]),
                $player_ids[1] => self::getCardsInLocation('Air', $player_ids[1]),
            ),
            'Land' => array(
                $player_ids[0] => self::getCardsInLocation('Land', $player_ids[0]),
                $player_ids[1] => self::getCardsInLocation('Land', $player_ids[1]),
            ),
            'Sea' => array(
                $player_ids[0] => self::getCardsInLocation('Sea', $player_ids[0]),
                $player_ids[1] => self::getCardsInLocation('Sea', $player_ids[1]),
            ),
        );

        $result['order'] = self::get_theatre_order();

        $result['scores'] = self::calculateRoundScore();


        // self::error("\n\n\n\n\n\n\n\n");
        // self::error("newcards in locaiton");
        // self::error(print_r(self::getCardsInLocation('hand', $player_ids[0]), true));
        // $result['cardsontable'] = $this->cards->getCardsInLocation('cardsontable');

        // TODO: Gather all information about current game situation (visible by player $current_player_id).

        return $result;
    }

    /*
    getGameProgression:
    
    Compute and return the current game progression.
    The number returned must be an integer beween 0 (=the game just started) and
    100 (= the game is finished or almost finished).
    
    This method is called each time we are in a game state with the "updateGameProgression" property set to true 
    (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


    //////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
    In this space, you can put any utility methods useful for your game logic
    */


    public function get_theatre_order()
    {
        $ret = self::getCollectionFromDB("SELECT `theatre`, `order` FROM theatres ORDER BY `order`");
        $theatres = array();
        foreach ($ret as $key => $values) {
            $theatres[] = $values['theatre'];
        }
        return $theatres;
    }

    public function get_player_ids()
    {
        $players = self::getNextPlayerTable();

        $player_ids = array(
            $players[0]
        );
        $player_ids[] = $players[$players[0]];

        return $player_ids;
    }

    // TODO: remove sqli issues
    public function getCardsInLocation($location, $location_arg)
    {
        $query = sprintf("SELECT card_id id, card_type type, card_type_arg type_arg, card_location location, card_location_arg location_arg, face_up FROM card WHERE (card_location LIKE '%s') AND (card_location_arg = %d)", $location, $location_arg);
        $x = self::getCollectionFromDB($query);
        return $x;
    }

    public function flipCard($card_id, $state)
    {
        $query = sprintf("UPDATE card SET face_up = %d WHERE card_id = %d", $state, $card_id);
        self::DbQuery($query);
    }

    public function calculateRoundScore()
    {
        $theatres = self::get_theatre_order();
        $player_ids = self::get_player_ids();
        $scores = [
            $player_ids[0] => [],
            $player_ids[1] => [],
        ];
        foreach ($theatres as $theatre) {
            foreach ($player_ids as $player_id) {
                $scores[$player_id][$theatre] = 0;
                $cards = self::getCardsInLocation($theatre, $player_id);

                foreach ($cards as $card) {
                    $points = $card['face_up'] ? $card['type_arg'] : 2;
                    $scores[$player_id][$theatre] += $points;
                }
            }
        }
        return $scores;
    }

    public function updateRoundscore($scores)
    {
        foreach ($scores as $player_id => $theatres) {
            $query = "UPDATE player SET ";
            $updates = [];
            foreach ($theatres as $theatre => $score) {
                $updates[] = sprintf("%s = %d", $theatre, $score);
            }
            $query .= sprintf("%s WHERE player_id = %d", implode(", ", $updates), $player_id);
            self::DbQuery($query);
        }
    }


    //////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
    Each time a player is doing some game action, one of the methods below is called.
    (note: each method below must match an input method in airlandseaelliotr.action.php)
    */

    function playCard($card_id, $target_theatre, $faceUp)
    {
        self::checkAction("playCard");
        self::error("what is faceup?");
        $player_id = self::getActivePlayerId();
        // XXX check rules here
        $currentCard = $this->cards->getCard($card_id);
        $theatre = $currentCard['type']; // TODO: Gottsta change this later when playing cards on wrong theatre

        // TODO: Rules checking wop wop
        // self::warn(sprintf("target is %d whereas theatre is %d", $target_theatre, $theatre));
        self::warn(print_r(self::getNextPlayerTable(), true));
        self::warn(self::getActivePlayerId());
        self::warn(self::getCurrentPlayerId());
        if ($faceUp && $target_theatre !== $theatre) {
            throw new BgaUserException("That card can't go there!");
        }


        $this->cards->moveCard($card_id, $this->theatre_name[$target_theatre], $player_id);
        self::flipCard($card_id, $faceUp);
        $scores = self::calculateRoundScore();
        self::updateRoundscore($scores);

        // And notify
        self::notifyAllPlayers(
            'playCard',
            clienttranslate('${player_name} plays ${value_displayed} ${color_displayed}'),
            array(
                'i18n' => array('color_displayed', 'value_displayed'),
                'card_id' => $card_id,
                'player_id' => $player_id,
                'player_name' => self::getActivePlayerName(),
                'value' => $currentCard['type_arg'],
                'value_displayed' => $this->values_label[$currentCard['type_arg']],
                'color' => $currentCard['type'],
                'color_displayed' => $this->theatres[$currentCard['type']]['name'],
                'theatre' => $target_theatre,
                'faceUp' => $faceUp,
            )
        );


        self::notifyAllPlayers(
            'newTheatreScore',
            '',
            array(
                'scores' => $scores
            )
        );
        // Next player
        $this->gamestate->nextState('playCard');
    }

    /*
    
    Example:
    function playCard( $card_id )
    {
    // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
    self::checkAction( 'playCard' ); 
    
    $player_id = self::getActivePlayerId();
    
    // Add your game logic to play a card there 
    ...
    
    // Notify all players about the card played
    self::notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
    'player_id' => $player_id,
    'player_name' => self::getActivePlayerName(),
    'card_name' => $card_name,
    'card_id' => $card_id
    ) );
    
    }
    
    */


    //////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
    Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
    These methods function is to return some additional information that is specific to the current
    game state.
    */

    function stNewRound()
    {
        // set all cards to faceup
        self::DbQuery("UPDATE card SET face_up = 1");
        // change theatre order
        self::DbQuery("UPDATE theatres SET order = (order + 1) % 3");
        // change first player
        self::DbQuery("UPDATE player SET player_1 = !player_1");

        // TODO: gotta change the active player potentially
        // if 1st player stays the same, need to active next player

        $this->gameState->nextState("");
    }

    # called when dealing cards ot each player
    function stNewHand()
    {
        self::error("start of stNewHand");
        // take back all cards (from any location -> null) to deck
        $this->cards->moveAllCardsInLocation(null, "deck");
        $this->cards->shuffle('deck');
        // deal 6 cards to each player
        // create deck, shuffle it and give 6 initial cards

        $players = self::loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            $cards = $this->cards->pickCards(6, 'deck', $player_id);
            // notify player about his cards
            self::notifyPlayer($player_id, 'newHand', '', array('cards' => $cards));
        }

        // self::calculateRoundScore();
        self::error("WHERE ARE U");
        self::error(print_r(self::calculateRoundScore(), true));
        self::notifyAllPlayers(
            'newTheatreScore',
            '',
            array(
                'scores' => self::calculateRoundScore()
            )
        );

        // need to swap players here. will worry about later
        $this->gamestate->nextState("");
    }


    function stNextPlayer()
    {
        // make next player active OR end round
        $players_ids = self::get_player_ids();
        // $cards_played = count($this->cards->getCardsInLocation('hand', $players_ids[0]));
        $cards_remaining = 0;
        foreach ($players_ids as $player_id) {
            $cards_remaining += $this->cards->countCardsInLocation('hand', $player_id);
        }

        // All dealt cards have been played -> end round
        if ($cards_remaining == 8) {
            // deal with player scores and check if player reached 12 points
            $this->gamestate->nextState("endRound");
        } else {
            // else next player's turn to place a card.
            self::activeNextPlayer();
            $player_id = self::getActivePlayerId();
            self::giveExtraTime($player_id);
            $this->gamestate->nextState("nextTurn");
        }

        // notify
        // $players = self::loadPlayersBasicInfos();
        // self::notifyAllPlayers('')
    }

    function stRoundEnd()
    {

        // // check who won this round
        $scores = self::calculateRoundScore();
        $player_ids = self::get_player_ids();
        $theatres = self::get_theatre_order();

        $player_2 = self::getActivePlayerId();
        $player_1 = $player_ids[0] == $player_2 ? $player_ids[1] : $player_ids[0];

        $p1_count = 0;
        $p2_count = 0;

        foreach ($theatres as $theatre) {
            $p1_score = $scores[$player_1][$theatre];
            $p2_score = $scores[$player_2][$theatre];
            if ($p2_score > $p1_score) {
                $p2_count += 1;
            } else {
                $p1_count += 1;
            }
        }

        $roundWinner = $p1_count >= $p2_count ? $player_1 : $player_2;

        self::DbQuery("UPDATE player SET player_score=player_score + 6 WHERE player_id='" . $roundWinner . "'");

        $query = sprintf("SELECT player_id id, player_score score FROM player order by player_score DESC LIMIT 1");
        $currWinning = self::GetObjectFromDB($query);


        if ($currWinning['score'] >= 12) {
            $this->gamestate->nextState("endGame");
        } else {
            $this->gamestate->nextState("newRound");
        }


        // figure out if someone has hit 12 points
        //  -> then end game
        // otherwise start next round
    }

    function argGiveCards()
    {
        return array();
    }

    //////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
    Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
    The action method of state X is called everytime the current game state is set to X.
    */

    /*
    
    Example for game state "MyGameState":
    function stMyGameState()
    {
    // Do some stuff ...
    
    // (very often) go to another gamestate
    $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

    //////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
    zombieTurn:
    
    This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
    You can do whatever you want in order to make sure the turn of this player ends appropriately
    (ex: pass).
    
    Important: your zombie code will be called when the player leaves the game. This action is triggered
    from the main site and propagated to the gameserver from a server, not from a browser.
    As a consequence, there is no current player associated to this action. In your zombieTurn function,
    you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn($state, $active_player)
    {
        $statename = $state['name'];

        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState("zombiePass");
                    break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive($active_player, '');

            return;
        }

        throw new feException("Zombie mode not supported at this game state: " . $statename);
    }

    ///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
    upgradeTableDb:
    
    You don't have to care about this until your game has been published on BGA.
    Once your game is on BGA, this method is called everytime the system detects a game running with your old
    Database scheme.
    In this case, if you change your Database scheme, you just have to apply the needed changes in order to
    update the game database and allow the game to continue to run with your new version.
    
    */

    function upgradeTableDb($from_version)
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }
}