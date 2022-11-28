<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * airlandseaelliotr implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * airlandseaelliotr game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

$this->theatres = array(
    1 => array(
        'name' => clienttranslate('Air'),
        'nametr' => self::_('Air')
    ),
    2 => array(
        'name' => clienttranslate('Land'),
        'nametr' => self::_('Land')
    ),
    3 => array(
        'name' => clienttranslate('Sea'),
        'nametr' => self::_('Sea')
    ),
);

$this->values_label = array(
    1 => '1',
    2 => '2',
    3 => '3',
    4 => '4',
    5 => '5',
    6 => '6',
);

/*
Example:
$this->card_types = array(
1 => array( "card_name" => ...,
...
)
);
*/