//
//  ViewController.m
//  SyrupAdSample
//
//  Created by SKplanet on 2016. 8. 21..
//  Copyright © 2016년 SKplanet. All rights reserved.
//

#import "ViewController.h"
#import "TadBanner.h"

@interface ViewController () <TadBannerDelegate>
@property (strong, nonatomic) TadBanner *tadBanner;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    // SADBanner 프로퍼티 초기화
    self.tadBanner = [[TadBanner alloc] initWithSeedViewController:self];
    // 광고가 삽입될 뷰 지정
    self.tadBanner.seedView = self.view;
    // clientID 설정
    self.tadBanner.clientID = @"IXT002001";
    // 광고슬롯 지정
    self.tadBanner.slotNo = TadSlotBanner;
    // 테스트 광고용 설정 (앱스토어에 배포 시에 반드시 NO로 바꾸셔야 합니다)
    self.tadBanner.isTest = YES;
    
    [self.tadBanner getAdvertisement];
    
    // 딜리게이트 옵션
    self.tadBanner.delegate = self;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma TadBanner Delegate
- (void)tadOnAdWillLoad:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdLoaded:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdClicked:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdTouchDown:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdClosed:(TadBanner *)tadBanner byUser:(BOOL)value {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdExpanded:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdExpandClose:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdResized:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdResizeClosed:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadBanner:(TadBanner *)tadBanner tadOnAdFailed:(TadErrorCode)errorCode {
    NSLog(@"%s", __PRETTY_FUNCTION__);

    NSString *string;
    if (errorCode == NO_AD) {
        string = @"<Tad Error> 광고 서버에서 송출 가능한 광고가 없는 경우 바형태 배너 일 경우 자동으로 재호출 됩니다. (전면 형태의 배너일 경우 자동 으로 호출 되지 않습니다.)";
    } else if (errorCode == MISSING_REQUIRED_PARAMETER_ERROR) {
        string = @"<Tad Error> 필수 파라메터 누락된 경우";
    } else if (errorCode == INVAILD_PARAMETER_ERROR) {
        string = @"<Tad Error> 잘못된 파라메터인 경우";
    } else if (errorCode == UNSUPPORTED_DEVICE_ERROR) {
        string = @"<Tad Error> 미지원 단말인 경우";
    } else if (errorCode == CLIENTID_DENIED_ERROR) {
        string = @"<Tad Error> 지정한 Client ID가 유효하지 않은 경우";
    } else if (errorCode == INVAILD_SLOT_NUMBER) {
        string = @"<Tad Error> 지정한 슬롯 번호가 유효하지 않은 경우";
    } else if (errorCode == CONNECTION_ERROR) {
        string = @"<Tad Error> 네트워크 연결이 가능하지 않은 경우";
    } else if (errorCode == NETWORK_ERROR) {
        string = @"<Tad Error> 광고의 수신 및 로딩 과정에서 네트워크 오류가 발생한 경우";
    } else if (errorCode == RECEIVE_AD_ERROR) {
        string = @"Tad Error 광고를 수신하는 과정에서 에러가 발생한 경우";
    } else if (errorCode == LOAD_ERROR) {
        string = @"<Tad Error> SDK에서 허용하는 시간 내에 광고를 재요청한 경우";
    } else if (errorCode == SHOW_ERROR) {
        string = @"<Tad Error> 노출할 광고가 없는 경우";
    } else if (errorCode == INTERNAL_ERROR) {
        string = @"<Tad Error> 광고의 수신 및 로딩 과정에서 내부적으로 오류가 발생한 경우";
    } else if (errorCode == ALREADY_SHOWN) {
        string = @"<ALREADY_SHOWN> 이미 광고가 표시되어있음.";
    } else if (errorCode == NOT_LOAD_AD) {
        string = @"<NOT_LOAD_AD> Load된 광고가 없음.";
    }

    NSString *totalString = [NSString stringWithFormat:@"%@\n%@", string, @"다시 요청 하시려면 getAdvertisement 를 호출 하세요"];
    NSLog(@"%@", totalString);
}

- (void)tadOnAdWillPresentModal:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdDidPresentModal:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdWillDismissModal:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdDidDismissModal:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (void)tadOnAdWillLeaveApplication:(TadBanner *)tadBanner {
    NSLog(@"%s", __PRETTY_FUNCTION__);
}

@end
