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
    self::error("LOOK OVER HERE");
    self::error($faceUp);
    $this->game->playCard($card_id, $theatre, $faceUp);
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