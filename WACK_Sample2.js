#pragma strict
//Public class variables
public var isAI : boolean = false;
public var health : float = 150;
public var grounded : boolean = false;
public var buttonScaler : float;
public var buttonBuffer : float;
private var walkSpeed : float;
public var isAttacking : boolean = false;
public var enemy : Transform;
public var comboed : boolean = false;
public var model : Transform;
public var puff : Transform;
public var mesh : GameObject;
public var offStage : boolean = false;
public var QP : Transform;
public var beatUp : boolean = false;
public var weapon : Transform;
public var wackStick : Transform;
public var weedWacker : Transform;
public var rocket : Transform;
public var rocketShoot : Transform;
public var rocketLauncher : Transform;
public var mine : Transform;
public var smoker : Transform;
public var bumper : Transform;
public var trail : Transform;
public var grass : Transform;
public var smokeStream : Transform;
public var mineInAir : Transform;
public var smokerInAir : Transform;
public var bumperInAir : Transform;
public var recentAttacks : int;
public var lastClear : int;
public var heroType : int;
public var shadow : Transform;
public var shield : Transform;

//Private class variables
private var onEdge : boolean;
private var attacked : boolean = false;
private var dropKick : boolean = true;
private var downStabComplete : boolean = false;
private var privateWalkSpeed : int;
private var doubleJump : boolean = false;
private var offStageJump : boolean = false;
private var jumpTimer : float = 0;
public var lookingLeft : boolean = false;
private var hill : boolean = false;
private var noJumpRect : Rect = Rect(0, Screen.height/2, Screen.width/2, Screen.height/2);
private var rocketRect : Rect = Rect(Screen.width/2, 0, Screen.width/2, Screen.height);
private var leftButtonRect : Rect;
private var rightButtonRect : Rect;
private var attackPrimaryRect : Rect;
private var attackSecondaryRect : Rect;
private var blockButtonRect : Rect;
private var attackUltimateRect : Rect;
private var isMovingLeft : boolean = false;
private var isMovingRight : boolean = false;
private var jumping : boolean = false;
private var oldHealth : float = 150;
private var oldHealthColor : float = 150;
private var lastBlockTime : float = 0;
private var shieldScale : float;
private var players : GameObject[];
//Combo attacks
private var comboQueue = new ArrayList();
private var comboTime : float = 0;
private var primaryToggle : boolean = false;
private var commitAAB : boolean = false;
private var commitABA : boolean = false;
private var commitBBA : boolean = false;
//Off stage
private var flyBack : boolean = false;
private var Babe : Transform;
//GUI
private var leftArrow : Texture2D;
private var rightArrow : Texture2D;
private var attackPrimary : Texture2D;
private var attackSecondary : Texture2D;
private var blockButton : Texture2D;
public var leftNon : Texture2D;
public var rightNon : Texture2D;
public var primaryNon : Texture2D;
public var secondaryNon : Texture2D;
public var wackFaceAttackNon : Texture2D;

public var selectedPrimary : Texture2D;
public var selectedSecondary : Texture2D;
public var selectedLeft : Texture2D;
public var selectedRight : Texture2D;
private var wackFaceAttack : Texture2D;
public var wackFaceAttackSelected : Texture2D;
public var blockButtonNon : Texture2D;
public var blockButtonSelected : Texture2D;
//Item
public var hasItem : boolean = false;
public var itemNum : int;
public var itemTime : int;
public var weedWacked : boolean = false;
private var wackTime : int = 0;
private var itemLockedIn : boolean = false;
private var itemNumLockedIn : int;
private var rocketShots : int;
private var rocketRotation : Quaternion;
private var lastRocketShot : float = 0;
private var throwMineCompletion : boolean = false;

//AI Variables
private var resources : int;
private var addTime : float;
public var levelDifficulty : int;
private var clone : Transform;
public var spark : Transform;
private var moveTowards : boolean = false;
private var facePlayer : boolean = false;
private var defendSelf : boolean = false;
private var sameLevel : boolean = false;
public var getToCenter : boolean = false;
private var commitCombo : boolean = false;
private var item : Transform;
private var instanceExecution : boolean = false;
private var doubleJumpIt : boolean = false;
private var multiplier : float[];
public var attack : boolean = false;
private var point : Vector3;
private var currentCombo : int = 0;
private var groundedTime : int;
private var lastTime : float;
public var playerRoof : Transform;

//Set up character individuality
private var aabCommitTime : float = 0;
private var abaCommitTime : float = 0;
private var bbaCommitTime : float = 0;
private var primaryDamage : float = 0.35;     //0.35
private var secondaryDamage : float = 0.75;   //0.75
private var aabDamage : float = 4.5;          //4.5
private var abaDamage : float = 3.0;          //3.0
private var bbaDamage : float = 2.5;          //2.5
private var primaryVelocity : float = 20;     //20,20
private var secondaryVelocity : float = 30;   //30,15
private var aabVelocity : float = 20;         //20,150
private var abaVelocity : float = 30;         //30,100
private var bbaVelocity : float = 150;        //150,100
private var jumpVelocity : float = 0;         //

