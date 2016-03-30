window.loggingOn = false;

// for mixdowns.
var bitDepth = 16;
var maxAmp = Math.pow ( 2, ( bitDepth - 1 ) ) - 1;
var sampleArrayLength = 2048; // Buffer size
var maxAmp = Math.pow ( 2, ( bitDepth - 1 ) ) - 1;
var rangeFactor = Math.pow ( 2, bitDepth - 1 );

var serverURL = "ws://server-de.adrianoc.com:6520";
window.collabReady = false;

// for recording

var recordingBuffersize = 1024;
var inputChannels = 2;
var outputChannels = 2;

///////////////////////////////////////////////////////

window.numSynths = 90;
window.onScreenKeyboardVelocity = 97;

window.collabId = "";

window.chatName = "John";

window.recording = false;

var webAudioContext = new AudioContext();

window.stereoPannerNode = webAudioContext.createStereoPanner();

window.lowpassFilterNode = webAudioContext.createBiquadFilter();
window.lowpassFilterNode.type = "lowpass";

window.highpassFilterNode = webAudioContext.createBiquadFilter();
window.highpassFilterNode.type = "highpass";

window.exitNode = webAudioContext.createGain();

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

var defaultSettings = {
    noteA4Frequency:    440, // value in hz
    masterVolSetting:   35,
    onScreenKeyboardOctave: 0,
    balance:    0,
    lowpassFilterFreq:  20000,
    highpassFilterFreq: 0,
    
    volSetting1:    35,
    freqSetting1:    440, // not used. see makeLFO function.
    waveformSetting1:    'sine',
    AttackSetting1:    0.04, // Attack value is in seconds.
    DecaySetting1:    0.35, // Decay value is in seconds.
    SustainSetting1:    0.8,
    ReleaseSetting1:    0.15426, // Release value is in seconds.
    OctaveMultiplierValue1:    0,
    SemitoneOffsetValue1:    0,
    
    volSetting2:    35,
    freqSetting2:    220, // not used. see makeLFO function.
    waveformSetting2:    'square',
    AttackSetting2:    0.04,
    DecaySetting2:    0.35,
    SustainSetting2:    0.8,
    ReleaseSetting2:    0.15426,
    OctaveMultiplierValue2:    0,
    SemitoneOffsetValue2:    0,
    
    volSetting3:    20,
    freqSetting3:    660, // not used. see makeLFO function.
    waveformSetting3:    'sawtooth',
    AttackSetting3:    0.04,
    DecaySetting3:    0.35,
    SustainSetting3:    0.8,
    ReleaseSetting3:    0.15426,
    OctaveMultiplierValue3:    0,
    SemitoneOffsetValue3:    0,
    
    volSettingLFO:    0,
    freqSettingLFO:    1,
    waveformSettingLFO:    'sine',
    AttackSettingLFO:    0.04,
    DecaySettingLFO:    0.35,
    SustainSettingLFO:    0.8,
    ReleaseSettingLFO:    0.15426,
}

var presetsList = {
    ePiano: {
        title:  "Electric Piano",  
        preset: {
                noteA4Frequency:    440, // value in hz
                masterVolSetting:   83,
                onScreenKeyboardOctave: 2,
                balance:    -0.11,
                lowpassFilterFreq:  20000,
                highpassFilterFreq: 0,
            
                volSetting1:    57,
                freqSetting1:    440, // not used. see makeLFO function.
                waveformSetting1:    'triangle',
                AttackSetting1:    0.2, // Attack value is in seconds.
                DecaySetting1:    2654, // Decay value is in seconds.
                SustainSetting1:    0.43,
                ReleaseSetting1:    50, // Release value is in seconds.
                OctaveMultiplierValue1:    0,
                SemitoneOffsetValue1:    0,
                
                volSetting2:    48,
                freqSetting2:    220, // not used. see makeLFO function.
                waveformSetting2:    'square',
                AttackSetting2:    0.2,
                DecaySetting2:    1258,
                SustainSetting2:    0.21,
                ReleaseSetting2:    50,
                OctaveMultiplierValue2:    2,
                SemitoneOffsetValue2:    0,
                
                volSetting3:    20,
                freqSetting3:    660, // not used. see makeLFO function.
                waveformSetting3:    'sawtooth',
                AttackSetting3:    0.2,
                DecaySetting3:    2320,
                SustainSetting3:    0.39,
                ReleaseSetting3:    52,
                OctaveMultiplierValue3:    4,
                SemitoneOffsetValue3:    0,
                
                volSettingLFO:    0,
                freqSettingLFO:    1,
                waveformSettingLFO:    'sine',
                AttackSettingLFO:    0.04,
                DecaySettingLFO:    0.35,
                SustainSettingLFO:    0.8,
                ReleaseSettingLFO:    0.15426,
            }
    },
    xylobell: {
        title:  "Xylobell",  
        preset: {
                noteA4Frequency:440,
                masterVolSetting:38,
                onScreenKeyboardOctave:3,
                balance:-0.26,
                lowpassFilterFreq:3033,
                highpassFilterFreq:244,
                freqSettingLFO:1,
                volSettingLFO:0,
                waveformSettingLFO:"sine",
                AttackSettingLFO:0.04000,
                DecaySettingLFO:0.35000,
                SustainSettingLFO:0.8,
                ReleaseSettingLFO:0.15000,
                volSetting1:57,
                freqSetting1:440,
                waveformSetting1:"triangle",
                AttackSetting1:0.20000,
                DecaySetting1:99.92000,
                SustainSetting1:0.43,
                ReleaseSetting1:1861.21000,
                volSetting2:48,
                freqSetting2:220,
                waveformSetting2:"square",
                AttackSetting2:0.20000,
                DecaySetting2:125.87000,
                SustainSetting2:0.21,
                ReleaseSetting2:1440.95000,
                volSetting3:20,
                freqSetting3:660,
                waveformSetting3:"sawtooth",
                AttackSetting3:0.20000,
                DecaySetting3:125.87000,
                SustainSetting3:0.39,
                ReleaseSetting3:677.24000,
                OctaveMultiplierValue1:0,
                SemitoneOffsetValue1:0,
                OctaveMultiplierValue2:2,
                SemitoneOffsetValue2:0,
                OctaveMultiplierValue3:4,
                SemitoneOffsetValue3:0
            }
    },
    organ: {
        title:  "Organ",  
        preset: {
                noteA4Frequency:    440, // value in hz
                masterVolSetting:   83,
                onScreenKeyboardOctave: 2,
                balance:    -0.11,
                lowpassFilterFreq:  20000,
                highpassFilterFreq: 0,
            
                volSetting1:    57,
                freqSetting1:    440, // not used. see makeLFO function.
                waveformSetting1:    'triangle',
                AttackSetting1:    0.2, // Attack value is in seconds.
                DecaySetting1:    2654, // Decay value is in seconds.
                SustainSetting1:    0.43,
                ReleaseSetting1:    50, // Release value is in seconds.
                OctaveMultiplierValue1:    0,
                SemitoneOffsetValue1:    0,
                
                volSetting2:    48,
                freqSetting2:    220, // not used. see makeLFO function.
                waveformSetting2:    'square',
                AttackSetting2:    0.2,
                DecaySetting2:    1258,
                SustainSetting2:    0.21,
                ReleaseSetting2:    50,
                OctaveMultiplierValue2:    2,
                SemitoneOffsetValue2:    0,
                
                volSetting3:    20,
                freqSetting3:    660, // not used. see makeLFO function.
                waveformSetting3:    'sawtooth',
                AttackSetting3:    0.2,
                DecaySetting3:    2320,
                SustainSetting3:    0.39,
                ReleaseSetting3:    52,
                OctaveMultiplierValue3:    4,
                SemitoneOffsetValue3:    0,
                
                volSettingLFO:    0,
                freqSettingLFO:    1,
                waveformSettingLFO:    'sine',
                AttackSettingLFO:    0.04,
                DecaySettingLFO:    0.35,
                SustainSettingLFO:    0.8,
                ReleaseSettingLFO:    0.15426,
            }
    }
}

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
    this.envelopeNode.gain.linearRampToValueAtTime( this.sustain, currentTime + this.attack + this.decay );
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
    return new Osc ( freq, vol, waveform, attack, decay, sustain, release, 0, 0 );
}

