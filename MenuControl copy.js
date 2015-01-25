#pragma strict
public var prototypeCell : Transform;
public var numberOfCells : int;
public var tableLength : int;
public var cellSpacing : float;
public var heroPicSet : Transform;
public var heroPic : Transform;
public var ai1Pic : Transform;
public var ai2Pic : Transform;
public var topBar : GameObject;
public var defaultBar : Sprite;
public var readyBar : Sprite;
public var dotIndicator : GameObject;
public var dots_1 : Sprite;
public var dots_2 : Sprite;
public var dots_3 : Sprite;

private var cells : Transform[];
private var topPosition : float;
private var bottomPosition : float;
private var moveDirection : boolean;
private var moveSpeed : float;
private var fingerDown : boolean;
private var lastNumber : int = -1;
private var haltSwap : boolean;
private var correction : float;
private var didSelectP1 : boolean;
private var didSelectP2 : boolean;
private var didSelectP3 : boolean;
private var touchRect : Rect = Rect(Screen.width*0.07, 0, Screen.width*0.6, Screen.height);
private var heroPicRect : Rect = Rect(Screen.width*0.71, 0, Screen.width*0.29, Screen.height*0.7);
private var heroPicType : int = 0;
private var deltaHeroPicSet : float;
private var damper : float = 100;
private var snapBack : boolean = true;
private var fadeHeroPic : boolean = false;

//Cell pictures
public var tennis : Sprite;
public var lion : Sprite;
public var elf : Sprite;
public var goat : Sprite;
public var bones : Sprite;
public var rabbit : Sprite;
public var scuba : Sprite;
public var opera : Sprite;
public var box : Sprite;
public var pig : Sprite;
public var scotty : Sprite;
public var chick : Sprite;
public var wolfy : Sprite;
public var shovelheart : Sprite;
public var mermaid : Sprite;
public var bear : Sprite;
public var clay : Sprite;
public var qp : Sprite;
public var tcow : Sprite;
public var scarecrow : Sprite;
public var cornercreeper : Sprite;
public var hound : Sprite;
public var lordevil : Sprite;
public var hedgemonster : Sprite;

//Hero Pictures
public var tennisLarge : Sprite;
public var lionLarge : Sprite;
public var elfLarge : Sprite;
public var goatLarge : Sprite;
public var bonesLarge : Sprite;
public var rabbitLarge : Sprite;
public var scubaLarge : Sprite;
public var operaLarge : Sprite;
public var boxLarge : Sprite;
public var pigLarge : Sprite;
public var scottyLarge : Sprite;
public var chickLarge : Sprite;
public var wolfyLarge : Sprite;
public var shovelheartLarge : Sprite;
public var mermaidLarge : Sprite;
public var bearLarge : Sprite;
public var clayLarge : Sprite;
public var qpLarge : Sprite;
public var tcowLarge : Sprite;
public var scarecrowLarge : Sprite;
public var cornercreeperLarge : Sprite;
public var houndLarge : Sprite;
public var lordevilLarge : Sprite;
public var hedgemonsterLarge : Sprite;

//Headers
public var humanHeader : Transform;
public var mythicalHeader : Transform;
public var animalHeader : Transform;
public var stageHeader : Transform;

public var scroller : Transform;
private var scrollerNum : float;

