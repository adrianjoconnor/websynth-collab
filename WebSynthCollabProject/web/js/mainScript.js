// for mixdowns.
var sampleRate = 44100;
var bitDepth = 16;
var maxAmp = Math.pow ( 2, ( bitDepth - 1 ) ) - 1;
var sampleArrayLength = 2048; // Buffer size

var rangeFactor = Math.pow ( 2, bitDepth - 1 );

///////////////////////////////////////////////////////

var webAudioContext = new AudioContext();

var noteA4Frequency = 440; // value in hz
window.numSynths = 90;
window.masterVolSetting = 25;
window.onScreenKeyboardOctave = 0;

window.oscillatorTypes = [ 'sine', 'square', 'sawtooth', 'triangle' ];

var oscillatorSelectData = [
    {
        text: "Sine",
        value: "sine",
        description: "Sine Wave",
        imageSrc: "./img/sine.png"
    },
    {
        text: "Square",
        value: "square",
        description: "Square Wave",
        imageSrc: "./img/square.png"
    },
    {
        text: "Sawtooth",
        value: "sawtooth",
        description: "Sawtooth Wave",
        imageSrc: "./img/sawtooth.png"
    },
    {
        text: "Triangle",
        value: "triangle",
        description: "Triangle Wave",
        imageSrc: "./img/triangle.png"
    }
];

var expVals = [ 0.04, 0.08, 0.14, 0.21, 0.30, 0.41, 0.54, 0.71, 0.90, 1.14, 1.42, 1.76, 2.18, 2.69, 3.30, 4.05, 4.97, 6.09, 7.48, 9.18, 11.29, 13.91, 17.17, 21.23, 26.30, 32.66, 40.65, 50.72, 63.43, 79.51, 99.92, 125.87, 158.95, 201.21, 255.30, 324.70, 413.92, 528.86, 677.24, 869.17, 1117.93, 1440.95, 1861.21, 2408.99, 3124.30, 4060.07, 5286.40, 6896.33, 9013.48, 11802.36 ];

var onScreenKeyboard;

window.volSetting1 = 35;
window.freqSetting1 = 440;
window.waveformSetting1 = 'sine';
window.AttackSetting1 = 0.04; // Attack value is in seconds.
window.DecaySetting1 = 0.1; // Decay value is in seconds.
window.SustainSetting1 = 0.8;
window.ReleaseSetting1 = 0.14; // Release value is in seconds.
window.OctaveMultiplierValue1 = 0;
window.SemitoneOffsetValue1 = 0;

window.volSetting2 = 35;
window.freqSetting2 = 220;
window.waveformSetting2 = 'square';
window.AttackSetting2 = 0.04;
window.DecaySetting2 = 0.1;
window.SustainSetting2 = 0.8;
window.ReleaseSetting2 = 0.14;
window.OctaveMultiplierValue2 = 0;
window.SemitoneOffsetValue2 = 0;

window.volSetting3 = 20;
window.freqSetting3 = 660;
window.waveformSetting3 = 'sawtooth';
window.AttackSetting3 = 0.04;
window.DecaySetting3 = 0.1;
window.SustainSetting3 = 0.8;
window.ReleaseSetting3 = 0.14;
window.OctaveMultiplierValue3 = 0;
window.SemitoneOffsetValue3 = 0;

window.LFOvol = 50;
window.LFOfreq = 1;
window.LFOwaveform = 'sine';
window.LFOattack = 0;
window.LFOdecay = 100;
window.LFOsustain = 0.8;
window.LFOrelease = 10;


function Osc ( freq, vol, waveform, attack, decay, sustain, release, octaveMultiplier, semitoneOffset ) {
    this.oscillator = webAudioContext.createOscillator();
    this.volumeNode = webAudioContext.createGain();
    
    this.oscillator.frequency.value = freq;
    this.volumeNode.gain.value = vol / 100;
    this.oscillator.type = waveform;
    
    this.attack = attack;
    this.decay = decay;
    this.sustain = sustain;
    this.release = release;
    
    this.envelopeNode = webAudioContext.createGain();
    
    
    
    this.octaveMultiplier = octaveMultiplier;
    this.semitoneOffset = semitoneOffset;
}

Osc.prototype.connect = function () {
    this.oscillator.connect( this.envelopeNode );
    this.envelopeNode.connect( this.volumeNode );
};

