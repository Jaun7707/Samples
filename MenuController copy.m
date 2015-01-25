//
//  ViewController.m
//  BACKATCHA
//
//  Created by Joey Hoffmann on 6/23/14.
//  Copyright (c) 2014 Jeffrey Lyons. All rights reserved.
//

#import "MenuController.h"
#import "AppDelegate.h"
#import <GameKit/GameKit.h>
#import "GameKitHelper.h"
#import <CoreLocation/CoreLocation.h>

bool initialLaunch;
NSTimer *timer;
CLLocationManager *locationManager;

@interface MenuController ()

@end

@implementation MenuController

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscape;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return UIInterfaceOrientationLandscapeLeft;
}

- (BOOL)prefersStatusBarHidden {
    return YES;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    initialLaunch = true;
    
    //Determine screen size
    if([[UIScreen mainScreen] bounds].size.width == 480) {
        deviceType = 0;
        [_friendsOutlet setFrame:CGRectMake(45, 175, 108, 30)];
        [_leaderboardsOutlet setFrame:CGRectMake(56, 238, 108, 30)];
        [_questionsOutlet setFrame:CGRectMake(330, 174, 108, 30)];
        [_studioOutlet setFrame:CGRectMake(319, 234, 108, 30)];
        [_titleOutlet setFrame:CGRectMake(30, 10, 420, 130)];
        [_blueThingOutlet setFrame:CGRectMake(0, 130, 480, 273)];
        [_playButtonOutlet setFrame:CGRectMake(180, 130, 120, 120)];
    }
    else if([[UIScreen mainScreen] bounds].size.width == 568) {
        deviceType = 1;
    }
    else {
        deviceType = 2;
    }
    timer = [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(updateProgress) userInfo:nil repeats:YES];
    
    //Begin location updates
    locationManager = [[CLLocationManager alloc] init];
    
    [locationManager requestWhenInUseAuthorization];
    [locationManager startUpdatingLocation];
    
    [locationManager setDelegate:self];
    [locationManager setDesiredAccuracy:kCLLocationAccuracyNearestTenMeters];
}

- (void)updateProgress {
    //Hide the progress view if the app is initially launching
    if(!initialLaunch) {
        [_progressView setAlpha:1];
    }
    else {
        [_progressView setAlpha:0];
    }
    
    //Update the progress of the bar
    [_progressView setProgress:progress];
    
    //Hide the bar when finished
    if(progress == 1 || progress == -1) {
        //Invalidate timer
        [timer invalidate];
        timer = nil;
        
        //Animate the progress view off screen
        [UIView animateWithDuration:0.75
                              delay:0.50
                            options:nil
                         animations:^{
                             [_progressView setCenter:CGPointMake(_progressView.center.x, _progressView.center.y-5)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
}

- (void)viewWillAppear:(BOOL)animated {
    if(!initialLaunch && ![SharedAdBannerView isBannerViewActionInProgress]) {
        //Set up iAd bannerview
        [SharedAdBannerView setDelegate:self];
        [self.view addSubview:SharedAdBannerView];
        if(bannerIsVisable)
            [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-SharedAdBannerView.frame.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
        else
            [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
    }
    
    //Pinhole transition
    if(shouldPinhole) {
        shouldPinhole = false;
        if(![SharedAdBannerView isBannerViewActionInProgress]) {
            //Pinhole transition
            [self.view setAlpha:0];
            UIImageView *holeView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 568, 568)];
            [holeView setCenter:self.view.center];
            [holeView setImage:[UIImage imageNamed:@"PinholeSmall.png"]];
            [self.view addSubview:holeView];
            
            [UIView animateWithDuration:0.5
                                  delay:0.1
                                options:nil
                             animations:^{
                                 [self.view setAlpha:1];
                                 if(deviceType == 2)
                                     [holeView setFrame:CGRectMake(0, 0, 22000, 22000)];
                                 else
                                     [holeView setFrame:CGRectMake(0, 0, 12000, 12000)];
                                 [holeView setCenter:self.view.center];
                             }
                             completion:^(BOOL finished){
                                 [holeView removeFromSuperview];
                                 if(initialLaunch) {
                                     //Take snapshot for transitions
                                     TransitionView = [self.view snapshotViewAfterScreenUpdates:NO];
                                     
                                     //Set up iAd bannerview
                                     [SharedAdBannerView setDelegate:self];
                                     [self.view addSubview:SharedAdBannerView];
                                     if(bannerIsVisable)
                                         [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-SharedAdBannerView.frame.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
                                     else
                                         [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
                                     
                                     //Set initial launch to false
                                     initialLaunch = false;
                                 }
                             }];
        }
    }
}

- (void)viewDidAppear:(BOOL)animated {
    //Gamekit helper
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showAuthenticationViewController) name:PresentAuthenticationViewController object:nil];
}

- (void)showAuthenticationViewController
{
    //Present Game Center controller
    GameKitHelper *gameKitHelper = [GameKitHelper sharedGameKitHelper];
    [self presentViewController:gameKitHelper.authenticationViewController animated:YES completion:nil];
}

- (void)bannerViewDidLoadAd:(ADBannerView *)banner {
    if(!bannerIsVisable) {
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
        
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDelay:0.0];
        [UIView setAnimationDuration:0.25];
        [UIView setAnimationCurve:UIViewAnimationCurveEaseIn];
        
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-SharedAdBannerView.frame.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
        bannerIsVisable = true;
        
        [UIView commitAnimations];
    }
}

- (void)bannerView:(ADBannerView *)banner didFailToReceiveAdWithError:(NSError *)error {
    if(bannerIsVisable) {
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-50, [UIScreen mainScreen].bounds.size.width, 50)];
        
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDelay:0.0];
        [UIView setAnimationDuration:0.25];
        [UIView setAnimationCurve:UIViewAnimationCurveEaseIn];
        
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
        bannerIsVisable = false;
        
        [UIView commitAnimations];
    }
}

