// init config vars
const CONFIG = {
	delay: 30,
	grid: {
		width: 80,
		height: 40
	},
	colours: 30,
	palette: [
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#fff',
		'#ff0',
		'#ff0',
		'#fe0',
		'#fe0',
		'#fd0',
		'#fd0',
		'#fc0',
		'#fb0',
		'#f90',
		'#f70',
		'#f50',
		'#f30',
		'#f10',
		'#e00',
		'#c00',
		'#a00',
		'#800',
		'#600',
		'#400',
		'#200',
		'#000'
	]
};

// init the variables that will change
let timer;
let step = 0;
let grid = [];
let cursor = {
	x: 0,
	y: 0
}


function grid_init() {

	let fireplace = document.getElementById('fireplace');

	// build the grid data container
	for ( let y = 0, ylen = CONFIG.grid.height; y <= ylen; y++ ) {

		grid[y] = [];

		for ( let x = 0; x < CONFIG.grid.width; x++ ) {

			grid[y][x] = {
				colour: CONFIG.colours-1
			}

			// if this grid entry has a physical ember attached (eg. it isn't on the last row)
			if ( y < CONFIG.grid.height ) {

				let ember = document.createElement("div");

				// draw the ember
				// document.write('<div id="grid_x' + x + 'y' + y + '" class="ember" onMouseOver="cursor[\'x\'] = ' + x + '; cursor[\'y\'] = ' + y + ';"></div>');

				ember.id = "grid_x" + x + "y" + y;
				ember.className = "ember";
				ember.setAttribute("onMouseOver", "cursor['x'] = " + x + "; cursor['y'] = " + y + ";");

				fireplace.appendChild(ember);

				grid[y][x].ember = document.getElementById('grid_x' + x + 'y' + y);
			}

		}

	}
}



// start a spot fire
function spot() {

	if (
		(
			( cursor['x'] > 2 ) &&
			( cursor['x'] < CONFIG.grid.width-3 )
		) && (
			( cursor['y'] > 2 ) &&
			( cursor['y'] < CONFIG.grid.height-3 )
		)
	) {

		let x = cursor['x'];
		let y = cursor['y'];

		let flicker = Math.round(Math.random() * 10);
		let offset = Math.round(Math.random() * 1);
		let size = Math.round(Math.random() * 2) + 5;

		for ( let i = Math.round((y + offset) - size / 2), ilen = Math.round((y + offset) + size / 2); i < ilen; i++ ) {
			for ( let j = Math.round(x - size / 2), jlen = Math.round(x + size / 2); j < jlen; j++ ) {
				grid[i][j].colour = flicker;
			}
		}
	}
}



// fill in the grid
function grid_fill() {

	// figure out where the spot fire is
	spot();

	let averagepixel = 0;

	// only generate new dots at the bottom every N steps (or frames)
	// this gives the averaging a smoother look
	step++;
	if ( step >= 2 ) {
		step = 0;
	}


	// work out what colour to set each pixel
	for ( let y = CONFIG.grid.height; y >= 0; y-- ) {

		for ( let x = 0; x < CONFIG.grid.width; x++ ) {

			// if we're below the enture height of the grid
			if ( y == CONFIG.grid.height ) {

				// if we're in the 'colour generating step'
				if ( step == 0 ) {
					// set a random colour for the current grid ember
					grid[y][x].colour = Math.floor( Math.random() * CONFIG.colours);
				}

			} else {

				let averageEmber = 0;

				// if we're any column other than the two sides...
				if (
					( x > 0 ) &&
					( x < CONFIG.grid.width-1 )
				) {
					averageEmber += grid[y][x-1].colour;
					averageEmber += grid[y][x+1].colour;
					averageEmber += grid[y+1][x-1].colour;
					averageEmber += grid[y+1][x+1].colour;

				// otherwise we're looking at one of the side embers
				} else {

					// if we're on the left
					if ( x == 0 ) {
						averageEmber += grid[y][x+1].colour;
						averageEmber += grid[y+1][x+1].colour;
					} else {
						averageEmber += grid[y][x-1].colour;
						averageEmber += grid[y+1][x-1].colour;
					}

					// add 2 fake black sites as we don't have grid elements for them
					averageEmber += ((CONFIG.colours-1) * 2);
				}

				// find our ember value
				averageEmber += grid[y][x].colour;

				// find the ember below us
				averageEmber += (grid[y+1][x].colour * 2);

				averageEmber = Math.round(averageEmber / 6.8);

				// if we're beyond the palette
				if ( averageEmber > CONFIG.colours ) {
					averageEmber = CONFIG.colours - 1
				}
				grid[y][x].colour = averageEmber;
			}
		}
	}


	// draw the flame - this is the slow part!
	for ( let y = CONFIG.grid.height-1; y >= 0; y-- ) {

		for ( let x = 0; x < CONFIG.grid.width; x++ ) {

			// trying to push all the colour changing off to css in hopes it'll be quicker.
			grid[y][x].ember.style.backgroundColor = CONFIG.palette[grid[y][x].colour];

			// this was slowish
			// document.getElementById("grid_x" + x + "y" + y).style.backgroundColor = "#" + CONFIG.colours[grid[y][x]];

			// for transparent flames
			// document.getElementById("x" + x + "y" + y).style.opacity = 1 - ((1 / (palette.length - 1)) * griddata[y][x]);
		}
	}


	timer = setTimeout("grid_fill();", CONFIG.delay);
}


// start the whole process!
function fire_init() {
	grid_init();
	grid_fill();
}


fire_init();
