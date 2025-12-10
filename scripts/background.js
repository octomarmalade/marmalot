/**
 * Wang tiles customized from this codepen
 * Copyright (c) 2025 by nicolas barradeau (https://codepen.io/nicoptere/pen/VLyWBe)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var WangTile = ( function()
{

    var w, n, e, s, x, y, size, id;

    var ids = [0,1,2,3,4,5,6,7];

    var R = 0,
        Y = 1,
        G = 2,
        B = 3,
        P = 4,
        W = 5;

    function Tile( id, _x, _y, _size ){

        //initis the colors
        this.init( id );

        //rendering
        this.x = _x;
        this.y = _y;
        this.size = _size;
    }

    function init( id ){

        this.id = id % ids.length;
        
        switch( this.id )
        {

            case 0: w = B; n = R; e = Y; s = G; break;
            case 1: w = B; n = G; e = B; s = G; break;
            case 2: w = Y; n = R; e = Y; s = R; break;
            case 3: w = Y; n = G; e = B; s = R; break;
            case 4: w = Y; n = R; e = B; s = G; break;
            case 5: w = Y; n = G; e = Y; s = G; break;
            case 6: w = B; n = R; e = B; s = R; break;
            case 7: w = B; n = G; e = Y; s = R; break;

        }

        //sides values
        this.sides = [  w, n, e, s ];
        this.w = this.sides[ 0 ];
        this.n = this.sides[ 1 ];
        this.e = this.sides[ 2 ];
        this.s = this.sides[ 3 ];

    }

    function rotate( turns ){

        while( turns-- )
        {
            this.sides.push( this.sides.shift() );
            this.w = this.sides[ 0 ];
            this.n = this.sides[ 1 ];
            this.e = this.sides[ 2 ];
            this.s = this.sides[ 3 ];
        }
    }

    function setTile( l, t )
    {

        //case 0: first tile of the set, nothing to do.
        if( l == null && t == null )return;

        //randomize the tiles' order
        var it = 0;
        ids.sort( function( a, b ){return Math.random()<.5?-1:1;} );

        //case 1 : building a row (only match the tile to the left)
        if( l != null && t == null )
        {
            //while the east of the tile to the left != the west of this tile
            while( l.e != this.w )
            {
                //select next tile
                ids.push( ids.shift() );
                this.init( ids[0] );
                if( it++ > ids.length )break;
            }
        }
        //case 2 : first tile of a row (only match the tile above )
        else if( l == null &&  t != null )
        {
            //while the south of the tile above != the north of this tile
            while( t.s != this.n )
            {
                //select next tile
                ids.push( ids.shift() );
                this.init( ids[0] );
                if( it++ > ids.length )break;
            }
        }
        else
        {
            //case 3: match both the top and the left tiles
            for( var i = 0; i< ids.length; i++ )
            {

                if(  l.e == this.w && t.s == this.n )break;

                this.init( ids[ i ] );
                if( this.sides.indexOf( l.e ) == -1 )continue;
                if( this.sides.indexOf( t.s ) == -1 )continue;

                for( var j = 0; j < 4; j++ )
                {
                    if(  l.e == this.w && t.s == this.n ) break;
                    this.rotate(1);
                }
            }
        }
    }

    function renderColor(ctx) {
        var x = this.x;
        var y = this.y;
        var size = this.size;
    
        var cx = x + size / 2;
        var cy = y + size / 2;
        var angle = Math.PI / 4 * 3;
        var radius = Math.sqrt(2) * size / 2;
    
        for (var i = 0; i < this.sides.length; i++) {
            var s = this.sides[i];
            var col;
    
            switch (s) {
                // "dreamy blue serenade" palette on coolors.co/palettes
                case R: col = "#7d84b2"; break;
                case Y: col = "#8e9dcc"; break;
                case G: col = "#d9dbf1"; break;
                case B: col = "#f9f9ed"; break;
            }
    
            ctx.beginPath();
            ctx.fillStyle = col;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
            angle += Math.PI / 2;
            ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
            ctx.lineTo(cx, cy);
            ctx.fill();
        }
    }
    
    function renderImage( ctx, img ) {
        var x = this.x;
        var y = this.y;
        var size = this.size;
        var id = this.id;
        var count = ~~( img.width / size );
        for (var i = 0; i < this.sides.length; i++) {
            ctx.drawImage(img, (id % count ) * size, (~~( id / count ) * size), size, size, x, y, size, size );
        }
    }

    var _p = Tile.prototype;
    _p.renderColor = renderColor;
    _p.renderImage = renderImage;
    _p.setTile = setTile;
    _p.init = init;
    _p.rotate = rotate;
    return Tile;

}( ) );

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

function reset()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var w = canvas.width;
    var h = canvas.height;

    var targetCols = 67;
    var size = Math.ceil(w / targetCols); 
    var targetRows = Math.ceil(h / size);

    var cols = targetCols;
    var rows = targetRows;

    var tiles = [];

    for (let y = 0; y < rows; y++) {
        var tmp = [];
        for (let x = 0; x < cols; x++) { 
            var id = ~~( Math.random() * 8 );
            var t = new WangTile( id, x * size, y * size, size);
            tmp.push( t );
        }
        tiles.push(tmp);
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            var tile_west = null;
            var tile_north = null;
            if (x > 0) tile_west = tiles[y][x - 1];
            if (y > 0) tile_north = tiles[y - 1][x];

            var t = tiles[y][x];
            t.setTile(tile_west, tile_north);
        }
    }

    ctx.clearRect(0, 0, w, h);

    // render using tiles[y][x]
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            var t = tiles[y][x];
            t.renderColor(ctx);
        }
    }
}

var resizeTimer = null;
window.addEventListener("resize", function(){
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reset, 80);
});

reset();

canvas.onmousedown = reset;