function Start () {
	Application.targetFrameRate = 60;

	cells = new Transform[numberOfCells];
	
	PlayerPrefs.SetInt("PlayerNum", -1);
	PlayerPrefs.SetInt("EnemyNum", -1);
	PlayerPrefs.SetInt("EnemyNumTwo", -1);

	for(var i = 0; i < numberOfCells; i++) {
		var cell : Transform = Instantiate(prototypeCell, Vector3(-1.64, -3.5+(i*cellSpacing-cellSpacing*(numberOfCells/2)), 0), transform.rotation);
		
		//Tennis Man
		if(i == 8) {
			cell.GetComponent(SpriteRenderer).sprite = tennis;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Lion
		else if(i == 0) {
			cell.GetComponent(SpriteRenderer).sprite = lion;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}	
		//Elf
		else if(i == 17) {
			cell.GetComponent(SpriteRenderer).sprite = elf;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Goat
		else if(i == 1) {
			cell.GetComponent(SpriteRenderer).sprite = goat;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Bones
		else if(i == 16) {
			cell.GetComponent(SpriteRenderer).sprite = bones;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Rabbit
		else if(i == 2) {
			cell.GetComponent(SpriteRenderer).sprite = rabbit;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scuba
		else if(i == 9) {
			cell.GetComponent(SpriteRenderer).sprite = scuba;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Opera
		else if(i == 10) {
			cell.GetComponent(SpriteRenderer).sprite = opera;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Box
		else if(i == 18) {
			cell.GetComponent(SpriteRenderer).sprite = box;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Pig
		else if(i == 3) {
			cell.GetComponent(SpriteRenderer).sprite = pig;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scotty
		else if(i == 11) {
			cell.GetComponent(SpriteRenderer).sprite = scotty;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Chick
		else if(i == 19) {
			cell.GetComponent(SpriteRenderer).sprite = chick;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Wolfy
		else if(i == 4) {
			cell.GetComponent(SpriteRenderer).sprite = wolfy;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Shovelheart
		else if(i == 12) {
			cell.GetComponent(SpriteRenderer).sprite = shovelheart;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Mermaid
		else if(i == 20) {
			cell.GetComponent(SpriteRenderer).sprite = mermaid;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Bear
		else if(i == 5) {
			cell.GetComponent(SpriteRenderer).sprite = bear;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Clay
		else if(i == 13) {
			cell.GetComponent(SpriteRenderer).sprite = clay;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Qp
		else if(i == 21) {
			cell.GetComponent(SpriteRenderer).sprite = qp;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Tcow
		else if(i == 6) {
			cell.GetComponent(SpriteRenderer).sprite = tcow;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scarecrow
		else if(i == 14) {
			cell.GetComponent(SpriteRenderer).sprite = scarecrow;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Cornercreeper
		else if(i == 22) {
			cell.GetComponent(SpriteRenderer).sprite = cornercreeper;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Hound
		else if(i == 7) {
			cell.GetComponent(SpriteRenderer).sprite = hound;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Lordevil
		else if(i == 15) {
			cell.GetComponent(SpriteRenderer).sprite = lordevil;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Hedgemonster
		else if(i == 23) {
			cell.GetComponent(SpriteRenderer).sprite = hedgemonster;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		else {
			cell.GetComponent(SpriteRenderer).sprite = null;
			cell.GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		
		cell.GetComponent(CellNumber).cellNumber = numberOfCells-i-2;
		cells[i] = cell;
		
		topPosition = i*cellSpacing-cellSpacing*(numberOfCells/2);
		if(i == 0) bottomPosition = i-1*cellSpacing-cellSpacing*(numberOfCells/2);
	}
}

function Update () {
	if(!fingerDown) moveSpeed = Mathf.Lerp(moveSpeed, 0, Time.deltaTime*2);
	if(moveSpeed < 0) moveDirection = true;
	else moveDirection = false;
	
	scroller.position.y = Mathf.Lerp(scroller.position.y, 3.5 - scrollerNum/2.64, Time.deltaTime*12);
	
	for(var t = 0; t < Input.touchCount; t++) {
		//Determin what you are touching
		var touchPosition = Vector2(Input.GetTouch(t).position.x, Input.GetTouch(t).position.y);
		var deltaPosition = Input.GetTouch(t).deltaPosition;
		Debug.DrawRay(Camera.main.ScreenToWorldPoint(touchPosition), Vector3(0,0,15), Color.blue, 5);
		var hit : RaycastHit;
		if (Physics.Raycast (Camera.main.ScreenToWorldPoint(touchPosition), Vector3(0,0,15), hit)) {
			if(hit.transform.gameObject.tag == "Cell" && Input.GetTouch(t).phase == TouchPhase.Ended && Mathf.Abs(moveSpeed) == 0) {
				UpdateHeroPic(hit.transform.gameObject.GetComponent(CellNumber).cellNumber);
				if(didSelectP1 && (didSelectP2 || didSelectP3)) topBar.GetComponent(SpriteRenderer).sprite = readyBar;
				else topBar.GetComponent(SpriteRenderer).sprite = defaultBar;
			}
			else if(didSelectP1 && (didSelectP2 || didSelectP3) && hit.transform.gameObject.tag == "FightButton" && Input.GetTouch(t).phase == TouchPhase.Ended) {
				Application.LoadLevel("StageOne");
			}
		}
		//Determin the move speed
		if(touchRect.Contains(touchPosition)) {
			if(Input.GetTouch(t).phase == TouchPhase.Moved) moveSpeed = 0.0175*deltaPosition.y;
			if(moveSpeed > 1.5) moveSpeed = 1.5;
			if(moveSpeed < -1.5) moveSpeed = -1.5;
			if(Input.GetTouch(t).phase == TouchPhase.Began) moveSpeed = 0;
		}
		//Determin the heroPicSet's change in position
		if(Input.GetTouch(t).phase == TouchPhase.Began) {
			deltaHeroPicSet = heroPicSet.position.x;
			snapBack = false;
		}
		else if(Input.GetTouch(t).phase == TouchPhase.Ended || Input.GetTouch(t).phase == TouchPhase.Canceled) {
			deltaHeroPicSet = heroPicSet.position.x - deltaHeroPicSet;
			snapBack = true;
		}
		//Lock heroPicSet to finger
		if(Input.GetTouch(t).phase == TouchPhase.Moved && heroPicRect.Contains(touchPosition)) {
			//Slow excessive movement gradually
			if((heroPicType == 0 && deltaPosition.x > 0) || (heroPicType == 2 && deltaPosition.x < 0)) damper = Mathf.Lerp(deltaPosition.x, 10000, Time.deltaTime);
			else damper = 100;
			heroPicSet.transform.position.x += deltaPosition.x/damper;
			snapBack = false;
		}
		else if(!heroPicRect.Contains(touchPosition)) snapBack = true;
		//Detect hero pic cancellation
		if(heroPicRect.Contains(touchPosition) && deltaPosition.y > 20) {
			fadeHeroPic = true;
		}
		//Determin wheather or not the finger is down
		fingerDown = !(Input.GetTouch(t).phase == TouchPhase.Ended || Input.GetTouch(t).phase == TouchPhase.Canceled);
	}
	
	//Snap number for heroPicSet
	if(deltaHeroPicSet <= -0.6 && heroPicType < 2 && !fingerDown) {
		heroPicType++;
		deltaHeroPicSet = 0;
	}
	else if(deltaHeroPicSet >= 0.6 && heroPicType > 0 && !fingerDown) {
		heroPicType--;
		deltaHeroPicSet = 0;
	}
	//Snap positioning of heroPicSet
	if(heroPicType == 0 && snapBack) heroPicSet.transform.position.x = Mathf.Lerp(heroPicSet.transform.position.x, 6.3, Time.deltaTime*4);
	else if(heroPicType == 1 && snapBack) heroPicSet.transform.position.x = Mathf.Lerp(heroPicSet.transform.position.x, 2.3, Time.deltaTime*4);
	else if(heroPicType == 2 && snapBack) heroPicSet.transform.position.x = Mathf.Lerp(heroPicSet.transform.position.x, -1.7, Time.deltaTime*4);

	if(cells[7].position.y < 2.5 && lastNumber < 0 && moveSpeed <= 0 && !fingerDown) {
		for(var b = 0; b < numberOfCells; b++)
			cells[b].position = Vector3.Lerp(cells[b].position, Vector3(-1.64, cells[b].position.y-correction, 0), Time.deltaTime*7);
		moveSpeed = 0;
		correction = cells[5].position.y+1.5;
	}
	else if(cells[7].position.y < 2.5 && lastNumber < 0 && moveSpeed < 0 && fingerDown) {
		moveSpeed = Mathf.Lerp(moveSpeed, 0, Time.deltaTime*50);
	}
	if(lastNumber > tableLength && moveSpeed >= 0 && !fingerDown) {
		for(var c = 0; c < numberOfCells; c++)
			cells[c].position = Vector3.Lerp(cells[c].position, Vector3(-1.64, cells[c].position.y-correction, 0), Time.deltaTime*7);
		moveSpeed = 0;
		correction = cells[4].position.y;
	}
	else if(lastNumber > tableLength && moveSpeed > 0 && fingerDown) {
		moveSpeed = Mathf.Lerp(moveSpeed, 0, Time.deltaTime*50);
	}
	
	haltSwap = false;
	if((lastNumber < 0 && moveSpeed <= 0) || (lastNumber > tableLength && moveSpeed >= 0)) haltSwap = true;
	
	for(var i = 0; i < numberOfCells; i++) {
		cells[i].Translate(0, moveSpeed, 0);
		
		if(moveDirection && cells[i].position.y-0.01 < bottomPosition && !haltSwap) {
			cells[i].position.y = cells[i].position.y + (numberOfCells*cellSpacing);
			if(cells[i].GetComponent(CellNumber).cellNumber-9 < 8) cells[i].position.y+= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber < 8) cells[i].position.y-= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber-9 < 16) cells[i].position.y+= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber < 16) cells[i].position.y-= 0.6;
			cells[i].GetComponent(CellNumber).cellNumber-=numberOfCells;
			lastNumber = cells[i].GetComponent(CellNumber).cellNumber;
			scrollerNum--;
		}
		else if(!moveDirection && cells[i].position.y+0.01 > topPosition && !haltSwap) {
			cells[i].position.y = cells[i].position.y - (numberOfCells*cellSpacing);
			if(cells[i].GetComponent(CellNumber).cellNumber+9 > 7) cells[i].position.y-= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber > 7) cells[i].position.y+= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber+9 > 15) cells[i].position.y-= 0.6;
			if(cells[i].GetComponent(CellNumber).cellNumber > 15) cells[i].position.y+= 0.6;
			cells[i].GetComponent(CellNumber).cellNumber+=numberOfCells;
			lastNumber = cells[i].GetComponent(CellNumber).cellNumber;
			scrollerNum++;
		}
		
		//Tennis Man
		if(cells[i].GetComponent(CellNumber).cellNumber == 8) {
			cells[i].GetComponent(SpriteRenderer).sprite = tennis;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(1);
		}
		//Lion
		else if(cells[i].GetComponent(CellNumber).cellNumber == 0) {
			cells[i].GetComponent(SpriteRenderer).sprite = lion;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(0);
		}	
		//Elf
		else if(cells[i].GetComponent(CellNumber).cellNumber == 17) {
			cells[i].GetComponent(SpriteRenderer).sprite = elf;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Goat
		else if(cells[i].GetComponent(CellNumber).cellNumber == 1) {
			cells[i].GetComponent(SpriteRenderer).sprite = goat;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Bones
		else if(cells[i].GetComponent(CellNumber).cellNumber == 16) {
			cells[i].GetComponent(SpriteRenderer).sprite = bones;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(2);
		}
		//Rabbit
		else if(cells[i].GetComponent(CellNumber).cellNumber == 2) {
			cells[i].GetComponent(SpriteRenderer).sprite = rabbit;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scuba
		else if(cells[i].GetComponent(CellNumber).cellNumber == 9) {
			cells[i].GetComponent(SpriteRenderer).sprite = scuba;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Opera
		else if(cells[i].GetComponent(CellNumber).cellNumber == 10) {
			cells[i].GetComponent(SpriteRenderer).sprite = opera;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Box
		else if(cells[i].GetComponent(CellNumber).cellNumber == 18) {
			cells[i].GetComponent(SpriteRenderer).sprite = box;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Pig
		else if(cells[i].GetComponent(CellNumber).cellNumber == 3) {
			cells[i].GetComponent(SpriteRenderer).sprite = pig;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scotty
		else if(cells[i].GetComponent(CellNumber).cellNumber == 11) {
			cells[i].GetComponent(SpriteRenderer).sprite = scotty;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Chick
		else if(cells[i].GetComponent(CellNumber).cellNumber == 19) {
			cells[i].GetComponent(SpriteRenderer).sprite = chick;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Wolfy
		else if(cells[i].GetComponent(CellNumber).cellNumber == 4) {
			cells[i].GetComponent(SpriteRenderer).sprite = wolfy;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Shovelheart
		else if(cells[i].GetComponent(CellNumber).cellNumber == 12) {
			cells[i].GetComponent(SpriteRenderer).sprite = shovelheart;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Mermaid
		else if(cells[i].GetComponent(CellNumber).cellNumber == 20) {
			cells[i].GetComponent(SpriteRenderer).sprite = mermaid;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Bear
		else if(cells[i].GetComponent(CellNumber).cellNumber == 5) {
			cells[i].GetComponent(SpriteRenderer).sprite = bear;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Clay
		else if(cells[i].GetComponent(CellNumber).cellNumber == 13) {
			cells[i].GetComponent(SpriteRenderer).sprite = clay;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Qp
		else if(cells[i].GetComponent(CellNumber).cellNumber == 21) {
			cells[i].GetComponent(SpriteRenderer).sprite = qp;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Tcow
		else if(cells[i].GetComponent(CellNumber).cellNumber == 6) {
			cells[i].GetComponent(SpriteRenderer).sprite = tcow;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Scarecrow
		else if(cells[i].GetComponent(CellNumber).cellNumber == 14) {
			cells[i].GetComponent(SpriteRenderer).sprite = scarecrow;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Cornercreeper
		else if(cells[i].GetComponent(CellNumber).cellNumber == 22) {
			cells[i].GetComponent(SpriteRenderer).sprite = cornercreeper;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Hound
		else if(cells[i].GetComponent(CellNumber).cellNumber == 7) {
			cells[i].GetComponent(SpriteRenderer).sprite = hound;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Lordevil
		else if(cells[i].GetComponent(CellNumber).cellNumber == 15) {
			cells[i].GetComponent(SpriteRenderer).sprite = lordevil;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		//Hedgemonster
		else if(cells[i].GetComponent(CellNumber).cellNumber == 23) {
			cells[i].GetComponent(SpriteRenderer).sprite = hedgemonster;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
		else {
			cells[i].GetComponent(SpriteRenderer).sprite = null;
			cells[i].GetComponent(typeof(CellNumber)).UpdateHeader(5);
		}
	}
	
	//Fade hero pic
	if(fadeHeroPic) {
		if(heroPicType == 0) {
			heroPic.renderer.material.color.a = Mathf.Lerp(heroPic.renderer.material.color.a, 0, Time.deltaTime*8);
			heroPic.position.y = Mathf.Lerp(heroPic.position.y, 5, Time.deltaTime*2);
			if(heroPic.renderer.material.color.a < 0.1) {
				fadeHeroPic = false;
				heroPic.renderer.material.color.a = 1;
				heroPic.localPosition.y = 0;
				heroPic.GetComponent(SpriteRenderer).sprite = null;
				didSelectP1 = false;
				PlayerPrefs.SetInt("PlayerNum", -1);
				if(!(didSelectP1 && (didSelectP2 || didSelectP3))) topBar.GetComponent(SpriteRenderer).sprite = defaultBar;
			}
		}
		else if(heroPicType == 1) {
			ai1Pic.renderer.material.color.a = Mathf.Lerp(ai1Pic.renderer.material.color.a, 0, Time.deltaTime*8);
			ai1Pic.position.y = Mathf.Lerp(ai1Pic.position.y, 5, Time.deltaTime*2);
			if(ai1Pic.renderer.material.color.a < 0.1) {
				fadeHeroPic = false;
				ai1Pic.renderer.material.color.a = 1;
				ai1Pic.localPosition.y = 0;
				ai1Pic.GetComponent(SpriteRenderer).sprite = null;
				didSelectP2 = false;
				PlayerPrefs.SetInt("EnemyNum", -1);
				if(!(didSelectP1 && (didSelectP2 || didSelectP3))) topBar.GetComponent(SpriteRenderer).sprite = defaultBar;
			}
		}
		else if(heroPicType == 2) {
			ai2Pic.renderer.material.color.a = Mathf.Lerp(ai2Pic.renderer.material.color.a, 0, Time.deltaTime*8);
			ai2Pic.position.y = Mathf.Lerp(ai2Pic.position.y, 5, Time.deltaTime*2);
			if(ai2Pic.renderer.material.color.a < 0.1) {
				fadeHeroPic = false;
				ai2Pic.renderer.material.color.a = 1;
				ai2Pic.localPosition.y = 0;
				ai2Pic.GetComponent(SpriteRenderer).sprite = null;
				didSelectP3 = false;
				PlayerPrefs.SetInt("EnemyNum", -1);
				if(!(didSelectP1 && (didSelectP2 || didSelectP3))) topBar.GetComponent(SpriteRenderer).sprite = defaultBar;
			}
		}
	}
	
	//Update dotIndicator
	if(heroPicType == 0) dotIndicator.GetComponent(SpriteRenderer).sprite = dots_1;
	else if(heroPicType == 1) dotIndicator.GetComponent(SpriteRenderer).sprite = dots_2;
	else if(heroPicType == 2) dotIndicator.GetComponent(SpriteRenderer).sprite = dots_3;
}

function UpdateHeroPic(i : int) {
	//Tennis Man
	if(i == 8) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = tennisLarge;
			PlayerPrefs.SetInt("PlayerNum", 0);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = tennisLarge;
			PlayerPrefs.SetInt("EnemyNum", 0);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = tennisLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 0);
		}
	}
	//Lion
	else if(i == 0) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = lionLarge;
			PlayerPrefs.SetInt("PlayerNum", 1);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = lionLarge;
			PlayerPrefs.SetInt("EnemyNum", 1);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = lionLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 1);
		}
	}	
	//Elf
	else if(i == 17) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = elfLarge;
			PlayerPrefs.SetInt("PlayerNum", 2);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = elfLarge;
			PlayerPrefs.SetInt("EnemyNum", 2);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = elfLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 2);
		}
	}
	//Goat
	else if(i == 1) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = goatLarge;
			PlayerPrefs.SetInt("PlayerNum", 3);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = goatLarge;
			PlayerPrefs.SetInt("EnemyNum", 3);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = goatLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 3);
		}
	}
	//Bones
	else if(i == 16) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = bonesLarge;
			PlayerPrefs.SetInt("PlayerNum", 4);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = bonesLarge;
			PlayerPrefs.SetInt("EnemyNum", 4);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = bonesLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 4);
		}
	}
	//Rabbit
	else if(i == 2) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = rabbitLarge;
			PlayerPrefs.SetInt("PlayerNum", 5);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = rabbitLarge;
			PlayerPrefs.SetInt("EnemyNum", 5);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = rabbitLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 5);
		}
	}
	//Scuba
	else if(i == 9) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = scubaLarge;
			PlayerPrefs.SetInt("PlayerNum", 6);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = scubaLarge;
			PlayerPrefs.SetInt("EnemyNum", 6);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = scubaLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 6);
		}
	}
	//Opera
	else if(i == 10) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = operaLarge;
			PlayerPrefs.SetInt("PlayerNum", 7);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = operaLarge;
			PlayerPrefs.SetInt("EnemyNum", 7);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = operaLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 7);
		}
	}
	//Box
	else if(i == 18) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = boxLarge;
			PlayerPrefs.SetInt("PlayerNum", 8);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = boxLarge;
			PlayerPrefs.SetInt("EnemyNum", 8);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = boxLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 8);
		}
	}
	//Pig
	else if(i == 3) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = pigLarge;
			PlayerPrefs.SetInt("PlayerNum", 9);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = pigLarge;
			PlayerPrefs.SetInt("EnemyNum", 9);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = pigLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 9);
		}
	}
	//Scotty
	else if(i == 11) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = scottyLarge;
			PlayerPrefs.SetInt("PlayerNum", 10);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = scottyLarge;
			PlayerPrefs.SetInt("EnemyNum", 10);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = scottyLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 10);
		}
	}
	//Chick
	else if(i == 19) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = chickLarge;
			PlayerPrefs.SetInt("PlayerNum", 11);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = chickLarge;
			PlayerPrefs.SetInt("EnemyNum", 11);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = chickLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 11);
		}
	}
	//Wolfy
	else if(i == 4) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = wolfyLarge;
			PlayerPrefs.SetInt("PlayerNum", 12);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = wolfyLarge;
			PlayerPrefs.SetInt("EnemyNum", 12);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = wolfyLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 12);
		}
	}
	//Shovelheart
	else if(i == 12) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = shovelheartLarge;
			PlayerPrefs.SetInt("PlayerNum", 13);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = shovelheartLarge;
			PlayerPrefs.SetInt("EnemyNum", 13);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = shovelheartLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 13);
		}
	}
	//Mermaid
	else if(i == 20) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = mermaidLarge;
			PlayerPrefs.SetInt("PlayerNum", 14);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = mermaidLarge;
			PlayerPrefs.SetInt("EnemyNum", 14);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = mermaidLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 14);
		}
	}
	//Bear
	else if(i == 5) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = bearLarge;
			PlayerPrefs.SetInt("PlayerNum", 15);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = bearLarge;
			PlayerPrefs.SetInt("EnemyNum", 15);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = bearLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 15);
		}
	}
	//Clay
	else if(i == 13) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = clayLarge;
			PlayerPrefs.SetInt("PlayerNum", 16);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = clayLarge;
			PlayerPrefs.SetInt("EnemyNum", 16);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = clayLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 16);
		}
	}
	//Qp
	else if(i == 21) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = qpLarge;
			PlayerPrefs.SetInt("PlayerNum", 17);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = qpLarge;
			PlayerPrefs.SetInt("EnemyNum", 17);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = qpLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 17);
		}
	}
	//Tcow
	else if(i == 6) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = tcowLarge;
			PlayerPrefs.SetInt("PlayerNum", 18);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = tcowLarge;
			PlayerPrefs.SetInt("EnemyNum", 18);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = tcowLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 18);
		}
	}
	//Scarecrow
	else if(i == 14) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = scarecrowLarge;
			PlayerPrefs.SetInt("PlayerNum", 19);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = scarecrowLarge;
			PlayerPrefs.SetInt("EnemyNum", 19);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = scarecrowLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 19);
		}
	}
	//Cornercreeper
	else if(i == 22) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = cornercreeperLarge;
			PlayerPrefs.SetInt("PlayerNum", 20);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = cornercreeperLarge;
			PlayerPrefs.SetInt("EnemyNum", 20);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = cornercreeperLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 20);
		}
	}
	//Hound
	else if(i == 7) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = houndLarge;
			PlayerPrefs.SetInt("PlayerNum", 21);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = houndLarge;
			PlayerPrefs.SetInt("EnemyNum", 21);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = houndLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 21);
		}
	}
	//Lordevil
	else if(i == 15) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = lordevilLarge;
			PlayerPrefs.SetInt("PlayerNum", 22);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = lordevilLarge;
			PlayerPrefs.SetInt("EnemyNum", 22);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = lordevilLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 22);
		}
	}
	//Hedgemonster
	else if(i == 23) {
		if(heroPicType == 0) {
			didSelectP1 = true;
			heroPic.GetComponent(SpriteRenderer).sprite = hedgemonsterLarge;
			PlayerPrefs.SetInt("PlayerNum", 23);
		}
		else if(heroPicType == 1) {
			didSelectP2 = true;
			ai1Pic.GetComponent(SpriteRenderer).sprite = hedgemonsterLarge;
			PlayerPrefs.SetInt("EnemyNum", 23);
		}
		else if(heroPicType == 2) {
			didSelectP3 = true;
			ai2Pic.GetComponent(SpriteRenderer).sprite = hedgemonsterLarge;
			PlayerPrefs.SetInt("EnemyNumTwo", 23);
		}
	}
	else heroPic.GetComponent(SpriteRenderer).sprite = null;
}