function Start () {
	//Frame Rate
	Application.targetFrameRate = 60;
	
	//Add shadow
	var shadowInstance : Transform = Instantiate(shadow, Vector3(transform.position.x, transform.position.y+4, transform.position.z), shadow.rotation);
	shadowInstance.SetParent(transform);
	
	//Save shield scale
	shieldScale = shield.localScale.x;
	shield.localScale = Vector3(0,0,0);
	
	//Find enemy -- the tag is set by the spawner
	players = new GameObject[3];
	var allPlayers = GameObject.FindGameObjectsWithTag("Player");
	var counter : int = 0;
	for (var playerSub in allPlayers) {
		if(playerSub != this.gameObject) {
			enemy = playerSub.transform;
			players[counter] = playerSub;
			counter++;
		}
	}
	
	//Set player roof
	playerRoof = Instantiate(playerRoof, transform.position, transform.rotation);
	playerRoof.parent = transform;
	
	//Setup AI difficulty
	if(isAI) {
		if(levelDifficulty == 1) {
			resources = 6;
			addTime = 2;
			multiplier = [1,1,1,1.2,1.4,1.6,1.8,2,3,3];
		}
		else if(levelDifficulty == 2) {
			resources = 6;
			addTime = 1.5;
			multiplier = [1,1,1,1.2,1.4,1.6,1.8,2,3,3];
		}
		else if(levelDifficulty == 3) {
			resources = 6;
			addTime = 1.0;
			multiplier = [1,1,1,1.2,1.4,1.6,1.8,2,3,3];
		}
		else if(levelDifficulty == 4) {
			resources = 6;
			addTime = 0.85;
			multiplier = [1,1,1,1.2,1.4,1.6,1.8,2,3,3];
		}
		else if(levelDifficulty == 5) {
			resources = 6;
			addTime = 0.7;
			multiplier = [1,1,1.2,1.5,1.8,2,2,3,3,3];
		}
		else if(levelDifficulty == 6) {
			resources = 6;
			addTime = 0.5;
			multiplier = [1,1,1.2,1.5,1.8,2,2,3,3,3];
		}
		else if(levelDifficulty == 7) {
			resources = 7;
			addTime = 0.5;
			multiplier = [1,1,1.2,1.5,1.8,2,2,3,3,3];
		}
		else if(levelDifficulty == 8) {
			resources = 8;
			addTime = 0.5;
			multiplier = [1,1,1.2,1.5,1.8,2,2,3,3,3];
		}
		else if(levelDifficulty == 9) {
			resources = 9;
			addTime = 0.4;
			multiplier = [1,1,1.1,2,3,3,3,3,3,3];
		}
		else if(levelDifficulty == 10) {
			resources = 10;
			addTime = 0.35;
			multiplier = [1,1,1.1,2,3,3,3,3,3,3];
		}
	}
	
	//Set up animations
	model.animation["WalkCycle"].layer = 0;
	model.animation["WalkCycle"].wrapMode = WrapMode.Loop;
	model.animation["WalkCycleWeed"].layer = 0;
	model.animation["WalkCycleWeed"].wrapMode = WrapMode.Loop;
	model.animation["WalkCycleRocket"].layer = 0;
	model.animation["WalkCycleRocket"].wrapMode = WrapMode.Loop;
	model.animation["WeedAttack"].layer = 0;
	model.animation["WeedAttack"].wrapMode = WrapMode.Loop;
	model.animation["AttackPrimary"].layer = 1;
	model.animation["AttackPrimary"].wrapMode = WrapMode.Once;
	model.animation["AttackPrimaryTwo"].layer = 1;
	model.animation["AttackPrimaryTwo"].wrapMode = WrapMode.Once;
	model.animation["AttackSecondary"].layer = 1;
	model.animation["AttackSecondary"].wrapMode = WrapMode.Once;
	model.animation["ThrowMine"].layer = 1;
	model.animation["ThrowMine"].wrapMode = WrapMode.Once;
	model.animation["RocketShoot"].layer = 1;
	model.animation["RocketShoot"].wrapMode = WrapMode.Once;
	model.animation["Jump"].wrapMode = WrapMode.Once;
	model.animation["Jump"].layer = 2;
	model.animation["RocketJump"].wrapMode = WrapMode.Once;
	model.animation["RocketJump"].layer = 2;
	model.animation["DropKick"].wrapMode = WrapMode.Once;
	model.animation["DropKick"].layer = 2;
	model.animation["DownStab"].wrapMode = WrapMode.Once;
	model.animation["DownStab"].layer = 2;
	model.animation["DoubleJump"].wrapMode = WrapMode.Once;
	model.animation["DoubleJump"].layer = 2;
	model.animation["Idle"].layer = 0;
	model.animation["Idle"].wrapMode = WrapMode.PingPong;
	model.animation["IdleRocket"].layer = 0;
	model.animation["IdleRocket"].wrapMode = WrapMode.PingPong;
	model.animation["Comboed"].layer = 2;
	model.animation["Grounded"].layer = 2;
	model.animation["Grounded"].wrapMode = WrapMode.Once;
	model.animation["Comboed"].wrapMode = WrapMode.Once;
	model.animation["BBA"].layer = 1;
	model.animation["BBA"].wrapMode = WrapMode.Once;
	model.animation["AAB"].layer = 1;
	model.animation["AAB"].wrapMode = WrapMode.Once;
	model.animation["ABA"].layer = 1;
	model.animation["ABA"].wrapMode = WrapMode.Once;
	model.animation["Hurt"].layer = 2;
	model.animation["Hurt"].wrapMode = WrapMode.PingPong;
	model.animation["Landing"].layer = 2;
	model.animation["Landing"].wrapMode = WrapMode.Once;
	model.animation["RocketLanding"].layer = 2;
	model.animation["RocketLanding"].wrapMode = WrapMode.Once;
	model.animation["OffStage"].layer = 2;
	model.animation["OffStage"].wrapMode = WrapMode.Once;
	model.animation["WackFaceOne"].layer = 1;
	model.animation["WackFaceOne"].wrapMode = WrapMode.Once;
	model.animation["WackFaceTwo"].layer = 1;
	model.animation["WackFaceTwo"].wrapMode = WrapMode.Once;
	model.animation["GotItem"].layer = 2;
	model.animation["GotItem"].wrapMode = WrapMode.Once;
	model.animation["GotItemMine"].layer = 2;
	model.animation["GotItemMine"].wrapMode = WrapMode.Once;
	model.animation["GotItemRocket"].layer = 2;
	model.animation["GotItemRocket"].wrapMode = WrapMode.Once;
	model.animation["BeatUp"].layer = 2;
	model.animation["BeatUp"].wrapMode = WrapMode.Loop;
	model.animation["Shield"].layer = 3;
	model.animation["Shield"].wrapMode = WrapMode.Once;
		
	//Tennis man
	if(heroType == 0) {
		aabCommitTime = 0.55;
		abaCommitTime = 0.32;
		bbaCommitTime = 0.1;
		walkSpeed = 140;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 4.5;
		abaDamage = 1.5;
		bbaDamage = 2.5;
		primaryVelocity = 15;
		secondaryVelocity = 40;
		aabVelocity = 50;
		abaVelocity = 30;
		bbaVelocity = 60;
	}
	//Lion
	else if(heroType == 1) {
		aabCommitTime = 0.63;
		abaCommitTime = 0.53;
		bbaCommitTime = 0.49;
		walkSpeed = 90;
		primaryDamage = 0.50;
		secondaryDamage = 1.0;
		aabDamage = 4.5;
		abaDamage = 4.5;
		bbaDamage = 4.5;
		primaryVelocity = 30;
		secondaryVelocity = 35;
		aabVelocity = 45;
		abaVelocity = 40;
		bbaVelocity = 80;
	}
	//Elf
	else if(heroType == 2) {
		aabCommitTime = 0.7;
		abaCommitTime = 0.58;
		bbaCommitTime = 0.65;
		walkSpeed = 120;
		primaryDamage = 0.24;
		secondaryDamage = 0.5;
		aabDamage = 3.8;
		abaDamage = 3.0;
		bbaDamage = 3.0;
		primaryVelocity = 15;
		secondaryVelocity = 30;
		aabVelocity = 25;
		abaVelocity = 40;
		bbaVelocity = 70;
	}
	//Goat
	else if(heroType == 3) {
		aabCommitTime = 0.55;
		abaCommitTime = 0.25;
		bbaCommitTime = 0.25;
		walkSpeed = 140;
		primaryDamage = 0.38;
		secondaryDamage = 0.45;
		aabDamage = 4.5;
		abaDamage = 2.0;
		bbaDamage = 4.5;
		primaryVelocity = 25;
		secondaryVelocity = 35;
		aabVelocity = 40;
		abaVelocity = 30;
		bbaVelocity = 90;
	}
	//Bones
	else if(heroType == 4) {
		aabCommitTime = 0.56;
		abaCommitTime = 0.68;
		bbaCommitTime = 0.44;
		walkSpeed = 110;
		primaryDamage = 0.25;
		secondaryDamage = 0.35;
		aabDamage = 4.5;
		abaDamage = 3.5;
		bbaDamage = 1.5;
		primaryVelocity = 25;
		secondaryVelocity = 30;
		aabVelocity = 35;
		abaVelocity = 35;
		bbaVelocity = 60;
	}
	//Rabbit
	else if(heroType == 5) {
		aabCommitTime = 0.74;
		abaCommitTime = 0.62;
		bbaCommitTime = 0.55;
		walkSpeed = 120;
		primaryDamage = 0.15;
		secondaryDamage = 0.35;
		aabDamage = 3.0;
		abaDamage = 2.5;
		bbaDamage = 4.5;
		primaryVelocity = 15;
		secondaryVelocity = 25;
		aabVelocity = 40;
		abaVelocity = 40;
		bbaVelocity = 90;
	}
	//Scuba
	else if(heroType == 6) {
		aabCommitTime = 0.68;
		abaCommitTime = 0.46;
		bbaCommitTime = 0.76;
		walkSpeed = 90;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 4.5;
		abaDamage = 2.5;
		bbaDamage = 2.0;
		primaryVelocity = 20;
		secondaryVelocity = 30;
		aabVelocity = 50;
		abaVelocity = 45;
		bbaVelocity = 55;
	}
	//Opera
	else if(heroType == 7) {
		aabCommitTime = 0.88;
		abaCommitTime = 0.88;
		bbaCommitTime = 0.6;
		walkSpeed = 90;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 5.0;
		abaDamage = 4.0;
		bbaDamage = 4.5;
		primaryVelocity = 20;
		secondaryVelocity = 30;
		aabVelocity = 55;
		abaVelocity = 50;
		bbaVelocity = 75;
	}
	//Box
	else if(heroType == 8) {
		aabCommitTime = 0.73;
		abaCommitTime = 0.5;
		bbaCommitTime = 0.32;
		walkSpeed = 100;
		primaryDamage = 0.70;
		secondaryDamage = 1.10;
		aabDamage = 5.0;
		abaDamage = 4.5;
		bbaDamage = 3.5;
		primaryVelocity = 30;
		secondaryVelocity = 30;
		aabVelocity = 45;
		abaVelocity = 30;
		bbaVelocity = 50;
	}
	//Pig
	else if(heroType == 9) {
		aabCommitTime = 0.61;
		abaCommitTime = 0.60;
		bbaCommitTime = 0.68;
		walkSpeed = 125;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 4.5;
		abaDamage = 2.5;
		bbaDamage = 3.5;
		primaryVelocity = 25;
		secondaryVelocity = 50;
		aabVelocity = 55;
		abaVelocity = 50;
		bbaVelocity = 70;
	}
	//Scotty
	else if(heroType == 10) {
		aabCommitTime = 0.7;
		abaCommitTime = 0.6;
		bbaCommitTime = 0.46;
		walkSpeed = 100;
		primaryDamage = 0.25;
		secondaryDamage = 0.45;
		aabDamage = 3.5;
		abaDamage = 3.0;
		bbaDamage = 4.0;
		primaryVelocity = 10;
		secondaryVelocity = 20;
		aabVelocity = 45;
		abaVelocity = 45;
		bbaVelocity = 60;
	}
	//Chick
	else if(heroType == 11) {
		aabCommitTime = 0.71;
		abaCommitTime = 0.71;
		bbaCommitTime = 0.67;
		walkSpeed = 115;
		primaryDamage = 0.60;
		secondaryDamage = 0.85;
		aabDamage = 5.0;
		abaDamage = 3.5;
		bbaDamage = 1.5;
		primaryVelocity = 45;
		secondaryVelocity = 50;
		aabVelocity = 35;
		abaVelocity = 45;
		bbaVelocity = 60;
	}
	//Wolfy
	else if(heroType == 12) {
		aabCommitTime = 0.64;
		abaCommitTime = 0.43;
		bbaCommitTime = 0.83;
		walkSpeed = 105;
		primaryDamage = 0.15;
		secondaryDamage = 0.30;
		aabDamage = 5.0;
		abaDamage = 4.5;
		bbaDamage = 5.5;
		primaryVelocity = 15;
		secondaryVelocity = 20;
		aabVelocity = 40;
		abaVelocity = 30;
		bbaVelocity = 45;
	}
	//Shovelheart
	else if(heroType == 13) {
		aabCommitTime = 0.74;
		abaCommitTime = 0.82;
		bbaCommitTime = 0.80;
		walkSpeed = 130;
		primaryDamage = 0.50;
		secondaryDamage = 0.95;
		aabDamage = 3.5;
		abaDamage = 2.5;
		bbaDamage = 1.5;
		primaryVelocity = 15;
		secondaryVelocity = 40;
		aabVelocity = 55;
		abaVelocity = 30;
		bbaVelocity = 45;
	}
	//Mermaid
	else if(heroType == 14) {
		aabCommitTime = 0.65;
		abaCommitTime = 0.78;
		bbaCommitTime = 0.66;
		walkSpeed = 105;
		primaryDamage = 0.10;
		secondaryDamage = 0.25;
		aabDamage = 4.25;
		abaDamage = 3.5;
		bbaDamage = 4.0;
		primaryVelocity = 15;
		secondaryVelocity = 28.5;
		aabVelocity = 50;
		abaVelocity = 50;
		bbaVelocity = 50;
	}
	//Bear
	else if(heroType == 15) {
		aabCommitTime = 0.63;
		abaCommitTime = 0.75;
		bbaCommitTime = 0.37;
		walkSpeed = 100;
		primaryDamage = 1.0;
		secondaryDamage = 1.25;
		aabDamage = 4.5;
		abaDamage = 5.5;
		bbaDamage = 3.5;
		primaryVelocity = 25;
		secondaryVelocity = 45;
		aabVelocity = 50;
		abaVelocity = 30;
		bbaVelocity = 50;
	}
	//Clay
	else if(heroType == 16) {
		aabCommitTime = 0.64;
		abaCommitTime = 0.61;
		bbaCommitTime = 0.6;
		walkSpeed = 125;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 4.0;
		abaDamage = 3.5;
		bbaDamage = 2.0;
		primaryVelocity = 15;
		secondaryVelocity = 35;
		aabVelocity = 30;
		abaVelocity = 25;
		bbaVelocity = 40;
	}
	//QP
	else if(heroType == 17) {
		aabCommitTime = 0.79;
		abaCommitTime = 0.63;
		bbaCommitTime = 0.69;
		walkSpeed = 108;
		primaryDamage = 0.30;
		secondaryDamage = 1.05;
		aabDamage = 2.5;
		abaDamage = 1.5;
		bbaDamage = 5.5;
		primaryVelocity = 15;
		secondaryVelocity = 40;
		aabVelocity = 45;
		abaVelocity = 40;
		bbaVelocity = 70;
	}
	//TCow
	else if(heroType == 18) {
		aabCommitTime = 0.64;
		abaCommitTime = 0.53;
		bbaCommitTime = 0.75;
		walkSpeed = 90;
		primaryDamage = 0.20;
		secondaryDamage = 1.05;
		aabDamage = 1.5;
		abaDamage = 2.5;
		bbaDamage = 5.0;
		primaryVelocity = 10;
		secondaryVelocity = 50;
		aabVelocity = 50;
		abaVelocity = 30;
		bbaVelocity = 90;
	}
	//Scarecrow
	else if(heroType == 19) {
		aabCommitTime = 0.65;
		abaCommitTime = 0.41;
		bbaCommitTime = 0.7;
		walkSpeed = 100;
		primaryDamage = 0.30;
		secondaryDamage = 0.65;
		aabDamage = 4.0;
		abaDamage = 2.0;
		bbaDamage = 3.0;
		primaryVelocity = 15;
		secondaryVelocity = 35;
		aabVelocity = 50;
		abaVelocity = 30;
		bbaVelocity = 60;
	}
	//Cornercreeper
	else if(heroType == 20) {
		aabCommitTime = 0.85;
		abaCommitTime = 0.62;
		bbaCommitTime = 0.93;
		walkSpeed = 100;
		primaryDamage = 0.10;
		secondaryDamage = 0.15;
		aabDamage = 4.5;
		abaDamage = 4.0;
		bbaDamage = 5.0;
		primaryVelocity = 8;
		secondaryVelocity = 10;
		aabVelocity = 70;
		abaVelocity = 70;
		bbaVelocity = 80;
	}
	//Hound
	else if(heroType == 21) {
		aabCommitTime = 0.61;
		abaCommitTime = 0.57;
		bbaCommitTime = 0.45;
		walkSpeed = 95;
		primaryDamage = 0.30;
		secondaryDamage = 0.85;
		aabDamage = 2.5;
		abaDamage = 1.0;
		bbaDamage = 4.5;
		primaryVelocity = 25;
		secondaryVelocity = 50;
		aabVelocity = 40;
		abaVelocity = 60;
		bbaVelocity = 45;
	}
	//LordEvil
	else if(heroType == 22) {
		aabCommitTime = 0.7;
		abaCommitTime = 0.8;
		bbaCommitTime = 0.67;
		walkSpeed = 105;
		primaryDamage = 0.50;
		secondaryDamage = 0.75;
		aabDamage = 2.0;
		abaDamage = 1.5;
		bbaDamage = 2.5;
		primaryVelocity = 15;
		secondaryVelocity = 40;
		aabVelocity = 60;
		abaVelocity = 50;
		bbaVelocity = 65;
	}
	//HedgeMonster
	else if(heroType == 23) {
		aabCommitTime = 0.75;
		abaCommitTime = 0.82;
		bbaCommitTime = 0.6;
		walkSpeed = 95;
		primaryDamage = 0.30;
		secondaryDamage = 0.45;
		aabDamage = 4.5;
		abaDamage = 1.5;
		bbaDamage = 3.5;
		primaryVelocity = 15;
		secondaryVelocity = 25;
		aabVelocity = 50;
		abaVelocity = 30;
		bbaVelocity = 60;
	}
	
	//Save some initial variables
	rocketRotation = rocketLauncher.localRotation;
	privateWalkSpeed = walkSpeed;
}

function Update () {
	//Set current enemy to closest player
	if(players[1] == null) {
		enemy = players[0].transform;
	}
	else {
		if(Mathf.Abs(players[0].transform.position.x - transform.position.x) < Mathf.Abs(players[1].transform.position.x - transform.position.x)) enemy = players[0].transform;
		else enemy = players[1].transform;
	}
	
	//Run sepecific updates
	if(!isAI) {
		humanUpdate();
	}
	else {
		aiUpdate();
	}
}

