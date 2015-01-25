//
//  StudioController.m
//  BACKATCHA
//
//  Created by Joey Hoffmann on 8/4/14.
//  Copyright (c) 2014 Jeffrey Lyons. All rights reserved.
//

#import "StudioController.h"
#import "AppDelegate.h"
#import "GameKitHelper.h"
#import <CloudKit/CloudKit.h>

@interface StudioController ()<UITextFieldDelegate>

@end

@implementation StudioController

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
    
    //Prep the popup transition
    [_popupView setAlpha:0];
    [_darkening setAlpha:0];
    [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
    [self.view insertSubview:TransitionView atIndex:0];
    
    //Set textfield delegates to the view controller
    [_nameField setDelegate:self];
    [_addressField setDelegate:self];
    [_phoneField setDelegate:self];
    [_emailField setDelegate:self];
    
    //Load the players leaderboard ranking
    [SharedLeaderboard setPlayerScope:GKLeaderboardPlayerScopeFriendsOnly];
    [SharedLeaderboard setTimeScope:GKLeaderboardTimeScopeAllTime];
    [SharedLeaderboard loadScoresWithCompletionHandler:^(NSArray *loadedScores, NSError *error) {
        if(loadedScores == nil) {
            NSLog(@"Error: %@", error);
        }
    }];
}