Osc.prototype.changeFrequency = function ( newFreq ) {
    this.oscillator.frequency.value = newFreq;
};

Osc.prototype.setUpEnvelope = function () {
    var currentTime = webAudioContext.currentTime;
    
    this.envelopeNode.gain.setValueAtTime( 0, currentTime );
    this.envelopeNode.gain.linearRampToValueAtTime( 1, currentTime + this.attack ); // Attack is in seconds.
    this.envelopeNode.gain.exponentialRampToValueAtTime( this.sustain, currentTime + this.attack + this.decay );
};

// To be called when note is released.
Osc.prototype.releaseNow = function () {
    var currentTime = webAudioContext.currentTime;
    this.envelopeNode.gain.exponentialRampToValueAtTime( 0.0001, currentTime + this.release );
    // Release value is in seconds.
};

Osc.prototype.changeVolume = function ( newVol ) {
    this.volumeNode.gain.value = newVol;
};

Osc.prototype.changeWaveform = function ( newType ) {
    this.oscillator.type = newType;
};

Osc.prototype.changeAttack = function ( newAttack ) {
    this.attack = newAttack;
};

Osc.prototype.changeDecay = function ( newDecay ) {
    this.decay = newDecay;
};

Osc.prototype.changeSustain = function ( newSustain ) {
    this.sustain = newSustain;
};

Osc.prototype.changeRelease = function ( newRelease ) {
    this.release = newRelease;
};

Osc.prototype.changeOctaveMultiplier = function ( newVal ) {
    this.octaveMultiplier = newVal;
};

Osc.prototype.changeSemitoneOffset = function ( newVal ) {
    this.semitoneOffset = newVal;
};

// An LFO is an oscillator set to a very low (usually subsonic) frequency.
// It has no octave or semitone offset since it has a fixed frequency.
function makeLFO ( freq, vol, waveform, attack, decay, sustain, release ) {
    return new Osc ( freq, vol, waveform, attack, decay, sustain, release, 1, 0 );
}

/*

LFO.prototype.connect = function () {
    this.oscillator.connect( this.envelopeNode );
    this.envelopeNode.connect( this.volumeNode );
}

LFO.prototype.changeFrequency = function ( newFreq ) {
    this.oscillator.frequency.value = newFreq;
};

LFO.prototype.changeVolume = function ( newVol ) {
    this.volumeNode.gain.value = newVol;
};

LFO.prototype.changeWaveform = function ( newType ) {
    this.oscillator.type = newFreq;
};

LFO.prototype.changeAttack = function ( newAttack ) {
    this.attack = newAttack;
};

LFO.prototype.changeDecay = function ( newDecay ) {
    this.decay = newDecay;
};

LFO.prototype.changeSustain = function ( newSustain ) {
    this.sustain = newSustain;
};

LFO.prototype.changeRelease = function ( newRelease ) {
    this.release = newRelease;
};

LFO.prototype.setUpEnvelope = function () {
    var currentTime = webAudioContext.currentTime;
    
    this.envelopeNode.gain.setValueAtTime( 0, currentTime );
    this.envelopeNode.gain.linearRampToValueAtTime( 1, currentTime + this.attack );
    this.envelopeNode.gain.exponentialRampToValueAtTime( this.sustain, currentTime + this.attack + this.decay );
};

// To be called when note is released.
LFO.prototype.releaseNow = function () {
    var currentTime = webAudioContext.currentTime;
    
    this.envelopeNode.gain.exponentialRampToValueAtTime( 0.0001, currentTime + this.release );
};
        
*/

function Synth () {
    this.osc1 = new Osc( window.freqSetting1, window.volSetting1, window.waveformSetting1, window.AttackSetting1, window.DecaySetting1, window.SustainSetting1, window.ReleaseSetting1, window.OctaveMultiplierValue1, SemitoneOffsetValue1 );
    this.osc2 = new Osc( window.freqSetting2, window.volSetting2, window.waveformSetting2, window.AttackSetting2, window.DecaySetting2, window.SustainSetting2, window.ReleaseSetting2, window.OctaveMultiplierValue2, SemitoneOffsetValue2 );
    this.osc3 = new Osc( window.freqSetting3, window.volSetting3, window.waveformSetting3, window.AttackSetting3, window.DecaySetting3, window.SustainSetting3, window.ReleaseSetting3, window.OctaveMultiplierValue3, SemitoneOffsetValue3 );
    this.LFO = makeLFO( window.LFOfreq, window.LFOvol, window.LFOwaveform, window.LFOattack, window.LFOdecay, window.LFOsustain, window.LFOrelease );
    
    this.midiGainNode = webAudioContext.createGain();
    this.masterVolumeNode = webAudioContext.createGain();
    
};

