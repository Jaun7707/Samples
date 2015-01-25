//
//  SecondViewController.m
//  Dota Stats
//
//  Created by Joey Hoffmann on 3/4/13.
//  Copyright (c) 2013 Joey Hoffmann. All rights reserved.
//
#import "SecondViewController.h"
#import "SaveData.h"
#import <QuartzCore/QuartzCore.h>

//Steam User Connection Variables
NSURLConnection *steamUserConnection;
NSMutableData *steamUserData;
NSString *steamUserString;
//For the match IDs
NSMutableData *matchHistoryData;
NSMutableArray *everyMatchEverPlayed;
NSURLConnection *connectionMatchHistory;
NSString *gameHistory;
NSNumber *lastMatchID;
long long int steamUserAccountIDLocal = 0;
//Hero Data Connection Variables
NSURLConnection *heroNameConnection;
NSMutableData *heroNameData;
UIButton *button;
//Other
UIProgressView *loadingProgress;
int accountIDInt;
int pageNum = 1;
float totalWin;
float totalLoss;
bool collecting = false;
bool goSearch = false;
bool swap = true;

@interface SecondViewController ()

@end

@implementation SecondViewController

- (BOOL) connectedToInternet
{
    NSString *URLString = [NSString stringWithContentsOfURL:[NSURL URLWithString:@"https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?key=D96F2969101F6440AD128D3E1F93EA91&match_id=89014061"]];
    return ( URLString != NULL ) ? YES : NO;
}

