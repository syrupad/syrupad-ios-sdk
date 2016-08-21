//
//  TadFloating.h
//
//  Syrup Ad SDK For iOS
//  Copyright © 2016 SKplanet. All rights reserved.
//

#import "TadCore.h"

@protocol TadFloatingDelegate;

/**
 * SDK 사용 시 주의사항 (원문 : https://github.com/syrupad/syrupad-ios-sdk)
 1. Syrup Ad SDK를 통해 광고를 수신하기 위해서는 Client ID가 필요합니다. http://www.syrupad.co.kr에서 매체 등록 후 Client ID를 발급 받으시길 바랍니다.
 2. Syrup Ad SDK를 적용한 window에 root view controller 속성이 있어야 합니다.
 3. 한 개의 화면에 TadCore instance 한 개만을 사용해야 합니다. 동일 화면에 여러개의 TadCore instance를 사용하는 경우 비정상적인 동작을 할 수 있습니다.
 4. 애플리케이션을 AppStore에 배포할 시에는 (BOOL)isTest 값을 반드시 NO로 설정해 주어야 합니다.
 5. AppStore 배포 시에 IDFA 사용여부를 Yes로 체크해 주시기 바랍니다.
 6. iOS 9 이상의 버전에는 앱과 웹 서비스 간 연결 보안을 강화하는ATS(App Transport Security)가 적용 됩니다. ATS가 적용된 후에는 암호화된 HTTPS 방식만 허용되기 때문에, 기존에 사용하던 HTTP 방식을 사용할 경우 OS에서 강제 차단되어 광고가 노출되지 않을 수있으니 하단의 내용을 info.plist 파일에 적용해 주시기 바랍니다.
    - `NSAppTransportSecurity NSAllowsArbitraryLoads`
 7. Xcode 7 이상의 버전에는 LLVM Compiler가 Bitcode 사용을 자동으로 활성화합니다. Syrup Ad SDK는 이를 지원하고 있지 않으므로 컴파일 과정에서 에러가 발생할 수 있습니다.
    - 따라서 프로젝트 설정의 Build Settings에서 Bitcode를 NO로 설정해주시기 바랍니다.
 8. 이 뷰는 플로팅 상품(Floating)을 위한 클래스입니다 Banner와 Interstitial 상품은 각각의 클래스를 참조해주세요.
 */
@interface TadFloating : TadCore

#pragma mark Initialization

/**
 *  광고를 송출할 개발자의 뷰컨트롤러와 함께 초기화
 *  @param seedViewController 광고를 송출할 뷰컨트롤러
 */
- (id)initWithSeedViewController:(UIViewController *)seedViewController;


#pragma mark Pre-Request

/**
 *  Required value
 *  광고가 삽입 되는 유저의 뷰 컨트롤러
 */
@property (strong, nonatomic) UIViewController *seedViewController;
/**
 *  Required value
 *  송출될 광고가 직접적으로 표시될 뷰
 */
@property (weak, nonatomic) UIView *seedView;
/**
 *  Required value
 *  AD 클라이언트 ID
 *  http://syrupad.co.kr에서 발급
 */
@property (strong, nonatomic) NSString *clientID;
/**
 *  Required value
 *  플로팅 광고 상품 번호
 */
@property (nonatomic) TadSlot slotNo;
/**
 *  Require method
 *  광고 뷰를 가진 개발자의 뷰컨트롤러(seedController)의 viewWillAppear에서 반드시 호출하여야 합니다.
 *  eg.
 *  - (void)viewWillAppear:(BOOL)animated {
 *   [tadFloating viewWillAppear:animated];
 *   [super viewWillAppear:animated];
 *  }
 */
- (void)viewWillAppear:(BOOL)animated;
/**
 *  Require method
 *  광고 뷰를 가진 개발자의 뷰컨트롤러(seedController)의 viewWillDisappear에서 반드시 호출하여야 합니다.
 *  eg.
 *  - (void)viewWillDisappear:(BOOL)animated {
 *   [tadFloating viewWillDisppear:animated];
 *   [super viewWillDisappear:animated];
 *  }
 */
- (void)viewWillDisappear:(BOOL)animated;


#pragma mark AD Request

/**
 *  광고를 요청한다.
 */
- (void)getAdvertisement;
/**
 *  현재 광고를 파기한다.
 */
- (void)destroyAd;
/**
 *  로드한 광고를 수동으로 노출
 *  호출하기 전에 loadAd를 통해서 광고를 받아와야 함.
 *  @return 광고 노출 성공 여부
 */
- (BOOL)showAd;
/**
 *  광고 수동으로 닫기
 */
- (void)closeAd;


#pragma mark Optional

/**
 *  Optioncal Delegate
 *  광고 상태 변경을 알려주는 프로토콜이 정의 된 딜리게이트
 */