Synth.prototype.connect = function () {
    this.osc1.connect();
    this.osc2.connect();
    this.osc3.connect();
    this.LFO.connect();

    this.osc1.volumeNode.connect( this.midiGainNode );
    this.osc2.volumeNode.connect( this.midiGainNode );
    this.osc3.volumeNode.connect( this.midiGainNode );
    this.LFO.volumeNode.connect( this.midiGainNode );
    
    this.midiGainNode.connect( this.masterVolumeNode );
    
    this.masterVolumeNode.connect( webAudioContext.destination );
};

Synth.prototype.changeMidiVolume = function ( newVol ) {
    this.midiGainNode.gain.value = newVol / 100;
};

Synth.prototype.start = function () {
    this.osc1.setUpEnvelope();
    this.osc2.setUpEnvelope();
    this.osc3.setUpEnvelope();

    this.osc1.oscillator.start();
    this.osc2.oscillator.start();
    this.osc3.oscillator.start();
};

Synth.prototype.stop = function () {
    this.osc1.oscillator.stop();
    this.osc2.oscillator.stop();
    this.osc3.oscillator.stop();
};

Synth.prototype.changeMasterVolume = function ( newVol ) {
    this.masterVolumeNode.gain.value = newVol;
};

Synth.prototype.setupReleaseCallback = function ( synthNum ) {
    
    this.osc1.releaseNow();
    this.osc2.releaseNow();
    this.osc3.releaseNow();
    this.LFO.releaseNow();
    
    var maxRelease = 0;
    
    if ( this.osc1.release > maxRelease ) {
        maxRelease = this.osc1.release;
    }
    if ( this.osc2.release > maxRelease ) {
        maxRelease = this.osc2.release;
    }
    if ( this.osc3.release > maxRelease ) {
        maxRelease = this.osc3.release;
    }
    if ( this.LFO.release > maxRelease ) {
        maxRelease = this.LFO.release;
    }
    
    // Use 129 for release phase.
    window.synthStates[synthNum] = 129;
    
    
    setTimeout( function(){ 
        window.synths[synthNum].stop();
        window.synthStates[synthNum] = 128;
    }, ( maxRelease * 1000 ) + 20 );
    
};

var playState = false;

var volumeNode = webAudioContext.createGain();

var source;

var osc1;
var osc2;
var osc3;
osc1 = webAudioContext.createOscillator();
osc2 = webAudioContext.createOscillator();
osc3 = webAudioContext.createOscillator();

var osc1VolNode = webAudioContext.createGain();
var osc2VolNode = webAudioContext.createGain();
var osc3VolNode = webAudioContext.createGain();

osc1VolNode.gain.value = volSetting1 / 100;
osc2VolNode.gain.value = volSetting2 / 100;
osc3VolNode.gain.value = volSetting3 / 100;

$( document ).ready(function() {

    // Register on-screen keyboard.

    onScreenKeyboard = document.getElementById('onScreenKeyboard');

    onScreenKeyboard.addEventListener('noteon', function(e) {
        console.log( "howiyagettinohnn: " + e.detail.index );
    });

    onScreenKeyboard.addEventListener('noteoff', function(e) {
        console.log( "howiyagettinohff: " + e.detail.index );
    });

    // Create multiple synths for chords.
    
    window.synths = [];
    
    window.synthStates = [];
    
    for ( var synthStateNo = 0; synthStateNo < numSynths; synthStateNo++ ) {
        window.synthStates[synthStateNo] = 128; // Use 128 for off. 0-127 denote note velocity.
    }
    
    var oscKnobWidth = 80;
    var oscKnobThickness = 0.2;

    $("#master-volume-knob").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseMasterVolume( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });

    $("#volume-knob-1").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume1( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
                    
    $("#frequency-knob-1").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq1( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
                    
    $("#volume-knob-2").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume2( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
                    
    $("#frequency-knob-2").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq2( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
                    
    $("#volume-knob-3").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume3( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
                    
    $("#frequency-knob-3").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq3( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                    });
    
    $('#master-volume-knob')
        .val(35)
        .trigger('change');
                    
    $('#volume-knob-1')
        .val(window.volSetting1)
        .trigger('change');
    
    $('#volume-knob-2')
        .val(window.volSetting2)
        .trigger('change');
        
    $('#volume-knob-3')
        .val(window.volSetting3)
        .trigger('change');
    
    $('#frequency-knob-1')
        .val(window.freqSetting1)
        .trigger('change');
    
    $('#frequency-knob-2')
        .val(window.freqSetting2)
        .trigger('change');
        
    $('#frequency-knob-3')
        .val(window.freqSetting3)
        .trigger('change');
    
    $('#waveformSelect1').empty();
    
    $('#waveformSelect1').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex:0,
        onSelected: function(data){
            reviseWaveform1( data.selectedData.value );
        }
    });
    
    $('#waveformSelect2').empty();
    
    $('#waveformSelect2').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex:1,
        onSelected: function(data){
            reviseWaveform2( data.selectedData.value );
        }
    });
    
    $('#waveformSelect3').empty();
    
    $('#waveformSelect3').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex:2,
        onSelected: function(data){
            reviseWaveform3( data.selectedData.value );
        }
    });

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
    
    switchMidiKeyboard ();
}