- (void)collectMatches
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:gameHistory]
                                             cachePolicy:NSURLRequestUseProtocolCachePolicy
                                         timeoutInterval:6000.0];
    connectionMatchHistory=[[NSURLConnection alloc] initWithRequest:request delegate:self];
    
    if (connectionMatchHistory) {
        matchHistoryData = [[NSMutableData data] retain];
    }
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    NSString *currentURLString = [_webView.request.URL absoluteString];
    NSString *question;
    if([currentURLString rangeOfString:@"id"].location != NSNotFound) {
        //Reset data
        NSString *appDomain = [[NSBundle mainBundle] bundleIdentifier];
        [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:appDomain];
        totalWinsSave = [NSUserDefaults standardUserDefaults];
        //Get ID
        NSString *idString = [[[[currentURLString componentsSeparatedByString:@"id/"] objectAtIndex:1] componentsSeparatedByString:@"/"] objectAtIndex:0];
        
        NSString *request = [NSString stringWithFormat:@"http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=D96F2969101F6440AD128D3E1F93EA91&vanityurl=%@",  idString];
        
        NSString *escapedUrl = [request
                                stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        
        NSURL *URL = [NSURL URLWithString:escapedUrl];
        
        NSError *error;
        NSString *HTML = [NSString stringWithContentsOfURL:URL encoding:NSASCIIStringEncoding error:&error];
        question = [[[[HTML componentsSeparatedByString:@"steamid\": \""] objectAtIndex:1] componentsSeparatedByString:@"\","] objectAtIndex:0];
        goSearch = true;
        [UIView animateWithDuration:0.35
                              delay:0.0
                            options: UIViewAnimationCurveEaseInOut
                         animations:^{
                             [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y+550)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    else if([currentURLString rangeOfString:@"profiles"].location != NSNotFound) {
        //Reset data
        NSString *appDomain = [[NSBundle mainBundle] bundleIdentifier];
        [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:appDomain];
        totalWinsSave = [NSUserDefaults standardUserDefaults];
        question = [[[[currentURLString componentsSeparatedByString:@"profiles/"] objectAtIndex:1] componentsSeparatedByString:@"/"] objectAtIndex:0];
        goSearch = true;
        [UIView animateWithDuration:0.35
                              delay:0.0
                            options: UIViewAnimationCurveEaseInOut
                         animations:^{
                             [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y+550)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    if(goSearch) {
        _segmentedControl.userInteractionEnabled = false;
        steamUserAccountIDLocal = [question longLongValue];
        [totalWinsSave setObject:question forKey:@"steamUserAccountID"];
        everyMatchEverPlayed = [[NSMutableArray alloc] init];
        [everyMatchEverPlayed removeAllObjects];
        [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
        
        NSString *accountID =  [NSString stringWithFormat:@"%i", (int)steamUserAccountIDLocal];
        accountIDInt = [accountID integerValue];
        
        //Set up first connection
        gameHistory = [NSString stringWithFormat:@"http://dotabuff.com/players/%@/matches?page=1", accountID];

        //Hero Name Connection
        NSURLRequest *requestHeroNames = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://api.steampowered.com/IEconDota2_570/GetHeroes/V001/?key=D96F2969101F6440AD128D3E1F93EA91&language=english"]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        heroNameConnection = [[NSURLConnection alloc] initWithRequest:requestHeroNames delegate:self];
        if (heroNameConnection) {
            heroNameData = [[NSMutableData data] retain];
        }
        
        //Steam User Connection
        steamUserString = [[NSString alloc] initWithFormat:@"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D96F2969101F6440AD128D3E1F93EA91&steamids=%lli", steamUserAccountIDLocal];
        NSURLRequest *requestingUserData=[NSURLRequest requestWithURL:[NSURL URLWithString:steamUserString]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        steamUserConnection = [[NSURLConnection alloc] initWithRequest:requestingUserData delegate:self];
        if (steamUserConnection) {
            steamUserData = [[NSMutableData data] retain];
        }
        
        //Call connection
        [self collectMatches];
        
        collecting = true;
        
        //Animate
        loadingProgress = [[UIProgressView alloc] initWithFrame:CGRectMake(0, 64, 320, 10)];
        [self.view addSubview:loadingProgress];
        loadingProgress.progress = 0;
    }
}

- (IBAction)toMenu:(id)sender {
    if(!collecting)
        [self dismissViewControllerAnimated:YES completion:nil];
    else {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Slow Down!" message:@"Metrics for Dota 2 is collecting your data. Please wait until the process is completed." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert show];
    }
}

- (void)viewDidLoad
{
    //Load login page
    [_webView setDelegate:self];
    NSString *steamString = @"https://steamcommunity.com/login/home/?goto=0";
    NSURL *steamURL = [NSURL URLWithString:steamString];
    NSURLRequest *steamRequest = [NSURLRequest requestWithURL:steamURL];
    [_webView loadRequest:steamRequest];
    //Initial setup
    collecting = false;
    goSearch = false;
    swap = true;
    [super viewDidLoad];
    totalWin = 0;
    totalLoss = 0;
    totalWinsSave = [NSUserDefaults standardUserDefaults];
    //Manual search stuff
    [_searchBar setDelegate:self];
    button = [[UIButton alloc] initWithFrame:CGRectMake(0, 64, 320, 520)];
    [button addTarget:self
               action:@selector(buttonTouched)
     forControlEvents:UIControlEventTouchUpInside];
    if([[totalWinsSave objectForKey:@"fromDetails"] longLongValue] != 0) {
        [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y+550)];
        _segmentedControl.userInteractionEnabled = false;
        NSString *question = [[NSString alloc] initWithString:[totalWinsSave objectForKey:@"fromDetails"]];
        //Reset data
        NSString *appDomain = [[NSBundle mainBundle] bundleIdentifier];
        [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:appDomain];
        totalWinsSave = [NSUserDefaults standardUserDefaults];
        //Continue
        _segmentedControl.userInteractionEnabled = false;
        steamUserAccountIDLocal = [question longLongValue];
        [totalWinsSave setObject:question forKey:@"steamUserAccountID"];
        everyMatchEverPlayed = [[NSMutableArray alloc] init];
        [everyMatchEverPlayed removeAllObjects];
        [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
        
        NSString *accountID =  [NSString stringWithFormat:@"%i", (int)steamUserAccountIDLocal];
        accountIDInt = [accountID integerValue];
        
        //Set up first connection
        gameHistory = [NSString stringWithFormat:@"http://dotabuff.com/players/%@/matches?page=1", accountID];
        
        //Hero Name Connection
        NSURLRequest *requestHeroNames = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://api.steampowered.com/IEconDota2_570/GetHeroes/V001/?key=D96F2969101F6440AD128D3E1F93EA91&language=english"]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        heroNameConnection = [[NSURLConnection alloc] initWithRequest:requestHeroNames delegate:self];
        if (heroNameConnection) {
            heroNameData = [[NSMutableData data] retain];
        }
        
        //Steam User Connection
        steamUserString = [[NSString alloc] initWithFormat:@"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D96F2969101F6440AD128D3E1F93EA91&steamids=%lli", steamUserAccountIDLocal];
        NSURLRequest *requestingUserData=[NSURLRequest requestWithURL:[NSURL URLWithString:steamUserString]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        steamUserConnection = [[NSURLConnection alloc] initWithRequest:requestingUserData delegate:self];
        if (steamUserConnection) {
            steamUserData = [[NSMutableData data] retain];
        }
        
        //Call connection
        [self collectMatches];
        
        collecting = true;
        
        //Animate
        loadingProgress = [[UIProgressView alloc] initWithFrame:CGRectMake(0, 64, 320, 10)];
        [self.view addSubview:loadingProgress];
        loadingProgress.progress = 0;
        [totalWinsSave setObject:@"0" forKey:@"fromDetails"];
    }
}
- (void)viewDidAppear:(BOOL)animated
{
    pageNum = 1;
    if(![self connectedToInternet]) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Network Communication Issue" message:@"An active internet connection is required to download player information." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert show];
    }

}
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    if([connection isEqual:steamUserConnection]) {
        [steamUserData appendData:data];
        NSDictionary *playerInfoDic = [NSJSONSerialization JSONObjectWithData:steamUserData options:NSJSONReadingMutableLeaves error:nil];
        @try {
            NSArray *stuffInPlayerDic = [playerInfoDic objectForKey:@"response"];
            NSDictionary *players = [[stuffInPlayerDic objectForKey:@"players"] objectAtIndex:0];
        
            //Setting retreived information to object types
            NSString *personaname = [players objectForKey:@"personaname"];
            NSString *avatarLink = [players objectForKey:@"avatarfull"];
        
            //Applying to interface object
            UIImage *pImage=[UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:avatarLink]]];;
            NSData *imageData = UIImagePNGRepresentation(pImage);
            [totalWinsSave setObject:imageData forKey:@"playerImageData"];
            [totalWinsSave setObject:personaname forKey:@"personaName"];
        } @catch (NSException *e) {
            NSLog(@"Invalid index");
        }
    }
    if([connection isEqual:heroNameConnection]) {
        [heroNameData appendData:data];
        
        NSDictionary *heroNamesDictionary= [NSJSONSerialization JSONObjectWithData:heroNameData options:NSJSONReadingMutableLeaves error:nil];
        
        NSArray *result = [heroNamesDictionary objectForKey:@"result"];
        
        NSDictionary *heroes = [result objectForKey:@"heroes"];
        
        NSString *count = [result valueForKey:@"count"];
        for (int indV = 0; indV < [count integerValue]; indV++) {
            @try {
                NSString *heroIDNumberString = [[heroes valueForKey:@"id"] objectAtIndex:indV];
                NSString *heroIDString = [[heroes valueForKey:@"localized_name"] objectAtIndex:indV];
                NSString *keyForHero = [[NSString alloc] initWithFormat:@"heroNameAtID%@", heroIDNumberString];
                [totalWinsSave setObject:heroIDString forKey:keyForHero];
            } @catch (NSException *e) {
                NSLog(@"Invalid index");
            }
        }
    }
    if([connection isEqual:connectionMatchHistory]) {
        [matchHistoryData appendData:data];
        NSString* html = [[[NSString alloc] initWithData:matchHistoryData
                                                  encoding:NSUTF8StringEncoding] autorelease];
        if ([html rangeOfString:@"</html>"].location != NSNotFound) {
            NSArray *components = [html componentsSeparatedByString: @"class=\"matchid\">"];
            
            loadingProgress.progress = 0;
            
            if([components count] > 1) {
                for(int i = 1; i < [components count]; i++) {
                    NSString *parsed = (NSString*) [components objectAtIndex:i];
                    NSRange range = [parsed rangeOfString:@"</a><div"];
                    NSString *matchIDZ = [parsed substringToIndex:range.location];
                    NSNumber *matchIDNZ = [NSNumber numberWithInt:[matchIDZ integerValue]];
                    if(![everyMatchEverPlayed containsObject:matchIDNZ] && [matchIDZ integerValue] != 0) {
                        [totalWinsSave setInteger:0 forKey:@"hasData"];
                        [everyMatchEverPlayed addObject:matchIDNZ];
                        [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                    }
                    if(i == [components count]-1) {
                        pageNum++;
                        gameHistory = [NSString stringWithFormat:@"http://dotabuff.com/players/%i/matches?page=%i", accountIDInt, pageNum];
                        [self collectMatches];
                    }
                }
            }
            else {
                for(int m = 0; m < [components count]; m++) {
                    @try {
                        NSString *parsed = (NSString*) [components objectAtIndex:m];
                        NSRange range = [parsed rangeOfString:@"</a><div"];
                        NSString *matchIDZ = [parsed substringToIndex:range.location];
                        NSNumber *matchIDNZ = [NSNumber numberWithInt:[matchIDZ integerValue]];
                        if(![everyMatchEverPlayed containsObject:matchIDNZ] && [matchIDZ integerValue] != 0) {
                            [totalWinsSave setInteger:0 forKey:@"hasData"];
                            [everyMatchEverPlayed addObject:matchIDNZ];
                            [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                        }
                    } @catch (NSException *e) {
                        NSLog(@"Ended list abruptly");
                    }
                    if(m == [components count]-1) {
                        float thing = (float) 1/[everyMatchEverPlayed count];
                        __block NSInteger outstandingRequests = [everyMatchEverPlayed count];
                        for(int i = 0; i < [everyMatchEverPlayed count]; i++) {
                            NSString *matchID = [everyMatchEverPlayed objectAtIndex:i];
                            NSNumber *matchIDInt = [NSNumber numberWithInt:[matchID integerValue]];
                            NSString *matchDetails = [NSString stringWithFormat:@"https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?key=D96F2969101F6440AD128D3E1F93EA91&match_id=%@",[everyMatchEverPlayed objectAtIndex:i]];
                            
                            NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:matchDetails]
                                                                     cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                                 timeoutInterval:6000.0];
                            NSOperationQueue *newQueue = [NSOperationQueue mainQueue];
                            [NSURLConnection sendAsynchronousRequest:request queue:newQueue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error)
                             {
                                 if(data != nil) {
                                     @try {
                                         loadingProgress.progress += thing;
                                         NSDictionary *matchCall = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:nil];
                                         
                                         NSArray *result = [matchCall objectForKey:@"result"];
                                         
                                         NSDictionary *players = [result valueForKey:@"players"];
                                         NSString *whoWon = [result valueForKey:@"radiant_win"];
                                         NSString *startTime = [result valueForKey:@"start_time"];
                                         NSString *gameMode = [result valueForKey:@"game_mode"];
                                         
                                         NSString *localMatchID = [result valueForKey:@"match_id"];
                                         NSNumber *localMatchIDInt = [NSNumber numberWithInt:[localMatchID integerValue]];
                                         lastMatchID = localMatchIDInt;
                                         
                                         for (int pl = 0; pl < [players count]; pl++) {
                                             NSString *accountIDString = [[players valueForKey:@"account_id"] objectAtIndex:pl];
                                             NSString *leaverStatus = [[players valueForKey:@"leaver_status"] objectAtIndex:pl];
                                             if((NSNull *)accountIDString == [NSNull null]) {
                                                 [everyMatchEverPlayed removeObject:matchIDInt];
                                                 [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                                                 gameMode = @"10";
                                             }
                                             if((NSNull *)leaverStatus != [NSNull null]) {
                                                 if([leaverStatus integerValue] == 4) {
                                                     [everyMatchEverPlayed removeObject:matchIDInt];
                                                     [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                                                     gameMode = @"10";
                                                 }
                                             }
                                         }
                                         if([gameMode integerValue] == 7 || [gameMode integerValue] == 9 || [gameMode integerValue] == 10 || [gameMode integerValue] == 15) {
                                             [everyMatchEverPlayed removeObject:localMatchIDInt];
                                             [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                                         }
                                         if([result count] == 0) {
                                             [everyMatchEverPlayed removeObject:matchIDInt];
                                             [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
                                         }
                                         if([gameMode integerValue] != 7 && [gameMode integerValue] != 9 && [gameMode integerValue] != 10 && [gameMode integerValue] != 15) {
                                             int indVF;
                                             for (int indV = 0; indV < [players count]; indV++) {
                                                 NSString *accountIDString = [[players valueForKey:@"account_id"] objectAtIndex:indV];
                                                 if((NSNull *)accountIDString == [NSNull null])
                                                     accountIDString = @"0";
                                                 if([accountIDString integerValue] == (int)steamUserAccountIDLocal) {
                                                     indVF = indV;
                                                 }
                                             }
                                             //Find out who won
                                             bool didWin = FALSE;
                                             NSString *playerSlot = [[players valueForKey:@"player_slot"] objectAtIndex:indVF];
                                             NSString *heroID = [[players valueForKey:@"hero_id"] objectAtIndex:indVF];
                                             NSString *heroImageName = [[NSString alloc] initWithFormat:@"%@.png",heroID];
                                             [_heroImageOne setImage:[UIImage imageNamed:heroImageName]];
                                             
                                             //Hero bundle
                                             NSString *heroBundleString = [[NSString alloc] initWithFormat:@"heroBundle:%@", heroID];
                                             NSMutableDictionary *heroBundle = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:heroBundleString]];
                                             
                                             int kill = [[heroBundle objectForKey:@"kill"] integerValue];
                                             NSString *killString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"kills"] objectAtIndex:indVF]];
                                             kill = kill + [killString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:kill] forKey:@"kill"];
                                             
                                             int death = [[heroBundle objectForKey:@"death"] integerValue];
                                             NSString *deathString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"deaths"] objectAtIndex:indVF]];
                                             death = death + [deathString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:death] forKey:@"death"];
                                             
                                             int assist = [[heroBundle objectForKey:@"assist"] integerValue];
                                             NSString *assistString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"assists"] objectAtIndex:indVF]];
                                             assist = assist + [assistString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:assist] forKey:@"assist"];
                                             
                                             int gpm = [[heroBundle objectForKey:@"gpm"] integerValue];
                                             NSString *gpmString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"gold_per_min"] objectAtIndex:indVF]];
                                             gpm = gpm + [gpmString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:gpm] forKey:@"gpm"];
                                             
                                             int xpm = [[heroBundle objectForKey:@"xpm"] integerValue];
                                             NSString *xpmString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"xp_per_min"] objectAtIndex:indVF]];
                                             xpm = xpm + [xpmString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:xpm] forKey:@"xpm"];
                                             
                                             int lh = [[heroBundle objectForKey:@"lh"] integerValue];
                                             NSString *lhString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"last_hits"] objectAtIndex:indVF]];
                                             lh = lh + [lhString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:lh] forKey:@"lh"];
                                             
                                             int dn = [[heroBundle objectForKey:@"dn"] integerValue];
                                             NSString *dnString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"denies"] objectAtIndex:indVF]];
                                             dn = dn + [dnString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:dn] forKey:@"dn"];
                                             
                                             int goldSpent = [[heroBundle objectForKey:@"goldSpent"] integerValue];
                                             NSString *goldSpentString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"gold_spent"] objectAtIndex:indVF]];
                                             goldSpent = goldSpent + [goldSpentString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:goldSpent] forKey:@"goldSpent"];
                                             
                                             int heroDamage = [[heroBundle objectForKey:@"heroDamage"] integerValue];
                                             NSString *heroDamageString = [[NSString alloc] initWithFormat:@"%@", [[players valueForKey:@"hero_damage"] objectAtIndex:indVF]];
                                             heroDamage = heroDamage + [heroDamageString integerValue];
                                             [heroBundle setObject:[NSNumber numberWithInt:heroDamage] forKey:@"heroDamage"];
                                             
                                             [totalWinsSave setObject:heroBundle forKey:heroBundleString];
                                             
                                             //NEW                //For Records
                                             NSMutableDictionary *recordGPMDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordGPMDictionary"]];
                                             NSString *recordGPMString = [[NSString alloc] initWithFormat:@"%f", [gpmString floatValue]/10000];
                                             [recordGPMDictionary setObject:matchID forKey:recordGPMString];
                                             [totalWinsSave setObject:recordGPMDictionary forKey:@"recordGPMDictionary"];
                                             
                                             NSMutableDictionary *recordXPMDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordXPMDictionary"]];
                                             NSString *recordXPMString = [[NSString alloc] initWithFormat:@"%f", [xpmString floatValue]/10000];
                                             [recordXPMDictionary setObject:matchID forKey:recordXPMString];
                                             [totalWinsSave setObject:recordXPMDictionary forKey:@"recordXPMDictionary"];
                                             
                                             NSMutableDictionary *recordLHDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordLHDictionary"]];
                                             NSString *recordLHString = [[NSString alloc] initWithFormat:@"%f", [lhString floatValue]/10000];
                                             [recordLHDictionary setObject:matchID forKey:recordLHString];
                                             [totalWinsSave setObject:recordLHDictionary forKey:@"recordLHDictionary"];
                                             
                                             NSMutableDictionary *recordDNDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordDNDictionary"]];
                                             NSString *recordDNString = [[NSString alloc] initWithFormat:@"%f", [dnString floatValue]/10000];
                                             [recordDNDictionary setObject:matchID forKey:recordDNString];
                                             [totalWinsSave setObject:recordDNDictionary forKey:@"recordDNDictionary"];
                                             
                                             NSMutableDictionary *recordKillDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordKillDictionary"]];
                                             NSString *recordKillString = [[NSString alloc] initWithFormat:@"%f", [killString floatValue]/10000];
                                             [recordKillDictionary setObject:matchID forKey:recordKillString];
                                             [totalWinsSave setObject:recordKillDictionary forKey:@"recordKillDictionary"];
                                             
                                             NSMutableDictionary *recordDeathDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordDeathDictionary"]];
                                             NSString *recordDeathString = [[NSString alloc] initWithFormat:@"%f", [deathString floatValue]/10000];
                                             [recordDeathDictionary setObject:matchID forKey:recordDeathString];
                                             [totalWinsSave setObject:recordDeathDictionary forKey:@"recordDeathDictionary"];
                                             
                                             NSMutableDictionary *recordAssistDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordAssistDictionary"]];
                                             NSString *recordAssistString = [[NSString alloc] initWithFormat:@"%f", [assistString floatValue]/10000];
                                             [recordAssistDictionary setObject:matchID forKey:recordAssistString];
                                             [totalWinsSave setObject:recordAssistDictionary forKey:@"recordAssistDictionary"];
                                             //
                                             NSMutableDictionary *recordGoldSpentDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordGoldSpentDictionary"]];
                                             NSString *recordGoldSpentString = [[NSString alloc] initWithFormat:@"%f", [goldSpentString floatValue]/10000];
                                             [recordGoldSpentDictionary setObject:matchID forKey:recordGoldSpentString];
                                             [totalWinsSave setObject:recordGoldSpentDictionary forKey:@"recordGoldSpentDictionary"];
                                             
                                             NSMutableDictionary *recordHeroDamageDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordHeroDamageDictionary"]];
                                             NSString *recordHeroDamageString = [[NSString alloc] initWithFormat:@"%f", [heroDamageString floatValue]/10000];
                                             [recordHeroDamageDictionary setObject:matchID forKey:recordHeroDamageString];
                                             [totalWinsSave setObject:recordHeroDamageDictionary forKey:@"recordHeroDamageDictionary"];
                                             
                                             NSMutableDictionary *recordTowerDamageDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordTowerDamageDictionary"]];
                                             NSString *recordTowerDamageString = [[NSString alloc] initWithFormat:@"%f", [[[players valueForKey:@"tower_damage"] objectAtIndex:indVF] floatValue]/10000];
                                             [recordTowerDamageDictionary setObject:matchID forKey:recordTowerDamageString];
                                             [totalWinsSave setObject:recordTowerDamageDictionary forKey:@"recordTowerDamageDictionary"];
                                             
                                             NSMutableDictionary *recordHeroHealingDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordHeroHealingDictionary"]];
                                             NSString *recordHeroHealingString = [[NSString alloc] initWithFormat:@"%f", [[[players valueForKey:@"hero_healing"] objectAtIndex:indVF] floatValue]/10000];
                                             [recordHeroHealingDictionary setObject:matchID forKey:recordHeroHealingString];
                                             [totalWinsSave setObject:recordHeroHealingDictionary forKey:@"recordHeroHealingDictionary"];
                                             
                                             NSMutableDictionary *recordMatchDurationDictionary = [[NSMutableDictionary alloc] initWithDictionary:[totalWinsSave dictionaryForKey:@"recordMatchDurationDictionary"]];
                                             NSString *recordMatchDurationString = [[NSString alloc] initWithFormat:@"%f", [[result valueForKey:@"duration"] floatValue]/10000];
                                             [recordMatchDurationDictionary setObject:matchID forKey:recordMatchDurationString];
                                             [totalWinsSave setObject:recordMatchDurationDictionary forKey:@"recordMatchDurationDictionary"];
                                             //END
                                             //Saving Match Information
                                             NSString *heroPlayedKey = [[NSString alloc] initWithFormat:@"heroPlayed:%@", matchID];
                                             [totalWinsSave setObject:heroID forKey:heroPlayedKey];
                                             NSString *gpmKey = [[NSString alloc] initWithFormat:@"gpmAtID:%@", matchID];
                                             [totalWinsSave setObject:gpmString forKey:gpmKey];
                                             NSString *xpmKey = [[NSString alloc] initWithFormat:@"xpmAtID:%@", matchID];
                                             [totalWinsSave setObject:gpmString forKey:xpmKey];
                                             NSString *lhKey = [[NSString alloc] initWithFormat:@"lhAtID:%@", matchID];
                                             [totalWinsSave setObject:lhString forKey:lhKey];
                                             NSString *dnKey = [[NSString alloc] initWithFormat:@"dnAtID:%@", matchID];
                                             [totalWinsSave setObject:dnString forKey:dnKey];
                                             NSString *gsKey = [[NSString alloc] initWithFormat:@"gsAtID:%@", matchID];
                                             [totalWinsSave setObject:goldSpentString forKey:gsKey];
                                             NSString *hdKey = [[NSString alloc] initWithFormat:@"hdAtID:%@", matchID];
                                             [totalWinsSave setObject:heroDamageString forKey:hdKey];
                                             
                                             //Set hero play count
                                             NSString *heroAPlayCountString = [[NSString alloc] initWithFormat:@"hero%i", [heroID integerValue]];
                                             int playCount = [totalWinsSave integerForKey:heroAPlayCountString];
                                             playCount++;
                                             [totalWinsSave setInteger:playCount forKey:heroAPlayCountString];
                                             
                                             //Saving if you won or lost for match history
                                             NSString *whoWonKey = [[NSString alloc] initWithFormat:@"whoWon:%@", matchID];
                                             
                                             //Saving Date
                                             NSString *dateKey = [[NSString alloc] initWithFormat:@"date:%@", matchID];
                                             [totalWinsSave setObject:startTime forKey:dateKey];
                                             if([whoWon integerValue] == 0) {
                                                 if([playerSlot integerValue] < 10) {
                                                     totalLoss++;
                                                     //Hero bundle continued
                                                     int loss = [[heroBundle objectForKey:@"loss"] integerValue];
                                                     loss++;
                                                     [heroBundle setObject:[NSNumber numberWithInt:loss] forKey:@"loss"];
                                                     [totalWinsSave setObject:heroBundle forKey:heroBundleString];
                                                     [totalWinsSave setObject:@"LOSS" forKey:whoWonKey];
                                                     [totalWinsSave setInteger:totalLoss forKey:@"totalLoss"];
                                                     didWin = FALSE;
                                                 }
                                                 else {
                                                     totalWin++;
                                                     //Hero bundle continued
                                                     int win = [[heroBundle objectForKey:@"win"] integerValue];
                                                     win++;
                                                     [heroBundle setObject:[NSNumber numberWithInt:win] forKey:@"win"];
                                                     [totalWinsSave setObject:heroBundle forKey:heroBundleString];
                                                     [totalWinsSave setObject:@"WIN" forKey:whoWonKey];
                                                     [totalWinsSave setInteger:totalWin forKey:@"totalWin"];
                                                     didWin = TRUE;
                                                 }
                                             }
                                             else {
                                                 if([playerSlot integerValue] > 10) {
                                                     totalLoss++;
                                                     //Hero bundle continued
                                                     int loss = [[heroBundle objectForKey:@"loss"] integerValue];
                                                     loss++;
                                                     [heroBundle setObject:[NSNumber numberWithInt:loss] forKey:@"loss"];
                                                     [totalWinsSave setObject:heroBundle forKey:heroBundleString];
                                                     [totalWinsSave setObject:@"LOSS" forKey:whoWonKey];
                                                     [totalWinsSave setInteger:totalLoss forKey:@"totalLoss"];
                                                     didWin = FALSE;
                                                 }
                                                 else {
                                                     totalWin++;
                                                     //Hero bundle continued
                                                     int win = [[heroBundle objectForKey:@"win"] integerValue];
                                                     win++;
                                                     [heroBundle setObject:[NSNumber numberWithInt:win] forKey:@"win"];
                                                     [totalWinsSave setObject:heroBundle forKey:heroBundleString];
                                                     [totalWinsSave setObject:@"WIN" forKey:whoWonKey];
                                                     [totalWinsSave setInteger:totalWin forKey:@"totalWin"];
                                                     didWin = TRUE;
                                                 }
                                             }
                                         }
                                     } @catch(NSException *e) {
                                         NSLog(@"Match invalid");
                                     }
                                 }
                                 outstandingRequests--;
                                 if(outstandingRequests == 0) {
                                     [totalWinsSave setInteger:1 forKey:@"hasData"];
                                     [totalWinsSave setInteger:1 forKey:@"searchComplete"];
                                     [totalWinsSave setInteger:0 forKey:@"launchCount"];
                                     //Logout
                                     NSString *steamString = @"http://steamcommunity.com/login/logout";
                                     NSURL *steamURL = [NSURL URLWithString:steamString];
                                     NSURLRequest *steamRequest = [NSURLRequest requestWithURL:steamURL];
                                     [_webView loadRequest:steamRequest];
                                     [self heroPlayCount];
                                     [self dismissViewControllerAnimated:YES completion:nil];
                                 }
                             }];
                        }
                    }
                }
            }
        }
    }
}

