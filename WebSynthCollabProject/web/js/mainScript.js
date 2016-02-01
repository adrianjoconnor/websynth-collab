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
window.masterVolSetting = 35;
window.onScreenKeyboardOctave = 0;
window.onScreenKeyboardVelocity = 97;

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
window.DecaySetting1 = 0.35; // Decay value is in seconds.
window.SustainSetting1 = 0.8;
window.ReleaseSetting1 = 0.64; // Release value is in seconds.
window.OctaveMultiplierValue1 = 0;
window.SemitoneOffsetValue1 = 0;

window.volSetting2 = 35;
window.freqSetting2 = 220;
window.waveformSetting2 = 'square';
window.AttackSetting2 = 0.04;
window.DecaySetting2 = 0.35;
window.SustainSetting2 = 0.8;
window.ReleaseSetting2 = 0.64;
window.OctaveMultiplierValue2 = 0;
window.SemitoneOffsetValue2 = 0;

window.volSetting3 = 20;
window.freqSetting3 = 660;
window.waveformSetting3 = 'sawtooth';
window.AttackSetting3 = 0.04;
window.DecaySetting3 = 0.35;
window.SustainSetting3 = 0.8;
window.ReleaseSetting3 = 0.64;
window.OctaveMultiplierValue3 = 0;
window.SemitoneOffsetValue3 = 0;

window.LFOvol = 50;
window.LFOfreq = 1;
window.LFOwaveform = 'sine';
window.LFOattack = 0.04;
window.LFOdecay = 0.35;
window.LFOsustain = 0.8;
window.LFOrelease = 0.64;