@property (weak, nonatomic) id <TadFloatingDelegate> delegate;
/**
 *  Optional value
 *  광고뷰의 위치를 변경 (Default: CGPoint(0, 0))
 */
@property (nonatomic, assign) CGPoint position;
/**
 *  Optional value
 *  테스트용 ClientID로 광고 호출하기 위한 모드
 *  YES : 테스트 서버, NO : 운영서버 (Default: NO)
 *  ** 앱을 배포하기 전 반드시 NO로 설정해주세요 **
 */
@property (nonatomic) BOOL isTest;
/**
 *  Optional value
 *  자동닫힘 설정(초) ; Default 0초
 *  0초 : 자동으로 닫히지 않음
 *  1~5 : 5초
 *  10~ : 10초
 */
@property (nonatomic) NSInteger autoClose;
/**
 *  광고 자동닫힘 설정이 되어있는지 여부
 */
@property (nonatomic, readonly) BOOL isAutoClose;
/**
 *  플로팅 광고의 위치를 변경
 *
 *  @param point 이동하고자하는 위치 (x, y)
 */
- (void)moveAd:(CGPoint)point;

/**
 *  광고뷰를 특정 뷰 위로 이동
 *
 *  @param view 광고를 올리고자하는 뷰
 */
- (void)bringSubviewToFront:(UIView *)view;


#pragma mark Access Properties

/**
 *  광고를 요청할 수 있는 상태인지 확인
 */
@property (nonatomic, readonly) BOOL isValidState;


#pragma mark Etc.
/**
 *  Optional Value
 *  광고가 준비 됐는지 여부
 */
@property (nonatomic, readonly) BOOL isReady;


#pragma mark Mediation

/**
 *  Optional value
 *  Mediation 여부
 */
@property (nonatomic) BOOL isMediation;
/**
 *  Mediation 기능을 사용할 때 광고가 삽입되는 뷰
 */
@property (nonatomic, retain) UIView *inlineView;
/**
 *  Mediation 기능을 사용할 때 광고뷰
 */
@property (strong, nonatomic, readonly) UIView *mediationView;

@end



/**
 *  광고 송출 관련한 프로토콜 메서드입니다.
 */
@protocol TadFloatingDelegate <NSObject>
@optional
/**
 *  @optional
 *  광고를 요청하기 직전에 호출 됩니다.
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdWillLoad:(TadFloating *)tadFloating;

/**
 *  @optional
 *  광고 전문을 받은 경우 호출 됩니다.
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdLoaded:(TadFloating *)tadFloating;

/**
 *  @optional
 *  사용자가 광고를 클릭한 경우 호출 됩니다.
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdClicked:(TadFloating *)tadFloating;

/**
 *  사용자에 의해 광고 영역에서 Touch Down 이벤트가 발생한 경우
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdTouchDown:(TadFloating *)tadFloating;

/**
 *  광고가 닫힐 때 호출 됩니다.
 *  @param tadFloating TadFloating 인스턴스
 *  @param value   YES (사용자가 직접 X 버튼을 눌러 닫은 경우) / NO (개발자가 closeAd() 함수를 호출하여 닫은 경우, 즉 autoClose 옵션인 경우)
 */
- (void)tadOnAdClosed:(TadFloating *)tadFloating byUser:(BOOL)value;


/**
 *  사용자에 의해 전체 확장이 일어날 때 호출이 됩니다.
 *
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdExpanded:(TadFloating *)tadFloating;

/**
 *  사용자에 의해 전체 화면이 닫힐 때 호출이 됩니다.
 *
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdExpandClose:(TadFloating *)tadFloating;

/**
 *  사용자에 의해 일부 확장이 일어날 때 호출이 됩니다.
 *
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdResized:(TadFloating *)tadFloating;

/**
 *  사용자에 의해 전체 확장 화면이 닫힐 때 호출이 됩니다.
 *
 *  @param tadFloating TadFloating 인스턴스
 */
- (void)tadOnAdResizeClosed:(TadFloating *)tadFloating;

/**
 *  에러 메세지를 전달 합니다.
 *
 *  @param tadFloating TadFloating 인스턴스
 *  @param errorCode 상황에 따른 에러코드 SADType
 */
- (void)tadFloating:(TadFloating *)tadFloating tadOnAdFailed:(TadErrorCode)errorCode;

/* For Admob Mediation Delegate */
- (void)tadOnAdWillPresentModal:(TadFloating *)tadFloating;
- (void)tadOnAdDidPresentModal:(TadFloating *)tadFloating;
- (void)tadOnAdWillDismissModal:(TadFloating *)tadFloating;
- (void)tadOnAdDidDismissModal:(TadFloating *)tadFloating;
- (void)tadOnAdWillLeaveApplication:(TadFloating *)tadFloating;
@end