function Synth () {
    this.osc1 = new Osc( window.freqSetting1, window.volSetting1, window.waveformSetting1, window.AttackSetting1, window.DecaySetting1, window.SustainSetting1, window.ReleaseSetting1, window.OctaveMultiplierValue1, SemitoneOffsetValue1 );
    this.osc2 = new Osc( window.freqSetting2, window.volSetting2, window.waveformSetting2, window.AttackSetting2, window.DecaySetting2, window.SustainSetting2, window.ReleaseSetting2, window.OctaveMultiplierValue2, SemitoneOffsetValue2 );
    this.osc3 = new Osc( window.freqSetting3, window.volSetting3, window.waveformSetting3, window.AttackSetting3, window.DecaySetting3, window.SustainSetting3, window.ReleaseSetting3, window.OctaveMultiplierValue3, SemitoneOffsetValue3 );
    this.LFO = makeLFO( window.freqSettingLFO, window.volSettingLFO, window.waveformSettingLFO, window.AttackSettingLFO, window.DecaySettingLFO, window.SustainSettingLFO, window.ReleaseSettingLFO );
    
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
    
    this.masterVolumeNode.connect( window.stereoPannerNode );
};

Synth.prototype.changeMidiVolume = function ( newVol ) {
    this.midiGainNode.gain.value = newVol / 100;
};

Synth.prototype.start = function () {
    this.osc1.setUpEnvelope();
    this.osc2.setUpEnvelope();
    this.osc3.setUpEnvelope();
    this.LFO.setUpEnvelope();

    this.osc1.oscillator.start();
    this.osc2.oscillator.start();
    this.osc3.oscillator.start();
    this.LFO.oscillator.start();
};

