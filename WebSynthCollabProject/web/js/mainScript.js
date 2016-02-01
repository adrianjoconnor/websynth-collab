// for mixdowns.
var sampleRate = 44100;
var bitDepth = 16;
var maxAmp = Math.pow ( 2, ( bitDepth - 1 ) ) - 1;
var sampleArrayLength = 2048; // Buffer size

var rangeFactor = Math.pow ( 2, bitDepth - 1 );

///////////////////////////////////////////////////////

var webAudioContext = new AudioContext();

var noteA4Frequency = 440;

window.numSynths = 10;

window.masterVolSetting = 25;

window.volSetting1 = 35;
window.freqSetting1 = 440;
window.waveformSetting1 = 'sine';
window.AttackSetting1 = 0;
window.DecaySetting1 = 100;
window.SustainSetting1 = 0.8;
window.ReleaseSetting1 = 10;
window.OctaveMultiplierValue1 = 1;
window.SemitoneOffsetValue1 = 1;

window.volSetting2 = 35;
window.freqSetting2 = 220;
window.waveformSetting2 = 'square';
window.AttackSetting2 = 0;
window.DecaySetting2 = 100;
window.SustainSetting2 = 0.8;
window.ReleaseSetting2 = 10;
window.OctaveMultiplierValue2 = 1;
window.SemitoneOffsetValue2 = 1;

window.volSetting3 = 20;
window.freqSetting3 = 660;
window.waveformSetting3 = 'sawtooth';
window.AttackSetting3 = 0;
window.DecaySetting3 = 100;
window.SustainSetting3 = 0.8;
window.ReleaseSetting3 = 10;
window.OctaveMultiplierValue3 = 1;
window.SemitoneOffsetValue3 = 1;

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
    this.envelopeNode.gain.linearRampToValueAtTime( 1, currentTime + this.attack );
    this.envelopeNode.gain.exponentialRampToValueAtTime( this.sustain, currentTime + this.attack + this.decay );
};

// To be called when note is released.
Osc.prototype.releaseNow = function () {
    var currentTime = webAudioContext.currentTime;
    
    this.envelopeNode.gain.exponentialRampToValueAtTime( 0.0001, currentTime + this.release );
};

Osc.prototype.changeVolume = function ( newVol ) {
    this.volumeNode.gain.value = newVol;
};

Osc.prototype.changeWaveform = function ( newType ) {
    this.oscillator.type = newFreq;
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

function LFO ( freq, vol, waveform, attack, decay, sustain, release ) {
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
}

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

function Synth () {
    this.osc1 = new Osc( window.freqSetting1, window.volSetting1, window.waveformSetting1, window.AttackSetting1, window.DecaySetting1, window.SustainSetting1, window.ReleaseSetting1, window.OctaveMultiplierValue1, SemitoneOffsetValue1 );
    this.osc2 = new Osc( window.freqSetting2, window.volSetting2, window.waveformSetting2, window.AttackSetting2, window.DecaySetting2, window.SustainSetting2, window.ReleaseSetting2, window.OctaveMultiplierValue2, SemitoneOffsetValue2 );
    this.osc3 = new Osc( window.freqSetting3, window.volSetting3, window.waveformSetting3, window.AttackSetting3, window.DecaySetting3, window.SustainSetting3, window.ReleaseSetting3, window.OctaveMultiplierValue3, SemitoneOffsetValue3 );
    this.LFO = new LFO( window.LFOfreq, window.LFOvol, window.LFOwaveform, window.LFOattack, window.LFOdecay, window.LFOsustain, window.LFOrelease );
    
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
    
    setTimeout( function(){ 
        window.synths[synthNum].stop();
        window.synthStates[synthNum] = 128;
    }, maxRelease + 20 );
    
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

    // Create multiple synths for chords.

    window.synths = [];
    
    window.synthStates = [];
    
    for ( var synthStateNo = 0; synthStateNo < numSynths; synthStateNo++ ) {
        window.synthStates[synthStateNo] = 128; // Use 128 for off. 0-127 denote note velocity.
    }

    $("#master-volume-knob").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseMasterVolume( val ) },
                    });

    $("#volume-knob-1").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume1( val ) },
                    });
                    
    $("#frequency-knob-1").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq1( val ) },
                    });
                    
    $("#volume-knob-2").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume2( val ) },
                    });
                    
    $("#frequency-knob-2").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq2( val ) },
                    });
                    
    $("#volume-knob-3").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume3( val ) },
                    });
                    
    $("#frequency-knob-3").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreq3( val ) },
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
                window.synths[curSynth].changeMidiVolume( (velocity / 128) );
                window.synths[curSynth].changeMasterVolume( window.masterVolSetting )
                
                // Frequency of musical note from a midi note is (note A4 freq) * 2 ^ ( (note-69) / 12 ) 
                // ^ above denotes to the power of.
                // See https://en.wikipedia.org/wiki/MIDI_Tuning_Standard for info
                // Semitone offset and octave multiplier must also be taken into account.
                
                window.synths[curSynth].osc1.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note - 69 + ( ( window.synths[curSynth].osc1.octaveMultiplier - 1 ) * 12 ) + window.synths[curSynth].osc1.semitoneOffset ) / 12 ) )    );
                window.synths[curSynth].osc2.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note - 69 + ( ( window.synths[curSynth].osc2.octaveMultiplier - 1 ) * 12 ) + window.synths[curSynth].osc2.semitoneOffset ) / 12 ) )    );
                window.synths[curSynth].osc3.changeFrequency (
                    window.noteA4Frequency * Math.pow( 2, ( ( note - 69 + ( ( window.synths[curSynth].osc3.octaveMultiplier - 1 ) * 12 ) + window.synths[curSynth].osc3.semitoneOffset ) / 12 ) )    );
                
                window.synths[curSynth].connect();
                window.synths[curSynth].start();
                
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

function VolumeTextChange1 () {
    var newVolSetting = document.getElementById("volume-knob-1").value;
    reviseVolume1( newVolSetting );
}

function FreqTextChange1() {
    var newFreqSetting = document.getElementById("frequency-knob-1").value;
    reviseFreq1( newFreqSetting );
}

function VolumeTextChange2 () {
    var newVolSetting = document.getElementById("volume-knob-2").value;
    reviseVolume2( newVolSetting );
}

function FreqTextChange3() {
    var newFreqSetting = document.getElementById("frequency-knob-3").value;
    reviseFreq3( newFreqSetting );
}

function VolumeTextChange3 () {
    var newVolSetting = document.getElementById("volume-knob-3").value;
    reviseVolume3( newVolSetting );
}

function FreqTextChange2() {
    var newFreqSetting = document.getElementById("frequency-knob-2").value;
    reviseFreq2( newFreqSetting );
}

function reviseMasterVolume ( vol ) {
    window.masterVolSetting = vol;
    volumeNode.gain.value = vol / 100;
}

function reviseVolume1 ( vol ) {
    window.volSetting1 = vol;
    osc1VolNode.gain.value = vol / 100;
}

function reviseFreq1 ( freq ) {
    window.freqSetting1 = freq;
    osc1.frequency.value = freq;
}

function reviseVolume2 ( vol ) {
    window.volSetting2 = vol;
    osc2VolNode.gain.value = vol / 100;
}

function reviseFreq2 ( freq ) {
    window.freqSetting2 = freq;
    osc2.frequency.value = freq;
}

function reviseVolume3 ( vol ) {
    window.volSetting3 = vol;
    osc3VolNode.gain.value = vol / 100;
}

function reviseFreq3 ( freq ) {
    window.freqSetting3 = freq;
    osc3.frequency.value = freq;
}