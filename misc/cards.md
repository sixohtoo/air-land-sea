# Cards

## Air
* 1: +3 strength in adjacent
* 2: Next card to non matching theatre
* 3: Flip adjacent
* 4: strength 3 or less anywhere
* 5: no facedown


## Land
* 1: Draw card and play facedown adjacent theatre
* 2: flip any card
* 3: flip adjacent
* 4: all covered cards worth 4
* 5: you flip, then opponent flips


## Sea
* 1: Move card anywhere
* 2: facedown worth 4
* 3: flip adjacent
* 4: pick up facedown and play another card
* 5: 3 or less cards in adjacent


## stuff left
* Air 2 (next card to non matching)             !!
* Land 1 (Draw and play facedown)               !!!
* Land 5 (you flip, then opponent flips)        !!
* Sea 1 (move card anywhere)                    !
* Sea 4 (pick ujp facedown and play another)    !!
* 

## TODO
* flipping opponents card doesnt cause animation (gotta refresh)

## stuff to code
* move cards (1) -> choose card + theatre
* flip cards (5) -> choose a card
* recall/2nd turn (1) -> choose card + stay active player
* top deck face down (1) -> see card + choose theatre (can be normal but can't select different card and only face down button)
* special scoring (3)
* place anywhere (2)
* check if destroy (2)


## states
* flip
    * needs to know card and chosen theatre
    * 3 adjacent, 1 anywhere, 1 yours * 2

## ideas
* check_adjacent(card_id, theatre)


# flipping
```js
// Button pops up that says flip card
// Need some way to highlight uncovered legal cards
// descriptionmyturn: You must select a card to flip
// description: {actplayer} must select a card to flip
{
    'theatres' : 'Air', 'Land', // theatres that player is allowed to flip in (e.g. green 2 allows anywhere, green 3 is only adjacent)
    'players' : 234234242, 234234243, // Players user can target (green 5 only allows you to flip)
}
```

```php
function get_flip_targets($num, $theatre) {
    $player_list = self::getNextPlayerTable();
    $theatre_list = self::get_theatre_order();

    $players = array(
        self::getActivePlayerId()
    );
    if ($num != 5) { // green 5 can only target your own cards, everything else can flip yours or opponents
        $players[] = $players[self::getActivePlayerId()];
    }

    $theatres = array();

    $theatre_index = array_search($theatre);
    if ($theatre_index - 1 >= 0) {
        $theatres[] = $theatre_list[$theatre_index - 1];
    }
    if ($theatre_indec + 1 <= 2) {
        $theatres[] = $theatre_list[$theatre_index + 1];
    }

    if ($num != 2) {
        $theatres[] = $theatre;
    }

    return array (
        'players' => $players,
        'theatres' => $theatres
    );
} 
```