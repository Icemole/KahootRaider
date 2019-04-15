const puppeteer = require( "puppeteer" )


// Various useful constants
// Max nickname length = 15
const MAX_LENGTH = 15
const PIN_INPUT = "#inputSession"
const USERNAME_INPUT = "#username"
const ENTER_BUTTON = "button"
var CLOSE_BROWSER_TIMEOUT	// Declared when getting user input
const LOAD_TIMEOUT = 10 * 1000

// Options to check when the page is loading (with timeout)
const WAIT_OPTIONS_TIMEOUT = { waitUntil: "load", timeout: LOAD_TIMEOUT }
// Options to check when the page is loading (without timeout)
const WAIT_OPTIONS_NO_TIMEOUT = { waitUntil: "load" }


// Ask for two different inputs.
const GET_PIN = 0, GET_STRING = 1
var state = GET_PIN

// The game's pin and the phrase to name the bots with.
var pin, phrase

function launchPuppeteer() {
	puppeteer.launch( { args: [ "--no-sandbox" ] } ).then( async browser => {
		try {
			for( let i = 0; i < phrase.length; i++ ) {
				console.log( "Preparing the bot with nickname", phrase[ i ] + "..." )
				let page = await browser.newPage()
				await page.goto( "https://kahoot.it", WAIT_OPTIONS_NO_TIMEOUT )

				// await page.screenshot( { path: "1.png" } )	// Main screen

				await page.waitForSelector( PIN_INPUT, WAIT_OPTIONS_TIMEOUT )
				await page.click( PIN_INPUT ).then( () => {
					for( let j = 0; j < pin.length; j++ ) {
						page.keyboard.down( parseInt( pin.charAt( j ) ) )
					}
				} )

				// await page.screenshot( { path: "2.png" } )	// Main screen with input done

				await Promise.all( [
					page.click( ENTER_BUTTON ),
					page.waitForSelector( USERNAME_INPUT, WAIT_OPTIONS_TIMEOUT ),
				] ).then( function( i ) {
					// Need to pass down the value of i
					return async () => {

						// We are now on the nickname chooser screen.
						// Kahoot's webpage has a transition from "entirely loaded"
						// to "I can click on things", so we need to wait
						// some time for this restriction to go.
						await page.waitFor( 1000 )
						// await page.screenshot( { path: "3.png" } )	// Username input screen

						await page.click( USERNAME_INPUT ).then( function( i ) {
							return () => {
								for( let j = 0; j < phrase[ i ].length; j++ ) {
									page.keyboard.down( phrase[ i ].charAt( j ) )
								}
								// page.screenshot( { path: "4.png" } )	// Username input screen with username done
							}
						}( i ) )	// End of inner then()

						console.log( "The bot with nickname ", phrase[ i ], " is ready!" )
					}	// End of return async ()

				}( i ) )	// End of outer then()
			}	// End of for

			pages = await browser.pages()
			console.log()

			for( let i = pages.length - 1; i >= 1; i-- ) {
				await pages[ i ].click( ENTER_BUTTON )
				await pages[ i ].waitForNavigation()
				let nickname = phrase[ i - (pages.length - phrase.length) ]
				console.log( "The bot with nickname ", nickname, " has been deployed!" )
			}


		} catch( exception ) {
			console.log( exception )
		} finally {
			setTimeout( () => {
				browser.close()
			}, CLOSE_BROWSER_TIMEOUT )
		}
	} );
}

/**
 * Kahoot!'s nickname allows up to 15 characters.
 * This function respects such restriction
 * by dividing every word into subwords of 15 characters max.
 */
function processPhrase( phrase ) {
	// Remove leading \n introduced by stdin.
	phraseArray = phrase.split( "\n" )[ 0 ]
	phraseArray = phraseArray.split( " " )

	// If the word considered has more than 15 characters,
	// separate it on two different words.
	for( let i = 0; i < phraseArray.length; i++ ) {
		while( phraseArray[ i ].length > MAX_LENGTH ) {
			let leftover = phraseArray[ i ].substring( MAX_LENGTH, phraseArray[ i ].length )
			phraseArray.splice( i + 1, 0, leftover )
			phraseArray[ i ] = phraseArray[ i ].substring( 0, phraseArray[ i ].length - leftover.length )
		}
	}
	return phraseArray
}

process.stdin.resume()
process.stdin.setEncoding( "utf-8" )
console.log()
console.log( "-------------------------" )
console.log( "Welcome! This program creates bots which appear on Kahoot!'s lobby." )
console.log( "Please have patience, bots usually take 10-20 seconds to appear, and they do not" )
console.log( "appear at once, so try to summon them when you know nobody else will enter the lobby!" )
console.log()
/*
console.log( "Please take into account that sometimes the program may fail to push" )
console.log( "The program tries to avoid pushing the bots into the game out of order" )
console.log( "(this is why it is kind of slow when all bots are deployed), but it may" )
console.log( "sometimes happen. This would have happened in a manual execution of the" )
console.log( "sequence, and it has to do with the fact that the server may not receive" )
console.log( "the petitions to enter the game in order." )
console.log()
*/
console.log( "Type the game pin now:" )
process.stdin.on( "data", ( input ) => {
	if( state == GET_PIN ) {
		// Remove leading \n introduced by stdin.
		pin = input.split( "\n" )[ 0 ]
		state = GET_STRING
		console.log()
		console.log( "Nicknames to name bots with." )
		console.log( "-> Every bot will be named with a nickname" )
		console.log( "\ttaking into account the spaces you type." )
		console.log( "Example: if you type \"hello world\"" )
		console.log( "\tthe first bot will be named \"hello\" and" )
		console.log( "\tthe second one will be named \"world\"" )
		console.log( "Type the nicknames now:" )
	} else if( state == GET_STRING ) {
		phrase = processPhrase( input )
		CLOSE_BROWSER_TIMEOUT = phrase.length * 5 * 1000
		console.log()
		launchPuppeteer()
	}
} )