function processMidiInput ( midiMessage ) {

    var midiInfo = midiMessage.data;
    
    if ( midiInfo[0] == 128 || ( midiInfo[0] == 144 && midiInfo[2] == 0 ) ) { // Note off message
        var note = midiInfo[1];
        
        $("#onScreenKeyboard").find("div" + "[data-index='" + (note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").removeClass("active");
        
        for ( var curSynth = 0; curSynth < window.numSynths; curSynth++ ) {
            if ( window.synthStates[curSynth] == note ) {
                window.synths[curSynth].setupReleaseCallback( curSynth );
                
                break;
            }
        }
        
    } else if ( midiInfo[0] == 144 ) { // Note on message                        
        var note = midiInfo[1];
        var velocity = midiInfo[2];
        
        for ( var curSynth = 0; curSynth < window.numSynths; curSynth++ ) {
            if ( window.synthStates[curSynth] == 128 ) {
                window.synthStates[curSynth] = note;
                window.synths[curSynth] = new Synth();
                window.synths[curSynth].changeMidiVolume( (velocity / 128) ); // Gain is between 0 and 1.
                window.synths[curSynth].changeMasterVolume( window.masterVolSetting )
                
                // Frequency of musical note from a midi note is (note A4 freq) * 2 ^ ( (note-69) / 12 ) 
                // ^ symbol above denotes to the power of.
                // See https://en.wikipedia.org/wiki/MIDI_Tuning_Standard for info
                // Semitone offset and octave multiplier must also be taken into account.
                
                var note1 = parseInt( note ) + ( parseInt(window.synths[curSynth].osc1.octaveMultiplier) * 12 ) + parseInt(window.synths[curSynth].osc1.semitoneOffset);
                var note2 = parseInt( note ) + ( parseInt(window.synths[curSynth].osc2.octaveMultiplier) * 12 ) + parseInt(window.synths[curSynth].osc2.semitoneOffset);
                var note3 = parseInt( note ) + ( parseInt(window.synths[curSynth].osc3.octaveMultiplier) * 12 ) + parseInt(window.synths[curSynth].osc3.semitoneOffset);
                
                window.synths[curSynth].osc1.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note1 - 69 ) / 12 ) ) );
                window.synths[curSynth].osc2.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note2 - 69 ) / 12 ) ) );
                window.synths[curSynth].osc3.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note3 - 69 ) / 12 ) ) );
                
                console.log( "Osc1 freq: " + ( window.noteA4Frequency * Math.pow( 2, ( ( note1 - 69 ) / 12 ) ) ) );
                console.log( "Osc2 freq: " + ( window.noteA4Frequency * Math.pow( 2, ( ( note2 - 69 ) / 12 ) ) ) );
                console.log( "Osc3 freq: " + ( window.noteA4Frequency * Math.pow( 2, ( ( note3 - 69 ) / 12 ) ) ) );
                
                window.synths[curSynth].connect();
                window.synths[curSynth].start();
                
                $("#onScreenKeyboard").find("div" + "[data-index='" + ( note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").addClass("active");
                
                break;
            }
        }
    }
    
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
            midiInput.value.onmidimessage = function () {};
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
        osc3.stop();
        osc1 = webAudioContext.createOscillator();
        osc2 = webAudioContext.createOscillator();
        osc3 = webAudioContext.createOscillator();
        playState = false;
    } else {
        document.getElementById("playButton").innerHTML = "Stop";
        playSine( window.freqSetting1, window.freqSetting2, window.freqSetting3, window.volSetting1, window.volSetting2, window.volSetting3, window.masterVolSetting );
        playState = true;
    }
}

