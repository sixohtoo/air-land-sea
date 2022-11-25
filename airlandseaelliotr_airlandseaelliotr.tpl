{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- airlandseaelliotr implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    airlandseaelliotr_airlandseaelliotr.tpl
    
    This is the HTML template of your game.
    
    Everything you are writing in this file will be displayed in the HTML page of your game user interface,
    in the "main game zone" of the screen.
    
    You can use in this template:
    _ variables, with the format {MY_VARIABLE_ELEMENT}.
    _ HTML block, with the BEGIN/END format
    
    See your "view" PHP file to check how to set variables and control blocks
    
    Please REMOVE this comment before publishing your game on BGA
-->


This is your game interface. You can edit this HTML in your ".tpl" file.


<div id="theatres">
    <!-- BEGIN THEATRES -->
    <div id="theatre_{THEATRE}" class="theatre">
        <div id="theatre_cards_{THEATRE}_{OTHER_PLAYER_ID}" class="theatre_cards whiteblock"   ></div>
        <div id="theatre_picture_{THEATRE}"                 class="theatre_picture"            ></div>
        <div id="theatre_cards_{THEATRE}_{PLAYER_ID}"       class="theatre_cards whiteblock"   ></div>
    </div>
    <!-- END THEATRES -->
</div>



<div id="myhand_wrap" class="whiteblock">
    <h3> My Hand </h3>
    <div id="myhand">
        <div class="playertablecard"></div>
    </div>
</div>


<script type="text/javascript">

// Javascript HTML templates

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
