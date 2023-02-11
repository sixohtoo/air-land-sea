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
    0 => array(
        'name' => clienttranslate('Face down'),
        'nametr' => self::_('Face Down')
    ),
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

$this->theatre_name = array(
    0 => "Face down",
    1 => "Air",
    2 => "Land",
    3 => "Sea"
);

$this->theatre_row = array(
    "Face down" => 0,
    "Air" => 1,
    "Land" => 2,
    "Sea" => 3
);


$this->values_label = array(
    1 => '1',
    2 => '2',
    3 => '3',
    4 => '4',
    5 => '5',
    6 => '6',
);

$this->max_points = 12;

$this->card_to_state = array(
    'Air1' => 'playCard',
    'Air2' => 'playCard',
    'Air3' => 'flipCard',
    'Air4' => 'playCard',
    'Air5' => 'playCard',
    'Air6' => 'playCard',

    'Land1' => 'drawCard',
    'Land2' => 'flipCard',
    'Land3' => 'flipCard',
    'Land4' => 'playCard',
    'Land5' => 'playCard',
    'Land6' => 'playCard',

    'Sea1' => 'moveCard',
    'Sea2' => 'playCard',
    'Sea3' => 'flipCard',
    'Sea4' => 'playCard',
    'Sea5' => 'playCard',
    'Sea6' => 'playCard',
);

$this->score_card = array(
    'Air1' => 'adjacent_3_scoring',
    'Air2' => 'normal_scoring',
    'Air3' => 'normal_scoring',
    'Air4' => 'normal_scoring',
    'Air5' => 'normal_scoring',
    'Air6' => 'normal_scoring',

    'Land1' => 'normal_scoring',
    'Land2' => 'normal_scoring',
    'Land3' => 'normal_scoring',
    'Land4' => 'covered_4_scoring',
    'Land5' => 'normal_scoring',
    'Land6' => 'normal_scoring',

    'Sea1' => 'normal_scoring',
    'Sea2' => 'facedown_4_scoring',
    'Sea3' => 'normal_scoring',
    'Sea4' => 'normal_scoring',
    'Sea5' => 'normal_scoring',
    'Sea6' => 'normal_scoring',
);



$this->strange_order_states = array(
    'flipCard',
    'moveCard',
    'drawCard',
);

$this->one_off_states = array(
    'moveCard'
);