Synth.prototype.stop = function () {
    this.osc1.oscillator.stop();
    this.osc2.oscillator.stop();
    this.osc3.oscillator.stop();
    this.LFO.oscillator.stop();
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

var volumeNode = webAudioContext.createGain();

$( document ).ready(function() {
    var URLSettingsOnLoad = getUrlSettings();

    document.getElementById('fileSelect').addEventListener( 'change', loadSettingsFile, false );
    
    populatePresets();
    
    loadSettingsObject( defaultSettings , false, false );
    
    loadSettings();
    
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
        turnNoteOn ( note, velocity, false );
    });

    onScreenKeyboard.addEventListener('noteoff', function(e) {
        var note = parseInt(e.detail.index) + 36 + ( parseInt(window.onScreenKeyboardOctave) * 12 );
        turnNoteOff ( note, false );
    });
    
    
    window.stereoPannerNode.connect( lowpassFilterNode );
    window.lowpassFilterNode.connect( highpassFilterNode );
    window.highpassFilterNode.connect( exitNode );
    
    window.lowpassFilterNode.frequency.value = window.lowpassFilterFreq;
    window.highpassFilterNode.frequency.value = window.highpassFilterFreq;
    
    window.exitNode.gain.value = 1;
    window.exitNode.connect( webAudioContext.destination );

    // Create multiple synths for chords.
    
    window.synths = [];
    
    window.synthStates = [];
    
    for ( var synthStateNo = 0; synthStateNo < numSynths; synthStateNo++ ) {
        window.synthStates[synthStateNo] = 128; // Use 128 for off. 0-127 denote note velocity.
    }
    
    var oscKnobWidth = 80;
    var oscKnobThickness = 0.2;
    var oscKnobHeight = 84;

    $("#master-volume-knob").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseMasterVolume( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
    
    $("#volume-knob-LFO").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume( "LFO" ,val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });

    $("#volume-knob-1").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume( "1", val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
                    
    $("#volume-knob-2").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume( "2", val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
                    
    $("#volume-knob-3").knob({
                        'min':0,
                        'max':100,
                        'change' : function ( val ) { reviseVolume( "3", val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
                    
    $("#freq-knob-lfo").knob({
                        'min':0,
                        'max':32,
                        'change' : function ( val ) { reviseFreqLFO( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
                    
    $("#freq-knob-lowpass").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreqLowpass( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
                    
    $("#freq-knob-highpass").knob({
                        'min':0,
                        'max':20000,
                        'change' : function ( val ) { reviseFreqHighpass( val ) },
                        'width' : oscKnobWidth,
                        'thickness' : oscKnobThickness,
                        'height': oscKnobHeight,
                    });
    
    $('#master-volume-knob')
        .val(window.masterVolSetting)
        .trigger('change');
        
    $('#volume-knob-LFO')
        .val(window.volSettingLFO)
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
        
    $('#freq-knob-lfo')
        .val(window.freqSettingLFO)
        .trigger('change');
        
    $('#freq-knob-lowpass')
        .val(window.lowpassFilterFreq)
        .trigger('change');
        
    $('#freq-knob-highpass')
        .val(window.highpassFilterFreq)
        .trigger('change');
    
    $('#waveformSelectLFO').empty();
    
    $('#waveformSelectLFO').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex: oscillatorTypes.indexOf( window.waveformSettingLFO ) ,
        onSelected: function(data){
            reviseWaveform( "LFO", data.selectedData.value );
        }
    });
    
    $('#waveformSelect1').empty();
    
    $('#waveformSelect1').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex: oscillatorTypes.indexOf( window.waveformSetting1 ) ,
        onSelected: function(data){
            reviseWaveform( "1", data.selectedData.value );
        }
    });
    
    $('#waveformSelect2').empty();
    
    $('#waveformSelect2').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex: oscillatorTypes.indexOf( window.waveformSetting2 ) ,
        onSelected: function(data){
            reviseWaveform( "2", data.selectedData.value );
        }
    });
    
    $('#waveformSelect3').empty();
    
    $('#waveformSelect3').ddslick({
        data: oscillatorSelectData,
        defaultSelectedIndex: oscillatorTypes.indexOf( window.waveformSetting3 ) ,
        onSelected: function(data){
            reviseWaveform( "3", data.selectedData.value );
        }
    });
    
    setSlidersandDropdowns();
    
    loadURLSettings ( URLSettingsOnLoad );
    updateBalance( false );
    
    window.lowpassFilterNode.frequency.value = window.lowpassFilterFreq;
    window.highpassFilterNode.frequency.value = window.highpassFilterFreq;
    
    /////////////////////////////////////
    if ( collabId !== "" ) {
        document.getElementById( 'collab-button-holder' ).innerHTML = '<button onclick="connectToServer()">Start Collaborating</button><button onclick="removeSession()">Remove Session</button>';
        connectToServer();
    }

});
    
    
    

if (navigator.requestMIDIAccess) {
    var midiAccessPromise = window.navigator.requestMIDIAccess( {
        sysex: false
        // There's no need for sysex here.
    } ).then( accessGrantedToMIDI, accessDeniedToMIDI );
} else {
    logMessage("Web MIDI not supported in this browser/version.");
}

function accessGrantedToMIDI ( MIDIobject ) {

    window.MidiInfoObject = MIDIobject;

    var midiInputIterator = window.MidiInfoObject.inputs.values();
    
    var midiKeyboardSelect = document.getElementById("midiKeyboard");
    
    for (var midiInput = midiInputIterator.next(); ! midiInput.done ; midiInput = midiInputIterator.next() ) {
        
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
        turnNoteOff ( note, false );
    } else if ( midiInfo[0] == 144 ) { // Note on message                        
        var note = midiInfo[1];
        var velocity = midiInfo[2];
        turnNoteOn ( note, velocity, false );
        $("#onScreenKeyboard").find("div" + "[data-index='" + ( note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").addClass("active");
    }
}

function turnNoteOn ( note, velocity, remote ) {
        if ( !remote && window.collabReady ) {
            var remoteNoteOnMessage = new Object();
            remoteNoteOnMessage.msgtype = "noteon";
            remoteNoteOnMessage.note = note;
            remoteNoteOnMessage.velocity = velocity;
            sendMessageToServer( remoteNoteOnMessage );
            
            setTimeout( function(  ){
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
                        
                        window.synths[curSynth].connect();
                        window.synths[curSynth].start();
                        
                        $("#onScreenKeyboard").find("div" + "[data-index='" + ( note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").addClass("active");
                        
                        break;
                    }
                }
            }, window.latencyEstDelay );
        } else {
        
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
                    
                    window.synths[curSynth].connect();
                    window.synths[curSynth].start();
                    
                    $("#onScreenKeyboard").find("div" + "[data-index='" + ( note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").addClass("active");
                    
                    break;
                }
            }
        }
}

function turnNoteOff ( note, remote ) {

    if ( !remote && window.collabReady ) {
            var remoteNoteOnMessage = new Object();
            remoteNoteOnMessage.msgtype = "noteoff";
            remoteNoteOnMessage.note = note;
            sendMessageToServer( remoteNoteOnMessage );
            
            setTimeout( function(  ){
                $("#onScreenKeyboard").find("div" + "[data-index='" + (note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").removeClass("active");
                for ( var curSynth = 0; curSynth < window.numSynths; curSynth++ ) {
                    if ( window.synthStates[curSynth] == note ) {
                        window.synths[curSynth].setupReleaseCallback( curSynth );
                        break;
                    }
                }
            }, window.latencyEstDelay );
    } else {
        $("#onScreenKeyboard").find("div" + "[data-index='" + (note - 36 - ( window.onScreenKeyboardOctave * 12 ) ) + "']").removeClass("active");
        for ( var curSynth = 0; curSynth < window.numSynths; curSynth++ ) {
            if ( window.synthStates[curSynth] == note ) {
                window.synths[curSynth].setupReleaseCallback( curSynth );
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
            logMessage("MIDI Keyboard " + midiInput.value.id + " selected.");
        } else {
            midiInput.value.onmidimessage = function () {};
        }
    }
    
}



function accessDeniedToMIDI ( errorMessage ) {
    logMessage( errorMessage );
}

if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        logMessage( "Web Audio API not properly supported." );
    }
    window.AudioContext = window.webkitAudioContext; // Some versions of Chrome need this.
}

function changeA4Freq () {
    var A4FreqSelect = document.getElementById("A4FreqSelect");
    var newFreq = A4FreqSelect.options[A4FreqSelect.selectedIndex].value
    setSetting ( "noteA4Frequency", parseFloat( newFreq ) );
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

function FreqTextChangeLFO () {
    var newFreqSetting = document.getElementById("freq-knob-lfo").value;
    reviseFreqLFO( newFreqSetting );
}

function FreqTextChangeLowpass () {
    var newFreqSetting = document.getElementById("freq-knob-lowpass").value;
    reviseFreqLowpass( newFreqSetting );
}

function FreqTextChangeHighpass () {
    var newFreqSetting = document.getElementById("freq-knob-highpass").value;
    reviseFreqHighpass( newFreqSetting );
}

function VolumeTextChange ( oscName ) {
    var newVolSetting = document.getElementById( "volume-knob-"+oscName ).value;
    reviseVolume( oscName, newVolSetting );
}

function changeWaveformSelect( oscName ) {
    var WaveformSelect = document.getElementById( "waveformSelect"+oscName );
    var newType = WaveformSelect.options[WaveformSelect.selectedIndex].value;
    reviseWaveform( oscName, newType );
}

function changeOctaveSelect( oscName ) {
    var OctaveSelect = document.getElementById( "octaveSelect"+oscName );
    var newOctave = OctaveSelect.options[OctaveSelect.selectedIndex].value;
    reviseOctave( oscName, newOctave );
}

function changeSemitoneSelect( oscName ) {
    var SemitoneSelect = document.getElementById( "semitoneSelect"+oscName );
    var newVal = SemitoneSelect.options[SemitoneSelect.selectedIndex].value;
    reviseSemitoneOffset( oscName,  newVal );
}

function setSetting ( setting, value ){
    if ( window.collabReady ) {
    	if ( setting !== "collabId" ) {
	        var remoteSettingChangeMessage = new Object();
	        remoteSettingChangeMessage.msgtype = "setting-change";
	        remoteSettingChangeMessage.setting = setting;
	        remoteSettingChangeMessage.value = value;
	        sendMessageToServer( remoteSettingChangeMessage );
	        
	        setTimeout( function() {
	            window[setting] = value;
	            saveSetting( setting, value );
	            updateShareLink();
	        }, window.latencyEstDelay );
    	} else {
    		window[setting] = value;
    		saveSetting( setting, value );
    		updateShareLink();
    	}
    } else {
        window[setting] = value;
        saveSetting( setting, value );
        updateShareLink();
    }
}

function setSettingRemotely ( setting, value ){
    window[setting] = value;
    saveSetting( setting, value );
    updateShareLink();
}

function reviseMasterVolume ( vol ) {
    setSetting ( "masterVolSetting", vol );
    volumeNode.gain.value = vol / 100;
}

function reviseOnScreenKeyboardOctave ( newOctave ) {
    setSetting( "onScreenKeyboardOctave", newOctave );
}

function reviseFreqLFO ( freq ) {
    setSetting( "freqSettingLFO", freq );
}

function reviseFreqLowpass( freq ) {
    window.lowpassFilterNode.frequency.value = freq;
    setSetting( "lowpassFilterFreq", freq );
}

function reviseFreqHighpass( freq ) {
    window.highpassFilterNode.frequency.value = freq;
    setSetting( "highpassFilterFreq", freq );
}

function reviseVolume ( oscName, vol ) {
    setSetting ( "volSetting"+oscName, vol );
}

function reviseWaveform ( oscName, type ) {
    setSetting ( "waveformSetting"+oscName, type );
}

function reviseOctave ( oscName, newOctave ) {
    setSetting ( "OctaveMultiplierValue"+oscName, newOctave );
}

function reviseSemitoneOffset ( oscName, newVal ) {
    setSetting ( "SemitoneOffsetValue"+oscName, newVal );
}

function reviseAttack ( oscName, newMsVal ) {
    setSetting ( "AttackSetting"+oscName, ( newMsVal / 1000 ) );
}

function reviseDecay ( oscName, newMsVal ) {
    setSetting ( "DecaySetting"+oscName, ( newMsVal / 1000 ) );
}

function reviseSustain ( oscName, newVol ) {
    setSetting ( "SustainSetting"+oscName, newVol );
}

function reviseRelease ( oscName, newMsVal ) {
    setSetting ( "ReleaseSetting"+oscName, ( newMsVal / 1000 ) );
}

function updateAttackText ( oscName ) {
    var attackSelect = document.getElementById( "attackSelect"+oscName );
    var attackDisplay = document.getElementById( "attackDisplay"+oscName );
    
    var newLinVal = attackSelect.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    attackDisplay.value = newVal.toFixed(2);
    
    reviseAttack( oscName, attackDisplay.value );
}

function updateAttackSlider ( oscName ) {
    var attackDisplay = document.getElementById( "attackDisplay"+oscName );
    var attackSelect = document.getElementById( "attackSelect"+oscName );
    
    var newVal = attackDisplay.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            attackSelect.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        attackSelect.value = 5.5;
    }
    
    reviseAttack( oscName, attackDisplay.value );
}

function updateDecayText ( oscName ) {
    var decaySelect = document.getElementById( "decaySelect"+oscName );
    var decayDisplay = document.getElementById( "decayDisplay"+oscName );
    
    var newLinVal = decaySelect.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    decayDisplay.value = newVal.toFixed(2);
    
    reviseDecay( oscName, decayDisplay.value );
}

function updateDecaySlider ( oscName ) {                
    var decayDisplay = document.getElementById( "decayDisplay"+oscName );
    var decaySelect = document.getElementById( "decaySelect"+oscName );
    
    var newVal = decayDisplay.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            decaySelect.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        decaySelect.value = 5.5;
    }
    
    reviseDecay( oscName, decayDisplay.value );
}

function updateSustainText ( oscName ) {
    var sustainSelect = document.getElementById( "sustainSelect"+oscName );
    var sustainDisplay = document.getElementById( "sustainDisplay"+oscName );
    var newVal = sustainSelect.value;
    
    sustainDisplay.value = newVal;
    reviseSustain( oscName, sustainSelect.value );
}

function updateSustainSlider ( oscName ) {
    var sustainDisplay = document.getElementById( "sustainDisplay"+oscName );
    var sustainSelect = document.getElementById( "sustainSelect"+oscName );
    
    var newVal = sustainDisplay.value;
    sustainSelect.value = newVal;
    
    reviseSustain( oscName, sustainDisplay.value );
}

function updateReleaseText ( oscName ) {
    var releaseSelect = document.getElementById( "releaseSelect"+oscName );
    var releaseDisplay = document.getElementById( "releaseDisplay"+oscName );
    
    var newLinVal = releaseSelect.value;
    var newVal = Math.pow(newLinVal, newLinVal) - 0.7;
    
    releaseDisplay.value = newVal.toFixed(2);
    
    reviseRelease( oscName, releaseDisplay.value );
}

function updateReleaseSlider ( oscName ) {
    var releaseDisplay = document.getElementById( "releaseDisplay"+oscName );
    var releaseSelect = document.getElementById( "releaseSelect"+oscName );
    
    var newVal = releaseDisplay.value;
    
    var max = true;
    var curIndex = 0;
    for ( var curVal = 0.6; curVal < 5.5; curVal+= 0.1 ) {
        if ( window.expVals[curIndex] >= newVal ) {
            releaseSelect.value = curVal;
            max = false;
            break;
        }
        curIndex++;
    }
    
    if ( max ) {
        releaseSelect.value = 5.5;
    }
    
    reviseRelease( oscName, releaseDisplay.value );
}

function startRecording() {
    window.recording = true;

    window.recordingBuffer = new Array();
    window.recordingNode = webAudioContext.createScriptProcessor( window.recordingBuffersize, window.inputChannels, window.outputChannels );
    window.recordingNode.onaudioprocess = function(audioProcessingEvent) {
        var inputBuffer = audioProcessingEvent.inputBuffer;
        audioProcessingEvent.outputBuffer = inputBuffer;
        var leftChan = inputBuffer.getChannelData(0);
        var rightChan = inputBuffer.getChannelData(1);
        
        var outputLeftChan = audioProcessingEvent.outputBuffer.getChannelData(0);
        var outputRightChan = audioProcessingEvent.outputBuffer.getChannelData(1);
        
        /*
        for ( var curSampleL = 0; curSampleL < leftChan.length; curSampleL++ ) {
            outputLeftChan = 0;
            recordingBuffer.push( leftChan[curSampleL] );
        }
        for ( var curSampleR = 0; curSampleR < rightChan.length; curSampleR++ ) {
            outputRightChan = 0;
            recordingBuffer.push( rightChan[curSampleR] );
        }
        */
        
        for ( var curSample = 0; curSample < leftChan.length; curSample++ ) {
            outputLeftChan = 0;
            outputRightChan = 0;
            window.recordingBuffer.push( leftChan[curSample] );
            window.recordingBuffer.push( rightChan[curSample] );
        }
    }
    window.exitNode.connect( window.recordingNode );
    window.recordingNode.connect( webAudioContext.destination );
}

function stopRecording() {
    window.exitNode.disconnect( window.recordingNode );
    window.recordingNode.disconnect( webAudioContext.destination );
    
    ////////////////
    
    window.data = [];
    for ( var curSample = 0; curSample < window.recordingBuffer.length; curSample++ ) {
        window.data[curSample] = window.recordingBuffer[curSample] * maxAmp ;
    }
    
    window.waveRecording = new RIFFWAVE(); // create the wave file
    window.waveRecording.header.sampleRate = webAudioContext.sampleRate;
    window.waveRecording.header.numChannels = 2;
    window.waveRecording.header.bitsPerSample = bitDepth;
    //
    window.waveRecording.Make( window.data );
    
    window.recordingLink = document.createElement("a");
    var date = new Date();
    window.recordingLink.download = "synth-recording-" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds() + ".wav";
    window.recordingLink.href = window.waveRecording.dataURI;
    window.recordingLink.innerHTML = "Download...";
    // recordingLink.click();
    
    window.audio = new Audio(); // create the HTML5 audio element
    window.audio.src = window.waveRecording.dataURI;
    window.audio.controls = true;
    
    $('#recorder').append( window.audio );
    $('#recorder').append( window.recordingLink );
    
    window.recording = false;
}

function pressRecordButton () {
    var recordButton = document.getElementById("recordButton");
    
    if ( window.recording ) {
        recordButton.innerHTML = "Record";
        stopRecording();
    } else {
        recordButton.innerHTML = "Stop Recording";
        startRecording();
    }
}

function saveSetting ( settingName, value ) {
    localStorage.setItem( "setting-"+settingName , value );
}

function loadSettings() {
    for ( var curSetting = 0; curSetting < localStorage.length; curSetting++ ){
        if ( localStorage.key(curSetting).substring(0, 8) === "setting-" ) {
            var setting = localStorage.key(curSetting);
            if ( setting.indexOf("waveform") > -1 ) {
                window[ setting.substring( 8, setting.length ) ] = localStorage.getItem( setting );
            } else if ( setting.indexOf("Attack") > -1 || setting.indexOf("Decay") > -1 || setting.indexOf("Release") > -1 ) {
                window[ setting.substring( 8, setting.length ) ] = ( parseFloat( localStorage.getItem( setting ) ) * 1000 ).toFixed(2);
            } else if ( setting.indexOf("Sustain") > -1 ) {
                // Sustain is linear rather than exponential.
                window[ setting.substring( 8, setting.length ) ] = ( parseFloat( localStorage.getItem( setting ) ) ).toFixed(2);
            } else {
                window[ setting.substring( 8, setting.length ) ] = parseFloat( localStorage.getItem( setting ) );
            }
        }
    }
}

function setSlidersandDropdowns () {
    var oscNames = [ "LFO", "1", "2", "3" ];
    var numberedOscNames = [ "1", "2", "3" ];
    var envelopeControls = ["Attack", "Decay", "Sustain", "Release"];
    
    oscNames.forEach( function( oscName ) {
        envelopeControls.forEach( function( control ) {
            var Display = document.getElementById( control.toLowerCase() + "Display"+oscName );
            Display.value = control == "Sustain" ? window[ control + "Setting" + oscName ] : parseFloat( window[ control + "Setting" + oscName ] ).toFixed(2);
            window[ "update" + control + "Slider" ]( oscName );
        } );
    } );
    
    numberedOscNames.forEach( function( numOscName ) {
        document.getElementById( "semitoneSelect" + numOscName ).value = window[ "SemitoneOffsetValue" + numOscName ];
        document.getElementById( "octaveSelect" + numOscName ).value = window[ "OctaveMultiplierValue" + numOscName ];
    } );

    document.getElementById( "onScreenKeyboardOctaveSelect" ).value = window[ "onScreenKeyboardOctave" ];
    document.getElementById( "A4FreqSelect" ).value = window[ "noteA4Frequency" ];
    
    updateBalanceDisplay( window.balance );
    updateBalanceSlider( window.balance );
}

function createSettingsFile () {
    var oscNames = [ "LFO", "1", "2", "3" ];
    var numberedOscNames = [ "1", "2", "3" ];
    
    var settings = new Object();
    
    settings['noteA4Frequency'] = window.noteA4Frequency;
    settings['masterVolSetting'] = window.masterVolSetting;
    settings['onScreenKeyboardOctave'] = window.onScreenKeyboardOctave;
    settings['balance'] = window.balance;
    settings['lowpassFilterFreq'] = window.lowpassFilterFreq;
    settings['highpassFilterFreq'] = window.highpassFilterFreq;
    
    settings['collabId'] = window.collabId;
    
    settings["freqSettingLFO"] = window["freqSettingLFO"];
    
    oscNames.forEach( function( oscName ) {
        settings["volSetting"+oscName] = window["volSetting"+oscName];
        settings["freqSetting"+oscName] = window["freqSetting"+oscName];
        settings["waveformSetting"+oscName] = window["waveformSetting"+oscName];
        settings["AttackSetting"+oscName] = ( window["AttackSetting"+oscName] * 1000 ).toFixed(5) ;
        settings["DecaySetting"+oscName] = ( window["DecaySetting"+oscName] * 1000 ).toFixed(5);
        settings["SustainSetting"+oscName] = window["SustainSetting"+oscName];
        settings["ReleaseSetting"+oscName] = ( window["ReleaseSetting"+oscName] * 1000 ).toFixed(5);
    } );
    
    numberedOscNames.forEach( function( numOscName ) {
        settings["OctaveMultiplierValue"+numOscName] = window["OctaveMultiplierValue"+numOscName];
        settings["SemitoneOffsetValue"+numOscName] = window["SemitoneOffsetValue"+numOscName];
    } );
    
    return settings;
}

function downloadSettingsFile () {
    var settings = createSettingsFile();
    
    var JSONSettings = JSON.stringify( settings );
    
    var JSONDownload = "data:text/json;charset=utf-8," + encodeURIComponent( JSONSettings );
    var date = new Date();
    var JSONDownloadLink = document.createElement("a");
    JSONDownloadLink.download = "synth-preset-" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds() + ".json";
    JSONDownloadLink.href = JSONDownload;
    JSONDownloadLink.click();
}

function loadSettingsFile ( event ) {
    event.stopPropagation();
    event.preventDefault();
    
    var file;
    if ( event.dataTransfer ) {
        file = event.dataTransfer.files[0];
    } else {
        file = event.target.files[0];
    }
    
    if ( file ) {
        var fReader = new FileReader();
        fReader.readAsText( file );
        fReader.onload = function( event ) {
            var JSONString = event.target.result;
            loadSettingsJSON ( JSONString );
        }
    }
    
    
}

function loadSettingsJSON ( JSONString ) {
    try {
        var SettingsObject = JSON.parse( JSONString );
        loadSettingsObject ( SettingsObject, true, true );
    } catch( exc ) {
        alert("Invalid settings file");
    }
}

function loadSettingsObject ( SettingsObject, setGUI, overwriteLocal ) {
    var SettingsObjectKeys = Object.keys(SettingsObject);
    
    var settingsKeys = Object.keys( createSettingsFile() );
    
    var settingsValid = true;
    SettingsObjectKeys.forEach( function( JSONsettingsKey ) {
        if ( settingsKeys.indexOf( JSONsettingsKey ) == -1 ) {
            settingsValid = false;
        }
    } );
    
    if ( settingsValid ) {
        SettingsObjectKeys.forEach( function( JSONsettingsKey ) {
            if ( overwriteLocal ) {
                setSettingRemotely( JSONsettingsKey, SettingsObject[JSONsettingsKey] );
            } else {
                window[JSONsettingsKey] = SettingsObject[JSONsettingsKey];
            }
        } );
        
        if ( setGUI ) {
            updateGUI();
        }
    } else {
        alert( "Invalid settings object" );
    }
}

function resetToDefault () {
    loadSettingsObject( defaultSettings, true, true );
}

// Taken from http://stackoverflow.com/a/21903119/5688277
// and modified.
// Tested & working.
function getUrlSettings() {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    var URLSettings = new Object();
        
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        // stop no parameters from diaplaying invalid settings message due to object having one key (the empty string).
        if ( sParameterName[0] !== "" ) {
            URLSettings[ sParameterName[0] ] = sParameterName[1];
        }
    }

    return URLSettings;
};

function loadURLSettings ( SettingsObject ) {
    loadSettingsObject( SettingsObject, true, true );
}

function generateShareURL ( fullURL ) {
    var settings = createSettingsFile();
    
    var SettingsObjectKeys = Object.keys(settings);
    var settingsString = "";
    var curSetting = 0;
    
    SettingsObjectKeys.forEach( function( settingsKey ) {
        if ( curSetting === 0 ) {
            settingsString += "?";
        } else {
            settingsString += "&";
        }
        settingsString += settingsKey + "=" + settings[settingsKey];
        curSetting++;
    } );
    
    return fullURL ? window.location.origin + window.location.pathname + settingsString : window.location.pathname + settingsString ;
}

function updateShareLink () {
    var shareTextBox = document.getElementById("shareText");
    shareTextBox.value = generateShareURL( true );
    if ( window.location.protocol !== "file:" ) {
        history.pushState(null, null, generateShareURL( false ) );
    }
}

function updateBalance ( remote ) {
    var balanceSlider = document.getElementById("balance-slider");
    var newBalanceVal = parseFloat( balanceSlider.value );
    if ( remote ) {
        setSettingRemotely( "balance", newBalanceVal );
    } else {
        setSetting( "balance", newBalanceVal );
    }
    window.stereoPannerNode.pan.value = newBalanceVal;
    updateBalanceDisplay( newBalanceVal );
}

function updateBalanceDisplay ( newBalanceVal ) {
    var balanceDisplay = document.getElementById("balance-display");
    if ( newBalanceVal == 0 ) {
        balanceDisplay.innerHTML = "C";
    } else if ( newBalanceVal < 0 ) {
        balanceString = parseFloat(newBalanceVal).toFixed(2).toString();
        balanceDisplay.innerHTML = balanceString.substring( 1, balanceString.length ) + "L";
    } else {
        balanceString = parseFloat(newBalanceVal).toFixed(2).toString();
        balanceDisplay.innerHTML = balanceString + "R";
    }
}

function updateBalanceSlider ( newBalanceVal ) {
    var balanceSlider = document.getElementById("balance-slider");
    balanceSlider.value = newBalanceVal;
}

function changePreset () {
    if ( window.collabReady ) {
        var presetSelect = document.getElementById("select-preset");
        var selectedPreset = presetSelect.options[presetSelect.selectedIndex].value;
        
        var newMessage = new Object();
        newMessage.msgtype = "preset-change";
        newMessage.preset = selectedPreset;
        sendMessageToServer ( newMessage );
        
        setTimeout( function() {
            loadSettingsObject( presetsList[selectedPreset].preset, true, true );
        }, window.latencyEstDelay )
    } else {
        var presetSelect = document.getElementById("select-preset");
        var selectedPreset = presetSelect.options[presetSelect.selectedIndex].value;
        loadSettingsObject( presetsList[selectedPreset].preset, true, true );
    }
    
}

function changePresetAndUpdateGUI ( newPreset ) {
    var presetSelect = document.getElementById("select-preset");
    presetSelect.value = newPreset;
    changePreset();
}

function populatePresets () {
    var presetSelect = document.getElementById("select-preset");
    var presetKeys = Object.keys( presetsList );
    for ( var curPreset = 0; curPreset < presetKeys.length; curPreset++ ) {
        var presetOptionTag = new Option( presetsList[ presetKeys[curPreset] ].title, presetKeys[curPreset] );
        presetSelect.add( presetOptionTag );
    }
}

function connectToServer () {
    window.CollabState = 0;
    document.getElementById( 'collab-button-holder' ).innerHTML = '<button onclick="stopSession()">Stop Session</button>';
    
    window.CollabSocket = new WebSocket( serverURL );
    
    
    window.CollabSocket.onopen = function (e) {
        document.getElementById('collab-status-holder').innerHTML = "Socket opened. Waiting for server...";
    };
    
    window.CollabSocket.onclose = function (e) {
        document.getElementById('collab-status-holder').innerHTML = "Socket closed. Disconnected.";
        document.getElementById( 'collab-button-holder' ).innerHTML = '<button onclick="connectToServer()">Start Collaborating</button><button onclick="removeSession()">Remove Session</button>';
        window.CollabState = 0;
        window.collabReady = false;
    };
    
    window.CollabSocket.onmessage = function (event) {
        logMessage(event.data);
        var receviedMessage = event.data;
        var receivedObject = JSON.parse( receviedMessage );
        
        switch ( window.CollabState ) {
            case 0:
                if ( receivedObject.msgtype === "id" ) {
                    // If ID is set, send setID message. If not, send getId message
                    if ( window.collabId === "" ) {
                        var newMessage = new Object();
                        newMessage.msgtype = "getid";
                        newMessage.name = window.chatName;
                        sendMessageToServer ( newMessage );
                        window.CollabState = 1;
                        document.getElementById('collab-status-holder').innerHTML = "Getting a new ID....";
                    } else {
                        // set id
                        var newMessage = new Object();
                        newMessage.msgtype = "setid";
                        newMessage.collabid = window.collabId;
                        newMessage.name = window.chatName;
                        sendMessageToServer ( newMessage );
                        window.CollabState = 2;
                        document.getElementById('collab-status-holder').innerHTML = "Checking ID...";
                    }
                    window.latencyEstSendTime = Date.now();
                }
                break;
            case 1: // getid sent, waiting on response.
                if ( receivedObject.msgtype === "setid" ) {
                    setSetting ( "collabId", receivedObject.collabid );
                    window.CollabState = 3;
                    window.serverLatencyEst = ( Date.now() - window.latencyEstSendTime ) / 2;
                    window.latencyEstDelay = serverLatencyEst * 2; // Use this value for now
                    window.collabReady = true;
                    document.getElementById('collab-status-holder').innerHTML = "Connected to server. You can share this link to collaborate:";
                }
                break;
            case 2: // setid sent, waiting on response.
                if ( receivedObject.msgtype === "id_ok" ) {
                    window.CollabState = 3;
                    window.serverLatencyEst = ( Date.now() - window.latencyEstSendTime ) / 2;
                    window.latencyEstDelay = serverLatencyEst * 2; // Use this value for now
                    window.collabReady = true;
                    document.getElementById('collab-status-holder').innerHTML = "Connected to server. You can share this link to collaborate:";
                } else if ( receivedObject.msgtype === "setid" ) {
                    setSetting ( "collabId", receivedObject.collabid );
                    window.CollabState = 3;
                    window.serverLatencyEst = ( Date.now() - window.latencyEstSendTime ) / 2;
                    window.latencyEstDelay = serverLatencyEst * 2; // Use this value for now
                    window.collabReady = true;
                    document.getElementById('collab-status-holder').innerHTML = "Connected to server. ID Rejected - new ID Generated. You can share this link to collaborate:";
                }
                break;
            case 3: // After collabId has been verified. "Anything goes" now...
                if ( receivedObject.msgtype === "setting-change" ) {
                    setSettingRemotely( receivedObject.setting, receivedObject.value );
                    if ( receivedObject.setting === "lowpassFilterFreq" ) {
                        window.lowpassFilterNode.frequency.value = receivedObject.value;
                    } else if ( receivedObject.setting === "highpassFilterFreq" ) {
                        window.highpassFilterNode.frequency.value = receivedObject.value;
                    } else if ( receivedObject.setting === "balance" ) {
                        window.stereoPannerNode.pan.value = receivedObject.value;
                    }
                    updateGUI();
                } else if ( receivedObject.msgtype === "preset-change" ) {
                    changePresetAndUpdateGUI( receivedObject.preset );
                } else if ( receivedObject.msgtype === "noteon" ) {
                    turnNoteOn ( receivedObject.note, receivedObject.velocity, true );
                } else if ( receivedObject.msgtype === "noteoff" ) {
                    turnNoteOff( receivedObject.note, true );
                } else if ( receivedObject.msgtype === "onward-latency-update" ) {
                    window.latencyEstDelay = window.serverLatencyEst + receivedObject.latency;
                } else if ( receivedObject.msgtype === "client-joined" ) {
                    
                } else if ( receivedObject.msgtype === "chat" ) {
                    
                } else {
                    // unknown message type.
                }
                
                break;
        }
        
    };
}

function sendMessageToServer ( messageObject ) {
    logMessage( messageObject );
    var JSONifiedMessage = JSON.stringify( messageObject );
    window.CollabSocket.send( JSONifiedMessage );
}

function stopSession () {
    window.CollabSocket.close();
    window.collabReady = false;
    document.getElementById( 'collab-button-holder' ).innerHTML = '<button onclick="connectToServer()">Start Collaborating</button><button onclick="removeSession()">Remove Session</button>';
    window.CollabState = 0;
}

function removeSession () {
    setSetting( 'collabId', "" );
    document.getElementById( 'collab-button-holder' ).innerHTML = '<button onclick="connectToServer()">Start Collaborating</button>';
    updateShareLink();
}

function updateGUI() {
    $('#master-volume-knob')
        .val(window.masterVolSetting)
        .trigger('change');
    $('#volume-knob-LFO')
        .val(window.volSettingLFO)
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
    $('#freq-knob-lfo')
        .val(window.freqSettingLFO)
        .trigger('change');
    $('#freq-knob-lowpass')
        .val(window.lowpassFilterFreq)
        .trigger('change');
    $('#freq-knob-highpass')
        .val(window.highpassFilterFreq)
        .trigger('change');

    setSlidersandDropdowns();
    
    $('#waveformSelectLFO').ddslick('select', {index: oscillatorTypes.indexOf( window.waveformSettingLFO ) });
    $('#waveformSelect1').ddslick('select', {index: oscillatorTypes.indexOf( window.waveformSetting1 ) });
    $('#waveformSelect2').ddslick('select', {index: oscillatorTypes.indexOf( window.waveformSetting2 ) });
    $('#waveformSelect3').ddslick('select', {index: oscillatorTypes.indexOf( window.waveformSetting3 ) });
}

function logMessage( message ) {
	if ( window.loggingOn ) {
		console.log( message );
	}
}