- (void)heroPlayCount
{
    //Hero Play Count
    NSMutableDictionary *heroPlayCountDictionary = [[NSMutableDictionary alloc] initWithCapacity:110];
    for(int h = 1; h < 111; h++) {
        NSString *heroAPlayCountString = [[NSString alloc] initWithFormat:@"hero%i", h];
        NSString *hero = [[NSString alloc] initWithFormat:@"%i", h];
        int heroAPlayCount = [totalWinsSave integerForKey:heroAPlayCountString];
        NSString *heroPlayCountString;
        
        if(heroAPlayCount < 10) {
            heroPlayCountString = [[NSString alloc] initWithFormat:@"00%ih%@", heroAPlayCount, hero];
        }
        if(heroAPlayCount > 9 && heroAPlayCount < 100) {
            heroPlayCountString = [[NSString alloc] initWithFormat:@"0%ih%@", heroAPlayCount, hero];
        }
        if(heroAPlayCount > 99) {
            heroPlayCountString = [[NSString alloc] initWithFormat:@"%ih%@", heroAPlayCount, hero];
        }
        [heroPlayCountDictionary setObject:hero forKey:heroPlayCountString];
        NSMutableArray *sortedValues = [[NSMutableArray alloc] init];
        NSSortDescriptor *sortOrder = [NSSortDescriptor sortDescriptorWithKey: @"self" ascending: NO];
        NSMutableArray *sortedKeys = [[NSMutableArray alloc] initWithArray:[[heroPlayCountDictionary allKeys] sortedArrayUsingDescriptors: [NSArray arrayWithObject: sortOrder]]];
        
        for (NSString *key in sortedKeys) {
            if([key integerValue] != 0)
                [sortedValues addObject:[heroPlayCountDictionary objectForKey:key]];
        }
        [totalWinsSave setObject:sortedValues forKey:@"heroPlayCountArray"];
        [totalWinsSave setObject:sortedKeys forKey:@"heroPlayCountKeys"];
    }
}

