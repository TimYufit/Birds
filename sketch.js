let birdNames = [
    "Yellowhammer bird",
    "Tree Sparrow bird",
    "Corn Bunting bird",
    "Red Back Shrike bird",
    "Corn Crake bird",
  ];
let curSection = -1;
  let years = [1970, 1980, 1990, 2000, 2010, 2020];
  let sounds = {}; // Object to store sounds

  let birdSounds = {};
  let volume;
  let customFont;
  let soundVolume = 1;
  let hasMoved = false; // Flag to track whether the user has moved the mouse

  // Variables for typing animation
  let currentBirdName = ""; // Current bird name being displayed
  let typingIndex = 0; // Index of the letter being typed
  let typingSpeed = 40; // Speed of typing animation (milliseconds per letter)
  let textPadding = 20; // Padding between bird name and year

  let backgroundMusic; // Background music

  let fontLight; // Variable to hold the font

  // Define an array to store the formulas
  let formulas = [];
  let prevMillis = 0; // Variable to store the previous time

  let num = {}; // Object to hold numbers for each bird
  let decreaseSpeeds = [1, 5, 10, 25, 30, 500]; // Different speeds for each quarter

  function preload() {
    // Load the custom font
    customFont = loadFont("SyneMono-Regular.ttf");
    fontLight = loadFont('HelveticaNeueUltraLightv130.ttf'); // Adjust the path to the font file

    // Load the audio files for each bird
    let treeSparow = [
      loadSound("Tree_high_sound.mp3"),
      loadSound("Tree_low_sound.mp3"),
      loadSound("Tree_the_lowest.mp3"),
      loadSound("Tree_song_lowest_low.mp3"),
    ];
    let YellowHammer = [
      loadSound("Yellowhammer_high_n.mp3"),
      loadSound("Yellowhammer_mid_n.mp3"),
      loadSound("Yellowhammer_low_n.mp3"),
      loadSound("Yellowhammer_lowest_l_n.mp3"),
    ];
    let CornBunting = [
      loadSound("Corn_bunting_high_n.mp3"),
      loadSound("Corn_bunting_mid_n.mp3"),
      loadSound("Corn_bunting_low_n.mp3"),
      loadSound("Corn_bunting_lowest_low_n.mp3"),
    ];
    let RedBackShrike = [
      loadSound("Red_Back_Shrike_high_n.mp3"),
      loadSound("Red Back Shrike_mid_n.mp3"),
      loadSound("Red Back Shrike_low_n11.mp3"),
      loadSound("Red Back Shrike_lowest_low.mp3"),
    ];

    let cornCrake  = [
      loadSound("Corn Crake_high_n.mp3"),
      loadSound("Corn Crake_mid_n.mp3"),
      loadSound("Corn Crake_low_n.mp3"),
      loadSound("Corn Crake_lowest_low.mp3"),
    ];

    birdSounds["Tree Sparrow bird"] = treeSparow;
    birdSounds["Yellowhammer bird"] = YellowHammer;
    birdSounds["Corn Bunting bird"] = CornBunting;
    birdSounds["Red Back Shrike bird"] = RedBackShrike;
    birdSounds["Corn Crake bird"] = cornCrake ;

    // Load background music
    backgroundMusic = loadSound("STALKER.mp3");
  }

  function setup() {
    // Create a black canvas
    createCanvas(windowWidth, windowHeight);
    textFont(customFont);
    background(0);

    // Play background music
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.3);

    // Initialize numbers for each bird
    num["Yellowhammer bird"] = 20000;
    num["Tree Sparrow bird"] = 18000;
    num["Corn Bunting bird"] = 22000; 
    num["Red Back Shrike bird"] = 16000;
    num["Corn Crake bird"] = 23000;

    // Display instructions
    displayInstructions();
    noCursor();
  }

  function draw() {
  // Always clear the background
  background(0);

  // Calculate deltaTime for time-based transitions
  let deltaTime = millis() - prevMillis;
  prevMillis = millis();

  // If the user hasn't clicked yet, show instructions only
  if (!hasMoved) {
    displayInstructions(); // Show "Click to begin"
    return; // Stop the rest of draw() from running
  }

  // === All main logic begins here AFTER the click ===

  let mouseXPos = mouseX;
  let mouseYPos = mouseY;

  // Adjust background music volume based on mouse position
  let backgroundVolume;
  if (mouseXPos < width / 2) {
    backgroundVolume = map(mouseXPos, 0, width / 2, 0.05, 0.1);
  } else {
    backgroundVolume = map(mouseXPos, width / 2, width, 0.1, 0.5);
  }
  backgroundVolume = constrain(backgroundVolume, 0.01, 0.5);
  backgroundMusic.setVolume(backgroundVolume);

  // Bird + year logic
  let indexX = int(map(mouseXPos, 0, width, 0, years.length));
  let indexY = int(map(mouseYPos, 0, height, 0, birdNames.length));

  let year = years[indexX];
  let birdName = birdNames[indexY];

  textSize(25);
  textAlign(LEFT, BOTTOM);
  let textColor = map(mouseXPos, 0, width, 250, 218, 94);
  fill(textColor);
  textFont(customFont);

  // Typing animation
  if (birdName !== currentBirdName) {
    currentBirdName = birdName;
    typingIndex = 0;
  }
  let partialBirdName = currentBirdName.substring(0, typingIndex);
  let textX = mouseXPos - textWidth(currentBirdName) + textWidth(partialBirdName) - 130;
  text(partialBirdName, textX - textPadding, mouseYPos - 40);
  if (typingIndex < currentBirdName.length) {
    typingIndex++;
  }

  // Species count logic
  let decreaseRate = decreaseSpeeds[int((mouseXPos / width) * decreaseSpeeds.length)];
  num[birdName] -= decreaseRate * (deltaTime / 1000);
  num[birdName] = max(0, num[birdName]);

  text(floor(num[birdName]) + " species", mouseXPos - textWidth(floor(num[birdName]).toString()) - 78, mouseYPos + 40);
  text(year + " Year", mouseXPos - 150, mouseYPos + 0);

  // Sound
  if (birdSounds[birdName]) {
    StopAllOtherSounds(birdName);
    SoundTransitionForBird(birdSounds[birdName], mouseXPos);
  }

  // === Formula logic ===
  let blockX = mouseX;
  let blockY = mouseY;
  let blockWidth = 1000;
  let blockHeight = 1000;
  let formulaProbability = 1;

  let quarterIndex = int(mouseX / (width / 4));
  let adjustedFormulaProbability = formulaProbability;

  if (quarterIndex === 0) adjustedFormulaProbability /= 12;
  else if (quarterIndex === 1) adjustedFormulaProbability /= 5;
  else if (quarterIndex === 2) adjustedFormulaProbability *= 1;
  else adjustedFormulaProbability *= 1;

  let formulaCount = quarterIndex === 0 ? 0.1 : quarterIndex === 1 ? 0.5 : quarterIndex === 2 ? 1 : 10;

  for (let i = 0; i < formulaCount; i++) {
    if (random(1) < adjustedFormulaProbability) {
      let x = random(blockX - blockWidth / 2, blockX + blockWidth / 2);
      let y = random(blockY - blockHeight / 2, blockY + blockHeight / 2);
      formulas.push(new Formula(randomFormula(), x, y));
    }
  }

  for (let i = formulas.length - 1; i >= 0; i--) {
    formulas[i].update(deltaTime);
    formulas[i].display();
    if (formulas[i].offscreen()) {
      formulas.splice(i, 1);
    }
  }
}

  function displayInstructions() {
    background(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 0, 0); // Set text color to red
    textFont(customFont); // Use custom font
    text("Press your mouse", width / 2, height / 2);
  }

  function SoundTransitionForBird(birdSound, mouseXPos) {
    for (let sound in birdSound) {
      if (!birdSound[sound].isPlaying()) {
        birdSound[sound].loop();
      }
    }
    // Adjust the volume based on mouse position
    soundVolume = map(mouseXPos, 0, width, 0, 1);
    // Ensure the volume is within range
    soundVolume = constrain(soundVolume, 0, 1);
    // Set the volume of each sound
    if (birdSound.length > 0) {
      let soundIndex = 0;
      if (soundVolume < 0.25) {
        for (let sound in birdSound) {
          birdSound[sound].setVolume(0);
        }
        let test = map(soundVolume, 0, 0.25, 0, 1);
        birdSound[0].setVolume(1 - test);
        birdSound[1].setVolume(test);
        if(curSection != 1){
        
          num["Yellowhammer bird"] = 40000;
    num["Tree Sparrow bird"] = 18000;
    num["Corn Bunting bird"] = 22000; 
    num["Red Back Shrike bird"] = 16000;
    num["Corn Crake bird"] = 23000;
          curSection = 1;
        }
            
      } else if (soundVolume < 0.5) {
        for (let sound in birdSound) {
          birdSound[sound].setVolume(0);
        }
        let test = map(soundVolume, 0.25, 0.5, 0, 1);
        birdSound[1].setVolume(1 - test);
        birdSound[2].setVolume(test);
        if(curSection != 2){
          curSection = 2
          num["Yellowhammer bird"] = 25000;
    num["Tree Sparrow bird"] = 13000;
    num["Corn Bunting bird"] = 17000; 
    num["Red Back Shrike bird"] = 12000;
    num["Corn Crake bird"] = 19000;
        }
            
      } else if (soundVolume < 0.75) {
        for (let sound in birdSound) {
          birdSound[sound].setVolume(0);
        }
        let test = map(soundVolume, 0.5, 0.75, 0, 1);
        birdSound[2].setVolume(1 - test);
        birdSound[3].setVolume(test);
        if(curSection != 3){
          curSection = 3
          num["Yellowhammer bird"] = 17000;
    num["Tree Sparrow bird"] = 9000;
    num["Corn Bunting bird"] = 13000; 
    num["Red Back Shrike bird"] = 8000;
    num["Corn Crake bird"] = 16000;
        }
        
      } else {
        for (let sound in birdSound) {
          birdSound[sound].setVolume(0);
        }
        let test = map(soundVolume, 0.75, 1, 0, 1);
        birdSound[3].setVolume(1 - test);
        if(curSection != 4){
          curSection = 4
        num["Yellowhammer bird"] = 9000;
    num["Tree Sparrow bird"] = 2000;
    num["Corn Bunting bird"] = 6000; 
    num["Red Back Shrike bird"] = 8000;
    num["Corn Crake bird"] = 9000;
        }
      }
    }
  }

  function StopAllOtherSounds(birdName) {
    for (let bird in birdSounds) {
      if (bird != birdName) {
        for (let sound in birdSounds[bird]) {
          var sounds = birdSounds[bird];
          sounds[sound].setVolume(0);
        }
      }
    }
  }

  function mousePressed() {
  if (!hasMoved) {
    hasMoved = true;

    // ✅ Unlock background audio explicitly
    if (!backgroundMusic.isPlaying()) {
      backgroundMusic.loop();
      backgroundMusic.setVolume(0.3); // or whatever you want
    }
  }
}

  // Formula class
  class Formula {
    constructor(formula, x, y) {
      this.x = x; // Start position of formula
      this.y = y; // Start position of formula
      this.formula = formula;
      this.speed = random(1, 5); // Adjust the speed as needed
      this.direction = createVector(0, 0); // Direction vector for movement
      this.timer = 0; // Timer to track formula display time
    }

    // Update the position of the formula
    update(deltaTime) {
      // Move formula towards the "block" (bird names, numbers, and years)
      let targetX = mouseX;
      let targetY = mouseY;
      this.direction = createVector(targetX - this.x, targetY - this.y).normalize();
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;

      // Increment timer
      this.timer += deltaTime / 1000; // Convert deltaTime to seconds
    }

    // Check if the formula has exited the canvas or exceeded display time
    offscreen() {
      return (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.timer > 2); // Remove formula if timer exceeds 5 seconds
    }

    // Display the formula
    display() {
      textSize(20);
      fill(140,250,202); // White color
      textFont(fontLight); // Set the font to Light
      text(this.formula, this.x, this.y);
    }
  }

  // Function to generate a random formula
  function randomFormula() {
    let formulas = ["C₁₂H₂₁N₂O₃PS", "C₉H₁₁Cl₃NO₃PS", "C₁₂H₂₁N₂O₃PS", "C₇H₁₄NO₅P", "C₉H₁₀Cl₃N₃O", "C₃H₆O", "C₄H₈O₂"];
    let index = floor(random(formulas.length));
    return formulas[index];
  }