- (IBAction)questionsAction:(id)sender {
    //iPad transitioning
    if(deviceType == 2) {
        UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
        UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"QuestionSubmissionView"];
        
        [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
    }
    //iPhone transitioning
    else {
        UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
        UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"QuestionSubmissionView"];
        
        [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
    }
}

- (IBAction)playAction:(id)sender {
    if([[[GameKitHelper sharedGameKitHelper] localPlayer] isAuthenticated] && (progress == 1 || (progress == -1 && [[[NSUserDefaults standardUserDefaults] arrayForKey:@"CategoryTypeList"] count] > 0))) {
        shouldPinhole = true;
        if(![SharedAdBannerView isBannerViewActionInProgress]) {
            //Pinhole transition
            UIImageView *holeView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 568, 568)];
            if(deviceType == 2)
                [holeView setFrame:CGRectMake(0, 0, 22000, 22000)];
            else
                [holeView setFrame:CGRectMake(0, 0, 12000, 12000)];
            [holeView setCenter:self.view.center];
            [holeView setImage:[UIImage imageNamed:@"PinholeSmall.png"]];
            [self.view addSubview:holeView];
            
            [UIView animateWithDuration:0.5
                                  delay:0.1
                                options:nil
                             animations:^{
                                 [self.view setAlpha:0];
                                 [holeView setFrame:CGRectMake(0, 0, 568, 568)];
                                 [holeView setCenter:self.view.center];
                             }
                             completion:^(BOOL finished){
                                 [holeView removeFromSuperview];
                                 //iPad transitioning
                                 if(deviceType == 2) {
                                     UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
                                     UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"GameSetupView"];
                                     
                                     [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
                                 }
                                 //iPhone transitioning
                                 else {
                                     UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
                                     UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"GameSetupView"];
                                     
                                     [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
                                 }
                             }];
        }
    }
    else if(![[[GameKitHelper sharedGameKitHelper] localPlayer] isAuthenticated]) {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Game Center Required", @"Game Center Required")
                     message: NSLocalizedString(@"You must be signed into Game Center in order to play.", @"Game Center Required!")
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", @"Game Center Required") otherButtonTitles: nil];
        
        [errorView show];
    }
    else if(progress < 1 && progress != -1) {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Please wait!", nil)
                     message: NSLocalizedString(@"BACKATCHA is updating the question database.", nil)
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", nil) otherButtonTitles: nil];
        
        [errorView show];
    }
    else if(progress == -1 && [[[NSUserDefaults standardUserDefaults] arrayForKey:@"CategoryTypeList"] count] == 0) {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Database Error", nil)
                     message: NSLocalizedString(@"Sorry, BACKATCHA could not download the question database, and you have no locally stored questions.", nil)
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", nil) otherButtonTitles: nil];
        
        [errorView show];
    }
}

- (IBAction)friendsAction:(id)sender {
    if([[[GameKitHelper sharedGameKitHelper] localPlayer] isAuthenticated]) {
        //iPad transitioning
        if(deviceType == 2) {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
            UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"FriendsView"];
            
            [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
        }
        //iPhone transitioning
        else {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
            UIViewController *questionsViewController = [mainStoryboard instantiateViewControllerWithIdentifier:@"FriendsView"];
            
            [self presentViewController:questionsViewController animated:NO completion:^(void) {}];
        }
    }
    else {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Game Center Required", @"Game Center Required")
                     message: NSLocalizedString(@"You must be signed into Game Center in order to view friends.", @"Game Center Required!")
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", @"Game Center Required") otherButtonTitles: nil];
        
        [errorView show];
    }
}