function playSine( freq1, freq2, freq3, vol1, vol2, vol3, masterVolume ) {
    
    osc1.type = 'sine';
    osc1.frequency.value = freq1;
    
    osc2.type = 'square';
   
    osc2.frequency.value = freq2;
    
    osc3.type = 'sawtooth';
    osc3.frequency.value = freq3;
    
    volumeNode.gain.value = 1;
    
    osc1.connect(osc1VolNode);
    osc2.connect(osc2VolNode);
    osc3.connect(osc3VolNode);
    
    osc1VolNode.connect(volumeNode);
    osc2VolNode.connect(volumeNode);
    osc3VolNode.connect(volumeNode);
    
    volumeNode.connect( webAudioContext.destination );
    
    osc1.start();
    osc2.start();
    osc3.start();
    
}

function MasterVolumeTextChange () {
    masterVolSetting = document.getElementById("master-volume-knob").value;
    reviseMasterVolume( masterVolSetting );
}

function changeOnScreenKeyboardOctaveSelect () {
    var onScreenKeyboardOctaveSelect = document.getElementById("onScreenKeyboardOctaveSelect");
    var newOctave = onScreenKeyboardOctaveSelect.options[onScreenKeyboardOctaveSelect.selectedIndex].value;
    reviseOnScreenKeyboardOctave( newOctave );
}

function VolumeTextChange1 () {
    var newVolSetting = document.getElementById("volume-knob-1").value;
    reviseVolume1( newVolSetting );
}

function FreqTextChange1() {
    var newFreqSetting = document.getElementById("frequency-knob-1").value;
    reviseFreq1( newFreqSetting );
}

function changeOsc1WaveformSelect() {
    var osc1WaveformSelect = document.getElementById("waveformSelect1");
    var newType = osc1WaveformSelect.options[osc1WaveformSelect.selectedIndex].value;
    reviseWaveform1( newType );
}

function changeOsc1OctaveSelect() {
    var osc1OctaveSelect = document.getElementById("octaveSelect1");
    var newOctave = osc1OctaveSelect.options[osc1OctaveSelect.selectedIndex].value;
    reviseOctave1( newOctave );
}

function changeOsc1SemitoneSelect() {
    var osc1SemitoneSelect = document.getElementById("semitoneSelect1");
    var newVal = osc1SemitoneSelect.options[osc1SemitoneSelect.selectedIndex].value;
    reviseSemitoneOffset1( newVal );
}

function VolumeTextChange2 () {
    var newVolSetting = document.getElementById("volume-knob-2").value;
    reviseVolume2( newVolSetting );
}

function FreqTextChange2() {
    var newFreqSetting = document.getElementById("frequency-knob-2").value;
    reviseFreq2( newFreqSetting );
}

function changeOsc2WaveformSelect() {
    var osc2WaveformSelect = document.getElementById("waveformSelect2");
    var newType = osc2WaveformSelect.options[osc2WaveformSelect.selectedIndex].value;
    reviseWaveform2( newType );
}

function changeOsc2OctaveSelect() {
    var osc2OctaveSelect = document.getElementById("octaveSelect2");
    var newOctave = osc2OctaveSelect.options[osc2OctaveSelect.selectedIndex].value;
    reviseOctave2( newOctave );
}

function changeOsc2SemitoneSelect() {
    var osc2SemitoneSelect = document.getElementById("semitoneSelect2");
    var newVal = osc2SemitoneSelect.options[osc2SemitoneSelect.selectedIndex].value;
    reviseSemitoneOffset2( newVal );
}

function VolumeTextChange3 () {
    var newVolSetting = document.getElementById("volume-knob-3").value;
    reviseVolume3( newVolSetting );
}

function FreqTextChange3() {
    var newFreqSetting = document.getElementById("frequency-knob-3").value;
    reviseFreq3( newFreqSetting );
}