function humanUpdate () {
	//Update for the Camera
	updateCamera();
	
	//Shield visability handler
	if(!model.animation["Shield"].enabled && !itemLockedIn) {
		shield.gameObject.SetActive(false);
		weapon.gameObject.SetActive(true);
	}
	else if(model.animation["Shield"].enabled) {
		if(model.animation["Shield"].normalizedTime < 0.4) 
			shield.transform.localScale = Vector3.Lerp(shield.transform.localScale, Vector3(shieldScale, shieldScale, shieldScale), Time.deltaTime*5);
		else if(model.animation["Shield"].normalizedTime > 0.8)
			shield.transform.localScale = Vector3.Lerp(shield.transform.localScale, Vector3(0, 0, 0), Time.deltaTime*20);
	}
	
	if(!itemLockedIn && !comboed && !model.animation["Grounded"].enabled && !model.animation["Comboed"].enabled && !model.animation["Hurt"].enabled && !model.animation["BeatUp"].enabled) {
		//Attack primary
		if(!enemy.GetComponent(PlayerControl).comboed &&
		attacked && ((model.animation["AttackPrimary"].normalizedTime > 0.01 && model.animation["AttackPrimary"].normalizedTime < 0.4) ||
		(model.animation["AttackPrimaryTwo"].normalizedTime > 0.01 && model.animation["AttackPrimaryTwo"].normalizedTime < 0.4)) &&
		Mathf.Abs(transform.position.x - enemy.transform.position.x) < 2.5 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			attacked = false;
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(primaryVelocity, primaryVelocity),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= primaryDamage;
				recentAttacks++;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-primaryVelocity, primaryVelocity),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= primaryDamage;
				recentAttacks++;
			}
		}
		//Attack secondary
		if(!enemy.GetComponent(PlayerControl).comboed && attacked &&
		(model.animation["AttackSecondary"].normalizedTime > 0.1 && model.animation["AttackSecondary"].normalizedTime < 0.4) &&
		Mathf.Abs(transform.position.x - enemy.transform.position.x) < 2.5 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			attacked = false;
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(secondaryVelocity, secondaryVelocity/2),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= secondaryDamage;
				recentAttacks++;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-secondaryVelocity, secondaryVelocity/2),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= secondaryDamage;
				recentAttacks++;
			}
		}
		//Down stab action
		if(!enemy.GetComponent(PlayerControl).comboed && !grounded && !model.animation["DropKick"].enabled &&
		model.animation["DownStab"].enabled && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 2.5 &&
		Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			if(transform.position.x < enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(secondaryVelocity+5, 0),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= 2;
			}
			else if(transform.position.x > enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(-secondaryVelocity-5, 0),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= 2;
			}
		}
		//Drop kick action
		if(!enemy.GetComponent(PlayerControl).comboed && !grounded && model.animation["DropKick"].enabled &&
		!model.animation["DownStab"].enabled && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 2.5 &&
		Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(primaryVelocity, 0),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= 2;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-primaryVelocity, 0),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= 2;
			}
		}
		//AAB 20,70
		if(commitAAB && model.animation["AAB"].normalizedTime > aabCommitTime && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			commitAAB = false;
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(aabVelocity,aabVelocity*2),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= aabDamage;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-aabVelocity,aabVelocity*2),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= aabDamage;
			}
		}
		//ABA 40,50
		if(commitABA && model.animation["ABA"].normalizedTime > abaCommitTime && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			commitABA = false;
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(abaVelocity,abaVelocity*1.25),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= abaDamage;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-abaVelocity,abaVelocity*1.25),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= abaDamage;
			}
		}
		//BBA 60,40
		if(commitBBA && model.animation["BBA"].normalizedTime > bbaCommitTime && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
			commitBBA = false;
			if(transform.position.x < enemy.transform.position.x && !lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(bbaVelocity,bbaVelocity - 35),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= bbaDamage;
			}
			else if(transform.position.x > enemy.transform.position.x && lookingLeft) {
				enemy.rigidbody2D.AddForce(Vector2(-bbaVelocity,bbaVelocity-35),ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= bbaDamage;
			}
		}
		//Combos
		if(comboQueue.Count == 3) {
			//A-A-B
			if(comboQueue[0] && comboQueue[1] && !comboQueue[2] && !enemy.GetComponent(PlayerControl).comboed) {
				if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2) {
					commitAAB = true;
					enemy.GetComponent(PlayerControl).comboed = true;
				}
			}
			//A-B-A
			else if(comboQueue[0] && !comboQueue[1] && comboQueue[2] && !enemy.GetComponent(PlayerControl).comboed) {
				if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2) {
					commitABA = true;
					enemy.GetComponent(PlayerControl).comboed = true;
				}
			}
			//B-B-A
			else if(!comboQueue[0] && !comboQueue[1] && comboQueue[2] && !enemy.GetComponent(PlayerControl).comboed) {
				if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2) {
					commitBBA = true;
					enemy.GetComponent(PlayerControl).comboed = true;
				}
			}
			comboQueue.RemoveRange(0, 3);
		}
	}
	if(Time.timeSinceLevelLoad > comboTime)
		comboQueue.RemoveRange(0, comboQueue.Count);
	
	//Set if attacking
	if(((transform.position.x < enemy.transform.position.x && !lookingLeft) || (transform.position.x > enemy.transform.position.x && lookingLeft)) && (model.animation["WeedAttack"].enabled || model.animation["WackFaceTwo"].enabled || model.animation["WackFaceOne"].enabled || model.animation["BBA"].enabled || model.animation["ABA"].enabled || model.animation["AAB"].enabled || model.animation["AttackPrimary"].enabled || model.animation["AttackPrimaryTwo"].enabled || model.animation["AttackSecondary"].enabled))
		isAttacking = true;
	else
		isAttacking = false;
	
	//Light up when hurt
	if(oldHealthColor != health) {
		for(var c = 0; c < mesh.renderer.materials.length; c++)
			mesh.renderer.materials[c].color = new Color(4,4,4);
		oldHealthColor = health;
	}
	
	//Return color to normal
	if(mesh.renderer.material.color.r > 1)
		for(var m = 0; m < mesh.renderer.materials.length; m++)
			mesh.renderer.materials[m].color = Color.Lerp(mesh.renderer.materials[m].color, Color.gray, Time.deltaTime * 4);

	//Item		
	if(hasItem && !itemLockedIn) {
		itemLockedIn = true;
		itemNumLockedIn = itemNum;
		weapon.gameObject.SetActive(false);
		if(itemNumLockedIn == 1) wackStick.gameObject.SetActive(true);
		else if(itemNumLockedIn == 2) weedWacker.gameObject.SetActive(true);
		else if(itemNumLockedIn == 3) {
			if(health + 20 <= 150) health += 20;
			else health = 150;
			itemLockedIn = false;
			hasItem = false;
			weapon.gameObject.SetActive(true);
		}
		else if(itemNumLockedIn == 4) {
			rocketLauncher.gameObject.SetActive(true);
			rocketShots = 3;
		}
		else if(itemNumLockedIn == 5) mine.gameObject.SetActive(true);
		else if(itemNumLockedIn == 6) smoker.gameObject.SetActive(true);
		else if(itemNumLockedIn == 7) bumper.gameObject.SetActive(true);
	}
	if((Time.timeSinceLevelLoad > itemTime || (rocketShots <= 0 && itemNumLockedIn == 4 && !model.animation["RocketShoot"].enabled)) && !model.animation["Shield"].enabled) {
		hasItem = false;
		itemLockedIn = false;
		weapon.gameObject.SetActive(true);
		wackStick.gameObject.SetActive(false);
		weedWacker.gameObject.SetActive(false);
		rocketLauncher.gameObject.SetActive(false);
		mine.gameObject.SetActive(false);
		bumper.gameObject.SetActive(false);
		smoker.gameObject.SetActive(false);
		trail.gameObject.SetActive(false);
	}
	
	//Trail effect
	if(model.animation["WackFaceOne"].enabled || model.animation["WackFaceTwo"].enabled)
		trail.gameObject.SetActive(true);
	else
		trail.gameObject.SetActive(false);
		
	//Clear recent attacks
	if(recentAttacks > 0 && Time.timeSinceLevelLoad > lastClear) {
		recentAttacks--;
		lastClear = Time.timeSinceLevelLoad + 5;
	}
	
	//Kill
	if(health <= 0) {
		if(model.animation.enabled && !model.animation["Hurt"].enabled)
			model.animation.Stop();
		model.animation.CrossFade("Hurt", 0.05);
	}
}

function FixedUpdate () {
	if(!isAI) {
		humanFixedUpdate();
	}
	else {
		aiFixedUpdate();
	}
}

