<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * airlandseaelliotr implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * airlandseaelliotr.action.php
 *
 * airlandseaelliotr main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/airlandseaelliotr/airlandseaelliotr/myAction.html", ...)
 *
 */


class action_airlandseaelliotr extends APP_GameAction
{
    // Constructor: please do not modify
    public function __default()
    {
        if (self::isArg('notifwindow')) {
            $this->view = "common_notifwindow";
            $this->viewArgs['table'] = self::getArg("table", AT_posint, true);
        } else {
            $this->view = "airlandseaelliotr_airlandseaelliotr";
            self::trace("Complete reinitialization of board game");
        }
    }

    // TODO: defines your action entry points there

    public function playCard()
    {
        self::setAjaxMode();
        $card_id = self::getArg("id", AT_posint, true);
        $theatre = self::getArg("theatre", AT_posint, true);
        $faceUp = self::getArg("faceUp", AT_bool, true);
        $this->game->playCard($card_id, $theatre, $faceUp);
        self::ajaxResponse();
    }

    public function flipCard()
    {
        self::setAjaxMode();
        $player_id = self::getArg("player_id", AT_posint);
        $theatre = self::getArg("theatre", AT_posint);
        if ($player_id === null || $theatre === null) {
            self::error('not going to flip a card');
            $this->game->updatePlayerNoAction();
            $this->game->gamestate->nextState("flipCard");
        } else {
            $this->game->flipCard($player_id, $theatre);

        }
        // $this->game->removeRecentCard();

        self::ajaxResponse();
    }

    public function moveCard()
    {
        self::setAjaxMode();
        $src_theatre = self::getArg("src_theatre", AT_alphanum);
        $dest_theatre = self::getArg("dest_theatre", AT_alphanum);
        // $src_theatre = self::getArg("src_theatre", AT_alphanum);
        // $player_id = self::getArg("player_id", AT_posint);
        // $theatre = self::getArg("theatre", AT_posint);
        $position = self::getArg("position", AT_posint);
        if ($src_theatre === null || $dest_theatre === null) {
            self::error("didnt pass anything in oh no!");
            $this->game->updatePlayerNoAction();
            $this->game->gamestate->nextState("");
        } else {
            self::error("in action boutta move");
            $this->game->moveCard($src_theatre, $dest_theatre, $position);

        }
        // $this->game->removeRecentCard();

        self::ajaxResponse();
    }


/*
Example:
public function myAction()
{
self::setAjaxMode();     
// Retrieve arguments
// Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
$arg1 = self::getArg( "myArgument1", AT_posint, true );
$arg2 = self::getArg( "myArgument2", AT_posint, true );
// Then, call the appropriate method in your game logic, like "playCard" or "myAction"
$this->game->myAction( $arg1, $arg2 );
self::ajaxResponse( );
}
*/

}