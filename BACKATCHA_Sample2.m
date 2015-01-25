//
//  QuestionController.m
//  BACKATCHA
//
//  Created by Joey Hoffmann on 7/9/14.
//  Copyright (c) 2014 Jeffrey Lyons. All rights reserved.
//

#import "QuestionController.h"
#import <CloudKit/CloudKit.h>
#import "AppDelegate.h"

@interface QuestionController ()<UITextFieldDelegate>

@end

@implementation QuestionController

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
    [_windowView setAlpha:0];
    [_darkening setAlpha:0];
    [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
    [self.view insertSubview:TransitionView atIndex:0];
    
    //Set textfield delegates to the view controller
    [_titleField setDelegate:self];
    [_correctField setDelegate:self];
    [_answerOneField setDelegate:self];
    [_answerTwoField setDelegate:self];
    [_answerThreeField setDelegate:self];
    [_titleField addTarget:self
                  action:@selector(textFieldDidChange:)
        forControlEvents:UIControlEventEditingChanged];
    [_correctField addTarget:self
                    action:@selector(textFieldDidChange:)
          forControlEvents:UIControlEventEditingChanged];
    [_answerOneField addTarget:self
                    action:@selector(textFieldDidChange:)
          forControlEvents:UIControlEventEditingChanged];
    [_answerTwoField addTarget:self
                    action:@selector(textFieldDidChange:)
          forControlEvents:UIControlEventEditingChanged];
    [_answerThreeField addTarget:self
                    action:@selector(textFieldDidChange:)
          forControlEvents:UIControlEventEditingChanged];
}

- (void)viewWillAppear:(BOOL)animated {
    if(![SharedAdBannerView isBannerViewActionInProgress]) {
        [SharedAdBannerView setDelegate:self];
        [self.view addSubview:SharedAdBannerView];
        if(bannerIsVisable)
            [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height-SharedAdBannerView.frame.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
        else
            [SharedAdBannerView setFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height, [UIScreen mainScreen].bounds.size.width, 50)];
    }
}