function humanFixedUpdate () {
	//Stand still while playing specific animations
	if(offStage || flyBack || model.animation["GotItemWeed"].enabled || 
	model.animation["GotItem"].enabled || model.animation["WackFaceTwo"].enabled ||
	model.animation["WackFaceOne"].enabled || model.animation["ABA"].enabled ||
	model.animation["AAB"].enabled || model.animation["AttackPrimary"].enabled ||
	model.animation["AttackPrimaryTwo"].enabled || model.animation["AttackSecondary"].enabled ||
	model.animation["Grounded"].enabled || model.animation["BBA"].enabled ||
	model.animation["Landing"].enabled || model.animation["Hurt"].enabled ||
	model.animation["BeatUp"].enabled || model.animation["DropKick"].enabled ||
	model.animation["DownStab"].enabled || model.animation["RocketShoot"].enabled ||
	model.animation["RocketLanding"].enabled || model.animation["GotItemRocket"].enabled ||
	model.animation["GotItemMine"].enabled || model.animation["ThrowMine"].enabled ||
	model.animation["Shield"].enabled || onEdge)
		walkSpeed = 0;
	else
		walkSpeed = privateWalkSpeed;
		
	if(hill)
		rigidbody2D.AddForce(Vector2(0,90), ForceMode2D.Force);
				
	//Update the grounding variable
	if(grounded)
		jumping = false;
	
	//Comboed animation
	if(comboed && (enemy.GetComponent(PlayerControl).model.animation["AAB"].normalizedTime > aabCommitTime ||
	enemy.GetComponent(PlayerControl).model.animation["ABA"].normalizedTime > abaCommitTime ||
	enemy.GetComponent(PlayerControl).model.animation["BBA"].normalizedTime > bbaCommitTime ||
	enemy.GetComponent(PlayerControl).model.animation["WackFaceOne"].normalizedTime > 0.05)) {
		model.animation.CrossFade("Comboed", 0.15);
	}
		
	//All else landing animations
	if(!comboed && !beatUp && grounded && (model.animation["RocketJump"].normalizedTime > 0.3 || model.animation["Jump"].normalizedTime > 0.3 ||
	model.animation["DoubleJump"].normalizedTime > 0.3 || model.animation["Hurt"].enabled ||
	model.animation["DropKick"].enabled || model.animation["DownStab"].enabled)) {
		if(hasItem && itemNumLockedIn == 4)
			model.animation.CrossFade("RocketLanding", 0.15, PlayMode.StopAll);
		else
			model.animation.CrossFade("Landing", 0.15, PlayMode.StopAll);
	}
		
	//Comboed landing animation
	if(comboed && grounded && !beatUp) {
		model.animation.CrossFade("Hurt", 0.15, PlayMode.StopAll);
		oldHealth = health;
		if(model.animation["Hurt"].normalizedTime > 0.1)
			comboed = false;
	}
	
	//Get beatup		
	if((beatUp || weedWacked) && !model.animation["Comboed"].enabled && !model.animation["Grounded"].enabled)
		model.animation.CrossFade("BeatUp", 0.15, PlayMode.StopAll);
	else if(model.animation["BeatUp"].enabled && (Mathf.Abs(transform.position.x - enemy.transform.position.x) > 4.5 || Mathf.Abs(transform.position.y - enemy.transform.position.y) > 2))
		model.animation.Stop("BeatUp");
	
	//Hurt animation
	if(!weedWacked && health != oldHealth && !comboed && rigidbody2D.velocity.y != 0 && !offStage) {
		model.animation.CrossFade("Hurt", 0.15, PlayMode.StopAll);
	}
		
	//Landing animation for all other things
	if(grounded && health != oldHealth && !comboed && !beatUp) {
		oldHealth = health;
		if(hasItem && itemNumLockedIn == 4)
			model.animation.CrossFade("RocketLanding", 0.15, PlayMode.StopAll);
		else
			model.animation.CrossFade("Landing", 0.15, PlayMode.StopAll);
	}
	
	//Down stab completion
	if(downStabComplete && rigidbody2D.velocity.y < 0) {
		rigidbody2D.AddForce(Vector2(-1*rigidbody2D.velocity.x, -190), ForceMode2D.Force);
	}
	
	//Throw mine completion
	if(throwMineCompletion && model.animation["ThrowMine"].normalizedTime > 0.35 && hasItem && (itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7)) {
		if(itemNumLockedIn == 5)
			Instantiate(mineInAir, transform.position, transform.rotation);
		else if(itemNumLockedIn == 6)
			Instantiate(smokerInAir, transform.position, transform.rotation);
		else
			Instantiate(bumperInAir, transform.position, transform.rotation);
		hasItem = false;
		itemLockedIn = false;
		weapon.gameObject.SetActive(true);
		mine.gameObject.SetActive(false);
		bumper.gameObject.SetActive(false);
		smoker.gameObject.SetActive(false);
		throwMineCompletion = false;
	}
		
	//Play Idle animation
	if(hasItem && itemNumLockedIn == 4)
		model.animation.CrossFade("IdleRocket", 0.10);
	else
		model.animation.CrossFade("Idle", 0.10);
		
	//Play falling animation when double jump has completed
	if(offStage && model.animation["DoubleJump"].normalizedTime > 0.9)
		model.animation.CrossFade("Hurt", 0.1, PlayMode.StopAll);
		
	//Get locked close to player when combo animation is playing
	if(model.animation["BeatUp"].enabled && comboed && !weedWacked && model.animation["BeatUp"].normalizedTime < 0.1) {
		var additional : int;
		if(!enemy.GetComponent(PlayerControl).lookingLeft)
			additional = 1;
		else
			additional = -1;
		var lockPosition = new Vector3(enemy.transform.position.x + 2.5*additional, enemy.transform.position.y+1, transform.position.z);
		transform.position = lockPosition;
	}

	//GUI
	leftArrow = leftNon;
	rightArrow = rightNon;
	attackPrimary = primaryNon;
	attackSecondary = secondaryNon;
	wackFaceAttack = wackFaceAttackNon;
	blockButton = blockButtonNon;
	isMovingLeft = false;
	isMovingRight = false;
	
	//Handle user touch
	if(!comboed && health > 0 && Time.timeSinceLevelLoad > 3 && !model.animation["Grounded"].enabled && !model.animation["Comboed"].enabled && !model.animation["BeatUp"].enabled && (!model.animation["Hurt"].enabled || offStageJump)) {
		for(var i = 0; i < Input.touchCount; i++) {
			var touchPosition = Vector2(Input.GetTouch(i).position.x, Screen.height-Input.GetTouch(i).position.y);
			var deltaPosition = Input.GetTouch(i).deltaPosition;
			//Left walk
			if(!jumping && !model.animation["GotItemRocket"].enabled && !model.animation["GotItemMine"].enabled && !model.animation["GotItem"].enabled && !model.animation["GotItemWeed"].enabled && leftButtonRect.Contains(touchPosition) && !isMovingRight && !flyBack) {
				leftArrow = selectedLeft;
				lookingLeft = true;
				transform.rotation.y = 180;
				rigidbody2D.AddForce(Vector2(-walkSpeed, rigidbody2D.velocity.y), ForceMode2D.Force);
				isMovingLeft = true;
				
				//Animation
				if(!itemLockedIn && !onEdge) {
					model.animation.CrossFade("WalkCycle", 0.10);
				}
				else if (!onEdge) {
					if(itemNumLockedIn == 2) {
						model.animation.CrossFade("WalkCycleWeed", 0.10);
					}
					else if(itemNumLockedIn == 4) {
						model.animation.CrossFade("WalkCycleRocket", 0.10);
					}
					else {
						model.animation.CrossFade("WalkCycle", 0.10);
					}
				}
			}
			//Right walk
			else if(!jumping && !model.animation["GotItemMine"].enabled && !model.animation["GotItemRocket"].enabled && !model.animation["GotItem"].enabled && !model.animation["GotItemWeed"].enabled && rightButtonRect.Contains(touchPosition) && !isMovingLeft && !flyBack) {
				rightArrow = selectedRight;
				lookingLeft = false;
				transform.rotation.y = 0;
				rigidbody2D.AddForce(Vector2(walkSpeed, rigidbody2D.velocity.y), ForceMode2D.Force);
				isMovingRight = true;
				
				//Animation
				if(!itemLockedIn && !onEdge) {
					model.animation.CrossFade("WalkCycle", 0.10);
				}
				else if(!onEdge) {
					if(itemNumLockedIn == 2) {
						model.animation.CrossFade("WalkCycleWeed", 0.10);
					}
					else if(itemNumLockedIn == 4) {
						model.animation.CrossFade("WalkCycleRocket", 0.10);
					}
					else {
						model.animation.CrossFade("WalkCycle", 0.10);
					}
				}
			}
			//Attack primary
			if(attackPrimaryRect.Contains(touchPosition)) {
				attackPrimary = selectedPrimary;
				wackFaceAttack = wackFaceAttackSelected;
			}
			if(!itemLockedIn && !model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled && attackPrimaryRect.Contains(touchPosition) && Input.GetTouch(i).phase == TouchPhase.Began && !jumping) {
				attacked = true;
				comboTime = Time.timeSinceLevelLoad + 0.4;
				if(comboQueue.Count == 3)
					comboQueue.RemoveAt(0);
				comboQueue.Add(true);
				
				//Animtation
				if(comboQueue.Count == 3 && !comboQueue[0] && !comboQueue[1] && comboQueue[2] && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5) {
					model.animation.CrossFade("BBA", 0.05);
				}
				else if(comboQueue.Count == 3 && comboQueue[0] && !comboQueue[1] && comboQueue[2] && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5) {
					model.animation.CrossFade("ABA", 0.05);
				}
				else {
					if(!primaryToggle) {
						model.animation.CrossFade("AttackPrimary", 0.05, PlayMode.StopSameLayer);
						primaryToggle = true;
					}
					else {
						model.animation.CrossFade("AttackPrimaryTwo", 0.05, PlayMode.StopSameLayer);
						primaryToggle = false;
					}
				}
			}
			//Down stab
			if(Time.timeSinceLevelLoad > jumpTimer && !offStage && !itemLockedIn && !downStabComplete && Mathf.Abs(deltaPosition.x) < 5 && deltaPosition.y < -6 && Input.GetTouch(i).phase == TouchPhase.Moved && !offStage && !model.animation["Hurt"].enabled && !itemLockedIn && !model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled && jumping) {				
				jumpTimer = Time.timeSinceLevelLoad + 0.35;
				//Animation
				model.animation.CrossFade("DownStab", 0.05);
				
				//Drop Velocity
				rigidbody2D.AddForce(Vector2(-1*rigidbody2D.velocity.x, 40-Mathf.Abs(rigidbody2D.velocity.y)), ForceMode2D.Impulse);
				downStabComplete = true;
			}
			if(itemLockedIn && (attackPrimaryRect.Contains(touchPosition) || (itemNumLockedIn == 4 && rocketRect.Contains(touchPosition))) && !jumping) {
				if(itemNumLockedIn == 1 && Input.GetTouch(i).phase == TouchPhase.Began && !enemy.GetComponent(PlayerControl).comboed) { 
					//Velocty direction of attack
					var stream : Transform;
					if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75) && !enemy.GetComponent(PlayerControl).comboed && transform.position.x < enemy.transform.position.x && !lookingLeft) {
						enemy.rigidbody2D.AddForce(Vector2(50,100),ForceMode2D.Impulse);
						enemy.GetComponent(PlayerControl).comboed = true;
						enemy.GetComponent(PlayerControl).health -= 1;
						enemy.GetComponent(PlayerControl).comboed = true;
						stream = Instantiate(smokeStream, enemy.position, smokeStream.rotation);
						stream.parent = enemy;
					}
					else if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75) && !enemy.GetComponent(PlayerControl).comboed && transform.position.x > enemy.transform.position.x && lookingLeft) {
						enemy.rigidbody2D.AddForce(Vector2(-50,100),ForceMode2D.Impulse);
						enemy.GetComponent(PlayerControl).comboed = true;
						enemy.GetComponent(PlayerControl).health -= 1;
						stream = Instantiate(smokeStream, enemy.position, smokeStream.rotation);
						stream.parent = enemy;
					}
					//Animation
					if(!primaryToggle && (!model.animation["WackFaceTwo"].enabled || model.animation["WackFaceTwo"].normalizedTime > 0.8)) {
						model.animation.CrossFade("WackFaceOne", 0.05);
						primaryToggle = true;
					}
					else if (primaryToggle && (!model.animation["WackFaceOne"].enabled || model.animation["WackFaceOne"].normalizedTime > 0.8)) {
						model.animation.CrossFade("WackFaceTwo", 0.05);
						primaryToggle = false;
					}
				}
				else if(itemNumLockedIn == 2 && !weedWacked && grounded && !enemy.GetComponent(PlayerControl).offStage) {
					//Animate it
					if(!model.animation["WalkCycleWeed"].enabled)
						model.animation.CrossFade("WeedAttack", 0.10);
					
					//Velocty direction of attack
					if(Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75) && Time.timeSinceLevelLoad > wackTime && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 5.5) {
						wackTime = Time.timeSinceLevelLoad + 0.3;
						if(!enemy.GetComponent(PlayerControl).comboed && transform.position.x < enemy.transform.position.x && !lookingLeft) {
							enemy.rigidbody2D.AddForce(Vector2(2,3),ForceMode2D.Impulse);
							enemy.GetComponent(PlayerControl).weedWacked = true;
							enemy.GetComponent(PlayerControl).health -= 0.1;
							Instantiate(grass, Vector3(weedWacker.position.x+2, weedWacker.position.y, weedWacker.position.z), grass.rotation);
						}
						else if(!enemy.GetComponent(PlayerControl).comboed && transform.position.x > enemy.transform.position.x && lookingLeft) {
							enemy.rigidbody2D.AddForce(Vector2(-2,3),ForceMode2D.Impulse);
							enemy.GetComponent(PlayerControl).weedWacked = true;
							enemy.GetComponent(PlayerControl).health -= 0.1;
							Instantiate(grass, Vector3(weedWacker.position.x-2, weedWacker.position.y, weedWacker.position.z), grass.rotation);
						}
					}
				}
				if(Time.timeSinceLevelLoad > lastRocketShot && rocketShots > 0 && itemNumLockedIn == 4 && !enemy.GetComponent(PlayerControl).comboed) {
					if(!lookingLeft) {
						rocketLauncher.LookAt(Vector3(transform.position.x+5, transform.position.y+(10*((Input.GetTouch(i).position.y)/(Screen.height))), 0));
						rocketLauncher.Rotate(-60, 0, 0);
					}
					else {
						rocketLauncher.LookAt(Vector3(transform.position.x-5, transform.position.y+(10*((Input.GetTouch(i).position.y)/(Screen.height))), 0));
						rocketLauncher.Rotate(-60, 0, 0);
					}
					if(Input.GetTouch(i).phase == TouchPhase.Ended) {
						//Animate it
						model.animation.CrossFade("RocketShoot", 0.10);
						
						//Shoot rocket and tick count
						var rocketInstance = Instantiate(rocket, rocketShoot.position, transform.rotation);
						rocketInstance.Rotate(0,0,-30+70*((Input.GetTouch(i).position.y)/(Screen.height)));
						
						lastRocketShot = Time.timeSinceLevelLoad + 1.5;
						//No long used
						//rocketShots--;
					}
				}
				else if(itemLockedIn && (itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7) && attackPrimaryRect.Contains(touchPosition) && !jumping && !model.animation["ThrowMine"].enabled) {
					model.animation.CrossFade("ThrowMine", 0.02);
					throwMineCompletion = true;
				}
			}
			//Attack secondary
			if(attackSecondaryRect.Contains(touchPosition)) {
				attackSecondary = selectedSecondary;
			}
			if(!model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled && attackSecondaryRect.Contains(touchPosition) && Input.GetTouch(i).phase == TouchPhase.Began && !jumping) {
				attacked = true;
				comboTime = Time.timeSinceLevelLoad + 0.4;
				if(comboQueue.Count == 3)
					comboQueue.RemoveAt(0);
				comboQueue.Add(false);
				
				//Animtation
				if(comboQueue.Count == 3 && comboQueue[0] && comboQueue[1] && !comboQueue[2] && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5) {
					model.animation.CrossFade("AAB", 0.05);
				}
				else {
					model.animation.CrossFade("AttackSecondary", 0.05, PlayMode.StopSameLayer);
				}
			}
			//Shield
			if(blockButtonRect.Contains(touchPosition)) {
				blockButton = blockButtonSelected;
			}
			if(lastBlockTime + 0 < Time.timeSinceLevelLoad && !model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled && blockButtonRect.Contains(touchPosition) && Input.GetTouch(i).phase == TouchPhase.Began && !jumping && !hasItem) {
				lastBlockTime = Time.timeSinceLevelLoad;
				weapon.gameObject.SetActive(false);
				shield.gameObject.SetActive(true);
				model.animation.CrossFade("Shield", 0.05, PlayMode.StopSameLayer);
			}
			//Drop Kick
			if(Time.timeSinceLevelLoad > jumpTimer && !itemLockedIn && !offStage && dropKick && Mathf.Abs(deltaPosition.x) > 15 && deltaPosition.y < 4 && Input.GetTouch(i).phase == TouchPhase.Moved && !offStage && !model.animation["Hurt"].enabled && !model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled && model.animation["DoubleJump"].normalizedTime > 0.2 && !noJumpRect.Contains(touchPosition)) {
				dropKick = false;
				jumpTimer = Time.timeSinceLevelLoad + 0.35;
				
				//Kick velocity
				if(deltaPosition.x > 0) {
					rigidbody2D.AddForce(Vector2(40, -10),ForceMode2D.Impulse);
					lookingLeft = false;
					transform.rotation.y = 0;
				}
				else {
					rigidbody2D.AddForce(Vector2(-40, -10),ForceMode2D.Impulse);
					lookingLeft = true;
					transform.rotation.y = 180;
				}
					
				//Animtation
				model.animation.CrossFade("DropKick", 0.05, PlayMode.StopSameLayer);
			}
			//Jump
			if(Time.timeSinceLevelLoad > jumpTimer && Mathf.Abs(deltaPosition.x) < 5 && deltaPosition.y > 10 && Input.GetTouch(i).phase == TouchPhase.Moved && grounded && !offStage && !model.animation["Jump"].enabled && !model.animation["RocketJump"].enabled && !model.animation["BeatUp"].enabled && !model.animation["GotItemMine"].enabled && !model.animation["GotItem"].enabled && !model.animation["GotItemWeed"].enabled && !model.animation["GotItemRocket"].enabled && !noJumpRect.Contains(touchPosition)) {
				jumpTimer = Time.timeSinceLevelLoad + 0.35;
				rigidbody2D.AddForce(Vector2(rigidbody2D.velocity.x*2.5,70),ForceMode2D.Impulse);
					if(hasItem && itemNumLockedIn == 4)
						model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
					else
						model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
				doubleJump = true;
				jumping = true;
			}
			//Double Jump
			if(Time.timeSinceLevelLoad > jumpTimer && !weedWacked && !model.animation["BeatUp"].enabled && Mathf.Abs(deltaPosition.x) > 15 && deltaPosition.y < 4 && Input.GetTouch(i).phase == TouchPhase.Moved && (doubleJump || offStageJump) && !noJumpRect.Contains(touchPosition)) {
				jumpTimer = Time.timeSinceLevelLoad + 0.35;
				if(deltaPosition.x > 0) {
					rigidbody2D.AddForce(Vector2(65,30),ForceMode2D.Impulse);
					lookingLeft = false;
					transform.rotation.y = 0;
				}
				else {
					rigidbody2D.AddForce(Vector2(-65,30),ForceMode2D.Impulse);
					lookingLeft = true;
					transform.rotation.y = 180;
				}
				model.animation.Stop();
				model.animation.CrossFade("DoubleJump", 0.05, PlayMode.StopAll);
				jumping = true;
				offStageJump = false;
				doubleJump = false;
			}
		}
	}
}