function changeOsc3WaveformSelect() {
    var osc3WaveformSelect = document.getElementById("waveformSelect3");
    var newType = osc3WaveformSelect.options[osc3WaveformSelect.selectedIndex].value;
    reviseWaveform3( newType );
}

function changeOsc3OctaveSelect() {
    var osc3OctaveSelect = document.getElementById("octaveSelect3");
    var newOctave = osc3OctaveSelect.options[osc3OctaveSelect.selectedIndex].value;
    reviseOctave3( newOctave );
}

function changeOsc3SemitoneSelect() {
    var osc3SemitoneSelect = document.getElementById("semitoneSelect3");
    var newVal = osc3SemitoneSelect.options[osc3SemitoneSelect.selectedIndex].value;
    reviseSemitoneOffset3( newVal );
}

function reviseMasterVolume ( vol ) {
    window.masterVolSetting = vol;
    volumeNode.gain.value = vol / 100;
}

function reviseOnScreenKeyboardOctave ( newOctave ) {
    window.onScreenKeyboardOctave = newOctave;
}

function reviseVolume1 ( vol ) {
    window.volSetting1 = vol;
    osc1VolNode.gain.value = vol / 100;
}

function reviseFreq1 ( freq ) {
    window.freqSetting1 = freq;
    osc1.frequency.value = freq;
}

function reviseWaveform1 ( type ) {
    window.waveformSetting1 = type;
}

function reviseOctave1 ( newOctave ) {
    window.OctaveMultiplierValue1 = newOctave;
}

function reviseSemitoneOffset1 ( newVal ) {
    window.SemitoneOffsetValue1 = newVal;
}

function reviseVolume2 ( vol ) {
    window.volSetting2 = vol;
    osc2VolNode.gain.value = vol / 100;
}

function reviseFreq2 ( freq ) {
    window.freqSetting2 = freq;
    osc2.frequency.value = freq;
}

function reviseWaveform2 ( type ) {
    window.waveformSetting2 = type;
}

function reviseOctave2 ( newOctave ) {
    window.OctaveMultiplierValue2 = newOctave;
}

function reviseSemitoneOffset2 ( newVal ) {
    window.SemitoneOffsetValue2 = newVal;
}

function reviseVolume3 ( vol ) {
    window.volSetting3 = vol;
    osc3VolNode.gain.value = vol / 100;
}

function reviseFreq3 ( freq ) {
    window.freqSetting3 = freq;
    osc3.frequency.value = freq;
}

function reviseWaveform3 ( type ) {
    window.waveformSetting3 = type;
}

function reviseOctave3 ( newOctave ) {
    window.OctaveMultiplierValue3 = newOctave;
}

function reviseSemitoneOffset3 ( newVal ) {
    window.SemitoneOffsetValue3 = newVal;
}

function reviseAttack3 ( newMsVal ) {
    window.AttackSetting3 = ( newMsVal / 1000 );
}

function updateAttackText3 ( ) {
    var attackSelect3 = document.getElementById("attackSelect3");
    var attackDisplay3 = document.getElementById("attackDisplay3");
    
    var newLinVal = attackSelect3.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    attackDisplay3.value = newVal.toFixed(2);
    
    reviseAttack3( attackDisplay3.value );
}

function updateAttackSlider3 ( ) {
    var attackDisplay3 = document.getElementById("attackDisplay3");
    var attackSelect3 = document.getElementById("attackSelect3");
    
    var newVal = attackDisplay3.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            attackSelect3.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        attackSelect3.value = 5.5;
    }
    
    reviseAttack3( attackDisplay3.value );
}

function reviseRelease3 ( newMsVal ) {
    window.ReleaseSetting3 = ( newMsVal / 1000 );
}

function updateReleaseText3 ( ) {
    var releaseSelect3 = document.getElementById("releaseSelect3");
    var releaseDisplay3 = document.getElementById("releaseDisplay3");
    
    var newLinVal = releaseSelect3.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    releaseDisplay3.value = newVal.toFixed(2);
    
    reviseAttack3( releaseDisplay3.value );
}

function updateReleaseSlider3 ( ) {
    var releaseDisplay3 = document.getElementById("releaseDisplay3");
    var releaseSelect3 = document.getElementById("releaseSelect3");
    
    var newVal = releaseDisplay3.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            releaseSelect3.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        releaseSelect3.value = 5.5;
    }
    
    reviseRelease3( releaseDisplay3.value );
}