#pragma strict
private var playerNum : int;
private var player : Transform;
public var tennis : Transform;
public var lion : Transform;
public var elf : Transform;
public var goat : Transform;
public var bones : Transform;
public var rabbit : Transform;
public var scuba : Transform;
public var opera : Transform;
public var box : Transform;
public var pig : Transform;
public var scotty : Transform;
public var chick : Transform;
public var wolfy : Transform;
public var shuvelheart : Transform;
public var mermaid : Transform;
public var bear : Transform;
public var clay : Transform;
public var qp : Transform;
public var tcow : Transform;
public var scarecrow : Transform;
public var cornercreeper : Transform;
public var hound : Transform;
public var lordevil : Transform;
public var hedgemonster : Transform;

function Awake () {
	playerNum = PlayerPrefs.GetInt("PlayerNum");
		
	//Spawn Tennis Man
	if(playerNum == 0) {
		player = Instantiate(tennis, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 0;
	}
	//Spawn Lion
	else if(playerNum == 1) {
		player = Instantiate(lion, transform.position, transform.rotation);	
		player.GetComponent(PlayerControl).heroType = 1;
	}
	//Spawn Elf
	else if(playerNum == 2) {
		player = Instantiate(elf, transform.position, transform.rotation);	
		player.GetComponent(PlayerControl).heroType = 2;
	}
	//Spawn Goat
	else if(playerNum == 3) {
		player = Instantiate(goat, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 3;
	}
	//Spawn Bones
	else if(playerNum == 4) {
		player = Instantiate(bones, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 4;
	}
	//Spawn Rabbit
	else if(playerNum == 5) {
		player = Instantiate(rabbit, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 5;
	}
	//Spawn Scuba
	else if(playerNum == 6) {
		player = Instantiate(scuba, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 6;
	}
	//Spawn Opera
	else if(playerNum == 7) {
		player = Instantiate(opera, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 7;
	}
	//Spawn Box
	else if(playerNum == 8) {
		player = Instantiate(box, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 8;
	}
	//Spawn Pig
	else if(playerNum == 9) {
		player = Instantiate(pig, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 9;
	}
	//Spawn Scotty
	else if(playerNum == 10) {
		player = Instantiate(scotty, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 10;
	}
	//Spawn Chick
	else if(playerNum == 11) {
		player = Instantiate(chick, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 11;
	}
	//Spawn Wolfy
	else if(playerNum == 12) {
		player = Instantiate(wolfy, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 12;
	}
	//Spawn Shovelheart
	else if(playerNum == 13) {
		player = Instantiate(shuvelheart, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 13;
	}
	//Spawn Mermaid
	else if(playerNum == 14) {
		player = Instantiate(mermaid, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 14;
	}
	//Spawn Bear
	else if(playerNum == 15) {
		player = Instantiate(bear, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 15;
	}
	//Spawn Clay
	else if(playerNum == 16) {
		player = Instantiate(clay, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 16;
	}
	//Spawn Qp
	else if(playerNum == 17) {
		player = Instantiate(qp, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 17;
	}
	//Spawn Tcow
	else if(playerNum == 18) {
		player = Instantiate(tcow, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 18;
	}
	//Spawn Scarecrow
	else if(playerNum == 19) {
		player = Instantiate(scarecrow, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 19;
	}
	//Spawn Cornercreeper
	else if(playerNum == 20) {
		player = Instantiate(cornercreeper, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 20;
	}
	//Spawn Hound
	else if(playerNum == 21) {
		player = Instantiate(hound, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 21;
	}
	//Spawn Lordevil
	else if(playerNum == 22) {
		player = Instantiate(lordevil, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 22;
	}
	//Spawn Hedgemonster
	else if(playerNum == 23) {
		player = Instantiate(hedgemonster, transform.position, transform.rotation);
		player.GetComponent(PlayerControl).heroType = 23;
	}
}