function OnGUI () {
	GUI.color.a = 0.5;
	if(health > 0 && Time.timeSinceLevelLoad > 3 && enemy.GetComponent(PlayerControl).health > 0 && !isAI) {
		//Scaling variables
		var buttonDimension : float = Screen.height * buttonScaler;
		var buffer : float = Screen.height * buttonBuffer;
		leftButtonRect = (new Rect(buffer*2.5, Screen.height - buttonDimension - buffer, buttonDimension, buttonDimension));
		rightButtonRect = (new Rect(buffer*2.5 + buttonDimension,Screen.height - buttonDimension - buffer, buttonDimension, buttonDimension));
		if(!itemLockedIn) {
			attackPrimaryRect = (new Rect(Screen.width - buttonDimension - buffer*9, Screen.height - buttonDimension - buffer, buttonDimension, buttonDimension));
			attackSecondaryRect = (new Rect(Screen.width - buttonDimension - buffer, Screen.height - buttonDimension*1.65, buttonDimension, buttonDimension));
			blockButtonRect = (new Rect(Screen.width - buttonDimension*0.75 - buffer, Screen.height - buffer - buttonDimension*0.6, buttonDimension/2, buttonDimension/2));
		}
		else {
			if(itemNumLockedIn == 1 || itemNumLockedIn == 2 || itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7) {
				attackPrimaryRect = (new Rect(Screen.width - buttonDimension - buffer*2, Screen.height - buttonDimension - buffer*1.3, buttonDimension*0.80, buttonDimension*0.80));
				attackSecondaryRect = (new Rect(0, 0, 0, 0));
				blockButtonRect = (new Rect(0,0,0,0));
			}
		}
		//Drawing GUI elements
		if(!itemLockedIn) {
			GUI.DrawTexture(leftButtonRect, leftArrow);
			GUI.DrawTexture(rightButtonRect, rightArrow);
			GUI.DrawTexture(attackPrimaryRect, attackPrimary);
			GUI.DrawTexture(attackSecondaryRect, attackSecondary);
			GUI.DrawTexture(blockButtonRect, blockButton);
		}
		else {
			if(itemNumLockedIn == 1 || itemNumLockedIn == 2 || itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7) {
				GUI.DrawTexture(leftButtonRect, leftArrow);
				GUI.DrawTexture(rightButtonRect, rightArrow);
				if(itemNumLockedIn != 4) GUI.DrawTexture(attackPrimaryRect, wackFaceAttack);
			}
		}
	}
}

function OnTriggerStay2D (other : Collider2D) {
	//Universal
	if(other.tag == "LeftEdge" && lookingLeft) {
		onEdge = true;
		rigidbody2D.velocity.x = 0;
	}
	else if(other.tag == "LeftEdge" && !lookingLeft) {
		onEdge = false;
	}
	if(other.tag == "RightEdge" && !lookingLeft) {
		onEdge = true;
		rigidbody2D.velocity.x = 0;
	}
	else if(other.tag == "RightEdge" && lookingLeft) {
		onEdge = false;
	}
	if(other.tag == "PushOut") {
		if(transform.position.x < 0) rigidbody2D.AddForce(Vector2(-30,-50),ForceMode2D.Force);
		else rigidbody2D.AddForce(Vector2(30,-50),ForceMode2D.Force);
	}
	if(other.tag == "PlayerRoof" && other.gameObject != playerRoof.gameObject) {
		if(enemy.transform.position.x > transform.position.x) {
			rigidbody2D.AddForce(Vector2(-150,-30),ForceMode2D.Force);
			enemy.rigidbody2D.AddForce(Vector2(150,-30),ForceMode2D.Force);
		}
		else {
			rigidbody2D.AddForce(Vector2(150,-30),ForceMode2D.Force);
			enemy.rigidbody2D.AddForce(Vector2(-150,-30),ForceMode2D.Force);
		}
	}
	//AI/Human Specific
	if(!isAI) {
		if(other.tag == "Ground") {
			dropKick = true;
			grounded = true;
			offStage = false;
			weedWacked = false;
			downStabComplete = false;
			if(!beatUp)
				model.animation.Stop("BeatUp");
			if(!weedWacked && !model.animation["Grounded"].enabled && !model.animation["Comboed"].enabled && !enemy.GetComponent(PlayerControl).model.animation["AAB"].enabled && !enemy.GetComponent(PlayerControl).model.animation["ABA"].enabled && !enemy.GetComponent(PlayerControl).model.animation["BBA"].enabled && !enemy.GetComponent(PlayerControl).model.animation["WackFaceOne"].enabled && !enemy.GetComponent(PlayerControl).model.animation["WackFaceTwo"].enabled)
				comboed = false;
		}
		if(other.tag == "Hill")
			hill = true;
	}
	else {
		if(other.tag == "Ground") {
			dropKick = false;
			grounded = true;
			offStage = false;
			weedWacked = false;
			if(!weedWacked && !comboed)
				model.animation.Stop("BeatUp");
			if(!weedWacked && !model.animation["Grounded"].enabled && !model.animation["Comboed"].enabled && !enemy.GetComponent(PlayerControl).model.animation["AAB"].enabled && !enemy.GetComponent(PlayerControl).model.animation["ABA"].enabled && !enemy.GetComponent(PlayerControl).model.animation["BBA"].enabled && !enemy.GetComponent(PlayerControl).model.animation["WackFaceOne"].enabled && !enemy.GetComponent(PlayerControl).model.animation["WackFaceTwo"].enabled)
				comboed = false;
		}
		if(other.tag == "Hill") {
			hill = true;
		}
		if(other.tag == "GetToCenter" && itemNumLockedIn != 2) {
			getToCenter = true;
			enemy.GetComponent(PlayerControl).recentAttacks = 0;
		}
		if(!getToCenter && other.tag == "Jump" && !enemy.GetComponent(PlayerControl).offStage && grounded && !weedWacked && !model.animation["DoubleJump"].enabled && !model.animation["RocketJump"].enabled && !model.animation["Jump"].enabled && !model.animation["RocketLanding"].enabled && !model.animation["Landing"].enabled && !comboed && Time.timeSinceLevelLoad > groundedTime && !model.animation["Grounded"].enabled && !model.animation["Comboed"].enabled) {
			//Find Jumper
			var jump : Transform;
			var jumps = GameObject.FindGameObjectsWithTag("Jump");
			var lastDistance : int = 1000000;
			for (var jumpSub in jumps) {
				if(Mathf.Abs(transform.position.x - jumpSub.transform.position.x) < lastDistance) {
					lastDistance = Mathf.Abs(transform.position.x - jumpSub.transform.position.x);
					jump = jumpSub.transform;
				}
			}
			var jumpVelocity : float = 70*Mathf.Pow(Mathf.Abs(transform.position.y - jump.position.y), 1/3);
			if((lookingLeft && jump.position.x < transform.position.x) || (!lookingLeft && jump.position.x > transform.position.x)) {
				groundedTime = Time.timeSinceLevelLoad + 1;
				//Cancel previous velocity
				rigidbody2D.AddForce(Vector2(-rigidbody2D.velocity.x, -rigidbody2D.velocity.y), ForceMode2D.Impulse);
				
				//Apply new velocity
				rigidbody2D.AddForce(Vector2(0,jumpVelocity),ForceMode2D.Impulse);
				if(hasItem && itemNumLockedIn == 4)
					model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
				else
					model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
				doubleJumpIt = true;
			}
		}
	}
}

function OnTriggerExit2D (other : Collider2D) {
	if(!isAI) {
		if(other.tag == "Ground")
			grounded = false;
		if(other.tag == "Hill")
			hill = false;
	}
	else {
		if(other.tag == "Ground")
			grounded = false;
		if(other.tag == "Hill")
			hill = false;
		if(other.tag == "GetToCenter")
			getToCenter = false;
	}
}

function OnTriggerEnter2D (other : Collider2D) {
	if(!isAI) {
		//Grounded
		if(other.tag == "Ground")
			Instantiate(puff, Vector3(transform.position.x, transform.position.y-2, transform.position.z), puff.rotation);
			
		if(other.tag == "Rocket" && !hasItem && (model.animation["Shield"].normalizedTime < 0.4 || model.animation["Shield"].normalizedTime > 0.75)) {
			if(enemy.transform.position.x > transform.position.x) {
				rigidbody2D.AddForce(Vector2(-100,100),ForceMode2D.Impulse);
				lookingLeft = false;
				transform.rotation.y = 0;
			}
			else {
				rigidbody2D.AddForce(Vector2(100,100),ForceMode2D.Impulse);
				lookingLeft = true;
				transform.rotation.y = 180;
			}
				
			health = health - 7;
			//comboed = true;
			grounded = false;
			offStage = true;
			model.animation.CrossFade("Hurt", 0.15);
			var stream : Transform;
			stream = Instantiate(smokeStream, transform.position, transform.rotation);
			stream.parent = transform;
		}
		
		//Off stage
		if(other.tag == "OffStage") {
			if(!flyBack) {
				health = health - 10;
				if(transform.position.x > 0) {
					lookingLeft = false;
					transform.rotation.y = 0;
				}
				else {
					lookingLeft = true;
					transform.rotation.y = 180;
				}
				Babe = Instantiate(QP, Vector3(transform.position.x, transform.position.y+2.35, transform.position.z+0.75), transform.rotation);
				Babe.parent = transform;
			}	
			flyBack = true;	
			offStageJump = false;
		}
		
		//Bump
		if(other.tag == "Bumper") {
			//Play animations
			other.animation.Play("Bump");
			model.animation.CrossFade("Hurt", 0.3);
			
			//Decide the correct velocity
			var velX : float;
			var velY : float;
			velX = -25*rigidbody2D.velocity.x;
			velY = -25*rigidbody2D.velocity.y;
			if(velX > 130)
				velX = 130;
			if(velX < -130)
				velX = -130;
			if(velY > 100)
				velY = 100;
			if(velY < -100)
				velY = -100;
			if(Mathf.Abs(velX) < 10) {
				if(velX < 0)
					velX = -10;
				else
					velX = 10;
			}
			
			//Apply the velocity
			rigidbody2D.AddForce(Vector2(velX, velY), ForceMode2D.Impulse);
		}
		
		//Detect if off stage
		if(other.tag == "OffEdge" && !offStage) {
			if(!model.animation["DoubleJump"].enabled)
				model.animation.Stop();
			if(!comboed)
				offStageJump = true;
			comboed = false;
			grounded = false;
			if(!model.animation["DoubleJump"].enabled)
				model.animation.CrossFade("Hurt", 0.3);
			dropKick = true;
			doubleJump = false;
			downStabComplete = false;
			offStage = true;
			weedWacked = false;
			//Get rid of item
			hasItem = false;
			itemLockedIn = false;
			weapon.gameObject.SetActive(true);
			wackStick.gameObject.SetActive(false);
			weedWacker.gameObject.SetActive(false);
			rocketLauncher.gameObject.SetActive(false);
			mine.gameObject.SetActive(false);
			bumper.gameObject.SetActive(false);
			smoker.gameObject.SetActive(false);
			trail.gameObject.SetActive(false);
		}
	}
	else {
		//Grounded
		if(other.tag == "Ground")
			Instantiate(puff, Vector3(transform.position.x, transform.position.y-2, transform.position.z), puff.rotation);
		
		if(other.tag == "Rocket") {
			if(enemy.transform.position.x > transform.position.x) {
				rigidbody2D.AddForce(Vector2(-100,100),ForceMode2D.Impulse);
				lookingLeft = false;
				transform.rotation.y = 0;
			}
			else {
				rigidbody2D.AddForce(Vector2(100,100),ForceMode2D.Impulse);
				lookingLeft = true;
				transform.rotation.y = 180;
			}
			
			health = health - 7;
			comboed = true;
			model.animation.CrossFade("Comboed", 0.15);
			stream = Instantiate(smokeStream, transform.position, transform.rotation);
			stream.parent = transform;
		}
		
		//Off stage
		if(other.tag == "OffStage") {
			if(!flyBack) {
				health = health - 10;
				if(transform.position.x > 0) {
					lookingLeft = false;
					transform.rotation.y = 0;
				}
				else {
					lookingLeft = true;
					transform.rotation.y = 180;
				}
				Babe = Instantiate(QP, Vector3(transform.position.x, transform.position.y+2.35, transform.position.z+0.75), transform.rotation);
				Babe.parent = transform;
			}	
			flyBack = true;
			getToCenter = false;
		}	
		
		//Bump
		if(other.tag == "Bumper") {
			//Play animations
			other.animation.Play("Bump");
			model.animation.CrossFade("Hurt", 0.3);
			
			//Decide the correct velocity
			velX = -25*rigidbody2D.velocity.x;
			velY = -25*rigidbody2D.velocity.y;
			if(velX > 130)
				velX = 130;
			if(velX < -130)
				velX = -130;
			if(velY > 100)
				velY = 100;
			if(velY < -100)
				velY = -100;
			if(Mathf.Abs(velX) < 20) {
				if(velX < 0)
					velX = -20;
				else
					velX = 20;
			}
			
			//Apply the velocity
			rigidbody2D.AddForce(Vector2(velX, velY), ForceMode2D.Impulse);
		}
		//Off edge
		if(other.tag == "OffEdge" && !offStage) {
			model.animation.Stop();
			comboed = false;
			grounded = false;
			model.animation.CrossFade("Hurt", 0.3);
			dropKick = false;
			offStage = true;
			weedWacked = false;
			//Get rid of item
			hasItem = false;
			itemLockedIn = false;
			weapon.gameObject.SetActive(true);
			wackStick.gameObject.SetActive(false);
			weedWacker.gameObject.SetActive(false);
			rocketLauncher.gameObject.SetActive(false);
			trail.gameObject.SetActive(false);
			mine.gameObject.SetActive(false);
			bumper.gameObject.SetActive(false);
			smoker.gameObject.SetActive(false);
		}
	}
}

