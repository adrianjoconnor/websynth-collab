var sampleRate = 44100;
var bitDepth = 16;
var maxAmp = Math.pow ( 2, ( bitDepth - 1 ) ) - 1;
var sampleArrayLength = 2048; // Buffer size

var rangeFactor = Math.pow ( 2, bitDepth - 1 );

window.volSetting = 25;
window.freqSetting = 440;

var playState = false;

var webAudioContext = new AudioContext();

var volumeNode = webAudioContext.createGain();

var source;

var osc1;
var osc2;
osc1 = webAudioContext.createOscillator();
osc2 = webAudioContext.createOscillator();

$( document ).ready(function() {
    $("#volume-knob").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume1( val ) },
                    });
                    
    $("#frequency-knob").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq1( val ) },
                    });
                    
    $('#volume-knob')
        .val(25)
        .trigger('change');
});

if (navigator.requestMIDIAccess) {
    var midiAccessPromise = window.navigator.requestMIDIAccess( {
        sysex: false
        // There's no need for sysex here.
    } ).then( accessGrantedToMIDI, accessDeniedToMIDI );
} else {
    console.log("Web MIDI not supported in this browser/version.");
}

function accessGrantedToMIDI ( MIDIobject ) {

    window.MidiInfoObject = MIDIobject;

    console.log( window.MidiInfoObject );
    var midiInputIterator = window.MidiInfoObject.inputs.values();
    
    var midiKeyboardSelect = document.getElementById("midiKeyboard");
    
    for (var midiInput = midiInputIterator.next(); ! midiInput.done ; midiInput = midiInputIterator.next() ) {
        console.log( midiInput.value );
        
        var inputLabel = "(" + midiInput.value.id + ") " +midiInput.value.manufacturer + " " + midiInput.value.name;
        var inputId = midiInput.value.id;
        
        var inputOptionTag = new Option( inputLabel, inputId );
        
        midiKeyboardSelect.add( inputOptionTag );
    }
}

function processMidiInput ( midiMessage ) {
    var midiInfo = midiMessage.data;
    

    playSine( 880, 70 );
}

function switchMidiKeyboard () {
    var midiInputIterator = window.MidiInfoObject.inputs.values();
    
    for (var midiInput = midiInputIterator.next(); ! midiInput.done ; midiInput = midiInputIterator.next() ) {
        var midiKeyboardSelect = document.getElementById("midiKeyboard");
        var selectedId = midiKeyboardSelect.options[midiKeyboardSelect.selectedIndex].value;
        if ( selectedId == midiInput.value.id ) {
            midiInput.value.onmidimessage = processMidiInput;
            console.log("MIDI Keyboard " + midiInput.value.id + " selected.");
        } else {
            
        }
    }
    
}



function accessDeniedToMIDI ( errorMessage ) {
    console.log( errorMessage );
}

if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        console.log( "Web Audio API not properly supported." );
    }
    window.AudioContext = window.webkitAudioContext; // Some versions of Chrome need this.
}

function playSound () {    
    if ( playState ) {
        document.getElementById("playButton").innerHTML = "Play";
        osc1.stop();
        osc2.stop();
        osc1 = webAudioContext.createOscillator();
        osc2 = webAudioContext.createOscillator();
        playState = false;
    } else {
        document.getElementById("playButton").innerHTML = "Stop";
        playSine( window.freqSetting, window.volSetting );
        playState = true;
    }
}

function playSine( freq, volume ) {

    osc1.type = 'sine';
    osc1.frequency.value = freq;
    volumeNode.gain.value = volume / 100;
    
    osc1.connect(volumeNode);
    
    volumeNode.connect( webAudioContext.destination );
    
    osc1.start();
    
}

function VolumeTextChange () {
    var newVolSetting = document.getElementById("volume-knob").value;
    reviseVolume1( newVolSetting );
}

function FreqTextChange() {
    var newFreqSetting = document.getElementById("frequency-knob").value;
    reviseFreq1( newFreqSetting );
}

function reviseVolume1 ( vol ) {
    window.volSetting = vol;
    volumeNode.gain.value = vol / 100;
}

function reviseFreq1 ( freq ) {
    window.freqSetting = freq;
    osc1.frequency.value = freq;
} 