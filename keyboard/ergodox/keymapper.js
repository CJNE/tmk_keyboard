var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var left = blessed.box({
  top: 'center',
  left: '2%',
  width: '42%',
  height: '50%',
  content: 'Left keyboard',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});
var right = blessed.box({
  top: 'center',
  left: '52%',
  width: '42%',
  height: '50%',
  content: 'Right keyboard',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});
//38 keys
var Key = function(index) {
  var self = this;
  var box = null;
  self.index = index;
  self.isLeft = function() { return self.index < 38; };
  self.mappings = new Array(72);
  self.getMapping = function(layer) {
    return self.mappings[layer];
  }
  self.setMapping = function(layer, mapping) {
    self.mappings[layer] = mapping;
  }

/*
    KEYMAP(  // layout: layer N: transparent on edges, all others are empty
        // left hand
        TRNS,NO,  NO,  NO,  NO,  NO,  NO,  
        TRNS,NO,  NO,  NO,  NO,  NO,  TRNS,
        TRNS,NO,  NO,  NO,  NO,  NO,  
        TRNS,NO,  NO,  NO,  NO,  NO,  TRNS,
        TRNS,TRNS,TRNS,LALT,LGUI,
                                      TRNS,TRNS,
                                           TRNS,
                                 LCTL,LSFT,TRNS,
        // right hand
             NO,  NO,  NO,  NO,  NO,  NO,  TRNS,
             TRNS,NO,  NO,  NO,  NO,  NO,  TRNS,
                  NO,  NO,  NO,  NO,  NO,  TRNS,
             TRNS,NO,  NO,  NO,  NO,  NO,  TRNS,
                       RGUI,RALT,TRNS,TRNS,TRNS,
        TRNS,TRNS,
        TRNS,
        TRNS,RSFT,RCTL
    ),
    */
  self.getBox = function() {
    if(box == null) {
      var pos = self.getPos();
      console.log("Key "+self.index+ " x: "+parseInt(pos.x)+" y: "+parseInt(pos.y)+" W:H "+pos.w+":"+pos.h);
      box = blessed.box({
        top: (100 / 8 * pos.y)+"%",
        left: (100 / 8 * pos.x)+"%",
        width: (100 / 8 * pos.w)+'%',
        height: (100 / 8 * pos.h)+'%',
        content: " K:"+(i - (self.isLeft() ? 0 : 38)),
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'green',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'pink'
          }
        }
      });
    }
    return box;
  }
  self.getPos = function() {
    var offsetIndex = self.index - (self.isLeft() ? 0 : 38);
    var x = 0, y = 0, w = 1, h= 1;
    switch(offsetIndex) {
      case 0: w = self.isLeft() ? 2 : 1; break;
      case 6: x = 6; w = self.isLeft() ? 1 : 2; break;
      case 7: y = 1; h = self.isLeft() ? 1 : 2; w = self.isLeft() ? 2 : 1; break;
      case 13: x = 6; y = 1; h = self.isLeft() ? 2 : 1; w = self.isLeft() ? 1 : 2; break;
      case 14: x = self.isLeft() ? 0 : 1; y = 2; w = self.isLeft() ? 2 : 1; break;
      case 19: x = self.isLeft() ? 1 : 0; y = 2; w = self.isLeft() ? 2 : 1; break;
      case 20: y = 3; h = self.isLeft() ? 1 : 2; w = self.isLeft() ? 2 : 1; break;
      case 26: y = 3; h = self.isLeft() ? 2 : 1; w = self.isLeft() ? 1 : 2; break;
      case 32: y = 5; x = self.isLeft() ? 5 : 0; break;
      case 33: y = 5; x = self.isLeft() ? 6 : 1; break;
      case 34: y = 6; x = self.isLeft() ? 6 : 0; break;
      case 35: y = self.isLeft() ? 6 : 7; h = self.isLeft() ? 2 : 1; x = self.isLeft() ? 4 : 0; break;
      case 36: y = 6; h = 2; x = self.isLeft() ? 5 : 1; break;
      case 37: y = self.isLeft() ? 7 : 6; h = self.isLeft() ? 1 : 2; x = self.isLeft() ? 6 : 2; break;
      default: {
        if(offsetIndex < 7) x = offsetIndex;
        else if(offsetIndex < 14) { 
          y = 1;
          x = offsetIndex - 7;
        }
        else if(offsetIndex < 20) {
          y = 2; 
          x = offsetIndex - 14;
        }
        else if(offsetIndex < 26) {
          y = 3;
          x = offsetIndex - 20;
        } 
        else {
          y = 4;
          x = offsetIndex - 26;
        } 
        break;
      }
    } 
    return { 'x': x, 'y': y, 'w': w, 'h': h };
  }
}

var i = 0;
var keys = [];
var keybox;
var pos;
var key;
for(i = 0; i < 72; i++) {
  key = new Key(i);
  keys.push(key);
  if(key.isLeft()) left.append(key.getBox());
  else right.append(key.getBox());
}


// Append our box to the screen.
screen.append(left);
screen.append(right);

// If our box is clicked, change the content.
left.on('click', function(data) {
  left.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
  screen.render();
});

// If box is focused, handle `enter`/`return` and give us some more content.
left.key('enter', function(ch, key) {
  left.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  left.setLine(1, 'bar');
  left.insertLine(1, 'foo');
  screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
left.focus();

// Render the screen.
screen.render();