function updateCamera() {
	//Intro
	if(Time.timeSinceLevelLoad <= 3) {
		var playerSet = GameObject.FindGameObjectsWithTag("Player");
		//Sort playerSet
		if(playerSet.Length == 3) {
			var newPlayerSet : GameObject[] = new GameObject[3];
			var tempPlayerSet : GameObject[] = new GameObject[2];
			var index : int = 0;
			for(var player in playerSet) {
				if(player.gameObject == this.gameObject) {
					newPlayerSet[0] = player;
				}
				else {
					tempPlayerSet[index] = player;
					index++;
				}
			}
			if(tempPlayerSet[0].transform.position.x < tempPlayerSet[1].transform.position.x) {
				newPlayerSet[1] = tempPlayerSet[0];
				newPlayerSet[2] = tempPlayerSet[1];
			}
			else {
				newPlayerSet[2] = tempPlayerSet[0];
				newPlayerSet[1] = tempPlayerSet[1];
			}
			playerSet = newPlayerSet;
			tempPlayerSet = null;
			newPlayerSet = null;
		}
		else {
			playerSet[0] = this.gameObject;
			playerSet[1] = enemy.gameObject;
		}
		//End sort
		Time.timeScale = 0.5;
		if(Time.timeSinceLevelLoad < 0.5) {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(playerSet[0].transform.position.x,playerSet[0].transform.position.y+2,-4), Time.deltaTime*15);
			Camera.main.transform.rotation.y = 0;
		}
		else if (Time.timeSinceLevelLoad < 1) {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(playerSet[1].transform.position.x,playerSet[1].transform.position.y+2,-4), Time.deltaTime*15);
			Camera.main.transform.rotation.y = 0;
		}
		else if(playerSet.Length == 3 && Time.timeSinceLevelLoad < 1.5) {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(playerSet[2].transform.position.x,playerSet[2].transform.position.y+2,-4), Time.deltaTime*15);
			Camera.main.transform.rotation.y = 0;
		}
		else {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(0, (transform.position.y + 2.25), -25), Time.deltaTime*15);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
	}
	//Players are dead - Game is over
	else if(health <= 0 || enemy.GetComponent(PlayerControl).health <= 0) {
		Time.timeScale = Mathf.Lerp(Time.timeScale, 0, Time.deltaTime * 30);
		if(health <= 0) {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(transform.position.x,transform.position.y+1,-2), Time.deltaTime*30);
			Camera.main.transform.rotation.y = 0;
		}
		else {
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, Vector3(enemy.transform.position.x,enemy.transform.position.y+1,-2), Time.deltaTime*30);
			Camera.main.transform.rotation.y = 0;
		}
	}
	//Players are alive - Game in progress
	else {
		var newPosition;
		//Falling off stage
		if(offStage || enemy.GetComponent(PlayerControl).offStage) {
			newPosition = new Vector3((transform.position.x + enemy.transform.position.x)/2, (transform.position.y + enemy.transform.position.y)/2 + 9, -10-0.5*Mathf.Abs(transform.position.x - enemy.transform.position.x));
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*2);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
		//Got item
		else if(model.animation["GotItemWeed"].enabled || model.animation["GotItem"].enabled || model.animation["GotItemRocket"].enabled || model.animation["GotItemMine"].enabled) {
			if(!model.animation["GotItem"].enabled && !model.animation["GotItemWeed"].enabled && !model.animation["GotItemRocket"].enabled && !model.animation["GotItemMine"].enabled) {
				newPosition = new Vector3((transform.position.x+enemy.transform.position.x)/2, transform.position.y+1.5, -5);
				Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*30);
				Camera.main.transform.rotation.y = 0;
			}
			else {
				lookingLeft = false;
				transform.rotation.y = 0;
				Time.timeScale = 0.4;
				if(itemNumLockedIn == 1)
					model.animation.CrossFade("GotItem", 0, PlayMode.StopAll);
				else if(itemNumLockedIn == 2)
					model.animation.CrossFade("GotItemWeed", 0.05, PlayMode.StopAll);
				else if(itemNumLockedIn == 4)
					model.animation.CrossFade("GotItemRocket", 0.05, PlayMode.StopAll);
				else if(itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7)
					model.animation.CrossFade("GotItemMine", 0.05, PlayMode.StopAll);
				var slowMoPos = new Vector3(transform.position.x, transform.position.y+3, -7);
				Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, slowMoPos, Time.deltaTime*40);
				Camera.main.transform.rotation.y = 0;
			}
		}
		//Jumping
		else if(model.animation["RocketJump"].enabled || model.animation["Jump"].enabled || model.animation["DoubleJump"].enabled || model.animation["DropKick"].enabled || model.animation["DownStab"].enabled) {
			newPosition = new Vector3((transform.position.x + enemy.transform.position.x)/2, transform.position.y + 4, -8-0.5*Mathf.Abs(transform.position.x - enemy.transform.position.x));
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*2);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
		else if(enemy.GetComponent(PlayerControl).model.animation["Jump"].enabled || enemy.GetComponent(PlayerControl).model.animation["DoubleJump"].enabled || enemy.GetComponent(PlayerControl).model.animation["DropKick"].enabled) {
			newPosition = new Vector3((transform.position.x + enemy.transform.position.x)/2, (enemy.transform.position.y + transform.position.y)/2 + 4, -8-0.5*Mathf.Abs(transform.position.x - enemy.transform.position.x));
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*2);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
		//Wackstick
		else if((model.animation["WackFaceOne"].enabled && enemy.GetComponent(PlayerControl).comboed) ||
		(model.animation["WackFaceTwo"].enabled && enemy.GetComponent(PlayerControl).comboed) || 
		(enemy.GetComponent(PlayerControl).model.animation["WackFaceOne"].enabled && comboed) ||
		(enemy.GetComponent(PlayerControl).model.animation["WackFaceTwo"].enabled && comboed)) {
			newPosition = new Vector3((transform.position.x + enemy.transform.position.x)/2, (Mathf.Max(transform.position.y, enemy.transform.position.y)) + 9, -10);
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*1);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
		//Normal
		else {
			newPosition = new Vector3((transform.position.x + enemy.transform.position.x)/2, (Mathf.Max(transform.position.y + 2.25, enemy.transform.position.y + 2.25)), -5-0.75*Mathf.Abs(transform.position.x - enemy.transform.position.x));
			Camera.main.transform.position = Vector3.Lerp(Camera.main.transform.position, newPosition, Time.deltaTime*2);
			Camera.main.transform.rotation.y = Camera.main.transform.position.x*-0.01;
			Time.timeScale = 1.0;
		}
		//Flyback
		if(flyBack) {
			model.animation.CrossFade("OffStage", 0.3);
			var newX = transform.position.x;
			if(transform.position.y > 0)
				newX = Mathf.Lerp(transform.position.x, 0, Time.deltaTime*30);
			var newPos = new Vector3(newX, 8, transform.position.z);
			transform.position = Vector3.Lerp(transform.position, newPos, Time.deltaTime * 2);
			rigidbody2D.gravityScale = 0;
			comboed = false;
			if(Mathf.Abs(transform.position.x) < 1) {
				Babe.parent = null;
				model.animation.CrossFade("Hurt", 0.3);
				flyBack = false;
				grounded = false;
				offStage = false;
				rigidbody2D.gravityScale = 9.8;
			}
		}
	}
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////ENEMY - AI////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





function aiUpdate () {
	//Shield visability handler
	if(!model.animation["Shield"].enabled && !itemLockedIn) {
		shield.gameObject.SetActive(false);
		weapon.gameObject.SetActive(true);
	}
	else if(model.animation["Shield"].enabled) {
		if(model.animation["Shield"].normalizedTime < 0.4) 
			shield.transform.localScale = Vector3.Lerp(shield.transform.localScale, Vector3(shieldScale, shieldScale, shieldScale), Time.deltaTime*5);
		else if(model.animation["Shield"].normalizedTime > 0.8)
			shield.transform.localScale = Vector3.Lerp(shield.transform.localScale, Vector3(0, 0, 0), Time.deltaTime*20);
	}

	//Prevent perma-combo
	if(!model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled) enemy.GetComponent(PlayerControl).beatUp = false;
	
	//Item		
	if(hasItem && !itemLockedIn) {
		itemLockedIn = true;
		itemNumLockedIn = itemNum;
		weapon.gameObject.SetActive(false);
		if(itemNumLockedIn == 1) wackStick.gameObject.SetActive(true);
		else if(itemNumLockedIn == 2) weedWacker.gameObject.SetActive(true);
		else if(itemNumLockedIn == 3) {
			if(health + 20 <= 150) health += 20;
			else health = 150;
			hasItem = false;
			itemLockedIn = false;
			weapon.gameObject.SetActive(true);
		}
		else if(itemNumLockedIn == 4) {
			lastRocketShot = Time.timeSinceLevelLoad + 2;
			rocketLauncher.gameObject.SetActive(true);
			rocketShots = 5;
		}
		else if(itemNumLockedIn == 5) mine.gameObject.SetActive(true);
		else if(itemNumLockedIn == 6) smoker.gameObject.SetActive(true);
		else if(itemNumLockedIn == 7) bumper.gameObject.SetActive(true);
	}
	if((Time.timeSinceLevelLoad > itemTime || (rocketShots <= 0 && itemNumLockedIn == 4 && !model.animation["RocketShoot"].enabled)) && !model.animation["Shield"].enabled) {
		hasItem = false;
		itemLockedIn = false;
		weapon.gameObject.SetActive(true);
		wackStick.gameObject.SetActive(false);
		weedWacker.gameObject.SetActive(false);
		rocketLauncher.gameObject.SetActive(false);
		mine.gameObject.SetActive(false);
		bumper.gameObject.SetActive(false);
		smoker.gameObject.SetActive(false);
		trail.gameObject.SetActive(false);
	}
	
	//Light up when hurt
	if(oldHealthColor != health) {
		for(var c = 0; c < mesh.renderer.materials.length; c++)
			mesh.renderer.materials[c].color = new Color(4,4,4);
		oldHealthColor = health;
		
		//Spark
		if(!weedWacked) {
			if(enemy.position.x > transform.position.x)
				clone = Instantiate(spark, Vector3(transform.position.x, transform.position.y+0.5, transform.position.z), spark.rotation);
			else
				clone = Instantiate(spark, Vector3(transform.position.x, transform.position.y+0.5, transform.position.z), spark.rotation);
			clone.transform.parent = transform;
		}
		
		defendSelf = false;
	}
	
	//Flyback
	if(flyBack) {
		model.animation.CrossFade("OffStage", 0.3);
		var newX = transform.position.x;
		if(transform.position.y > 0)
			newX = Mathf.Lerp(transform.position.x, 0, Time.deltaTime * 30);
		var newPos = new Vector3(newX, 8, transform.position.z);
		transform.position = Vector3.Lerp(transform.position, newPos, Time.deltaTime * 2);
		rigidbody2D.gravityScale = 0;
		comboed = false;
		if(Mathf.Abs(transform.position.x) < 1) {
			Babe.parent = null;
			model.animation.CrossFade("Hurt", 0.3);
			flyBack = false;
			grounded = false;
			offStage = false;
			rigidbody2D.gravityScale = 9.8;
		}
	}
	
	//Hurt color return
	if(mesh.renderer.material.color.r > 1)
		for(var m = 0; m < mesh.renderer.materials.length; m++)
			mesh.renderer.materials[m].color = Color.Lerp(mesh.renderer.materials[m].color, Color.gray, Time.deltaTime * 3);
	
	//Combo
	if(commitCombo && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75) && (model.animation["AAB"].normalizedTime > aabCommitTime || model.animation["ABA"].normalizedTime > abaCommitTime || model.animation["BBA"].normalizedTime > bbaCommitTime)) {
		commitCombo = false;
		enemy.GetComponent(PlayerControl).beatUp = false;
		if(model.animation["AAB"].enabled) {
			if(transform.position.x < enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(aabVelocity, aabVelocity*2), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= aabDamage;
			}
			else if(transform.position.x > enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(-aabVelocity, aabVelocity*2), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= aabDamage;
			}
		}
		else if(model.animation["ABA"].enabled) {
			if(transform.position.x < enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(abaVelocity, abaVelocity*1.25), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= abaDamage;
			}
			else if(transform.position.x > enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(-abaVelocity, abaVelocity*1.25), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= abaDamage;
			}
		}
		else if(model.animation["BBA"].enabled) {
			if(transform.position.x < enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(bbaVelocity, bbaVelocity-35), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= bbaDamage;
			}
			else if(transform.position.x > enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(-bbaVelocity, bbaVelocity-35), ForceMode2D.Impulse);
				enemy.GetComponent(PlayerControl).health -= bbaDamage;
			}
		}
	}
	
	//Combo sparks
	if(commitCombo && enemy.GetComponent(PlayerControl).model.animation["BeatUp"].enabled && Mathf.Ceil(enemy.GetComponent(PlayerControl).model.animation["BeatUp"].normalizedTime*10) % 2 == 0 && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4) {
		if(enemy.position.x < transform.position.x)
			clone = Instantiate(spark, Vector3(enemy.position.x, enemy.position.y + 1, enemy.position.z), spark.rotation);
		else
			clone = Instantiate(spark, Vector3(enemy.position.x, enemy.position.y + 1, enemy.position.z), spark.rotation);
		clone.transform.parent = enemy;
	}
}