- (void)buttonTouched
{
    _segmentedControl.selectedSegmentIndex = 0;
    [_searchBar resignFirstResponder];
    [button removeFromSuperview];
    [UIView animateWithDuration:0.35
                          delay:0.0
                        options: UIViewAnimationCurveEaseInOut
                     animations:^{
                         [_searchBar setCenter:CGPointMake(160, 42)];
                         [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y-44)];
                     }
                     completion:^(BOOL finished){
                     }];
    swap = true;
}

- (IBAction)segmentSwap:(id)sender
{
    if(swap) {
        [self.view insertSubview:button aboveSubview:_webView];
        [_searchBar becomeFirstResponder];
        [UIView animateWithDuration:0.35
                              delay:0.0
                            options: UIViewAnimationCurveEaseInOut
                         animations:^{
                             [_searchBar setCenter:CGPointMake(160, 86)];
                             [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y+44)];
                         }
                         completion:^(BOOL finished){
                         }];
        swap = false;
    }
    else {
        [_searchBar resignFirstResponder];
        [button removeFromSuperview];
        [UIView animateWithDuration:0.35
                              delay:0.0
                            options: UIViewAnimationCurveEaseInOut
                         animations:^{
                             [_searchBar setCenter:CGPointMake(160, 42)];
                             [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y-44)];
                         }
                         completion:^(BOOL finished){
                         }];
        swap = true;
    }
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    NSString *request = [NSString stringWithFormat:@"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D96F2969101F6440AD128D3E1F93EA91&steamids=%@",  searchBar.text];
    NSString *escapedUrl = [request stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURL *URL = [NSURL URLWithString:escapedUrl];
    NSError *error;
    NSString *HTML = [NSString stringWithContentsOfURL:URL encoding:NSASCIIStringEncoding error:&error];
    if([HTML rangeOfString:@"steamid"].location != NSNotFound) {
        //Reset data
        NSString *appDomain = [[NSBundle mainBundle] bundleIdentifier];
        [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:appDomain];
        totalWinsSave = [NSUserDefaults standardUserDefaults];
        [UIView animateWithDuration:0.35
                              delay:0.0
                            options: UIViewAnimationCurveEaseInOut
                         animations:^{
                             [_webView setCenter:CGPointMake(_webView.center.x, _webView.center.y+550)];
                             [_searchBar setCenter:CGPointMake(160, 22)];
                         }
                         completion:^(BOOL finished){
                             [searchBar resignFirstResponder];
                         }];
        _segmentedControl.userInteractionEnabled = false;
        steamUserAccountIDLocal = [searchBar.text longLongValue];
        [totalWinsSave setObject:searchBar.text forKey:@"steamUserAccountID"];
        everyMatchEverPlayed = [[NSMutableArray alloc] init];
        [everyMatchEverPlayed removeAllObjects];
        [totalWinsSave setObject:everyMatchEverPlayed forKey:@"everyMatchEverPlayed"];
        
        NSString *accountID =  [NSString stringWithFormat:@"%i", (int)steamUserAccountIDLocal];
        accountIDInt = [accountID integerValue];
        
        //Set up first connection
        gameHistory = [NSString stringWithFormat:@"http://dotabuff.com/players/%@/matches?page=1", accountID];
        
        //Hero Name Connection
        NSURLRequest *requestHeroNames = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://api.steampowered.com/IEconDota2_570/GetHeroes/V001/?key=D96F2969101F6440AD128D3E1F93EA91&language=english"]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        heroNameConnection = [[NSURLConnection alloc] initWithRequest:requestHeroNames delegate:self];
        if (heroNameConnection) {
            heroNameData = [[NSMutableData data] retain];
        }
        
        //Steam User Connection
        steamUserString = [[NSString alloc] initWithFormat:@"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D96F2969101F6440AD128D3E1F93EA91&steamids=%lli", steamUserAccountIDLocal];
        NSURLRequest *requestingUserData=[NSURLRequest requestWithURL:[NSURL URLWithString:steamUserString]
                                                          cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                      timeoutInterval:60.0];
        steamUserConnection = [[NSURLConnection alloc] initWithRequest:requestingUserData delegate:self];
        if (steamUserConnection) {
            steamUserData = [[NSMutableData data] retain];
        }
        
        //Call connection
        [self collectMatches];
        
        collecting = true;
        
        //Animate
        loadingProgress = [[UIProgressView alloc] initWithFrame:CGRectMake(0, 64, 320, 10)];
        [self.view addSubview:loadingProgress];
        loadingProgress.progress = 0;
    }
    else {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"ID Not Found!" message:@"Please make sure you have entered a valid steam ID. Example: 76561198020537345." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert show];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)dealloc {
    [_progressBar release];
    [_webView release];
    [_heroImageOne release];
    [_searchBar release];
    [_segmentedControl release];
    [super dealloc];
}

@end