- (IBAction)studioAction:(id)sender {
    if([self startStandardUpdates]) {
        //iPad transitioning
        if(deviceType == 2) {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
            UIViewController *studioView = [mainStoryboard instantiateViewControllerWithIdentifier:@"StudioView"];
            
            [self presentViewController:studioView animated:NO completion:^(void) {}];
        }
        //iPhone transitioning
        else {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
            UIViewController *studioView = [mainStoryboard instantiateViewControllerWithIdentifier:@"StudioView"];
            
            [self presentViewController:studioView animated:NO completion:^(void) {}];
        }
    }
    else {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Hold a moment!", nil)
                     message: NSLocalizedString(@"You must be within range of WFIE studio.", @"Game Center Required!")
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", nil) otherButtonTitles: nil];
        
        [errorView show];
    }
}

- (IBAction)leaderboardAction:(id)sender {
    if([[[GameKitHelper sharedGameKitHelper] localPlayer] isAuthenticated]) {
        //iPad transitioning
        if(deviceType == 2) {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
            UIViewController *leaderboardView = [mainStoryboard instantiateViewControllerWithIdentifier:@"LeaderboardView"];
            
            [self presentViewController:leaderboardView animated:NO completion:^(void) {}];
        }
        //iPhone transitioning
        else {
            UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
            UIViewController *leaderboardView = [mainStoryboard instantiateViewControllerWithIdentifier:@"LeaderboardView"];
            
            [self presentViewController:leaderboardView animated:NO completion:^(void) {}];
        }
    }
    else {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Game Center Required", @"Game Center Required")
                     message: NSLocalizedString(@"You must be signed into Game Center in order to view leaderboards.", @"Game Center Required!")
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Okay", @"Game Center Required") otherButtonTitles: nil];
        
        [errorView show];
    }
}

- (BOOL)startStandardUpdates
{
    CLLocation *evansville = [[CLLocation alloc] initWithLatitude:37.9772 longitude:87.5506];
    CLLocationDistance meters = [evansville distanceFromLocation:[locationManager location]];
    
    NSLog(@"%f", meters);
    if(meters < 80468 && meters > -1) {
        return YES;
    }
    else {
        return NO;
    }
}

- (void)matchmakerViewControllerWasCancelled:(GKMatchmakerViewController *)viewController
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)matchmakerViewController:(GKMatchmakerViewController *)viewController didFailWithError:(NSError *)error
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)matchmakerViewController:(GKMatchmakerViewController *)viewController didFindMatch:(GKMatch *)match
{
    [self startMatch:match];
}

- (void)startMatch:(GKMatch *)match {
    SharedMatch = match;
    
    if(![SharedAdBannerView isBannerViewActionInProgress]) {
        //Pinhole transition
        UIImageView *holeView = [[UIImageView alloc] init];
        if(deviceType == 2)
            [holeView setFrame:CGRectMake(0, 0, 22000, 22000)];
        else
            [holeView setFrame:CGRectMake(0, 0, 12000, 12000)];
        [holeView setCenter:self.view.center];
        [holeView setImage:[UIImage imageNamed:@"PinholeSmall.png"]];
        [self.view addSubview:holeView];
        
        [UIView animateWithDuration:0.5
                              delay:0.5
                            options:nil
                         animations:^{
                             [self.view setAlpha:0];
                             [holeView setFrame:CGRectMake(0, 0, 568, 568)];
                             [holeView setCenter:self.view.center];
                         }
                         completion:^(BOOL finished){
                             [holeView removeFromSuperview];
                             //iPad transitioning
                             if(deviceType == 2) {
                                 UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard-iPad" bundle:nil];
                                 UIViewController *gameView = [mainStoryboard instantiateViewControllerWithIdentifier:@"GameView"];
                                 
                                 [self dismissViewControllerAnimated:YES completion:nil];
                                 [self presentViewController:gameView animated:NO completion:^(void) {}];
                             }
                             //iPhone small transitioning
                             else if(deviceType == 0) {
                                 UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
                                 UIViewController *gameView = [mainStoryboard instantiateViewControllerWithIdentifier:@"GameViewSmall"];
                                 
                                 [self dismissViewControllerAnimated:YES completion:nil];
                                 [self presentViewController:gameView animated:NO completion:^(void) {}];
                             }
                             //iPhone regular transitioning
                             else {
                                 UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
                                 UIViewController *gameView = [mainStoryboard instantiateViewControllerWithIdentifier:@"GameView"];
                                 
                                 [self dismissViewControllerAnimated:YES completion:nil];
                                 [self presentViewController:gameView animated:NO completion:^(void) {}];
                             }
                         }];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    // Dispose of any resources that can be recreated.
}

@end