- (void)viewWillAppear:(BOOL)animated {
    [SharedAdBannerView setDelegate:self];
    [self.view addSubview:SharedAdBannerView];
    if(bannerIsVisable)
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-SharedAdBannerView.frame.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
    else
        [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
}

- (void)viewDidAppear:(BOOL)animated {
    //Popup transition
    [UIView animateWithDuration:0.4
                          delay:0.1
                        options:nil
                     animations:^{
                         [_popupView setAlpha:1];
                         [_darkening setAlpha:0.4];
                         [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
}

- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField {
    if(textField == _addressField) {
        [UIView animateWithDuration:0.20
                         animations:^{
                             if(deviceType == 2)
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 180)];
                             else
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 90)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    else if(textField == _phoneField || textField == _emailField) {
        [UIView animateWithDuration:0.20
                         animations:^{
                             if(deviceType == 2)
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 100)];
                             else
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 28)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    else if(textField == _nameField) {
        [UIView animateWithDuration:0.28
                         animations:^{
                             if(deviceType == 2)
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 240)];
                             else
                                 [_popupView setCenter:CGPointMake(self.view.center.x+10, 160)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    return YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if(textField == _nameField) {
        [textField resignFirstResponder];
        [_addressField becomeFirstResponder];
    }
    else if(textField == _addressField) {
        [textField resignFirstResponder];
        [_phoneField becomeFirstResponder];
    }
    else if(textField == _phoneField) {
        [textField resignFirstResponder];
        [_emailField becomeFirstResponder];
    }
    else if(textField == _emailField) {
        [textField resignFirstResponder];
        [UIView animateWithDuration:0.28
                         animations:^{
                             [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    return true;
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    if([alertView.message isEqualToString:@"An error occurred while submitting your request. Please try again at another time."] || [alertView.message isEqualToString:@"Your request has successfully been submitted for review. Thank you!"]) {
        //Popup transition
        [UIView animateWithDuration:0.5
                              delay:0.1
                            options:nil
                         animations:^{
                             [_popupView setAlpha:0];
                             [_darkening setAlpha:0];
                             [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
                         }
                         completion:^(BOOL finished){
                             [self dismissViewControllerAnimated:NO completion:nil];
                         }];
    }
}

- (IBAction)backAction:(id)sender {
    //Popup transition
    [UIView animateWithDuration:0.5
                          delay:0.1
                        options:nil
                     animations:^{
                         [_popupView setAlpha:0];
                         [_darkening setAlpha:0];
                         [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
                     }
                     completion:^(BOOL finished){
                         [self dismissViewControllerAnimated:NO completion:nil];
                     }];
}

- (IBAction)resignButton:(id)sender {
    [_nameField resignFirstResponder];
    [_addressField resignFirstResponder];
    [_phoneField resignFirstResponder];
    [_emailField resignFirstResponder];
    [UIView animateWithDuration:0.28
                     animations:^{
                         [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
}

- (IBAction)submitAction:(id)sender {
    [_nameField resignFirstResponder];
    [_addressField resignFirstResponder];
    [_phoneField resignFirstResponder];
    [_emailField resignFirstResponder];
    [UIView animateWithDuration:0.28
                     animations:^{
                         [_popupView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
    if(_nameField.text.length > 0 && _addressField.text.length > 0 && _phoneField.text.length > 0 && _emailField.text.length > 0) {
        //Submission animation
        UIView *blurBar = [[UINavigationBar alloc] initWithFrame:CGRectMake(0, 0, 200, 75)];
            //Rounding edges
            CGRect bounds = blurBar.layer.bounds;
            UIBezierPath *maskPath = [UIBezierPath bezierPathWithRoundedRect:bounds
                                                           byRoundingCorners:(UIRectCornerAllCorners)
                                                                 cornerRadii:CGSizeMake(5.0, 5.0)];
            CAShapeLayer *maskLayer = [CAShapeLayer layer];
            maskLayer.frame = bounds;
            maskLayer.path = maskPath.CGPath;
            [blurBar.layer addSublayer:maskLayer];
            [blurBar.layer setMask:maskLayer];
            //End of rounding
        [blurBar setCenter:self.view.center];
        [blurBar setAlpha:0];
        
        UILabel *loadingLabel = [[UILabel alloc] initWithFrame:CGRectMake(40, 0, 180, 75)];
        [loadingLabel setText:@"Uploading..."];
        [loadingLabel setFont:[UIFont fontWithName:@"Optima-ExtraBlack" size:15]];
        [loadingLabel setTextColor:[UIColor darkGrayColor]];
        
        UIActivityIndicatorView *aiv = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
        [aiv startAnimating];
        [aiv setCenter:CGPointMake(150, 37.5)];
        
        UIView *backCover = [[UIView alloc] initWithFrame:self.view.frame];
        [backCover setBackgroundColor:[UIColor blackColor]];
        [backCover setAlpha:0];
        [self.view setUserInteractionEnabled:NO];
        
        [self.view addSubview:backCover];
        [self.view addSubview:blurBar];
        [blurBar addSubview:loadingLabel];
        [blurBar addSubview:aiv];
        
        [UIView animateWithDuration:0.20
                         animations:^{
                             [backCover setAlpha:0.4];
                             [blurBar setAlpha:1];
                         }
                         completion:^(BOOL finished) {
                         }];
        
        //Cloudkit
        CKContainer *defaultContainer = [CKContainer defaultContainer];
        CKDatabase *publicDatabase = [defaultContainer publicCloudDatabase];
        
        //Creating the question that is to be submitted
        CKRecord *submittedRecord = [[CKRecord alloc] initWithRecordType:@"StudioInviteList"];
        [submittedRecord setObject:_nameField.text forKey:@"Name"];
        [submittedRecord setObject:_addressField.text forKey:@"Address"];
        [submittedRecord setObject:_phoneField.text forKey:@"Phone"];
        [submittedRecord setObject:_emailField.text forKey:@"Email"];
        //Game Center Name
        [submittedRecord setObject:[[[GameKitHelper sharedGameKitHelper] localPlayer] alias] forKey:@"GameCenterName"];
        //Leaderboard information
        NSString *leaderboardRanking = [[NSString alloc] initWithFormat:@"%i", [[SharedLeaderboard localPlayerScore] rank]];
        NSString *highScore = [[NSString alloc] initWithFormat:@"%i", [[SharedLeaderboard localPlayerScore] value]];
        [submittedRecord setObject:leaderboardRanking forKey:@"Ranking"];
        [submittedRecord setObject:highScore forKey:@"Score"];
        //Submit information
        [publicDatabase saveRecord:submittedRecord completionHandler:^(CKRecord *record, NSError *error) {
            //Submission error output and animation completion
            [UIView animateWithDuration:0.20
                             animations:^{
                                 [backCover setAlpha:0];
                                 [blurBar setAlpha:0];
                             }
                             completion:^(BOOL finished) {
                                 [self.view setUserInteractionEnabled:YES];
                                 [backCover removeFromSuperview];
                                 [blurBar removeFromSuperview];
                                 if(error != nil) {
                                     UIAlertView *errorView;
                                     
                                     errorView = [[UIAlertView alloc]
                                                  initWithTitle: NSLocalizedString(@"Error", @"Error")
                                                  message: NSLocalizedString(@"An error occurred while submitting your request. Please try again at another time.", @"Error!")
                                                  delegate: self
                                                  cancelButtonTitle: NSLocalizedString(@"Okay", @"Network error") otherButtonTitles: nil];
                                     
                                     [errorView show];
                                 }
                                 else {
                                     UIAlertView *errorView;
                                     
                                     errorView = [[UIAlertView alloc]
                                                  initWithTitle: NSLocalizedString(@"Success!", @"Error")
                                                  message: NSLocalizedString(@"Your request has successfully been submitted for review. Thank you!", @"Error")
                                                  delegate: self
                                                  cancelButtonTitle: NSLocalizedString(@"Okay", @"Network error") otherButtonTitles: nil];
                                     
                                     [errorView show];
                                 }
                             }];
        }];
    }
    else {
        UIAlertView *errorView;
        
        errorView = [[UIAlertView alloc]
                     initWithTitle: NSLocalizedString(@"Hold a Moment!", @"Error")
                     message: NSLocalizedString(@"You have not completed all the required fields for this submission.", @"Error")
                     delegate: self
                     cancelButtonTitle: NSLocalizedString(@"Let me fix that", @"Network error") otherButtonTitles: nil];
        
        [errorView show];
    }
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

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