- (void)viewDidAppear:(BOOL)animated {
    //Popup transition
    [UIView animateWithDuration:0.4
                          delay:0.1
                        options:nil
                     animations:^{
                         [_windowView setAlpha:1];
                         [_darkening setAlpha:0.4];
                         [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
}

- (void)textFieldDidChange:(UITextField *)textField {
    //Character limits for field one
    NSString *charCount = [[NSString alloc] initWithFormat:@"%i", 50-_titleField.text.length];
    [_characterLimitOne setText:charCount];
    if(_titleField.text.length >= 40)
        [_characterLimitOne setTextColor:[UIColor redColor]];
    else
        [_characterLimitOne setTextColor:[UIColor lightGrayColor]];
    
    //Character limits for field two
    NSString *charCountTwo = [[NSString alloc] initWithFormat:@"%i", 50-_correctField.text.length];
    [_characterLimitTwo setText:charCountTwo];
    if(_correctField.text.length >= 40)
        [_characterLimitTwo setTextColor:[UIColor redColor]];
    else
        [_characterLimitTwo setTextColor:[UIColor lightGrayColor]];
    
    //Character limits for field three
    NSString *charCountThree = [[NSString alloc] initWithFormat:@"%i", 50-_answerOneField.text.length];
    [_characterLimitThree setText:charCountThree];
    if(_answerOneField.text.length >= 40)
        [_characterLimitThree setTextColor:[UIColor redColor]];
    else
        [_characterLimitThree setTextColor:[UIColor lightGrayColor]];
    
    //Character limits for field four
    NSString *charCountFour = [[NSString alloc] initWithFormat:@"%i", 50-_answerTwoField.text.length];
    [_characterLimitFour setText:charCountFour];
    if(_answerTwoField.text.length >= 40)
        [_characterLimitFour setTextColor:[UIColor redColor]];
    else
        [_characterLimitFour setTextColor:[UIColor lightGrayColor]];
    
    //Character limits for field five
    NSString *charCountFive = [[NSString alloc] initWithFormat:@"%i", 50-_answerThreeField.text.length];
    [_characterLimitFive setText:charCountFive];
    if(_answerThreeField.text.length >= 40)
        [_characterLimitFive setTextColor:[UIColor redColor]];
    else
        
        [_characterLimitFive setTextColor:[UIColor lightGrayColor]];
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
    //Prevent edditing beyond character limit
    return textField.text.length + (string.length - range.length) <= 50;
}

- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField {
    if(textField == _correctField) {
        [UIView animateWithDuration:0.20
                         animations:^{
                             if(deviceType == 2)
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 180)];
                             else
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 90)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    else if(textField == _answerOneField || textField == _answerTwoField || textField == _answerThreeField) {
        [UIView animateWithDuration:0.20
                         animations:^{
                             if(deviceType == 2)
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 100)];
                             else
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 28)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    else if(textField == _titleField) {
        [UIView animateWithDuration:0.28
                         animations:^{
                             if(deviceType == 2)
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 240)];
                             else
                                 [_windowView setCenter:CGPointMake(self.view.center.x+10, 160)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    return YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if(textField == _titleField) {
        [textField resignFirstResponder];
        [_correctField becomeFirstResponder];
    }
    else if(textField == _correctField) {
        [textField resignFirstResponder];
        [_answerOneField becomeFirstResponder];
    }
    else if(textField == _answerOneField) {
        [textField resignFirstResponder];
        [_answerTwoField becomeFirstResponder];
    }
    else if(textField == _answerTwoField) {
        [textField resignFirstResponder];
        [_answerThreeField becomeFirstResponder];
    }
    else if(textField == _answerThreeField) {
        [textField resignFirstResponder];
        [UIView animateWithDuration:0.28
                         animations:^{
                             [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                         }
                         completion:^(BOOL finished){
                         }];
    }
    return true;
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    if([alertView.message isEqualToString:@"An error occurred while submitting your question. Please try again at another time."] || [alertView.message isEqualToString:@"Your question has successfully been submitted for review. Thank you!"]) {
        //Popup transition
        [UIView animateWithDuration:0.5
                              delay:0.1
                            options:nil
                         animations:^{
                             [_windowView setAlpha:0];
                             [_darkening setAlpha:0];
                             [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
                         }
                         completion:^(BOOL finished){
                             [self dismissViewControllerAnimated:NO completion:nil];
                         }];
        }
}

- (IBAction)cancelAction:(id)sender {
    //Popup transition
    [UIView animateWithDuration:0.5
                          delay:0.1
                        options:nil
                     animations:^{
                         [_windowView setAlpha:0];
                         [_darkening setAlpha:0];
                         [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.frame.size.height)];
                     }
                     completion:^(BOOL finished){
                        [self dismissViewControllerAnimated:NO completion:nil];
                     }];
}

- (IBAction)resignButton:(id)sender {
    [_titleField resignFirstResponder];
    [_correctField resignFirstResponder];
    [_answerOneField resignFirstResponder];
    [_answerTwoField resignFirstResponder];
    [_answerThreeField resignFirstResponder];
    [UIView animateWithDuration:0.28
                     animations:^{
                         [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
}

- (IBAction)submitAction:(id)sender {
    [_titleField resignFirstResponder];
    [_correctField resignFirstResponder];
    [_answerOneField resignFirstResponder];
    [_answerTwoField resignFirstResponder];
    [_answerThreeField resignFirstResponder];
    [UIView animateWithDuration:0.28
                     animations:^{
                         [_windowView setCenter:CGPointMake(self.view.center.x+10, self.view.center.y)];
                     }
                     completion:^(BOOL finished){
                     }];
    if(_titleField.text.length > 0 && _correctField.text.length > 0 && _answerOneField.text.length > 0 && _answerTwoField.text.length > 0 && _answerThreeField.text.length > 0) {
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
        CKRecord *submittedRecord = [[CKRecord alloc] initWithRecordType:@"UserSubmittedQuestionList"];
        [submittedRecord setObject:_titleField.text forKey:@"QuestionTitle"];
        [submittedRecord setObject:_correctField.text forKey:@"CorrectAnswer"];
        [submittedRecord setObject:@"User Submitted" forKey:@"Category"];
        NSMutableArray *answerList = [[NSMutableArray alloc] init];
        [answerList addObject:_correctField.text];
        [answerList addObject:_answerOneField.text];
        [answerList addObject:_answerTwoField.text];
        [answerList addObject:_answerThreeField.text];
        [answerList exchangeObjectAtIndex:arc4random() % 4 withObjectAtIndex:arc4random() % 4];
        [submittedRecord setObject:answerList forKey:@"AnswerList"];
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
                                                  message: NSLocalizedString(@"An error occurred while submitting your question. Please try again at another time.", @"Error!")
                                                  delegate: self
                                                  cancelButtonTitle: NSLocalizedString(@"Okay", @"Network error") otherButtonTitles: nil];
                                     
                                     [errorView show];
                                 }
                                 else {
                                     UIAlertView *errorView;
                                     
                                     errorView = [[UIAlertView alloc]
                                                  initWithTitle: NSLocalizedString(@"Success!", @"Error")
                                                  message: NSLocalizedString(@"Your question has successfully been submitted for review. Thank you!", @"Error")
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