function aiFixedUpdate() {
	//Stand still while playing specific animations
	if(model.animation["ThrowMine"].enabled || model.animation["DropKick"].enabled || model.animation["RocketShoot"].enabled || offStage || flyBack || model.animation["BBA"].enabled || model.animation["ABA"].enabled || model.animation["AAB"].enabled || model.animation["AttackPrimary"].enabled || model.animation["AttackPrimaryTwo"].enabled || model.animation["AttackSecondary"].enabled || model.animation["Landing"].enabled || model.animation["RocketLanding"].enabled || model.animation["Hurt"].enabled || model.animation["Comboed"].enabled || model.animation["Grounded"].enabled || onEdge)
		walkSpeed = 0;
	else
		walkSpeed = privateWalkSpeed;

	//Play Idle animation
	if(!model.animation["Landing"].enabled && !model.animation["RocketLanding"].enabled) {
		if(hasItem && itemNumLockedIn == 4)
			model.animation.CrossFade("IdleRocket", 0.30);
		else
			model.animation.CrossFade("Idle", 0.30);	
	}
	
	//Get locked close to player when combo animation is playing
	if(model.animation["BeatUp"].enabled && comboed && !weedWacked && model.animation["BeatUp"].normalizedTime < 0.1) {
		var additional : int;
		if(!enemy.GetComponent(PlayerControl).lookingLeft)
			additional = 1;
		else
			additional = -1;
		var lockPosition = new Vector3(enemy.transform.position.x + 2.5*additional, enemy.transform.position.y+1, transform.position.z);
		transform.position = lockPosition;
	}
	
	//Get beatup
	if((weedWacked || comboed) && !model.animation["Comboed"].enabled && !model.animation["Grounded"].enabled && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5)
		model.animation.CrossFade("BeatUp", 0.15, PlayMode.StopAll);
	else if(model.animation["BeatUp"].enabled && (Mathf.Abs(transform.position.x - enemy.transform.position.x) > 4.5 || Mathf.Abs(transform.position.y - enemy.transform.position.y) > 2))
		model.animation.Stop("BeatUp");
		
	//Spark on beatup
	if(Mathf.Ceil(model.animation["BeatUp"].normalizedTime*10) % 2 == 0 && model.animation["BeatUp"].enabled && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5) {
		clone = Instantiate(spark, transform.position, spark.rotation);
		clone.transform.parent = transform;
	}

	//Hill navigation
	if(hill)
		rigidbody2D.AddForce(Vector2(0,90), ForceMode2D.Force);
		
	//Hurt animation
	if(!weedWacked && health != oldHealth && !comboed && rigidbody2D.velocity.y != 0) {
		model.animation.CrossFade("Hurt", 0.15, PlayMode.StopAll);
	}
	
	if(comboed && (enemy.GetComponent(PlayerControl).model.animation["AAB"].normalizedTime > enemy.GetComponent(PlayerControl).aabCommitTime || enemy.GetComponent(PlayerControl).model.animation["ABA"].normalizedTime > enemy.GetComponent(PlayerControl).abaCommitTime || enemy.GetComponent(PlayerControl).model.animation["BBA"].normalizedTime > enemy.GetComponent(PlayerControl).bbaCommitTime || enemy.GetComponent(PlayerControl).model.animation["WackFaceOne"].normalizedTime > 0.05 || enemy.GetComponent(PlayerControl).model.animation["WackFaceTwo"].normalizedTime > 0.05))
		model.animation.CrossFade("Comboed", 0.15);
		
	if(comboed && grounded && model.animation["Comboed"].normalizedTime > 0.2)
		model.animation.CrossFade("Hurt", 0.15, PlayMode.StopAll);
		
	//Landing animation for all other things
	if(grounded && health != oldHealth && !comboed) {
		oldHealth = health;
		if(hasItem && itemNumLockedIn == 4)
			model.animation.CrossFade("RocketLanding", 0.15, PlayMode.StopAll);
		else
			model.animation.CrossFade("Landing", 0.15, PlayMode.StopAll);
	}
	
	//All else landing animations
	if(!comboed && grounded && (model.animation["DoubleJump"].normalizedTime > 0.3 || model.animation["Jump"].normalizedTime > 0.3 || model.animation["RocketJump"].normalizedTime > 0.3 || model.animation["Hurt"].enabled || model.animation["DropKick"].enabled)) {
		if(hasItem && itemNumLockedIn == 4)
			model.animation.CrossFade("RocketLanding", 0.15, PlayMode.StopAll);
		else
			model.animation.CrossFade("Landing", 0.15, PlayMode.StopAll);
	}
		
	//Set item object if it exists
	var items = GameObject.FindGameObjectsWithTag("Item");
	for (var itemSub in items)
		item = itemSub.transform;
	if(items.Length == 0)
		item = null;
		
	//Trail effect
	if(model.animation["WackFaceOne"].enabled)
		trail.gameObject.SetActive(true);
	else
		trail.gameObject.SetActive(false);
				
	//////////////////////////////////////////////////////////////////////////////////////////////
	//Main AI tasks and functions/////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	if(Time.timeSinceLevelLoad > 3 && !enemy.GetComponent(PlayerControl).comboed && !enemy.GetComponent(PlayerControl).offStage && !offStage && !enemy.GetComponent(PlayerControl).model.animation["OffStage"].enabled)
	if(instanceExecution) {
		//Shoot rocket or throw mine
		if(hasItem && (itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7) && resources - 5 >= 0 && Mathf.Abs(transform.position.x - enemy.transform.position.x) >= 10 && Mathf.Abs(transform.position.x - enemy.transform.position.x) <= 15 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 3.5 && !dropKick && !weedWacked && !enemy.GetComponent(PlayerControl).offStage && !comboed && !enemy.GetComponent(PlayerControl).comboed && !model.animation["Jump"].enabled && !model.animation["RocketJump"].enabled && !model.animation["Shield"].enabled && !model.animation["DoubleJump"].enabled && !model.animation["Comboed"].enabled && !model.animation["Grounded"].enabled) {
			if(itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7) {
				model.animation.CrossFade("ThrowMine", 0.02);
				throwMineCompletion = true;
				moveTowards = false;
			}
			if(itemNumLockedIn == 4 && Time.timeSinceLevelLoad > lastRocketShot && rocketShots > 0) {
				//Find Jumper
				var jump : Transform;
				var jumps = GameObject.FindGameObjectsWithTag("Jump");
				var lastDistance : int = 1000000;
				for (var jumpSub in jumps) {
					if(Mathf.Abs(transform.position.x - jumpSub.transform.position.x) < lastDistance) {
						lastDistance = Mathf.Abs(transform.position.x - jumpSub.transform.position.x);
						jump = jumpSub.transform;
					}
				}
				if((jump != null && Mathf.Abs(jump.transform.position.x - transform.position.x) >= 4) || jump == null) {
					resources = resources - 5;
					lastRocketShot = Time.timeSinceLevelLoad + 3;
					attack = false;
					
					//Face player
					if(enemy.position.x < transform.position.x) {
						transform.rotation.y = 180;
						lookingLeft = true;
					}
					else {
						transform.rotation.y = 0;
						lookingLeft = false;
					}
					 
					if(itemNumLockedIn == 4 && !enemy.GetComponent(PlayerControl).model.animation["Grounded"].enabled && !model.animation["RocketShoot"].enabled) {
						//Animate it
						model.animation.CrossFade("RocketShoot", 0.10);
						
						//Shoot rocket and tick count
						Instantiate(rocket, rocketShoot.position, transform.rotation);
						rocketShots--;
					}
				}
			}
		}
		
		//Throw mine completion
		if(throwMineCompletion && model.animation["ThrowMine"].normalizedTime > 0.35) {
			if(itemNumLockedIn == 5)
				Instantiate(mineInAir, transform.position, transform.rotation);
			else if(itemNumLockedIn == 6)
				Instantiate(smokerInAir, transform.position, transform.rotation);
			else 
				Instantiate(bumperInAir, transform.position, transform.rotation);
			hasItem = false;
			itemLockedIn = false;
			weapon.gameObject.SetActive(true);
			mine.gameObject.SetActive(false);
			bumper.gameObject.SetActive(false);
			smoker.gameObject.SetActive(false);
			throwMineCompletion = false;
		}
		
		//Double Jump Completion
		if(doubleJumpIt && model.animation["Jump"].normalizedTime > 0.1) {
			var jumpXVel = 60;
			var jumpYVel = 10;
			if(dropKick) { jumpXVel = 0; jumpYVel = 20; }
			if(lookingLeft) {
				rigidbody2D.AddForce(Vector2(-jumpXVel,jumpYVel),ForceMode2D.Impulse);
				model.animation.CrossFade("DoubleJump", 0.05, PlayMode.StopAll);
				doubleJump = false;
				doubleJumpIt = false;
			}
			else {
				rigidbody2D.AddForce(Vector2(jumpXVel,jumpYVel),ForceMode2D.Impulse);
				model.animation.CrossFade("DoubleJump", 0.05, PlayMode.StopAll);
				doubleJump = false;
				doubleJumpIt = false;
			}
		}
		
		//Drop Kick Completion
		if(!hasItem && !comboed && dropKick && item == null && model.animation["DoubleJump"].normalizedTime > 0.2) {
			if(model.animation["DoubleJump"].enabled) {
				if(enemy.transform.position.x < transform.position.x) {
					transform.rotation.y = 180;
					lookingLeft = true;
					rigidbody2D.AddForce(Vector2(-35, -5), ForceMode2D.Impulse);
					model.animation.CrossFade("DropKick", 0.05, PlayMode.StopAll);
				}
				else {
					transform.rotation.y = 0;
					lookingLeft = false;
					rigidbody2D.AddForce(Vector2(35, -5), ForceMode2D.Impulse);
					model.animation.CrossFade("DropKick", 0.05, PlayMode.StopAll);
				}
			}					
		}
		if(!hasItem && dropKick && model.animation["DropKick"].enabled && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 2 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) { 
			if(enemy.position.x < transform.position.x)
				clone = Instantiate(spark, Vector3(enemy.position.x + 1, enemy.position.y, enemy.position.z), spark.rotation);
			else
				clone = Instantiate(spark, Vector3(enemy.position.x - 1, enemy.position.y, enemy.position.z), spark.rotation);
			clone.transform.parent = enemy;
			
			enemy.GetComponent(PlayerControl).health -= 2;
			if(transform.position.x < enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(45, 0),ForceMode2D.Impulse);
				rigidbody2D.AddForce(Vector2(-10, -5), ForceMode2D.Impulse);
			}
			else if(transform.position.x > enemy.transform.position.x) {
				enemy.rigidbody2D.AddForce(Vector2(-45, 0),ForceMode2D.Impulse);
				rigidbody2D.AddForce(Vector2(10, -5), ForceMode2D.Impulse);
			}
			
			dropKick = false;
		}
	
		//Get up
		if(comboed) {
			resources = resources - 50;
			if(model.animation["Grounded"].normalizedTime > 0.9 || (grounded && model.animation["Hurt"].normalizedTime > 0.1))
				comboed = false;
		}
		
		//Get to the center of the stage
		if(getToCenter && Mathf.Abs(enemy.position.x - transform.position.x) < 2 && !comboed && !weedWacked && !model.animation["Grounded"].enabled && Time.timeSinceLevelLoad > groundedTime) {
			groundedTime = Time.timeSinceLevelLoad + 1;
			facePlayer = false;
			moveTowards = false;
			if(transform.position.x < 0) {
				if(enemy.position.x > transform.position.x && grounded) {
					rigidbody2D.AddForce(Vector2(0,55),ForceMode2D.Impulse);
					if(hasItem && itemNumLockedIn == 4)
						model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
					else
						model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
					doubleJumpIt = true;
					
					//Drop kick
					if(Random.Range(0,2) == 1 && !hasItem) {
						dropKick = true;
						facePlayer = false;
						if(lookingLeft)
							rigidbody2D.AddForce(Vector2(0,5),ForceMode2D.Impulse);
						else
							rigidbody2D.AddForce(Vector2(0,5),ForceMode2D.Impulse);
					}
				}
			}
			else {
				if(enemy.position.x < transform.position.x && grounded) {
					rigidbody2D.AddForce(Vector2(0,55),ForceMode2D.Impulse);
					if(hasItem && itemNumLockedIn == 4)
						model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
					else
						model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
					doubleJumpIt = true;
					
					//Drop kick
					if(Random.Range(0,2) == 1 && !hasItem) {
						dropKick = true;
						facePlayer = false;
						if(lookingLeft)
							rigidbody2D.AddForce(Vector2(0,10),ForceMode2D.Impulse);
						else
							rigidbody2D.AddForce(Vector2(0,10),ForceMode2D.Impulse);
					}			
				}
			}
		}
		
		//Turn to face the player
		if(facePlayer && resources - 5 >= 0 && !model.animation["Jump"].enabled && !model.animation["DoubleJump"].enabled) {
			resources = resources - 5;
			if(!lookingLeft) {
				transform.rotation.y = 180;
				lookingLeft = true;
			}
			else {
				transform.rotation.y = 0;
				lookingLeft = false;
			}
			facePlayer = false;
		}
		
		//Begin to move towards the player
		if(!comboed && !model.animation["Grounded"].enabled && moveTowards && resources - 5 >= 0 && !model.animation["Jump"].enabled && !model.animation["DoubleJump"].enabled && enemy.GetComponent(PlayerControl).recentAttacks < 6 && !model.animation["Shield"].enabled) {
			resources = resources - 5;
			if(hasItem && itemNumLockedIn == 4)
				model.animation.CrossFade("WalkCycleRocket", 0.10);
			else
				model.animation.CrossFade("WalkCycle", 0.10);
			if(!lookingLeft && !onEdge)
				rigidbody2D.AddForce(Vector2(walkSpeed, rigidbody2D.velocity.y), ForceMode2D.Force);
			else if(!onEdge)
				rigidbody2D.AddForce(Vector2(-walkSpeed, rigidbody2D.velocity.y), ForceMode2D.Force);
		}
		
		//Avoid attacks
		if(defendSelf && !model.animation["Shield"].enabled && !model.animation["Jump"].enabled && !hasItem && !getToCenter && resources - 2 >= 0 && grounded && Mathf.Abs(enemy.position.x - transform.position.x) < 5) {
			resources = resources - 2;
			if(Random.Range(0,10) == 1 && Time.timeSinceLevelLoad > groundedTime) {
				//Jump back in prep for drop kick
				groundedTime = Time.timeSinceLevelLoad + 1;
				if(lookingLeft)
					rigidbody2D.AddForce(Vector2(30,30),ForceMode2D.Impulse);
				else
					rigidbody2D.AddForce(Vector2(-30,30),ForceMode2D.Impulse);
					
				if(hasItem && itemNumLockedIn == 4)
					model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
				else
					model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
				defendSelf = false;
				
				//Drop kick
				doubleJumpIt = true;
				dropKick = true;
				if(lookingLeft) rigidbody2D.AddForce(Vector2(20,20),ForceMode2D.Impulse);
				else rigidbody2D.AddForce(Vector2(-20,20),ForceMode2D.Impulse);
			}
			else if(lastBlockTime + 0 < Time.timeSinceLevelLoad) {
				//Use the standard block
				lastBlockTime = Time.timeSinceLevelLoad;
				weapon.gameObject.SetActive(false);
				shield.gameObject.SetActive(true);
				model.animation.CrossFade("Shield", 0.05, PlayMode.StopSameLayer);
			}
		}
		
		//Jump player for item or rocket positioning
		if(((hasItem && itemNumLockedIn == 4 && point.x == 0) || (!hasItem && item != null)) && Mathf.Abs(enemy.position.x - transform.position.x) < 4 && grounded && Time.timeSinceLevelLoad > groundedTime && !getToCenter && ((lookingLeft && transform.position.x - enemy.transform.position.x > 0) || (!lookingLeft && transform.position.x - enemy.transform.position.x < 0))) {	
			var pointDrop : Vector3;
			if(item == null)
				pointDrop.x = point.x;
			else
				pointDrop.x = item.position.x;
				
			if(lookingLeft && pointDrop.x < transform.position.x) {
				rigidbody2D.AddForce(Vector2(-30,55),ForceMode2D.Impulse);
				if(hasItem && itemNumLockedIn == 4)
					model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
				else
					model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
				groundedTime = Time.timeSinceLevelLoad + 1;
			}
			else if(!lookingLeft && pointDrop.x > transform.position.x) {
				rigidbody2D.AddForce(Vector2(30,55),ForceMode2D.Impulse);
				if(hasItem && itemNumLockedIn == 4)
					model.animation.CrossFade("RocketJump", 0.05, PlayMode.StopAll);
				else
					model.animation.CrossFade("Jump", 0.05, PlayMode.StopAll);
				groundedTime = Time.timeSinceLevelLoad + 1;
			}
		}
		
		//Attack player
		if(Mathf.Abs(transform.position.x - enemy.transform.position.x) < 3 && Mathf.Abs(transform.position.y - enemy.transform.position.y) < 2 && !dropKick && !weedWacked && attack && !enemy.GetComponent(PlayerControl).offStage && !comboed && !enemy.GetComponent(PlayerControl).comboed && !model.animation["Jump"].enabled && !model.animation["RocketJump"].enabled && !model.animation["DoubleJump"].enabled && !model.animation["AttackPrimary"].enabled && !model.animation["AttackSecondary"].enabled && !model.animation["AAB"].enabled && !model.animation["ABA"].enabled && !model.animation["BBA"].enabled) {
			 //Face player
			 if(enemy.position.x < transform.position.x) {
				transform.rotation.y = 180;
				lookingLeft = true;
			 }
		 	 else {
				transform.rotation.y = 0;
				lookingLeft = false;
			 }
			 
			 //Adjust variables
			 attack = false;
			 
			 if(!itemLockedIn) {
				 //Chose the strength of the attack
				 var randomIndex = Random.Range(Mathf.Ceil(levelDifficulty/2), multiplier.Length);
				 if(multiplier[randomIndex] == 3)
				 	enemy.GetComponent(PlayerControl).comboed = true;
				 	
				 //Spark
				 if(enemy.position.x < transform.position.x)
				 	clone = Instantiate(spark, Vector3(enemy.position.x + 1, enemy.position.y, enemy.position.z), spark.rotation);
				 else
				 	clone = Instantiate(spark, Vector3(enemy.position.x - 1, enemy.position.y, enemy.position.z), spark.rotation);
				 clone.transform.parent = enemy;
				 		
				 //Play animations
				 if(multiplier[randomIndex] == 1) {
					 model.animation.CrossFade("AttackPrimary", 0.05, PlayMode.StopSameLayer);
				 }
				 else if (multiplier[randomIndex] > 1 && multiplier[randomIndex] <= 2) {
					 model.animation.CrossFade("AttackPrimaryTwo", 0.05, PlayMode.StopSameLayer);
				 }
				 else if (multiplier[randomIndex] == 2) {
				 	 model.animation.CrossFade("AttackSecondary", 0.05, PlayMode.StopSameLayer);
				 }
				 else if (multiplier[randomIndex] == 3) {
				 	if(currentCombo == 0) {
				 		model.animation.CrossFade("AAB", 0.05, PlayMode.StopSameLayer);
				 		currentCombo = 1;
				 	}
				 	else if(currentCombo == 1) {
				 		model.animation.CrossFade("ABA", 0.05, PlayMode.StopSameLayer);
				 		currentCombo = 2;
				 	}
				 	else if(currentCombo == 2) {
				 		model.animation.CrossFade("BBA", 0.05, PlayMode.StopSameLayer);
				 		currentCombo = 0;
				 	}
				 }
				 
				 //Subtract health and do damage
				 if(multiplier[randomIndex] != 3 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
					 enemy.GetComponent(PlayerControl).health -= multiplier[randomIndex];
					 if(transform.position.x < enemy.transform.position.x)
					 	enemy.rigidbody2D.AddForce(Vector2((150-privateWalkSpeed)/3+20*multiplier[randomIndex], (160-privateWalkSpeed)/2+10*multiplier[randomIndex]),ForceMode2D.Impulse);
					 else if(transform.position.x > enemy.transform.position.x)
					 	enemy.rigidbody2D.AddForce(Vector2(-(150-privateWalkSpeed)/3-20*multiplier[randomIndex], (160-privateWalkSpeed)/2+10*multiplier[randomIndex]),ForceMode2D.Impulse);
				}
				else {
					commitCombo = true;
					enemy.GetComponent(PlayerControl).beatUp = true;
				}
			}
			else {
				if(itemNumLockedIn == 1 && !enemy.GetComponent(PlayerControl).model.animation["Grounded"].enabled && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
					//Spark
					var cloneTwo : Transform;
					if(enemy.position.x < transform.position.x)
						cloneTwo = Instantiate(spark, Vector3(enemy.position.x + 1, enemy.position.y, enemy.position.z), spark.rotation);
					else
						cloneTwo = Instantiate(spark, Vector3(enemy.position.x - 1, enemy.position.y, enemy.position.z), spark.rotation);
					cloneTwo.transform.parent = enemy;
									
					//Subtract health and do damage
					enemy.GetComponent(PlayerControl).health -= 1;
					if(transform.position.x < enemy.transform.position.x)
						enemy.rigidbody2D.AddForce(Vector2(50, 100),ForceMode2D.Impulse);
					else if(transform.position.x > enemy.transform.position.x)
						enemy.rigidbody2D.AddForce(Vector2(-50, 100),ForceMode2D.Impulse);
						
					enemy.GetComponent(PlayerControl).comboed = true;
					
					var stream : Transform = Instantiate(smokeStream, enemy.position, smokeStream.rotation);
					stream.parent = enemy;
					model.animation.CrossFade("WackFaceOne", 0.05, PlayMode.StopSameLayer);
				}
				else if(itemNumLockedIn == 2 && !weedWacked && grounded) {
					model.animation.CrossFade("WalkCycleWeed", 0.05, PlayMode.StopSameLayer);
					enemy.GetComponent(PlayerControl).weedWacked = true;
					
					//Move
					if(!lookingLeft)
						rigidbody2D.AddForce(Vector2(walkSpeed*1.5, rigidbody2D.velocity.y), ForceMode2D.Force);
					else
						rigidbody2D.AddForce(Vector2(-walkSpeed*1.5, rigidbody2D.velocity.y), ForceMode2D.Force);
					
					if(Mathf.Ceil(model.animation["WalkCycleWeed"].normalizedTime * 10) % 2 == 0 && (enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime < 0.4 || enemy.GetComponent(PlayerControl).model.animation["Shield"].normalizedTime > 0.75)) {
						//Spark
						if(enemy.position.x < transform.position.x)
							cloneTwo = Instantiate(spark, Vector3(enemy.position.x, enemy.position.y, enemy.position.z), spark.rotation);
						else
							cloneTwo = Instantiate(spark, Vector3(enemy.position.x, enemy.position.y, enemy.position.z), spark.rotation);
						cloneTwo.transform.parent = enemy;
						
						//Subtract health and do damage
						enemy.GetComponent(PlayerControl).health -= 0.1;
						if(transform.position.x < enemy.transform.position.x) {
							enemy.rigidbody2D.AddForce(Vector2(2, 3),ForceMode2D.Impulse);
							Instantiate(grass, Vector3(weedWacker.position.x+2, weedWacker.position.y, weedWacker.position.z), grass.rotation);
						}
						else if(transform.position.x > enemy.transform.position.x) {
							enemy.rigidbody2D.AddForce(Vector2(-2, 3),ForceMode2D.Impulse);
							Instantiate(grass, Vector3(weedWacker.position.x-2, weedWacker.position.y, weedWacker.position.z), grass.rotation);
						}
					}
						
					attack = true;
				}		
			}
		}
		if(hasItem && itemNumLockedIn == 2 && Mathf.Abs(transform.position.x - enemy.transform.position.x) < 4.5)
			attack = true;
		else {
			attack = false;
			enemy.GetComponent(PlayerControl).weedWacked = false;
			model.animation.Stop("WalkCycleWeed");
		}
		
		resources = 6 + Mathf.Floor(levelDifficulty/3);;
		if(Time.timeSinceLevelLoad > lastTime + addTime) {
			instanceExecution = false;
		}
	}
	else {
		//Create a point to move towards for the rocket launcher
		if(hasItem && (itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7)) {
			if(enemy.position.x < transform.position.x)
				point.x = enemy.position.x + 12;
			else
				point.x = enemy.position.x - 12;
				
			if(getToCenter && point.x < 0)
				point.x = 0;
			else if(getToCenter && point.x > 0)
				point.x = 0;
		}
		
		//Check if the unit should move towards the player		
		if(hasItem && (itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7)) {				
			moveTowards = Mathf.Abs(point.x - transform.position.x) > 2;
		}
		else {
			if(hasItem || item == null)
				moveTowards = Mathf.Abs(enemy.position.x - transform.position.x) > 3;
			else
				moveTowards = Mathf.Abs(item.position.x - transform.position.x) > 0;
		}
			
		//Check if the unit should face the player
		if(hasItem && (itemNumLockedIn == 4 || itemNumLockedIn == 5 || itemNumLockedIn == 6 || itemNumLockedIn == 7)) {
			if(Mathf.Abs(point.x - transform.position.x) <= 2)
				facePlayer = (enemy.position.x < transform.position.x && !lookingLeft) || (enemy.position.x > transform.position.x && lookingLeft);
			else
				facePlayer = ((point.x > transform.position.x && lookingLeft) || (point.x < transform.position.x && !lookingLeft));
		}
		else {
			if((hasItem || item == null) && enemy.GetComponent(PlayerControl).recentAttacks < 4)
				facePlayer = ((enemy.position.x < transform.position.x && !lookingLeft) || (enemy.position.x > transform.position.x && lookingLeft));
			else if(enemy.GetComponent(PlayerControl).recentAttacks >= 4 && (hasItem || item == null))
				facePlayer = ((enemy.position.x > transform.position.x && !lookingLeft) || (enemy.position.x < transform.position.x && lookingLeft));
			else
				facePlayer = ((item.position.x > transform.position.x && lookingLeft) || (item.position.x < transform.position.x && !lookingLeft));
		}
		
		//Check if the unit should defend itself
		defendSelf = (enemy.GetComponent(PlayerControl).isAttacking);
			
		//Check if the unit is on the same level
		sameLevel = (Mathf.Abs(enemy.position.y - transform.position.y) < 2);
			
		//Begin the new instance
		attack = true;
		doubleJump = true;
		instanceExecution = true;
		lastTime = Time.timeSinceLevelLoad;
	}
}
