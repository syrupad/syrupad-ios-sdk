//
//  TadCore.h
//
//  Syrup Ad SDK For iOS
//  Copyright © 2016 SKplanet. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TadType.h"
#import "TadDemographicInfo.h"

@protocol TadDelegate;

/**
 이 클래스는 각 상품 클래스들의 공통적인 내용들을 정의 해둔 클래스입니다.
 
 @warning 개발자는 이 클래스의 인스턴스를 직접 생성하여 사용하는 경우 비정상적으로 앱이 종료될 수 있습니다. 반드시 각 상품에 맞는 클래스를 참조하여 사용해주시기 바랍니다.
 */
@interface TadCore : NSObject

#pragma mark Initialization
/**
 *  광고를 송출할 개발자의 뷰컨트롤러와 함께 초기화
 *  @param seedViewController 광고를 송출할 뷰컨트롤러
 */
- (id)initWithSeedViewController:(UIViewController *)seedViewController;


#pragma mark Pre-Request
/**
 * 초기화
 */
- (void)initializeSetting;
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
 *  띠배너의 상품 번호를 입력합니다.
 *  TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner
 */
@property (nonatomic) TadSlot slotNo;
/**
 *  Optional value
 *  테스트용 ClientID로 광고 호출하기 위한 모드
 *  @param isTest 테스트 서버로 요청할지 여부
 *
 */
@property (nonatomic) BOOL isTest;
/**
 *  Require method
 *  광고 뷰를 가진 개발자의 뷰컨트롤러(seedController)의 viewWillAppear에서 반드시 호출하여야 합니다.
 *  eg.
 *  - (void)viewWillAppear:(BOOL)animated {
 *   [tadBanner viewWillAppear:animated];
 *   [super viewWillAppear:animated];
 *  }
 */
- (void)viewWillAppear:(BOOL)animated;
/**
 *  Require method
 *  광고 뷰를 가진 개발자의 뷰컨트롤러(seedController)의 viewWillDisappear에서 반드시 호출하여야 합니다.
 *  eg.
 *  - (void)viewWillDisappear:(BOOL)animated {
 *   [tadBanner viewWillDisppear:animated];
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
 *  Demographic 데이터와 함께 광고 요청
 *  @param Info TadDemographicInfo 인스턴스 (상단 참조)
 */
- (void)getAdvertisement:(TadDemographicInfo *)Info;
/**
 *  현재 광고를 파기한다.
 */
- (void)destroyAd;


#pragma mark Optional
/**
 *  Optioncal Delegate
 *  광고 상태 변경을 알려주는 프로토콜이 정의 된 딜리게이트
 */
//@property (weak, nonatomic) id <TadDelegate> delegate;
/**
 *  Optional value
 *  광고뷰의 위치를 변경 (Default: CGPoint(0, 0))
 */
@property (nonatomic, assign) CGPoint position;


#pragma mark Access Properties

#pragma mark Etc.
/**
 *  SDK의 로그를 출력
 *  @param isLogMode 로그 출력 여부 (Default: NO)
 */
- (void)setLogMode:(BOOL)isLogMode;
/**
 *  Optional Value
 *  광고가 준비 됐는지 여부
 */
@property (nonatomic, readonly) BOOL isReady;


#pragma mark Mediation
/**
 *  Optional value
 *  Mediation 여부 (Default: NO)
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