function mobilecheck ( ) {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

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

    if ( mobilecheck() ) {
        $('#onScreenKeyboard').attr('octaves','1');
        $('#onScreenKeyboardOctaveSelect').append($('<option>', {
            value: 12,
            text: '12'
        }));
    }

    // Register on-screen keyboard.

    onScreenKeyboard = document.getElementById('onScreenKeyboard');

    onScreenKeyboard.addEventListener('noteon', function(e) {
        var note = parseInt(e.detail.index) + 36 + ( parseInt(window.onScreenKeyboardOctave) * 12 );
        var velocity = parseInt(window.onScreenKeyboardVelocity);
        turnNoteOn ( note, velocity );
    });

    onScreenKeyboard.addEventListener('noteoff', function(e) {
        var note = parseInt(e.detail.index) + 36 + ( parseInt(window.onScreenKeyboardOctave) * 12 );
        turnNoteOff ( note );
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
        turnNoteOff ( note );
    } else if ( midiInfo[0] == 144 ) { // Note on message                        
        var note = midiInfo[1];
        var velocity = midiInfo[2];
        turnNoteOn ( note, velocity );
        $("#onScreenKeyboard").find("div" + "[data-index='" + ( note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").addClass("active");
    }
}

function turnNoteOn ( note, velocity ) {
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

function turnNoteOff ( note ) {
    $("#onScreenKeyboard").find("div" + "[data-index='" + (note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").removeClass("active");
        
        for ( var curSynth = 0; curSynth < window.numSynths; curSynth++ ) {
            if ( window.synthStates[curSynth] == note ) {
                window.synths[curSynth].setupReleaseCallback( curSynth );
                
                break;
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

function reviseAttack1 ( newMsVal ) {
    window.AttackSetting1 = ( newMsVal / 1000 );
}

function reviseDecay1 ( newMsVal ) {
    window.DecaySetting1 = ( newMsVal / 1000 );
}

function reviseSustain1 ( newVol ) {
    window.SustainSetting1 = ( newVol );
}

function reviseRelease1 ( newMsVal ) {
    window.ReleaseSetting1 = ( newMsVal / 1000 );
}

function reviseAttack2 ( newMsVal ) {
    window.AttackSetting2 = ( newMsVal / 1000 );
}

function reviseDecay2 ( newMsVal ) {
    window.DecaySetting2 = ( newMsVal / 1000 );
}

function reviseSustain2 ( newVol ) {
    window.SustainSetting2 = ( newVol );
}

function reviseRelease2 ( newMsVal ) {
    window.ReleaseSetting2 = ( newMsVal / 1000 );
}

function reviseAttack3 ( newMsVal ) {
    window.AttackSetting3 = ( newMsVal / 1000 );
}

function reviseDecay3 ( newMsVal ) {
    window.DecaySetting3 = ( newMsVal / 1000 );
}

function reviseSustain3 ( newVol ) {
    window.SustainSetting3 = ( newVol );
}

function reviseRelease3 ( newMsVal ) {
    window.ReleaseSetting3 = ( newMsVal / 1000 );
}

function updateAttackText1 ( ) {
    var attackSelect1 = document.getElementById("attackSelect1");
    var attackDisplay1 = document.getElementById("attackDisplay1");
    
    var newLinVal = attackSelect1.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    attackDisplay1.value = newVal.toFixed(2);
    
    reviseAttack1( attackDisplay1.value );
}

function updateAttackSlider1 ( ) {
    var attackDisplay1 = document.getElementById("attackDisplay1");
    var attackSelect1 = document.getElementById("attackSelect1");
    
    var newVal = attackDisplay1.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            attackSelect1.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        attackSelect1.value = 5.5;
    }
    
    reviseAttack1( attackDisplay1.value );
}

function updateDecayText1 ( newVol ) {
    var decaySelect1 = document.getElementById("decaySelect1");
    var decayDisplay1 = document.getElementById("decayDisplay1");
    
    var newLinVal = decaySelect1.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    decayDisplay1.value = newVal.toFixed(2);
    
    reviseDecay1( decayDisplay1.value );
}

function updateDecaySlider1 ( newVol ) {                    
    var decayDisplay1 = document.getElementById("decayDisplay1");
    var decaySelect1 = document.getElementById("decaySelect1");
    
    var newVal = decayDisplay1.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            decaySelect1.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        decaySelect1.value = 5.5;
    }
    
    reviseDecay1( decayDisplay1.value );
}

function updateSustainText1 ( ) {
    var sustainSelect1 = document.getElementById("sustainSelect1");
    var sustainDisplay1 = document.getElementById("sustainDisplay1");
    var newVal = sustainSelect1.value;
    
    sustainDisplay1.value = newVal;
    reviseSustain1( sustainSelect1.value );
}

function updateSustainSlider1 ( ) {
    var sustainDisplay1 = document.getElementById("sustainDisplay1");
    var sustainSelect1 = document.getElementById("sustainSelect1");
    
    var newVal = sustainDisplay1.value;
    sustainSelect1.value = newVal;
    
    reviseSustain1( sustainDisplay1.value );
}

function updateReleaseText1 ( ) {
    var releaseSelect1 = document.getElementById("releaseSelect1");
    var releaseDisplay1 = document.getElementById("releaseDisplay1");
    
    var newLinVal = releaseSelect1.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    releaseDisplay1.value = newVal.toFixed(2);
    
    reviseRelease1( releaseDisplay1.value );
}

function updateReleaseSlider1 ( ) {
    var releaseDisplay1 = document.getElementById("releaseDisplay1");
    var releaseSelect1 = document.getElementById("releaseSelect1");
    
    var newVal = releaseDisplay1.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            releaseSelect1.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        releaseSelect1.value = 5.5;
    }
    
    reviseRelease1( releaseDisplay1.value );
}

function updateAttackText2 ( ) {
    var attackSelect2 = document.getElementById("attackSelect2");
    var attackDisplay2 = document.getElementById("attackDisplay2");
    
    var newLinVal = attackSelect2.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    attackDisplay2.value = newVal.toFixed(2);
    
    reviseAttack2( attackDisplay2.value );
}

function updateAttackSlider2 ( ) {
    var attackDisplay2 = document.getElementById("attackDisplay2");
    var attackSelect2 = document.getElementById("attackSelect2");
    
    var newVal = attackDisplay2.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            attackSelect2.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        attackSelect2.value = 5.5;
    }
    
    reviseAttack2( attackDisplay2.value );
}

function updateDecayText2 ( newVol ) {
    var decaySelect2 = document.getElementById("decaySelect2");
    var decayDisplay2 = document.getElementById("decayDisplay2");
    
    var newLinVal = decaySelect2.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    decayDisplay2.value = newVal.toFixed(2);
    
    reviseDecay2( decayDisplay2.value );
}

function updateDecaySlider2 ( newVol ) {                    
    var decayDisplay2 = document.getElementById("decayDisplay2");
    var decaySelect2 = document.getElementById("decaySelect2");
    
    var newVal = decayDisplay2.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            decaySelect2.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        decaySelect2.value = 5.5;
    }
    
    reviseDecay2( decayDisplay2.value );
}

function updateSustainText2 ( ) {
    var sustainSelect2 = document.getElementById("sustainSelect2");
    var sustainDisplay2 = document.getElementById("sustainDisplay2");
    var newVal = sustainSelect2.value;
    
    sustainDisplay2.value = newVal;
    reviseSustain2( sustainSelect2.value );
}

function updateSustainSlider2 ( ) {
    var sustainDisplay2 = document.getElementById("sustainDisplay2");
    var sustainSelect2 = document.getElementById("sustainSelect2");
    
    var newVal = sustainDisplay2.value;
    sustainSelect2.value = newVal;
    
    reviseSustain2( sustainDisplay2.value );
}

function updateReleaseText2 ( ) {
    var releaseSelect2 = document.getElementById("releaseSelect2");
    var releaseDisplay2 = document.getElementById("releaseDisplay2");
    
    var newLinVal = releaseSelect2.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    releaseDisplay2.value = newVal.toFixed(2);
    
    reviseRelease2( releaseDisplay2.value );
}

function updateReleaseSlider2 ( ) {
    var releaseDisplay2 = document.getElementById("releaseDisplay2");
    var releaseSelect2 = document.getElementById("releaseSelect2");
    
    var newVal = releaseDisplay2.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            releaseSelect2.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        releaseSelect2.value = 5.5;
    }
    
    reviseRelease2( releaseDisplay2.value );
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

function updateDecayText3 ( newVol ) {
    var decaySelect3 = document.getElementById("decaySelect3");
    var decayDisplay3 = document.getElementById("decayDisplay3");
    
    var newLinVal = decaySelect3.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    decayDisplay3.value = newVal.toFixed(2);
    
    reviseDecay3( decayDisplay3.value );
}

function updateDecaySlider3 ( newVol ) {                    
    var decayDisplay3 = document.getElementById("decayDisplay3");
    var decaySelect3 = document.getElementById("decaySelect3");
    
    var newVal = decayDisplay3.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            decaySelect3.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        decaySelect3.value = 5.5;
    }
    
    reviseDecay3( decayDisplay3.value );
}

function updateSustainText3 ( ) {
    var sustainSelect3 = document.getElementById("sustainSelect3");
    var sustainDisplay3 = document.getElementById("sustainDisplay3");
    var newVal = sustainSelect3.value;
    
    sustainDisplay3.value = newVal;
    reviseSustain3( sustainSelect3.value );
}

function updateSustainSlider3 ( ) {
    var sustainDisplay3 = document.getElementById("sustainDisplay3");
    var sustainSelect3 = document.getElementById("sustainSelect3");
    
    var newVal = sustainDisplay3.value;
    sustainSelect3.value = newVal;
    
    reviseSustain3( sustainDisplay3.value );
}

function updateReleaseText3 ( ) {
    var releaseSelect3 = document.getElementById("releaseSelect3");
    var releaseDisplay3 = document.getElementById("releaseDisplay3");
    
    var newLinVal = releaseSelect3.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    releaseDisplay3.value = newVal.toFixed(2);
    
    reviseRelease3( releaseDisplay3.value );
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