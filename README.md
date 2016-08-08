# Syrup Ad iOS SDK Guide

## SDK 정보
Syrup Ad SDK는 다음과 같은 개발환경에서 개발되었습니다.

| 항목 | 내용 |
|:-----|:-----|
|iOS Base SDK|iOS 9.3|
|iOS Deployment Target|6.0|
|Tested iOS Version|6.0 ~ 9.3|
|Tested iOS Device|iphone (3gs, 4, 4s, 5, 5s, 6, 6s), iPad2, new iPad, iPad Retina 디스플레이, iPad Air, iPad Air 2 iPad mini, iPad mini 2, iPad mini 3|
|Support Core|arm64, armv7, armv7s|
|MAC Development OS|OS X El Capatian|
|Xcode Version|Xcode 7.3.1|

Syrup Ad SDK는 다음과 같은 광고 사이즈를 제공합니다.

| 슬롯 | 사이즈 |
|:----|:----|
|SlotBanner|320x50|
|SADSlotInterstitial|Full-screen|
|SADSlotFloating|100x100|
|SADSlotMediumRectangle|300x250|
|SADSlotLargeBanner|320x100|

## 준비사항
1. Syrup Ad SDK를 통해 광고를 수신하기 위해서는 Client ID가 필요합니다. [http://www.syrupad.co.kr](http://www.syrupad.co.kr) 에서 매체 등록 후 Client ID를 발급 받으세요.

## 주의사항
1. 화면의 최상위 view에 banner가 배치되어야 합니다.
최상위 view에 banner가 배치되지 않을 경우 검수 과정에서 반려 사유가 될 수 있습니다.
Syrup Ad SDK 에서 제공하는 bringSubviewToFront: 메소드를 사용하여 최상위 view로 설정 할 수 있습니다.
2. Syrup Ad SDK를 적용한 window에 root view controller 속성이 있어야 합니다.
3. 한 개의 화면에 SADCore instance 한 개만을 사용해야 합니다.
동일 화면에 여러개의 SADCore instance를 사용하는 경우 비정상적인 동작을 할 수 있습니다.
4. 애플리케이션을 AppStore에 배포할 시에는 (BOOL)isTest 값을 반드시 NO로 설정해 주어야 합니다.
5. AppStore 배포 시에 아래와 같이 IDFA 사용여부를 Yes로 체크해 주시기 바랍니다.<br />
![check use of idfa](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/use_idfa.png)

6. iOS 9 이상의 버전에는 앱과 웹 서비스 간 연결 보안을 강화하는ATS(App Transport Security)가 적용 됩니다.
ATS가 적용된 후에는 암호화된 HTTPS 방식만 허용되기에, 기존에 사용하던 HTTP 방식을 사용할 경우 OS에서 강제 차단되어 광고가 노출되지 않을 수있으니 하단의 내용을 info.plist 파일에 적용해 주시기 바랍니다.

```objectivec
NSAppTransportSecurity NSAllowsArbitraryLoads
```

**ATS(App Transport Security)에 대한 상세 내용은 App Transport Security Technote 를 참고 해주시기 바랍니다.**

7. Xcode 7 이상의 버전에는 LLVM Compiler가 Bitcode 사용을 자동으로 활성화합니다. Syrup Ad SDK는 이를 지원하고 있지 않으므로 컴파일 과정에서 에러가 발생할 수 있습니다. 따라서 프로젝트 설정의 Build Settings에서 하단 스크린 샷과 같이 Bitcode를 ```NO```로 설정해주시기 바랍니다.

![bitcode disabled](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/bitcode_disabled.png)


## Step I. Syrup Ad SDK integration

### Add SDK to Project
프로젝트 폴더에 다음의 파일들을 복사합니다.
> SADCore.h
> libTadCore.a
> Tad.bundle
> SADBanner.h
> SADFloating.h
> SADInterstitial.h
> SADDelegate.h
> SADType.h
> SADDemographicInfo.h

![copy files](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/copy_files.png)

XCode 상에서 파일을 추가 할 폴더에 우측 클릭 후 Add Files to “...” 를 선택합니다.

![add files](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/add_files.png)

복사한 파일을 선택 후 Add를 선택합니다.
![add files2](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/add_files2.png)

### Link Option
Xcode Project Navigation에서 프로젝트를 선택한 후, Build Phases에서 아래와 같이 라이브러리 파일을 추가합니다.
![link library](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/link_library.png)

### Add Framework
Syrup Ad SDK는 다음의 프레임워크를 사용합니다.
> SystemConfiguration.framework
> CoreTelephony.framework
> AVFoundation.framework
> QuartzCore.framework
> AudioToolbox.framework
> EventKit.framework
> MediaPlayer.framework
> CoreGraphics.framework
> UIKit.framework
> Foundation.framework
> AdSupport.framework
> Security.framework
> libxml2.dylib

Xcode Project Navigation에서 프로젝트를 선택한 후, 원하는 타겟의 Build Phases 탭으로 이동합니다. Link Binary With Libraries 메뉴에서 +를 선택하고 필요한 framework 를 추가합니다.
![add framework](http://syrupad.github.io/syrupad-ios-sdk/readme-screenshots/add_frameworks.png)

## Step II. Declaration

1. 사용자가 사용하려는 상품에 맞게 헤더를 임포트합니다 (이후 설명은 배너 상품 기준입니다)
```objectivec
#import "SADBanner.h"
```
```objectivec
#import "SADFloating.h"
```
```objectivec
#import "SADInterstitial.h"
```
2. SDK 인스턴스 선언
```objectivec
@property (strong, nonatomic) SADBanner *sadBanner;
```

## Step III. Implementation
1. 초기화
```objectivec
-(void)viewDidLoad {
        // SADBanner 프로퍼티 초기화
        self.sadBanner = [[SADBanner alloc] initWithSeedViewController:self];
        // 광고가 삽입될 뷰 지정
        self.sadBanner.seedView = self.view;
        // clientID 설정
        self.sadBanner.clientID = @"IXT002001";
        // 광고슬롯 지정
        self.sadBanner.slotNo = SADSlotBanner;
        // 테스트 광고용 설정
        self.sadBanner.isTest = YES;
		
        [self.sadBanner getAdvertisement];
    }
    return self;
}
```

2. viewWillAppear, viewWillDisappear 호출
광고 뷰를 가진 뷰컨트롤러(seedViewController)에서 viewWillAppear, viewWillDisappear를 반드시 호출하여야 합니다.
```objectivec
-(void) viewWillAppear:(BOOL)animated) {
    [self.sadBanner viewWillAppear:animated];
    [super viewWillAppear:animated];
}
```
```objectivec
-(void)viewWillDisappear:(BOOL)animated {
    [self.sadBanner viewWillDisappear:animated];
    [super viewWillDisappear:animated];
}
```

3. 광고 제거
광고의 제거가 필요한 경우나 광고가 포함된 뷰가 종료될 때에는 destroyAd를 반드시 호출하여야 합니다.
```objectivec
[self.sadBanner destroyAd];
```

#### Banner
```objectivec
SADBanner *sadBanner = [[SADBanner alloc] initWithSeedViewController:self];
sadBanner.seedView = self.view;
sadBanner.delegate = self;
sadBanner.clientID = @"IXT002001";
sadBanner.slotNo = TadSlotBanner;
// 사용가능한 슬롯: TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner

[sadBanner getAdvertisement];
```

#### Interstitial
```objectivec
## SADInterstitial *sadInterstitial = [[SADBanner alloc] initWithSeedViewController:self];
sadInterstitial.delegate = self;
sadInterstitial.clientID = @"IXT003001";
sadInterstitial.slotNo = TadSlotInterstitial;
sadInterstitial.autoCloserWhenNoInteraction = NO;
sadInterstitial.autoCloseAfterLeaveApplication = NO;

[sadInterstitial getAdvertisement];	// Load Ad
[sadInterstitial showAd]; // Show Ad
```

#### Floating
```objectivec
SADFloating *sadFloating = [[SADFloating alloc] initWithSeedViewController:self];
sadFloating.delegate = self;
sadFloating.clinetID = @"IXT103001";
sadFloating.slotNo = TadSlotFloating;
sadFloating.autoClose = NO;
sadFloating.position = (CGPoint){0, 0};

[sadFloating getAdvertisement];	// Load Ad
[sadFloating showAd];	// Show Ad
```

##헤더파일
각각의 상품별 헤더 파일(SADBanner, SADFloating, SADInterstitial)에는 Syrup Ad SDK 를 사용하기 위한 설정, 메소드 등이 정의 되어 있습니다.

###Constants
####SADSlot
```objectivec
SADSlotNone
SADSlotBanner                       // 320x50  사이즈를 가지는 배너 광고를 의미합니다.
SADSlotInterstitial                 // 320x480 사이즈를 가지는 전면 광고를 의미합니다.
SADSlotFloating                     // 100x100 사이즈를 가지는 플로팅 광고를 의미합니다.
SADSlotMediumRectangle              // 300x250 사이즈를 가지는 배너 광고를 의미합니다.
SADSlotLargeBanner                  // 320x100 사이즈를 가지는 배너 광고를 의미합니다.
```
####SADErrorCode
```objectivec
NO_AD                               // 광고 서버에서 송출 가능한 광고가 없는 경우
MISSING_REQUIRED_PARAMETER_ERROR    // 광고를 송수신하는 과정에서 필수 파라메터가 누락된 경우
INVAILD_PARAMETER_ERROR             // 광고를 송수신하는 과정에서 잘못된 파라메터가 있는 경우
UNSUPPORTED_DEVICE_ERROR            // 광고를 송수신하는 과정에서 미지원 단말로 인식되는 경우
CLIENTID_DENIED_ERROR               // 지정한 Client ID 가 유효하지 않은 경우
INVAILD_SLOT_NUMBER                 // 지정한 슬롯 번호가 유효하지 않은 경우
CONNECTION_ERROR                    // 네트워크 연결이 가능하지 않은 경우
NETWORK_ERROR                       // 광고의 수신 및 로딩 과정에서 네트워크 오류가 발생한 경우
RECEIVE_AD_ERROR                    // 광고를 수신하는 과정에서 에러가 발생한 경우
LOAD_ERROR                          // 허용하지 않는 시간 내에 광고를 재요청한 경우
SHOW_ERROR                          // 노출할 광고가 없는 경우
INTERNAL_ERROR                      // 광고의 수신 및 로딩 과정에서 내부적으로 오류가 발생한 경우
ALREADY_SHOWN                       // 이미 광고가 표시되어있는 경우
NOT_INLINE_SHOW                     // 배너 광고일 경우 show 기능 방지
INVALID_REQUEST					 // 비정상적인 요청인 경우.
```

###필수 설정 요소 (Required Value)
```objectivec
- (id)initWithSeedViewController:(UIViewController *)seedViewController;
```
광고를 송출할 개발자의 뷰컨트롤러와 함께 초기화
**반드시 설정해야 합니다.**
> seedViewController 광고를 송출할 사용자의 뷰컨트롤러

---
```objectivec
UIView *seedView;
```
광고주 페이지로 이동이 될 때 modal 의 기반이 되는 view controller 를 설정합니다.
**반드시 설정해야 합니다.**

---
```objectivec
NSString *clientID
```
상품의 클라이언트 ID를 설정합니다.
http://www.syrupad.co.kr 에서 발급할 수 있습니다.
**반드시 설정해야 합니다.**

---
```objectivec
SADSlot *slotNO
```
상품의 번호를 설정합니다. 클라이언트 아이디와 매칭이 되지 않을 경우 광고 수신에 문제가 있을 수 있습니다.
> slotNo : 광고 슬롯
> 
| 슬롯 | 사이즈 |
|:----|:----|
|SADSlotBanner|320x50|
|SADSlotInterstitial|full-screen|
|SADSlotFloating|100x100|
|SADSlotMediumRectangle|300x250|
|SADSlotLargeBanner|320x100|
**반드시 설정해야 합니다.**

---
```objectivec
- (void)viewWillAppear:(BOOL)animated
```
**광고 뷰를 가진 컨트롤러의 viewWillAppear에서 반드시 호출해 주어야 합니다.**

---
```objectivec
- (void)viewWillDisappear:(BOOL)animated
```
**광고 뷰를 가진 컨트롤러의 viewWillDisappear에서 반드시 호출해 주어야 합니다.**

### 광고 요청 메서드

```objectivec
- (void)getAdvertisement:(SADDemographicInfo *)info
```
새로운 광고를 요청합니다.
**반드시 초기화 이후에 호출해야 합니다.**
> info : demographics 정보

---
```objectivec
- (void)destroyAd
```
노출 중인 광고를 화면에서 제거합니다.

---
```objectivec
- (void)showAd
```
수신한 광고를 노출합니다.
**SADSlotInterstitial 에서만 사용됩니다.**

---
```objectivec
- (void)pauseAd
```
배너의 자동 갱신을 정지합니다.
**SADSlotBanner, SADSlotMediumRectangle, SADSlotLargeBanner 에서만 사용됩니다.**

---
```objectivec
- (void)resumeAd
```
배너의 자동 갱신을 재개합니다.
**SADSlotBanner, SADSlotMediumRectangle, SADSlotLargeBanner 에서만 사용됩니다.**

---
```objectivec
- (void)stopAd
```
배너를 중지합니다.
**SADSlotBanner, SADSlotMediumRectangle, SADSlotLargeBanner 에서만 사용됩니다.**

---
```objectivec
- (void)closeAd
```
노출 중인 플로팅 광고를 닫습니다.
**SADSlotFloating 에서만 사용됩니다.**

### 기타 설정

```objectivec
id <SADDelegate> delegate;
```
광고 상태의 변경을 알려주는 프로토콜이 정의 된 딜리게이트
SADDelegate.h 참조

```objectivec
CGPoint position
```
광고뷰의 위치를 조정합니다. 위치조정의 기준뷰는 seedView입니다.

```objectivec
BOOL isTest
```
테스트용 ClientID로 광고 호출하기 위한 모드
YES : 테스트 서버, NO : 운영서버 (Default: NO)
** 앱을 배포하기 전 반드시 NO로 설정해주세요 **

---
```objectivec
- (void)setLogMode:(BOOL)isLogMode
```
SDK 로그를 On/Off 합니다.
> isLogMode : 로그 활성화 여부 (defailt : NO)

---
```objectivec
BOOL isReady
```
광고가 노출 될 준비가 됐는지 여부 (readyonly)

---
```objectivec
BOOL isValidState;
```
광고를 요청할 수 있는 상태인지 여부 (readyonly)

### Banner 상품 특화 옵션

```objectivec
CGFloat refreshInterval
```
새로운 광고를 요청하는 주기를 설정합니다.
> autoRefresh : 요청 주기 (default: 20)
> 
> | 값 | 설명 |
|:----|:----|
|0|새로운 광고를 요청하지 않습니다.|
|~15|15초 간격으로 새로운 광고를 요청합니다.|
|60~|60초 간격으로 새로운 광고를 요청합니다.|

---
```objectivec
BOOL useBackFillColor;
```
배너 배경색의 사용 여부를 On/Off 합니다.
> useBackFillColor : 배경색 사용 여부 (defailt : NO)

### Interstitial 특화 옵션

```objectivec
BOOL autoCloseWhenNoInteraction
```
광고 노출 후 사용자의 액션이 없을 시 5 초 후 광고를 자동으로 닫기 여부를 설정합니다. (defailt : NO)

---
```objectivec
BOOL autoCloseAfterLeaveApplication
```
광고 클릭 후 랜딩페이지로 이동 시 광고를 자동으로 닫기 여부를 설정합니다. (defailt : NO)

### Floating 특화 옵션

```objectivec
NSInteger autoClose
```
플로팅 광고를 자동으로 닫는 시간을 설정합니다.
> autoClose : 시간 (defailt : 0)
> 
> | 값 | 설명 |
|:----|:----|
|0|자동으로 닫지 않습니다.|
|~5|5초 후 닫습니다.|
|10~|10초 후 닫습니다.|

---
### Callbacks
```objectivec
- (void)sadOnAdWillReceive:(SADCore *)sadCore
```
광고를 요청하기 직전에 호출됩니다.

```objectivec
- (void)sadOnAdReceived:(SADCore *)sadCore
```
광고의 수신을 완료하면 호출됩니다.

```objectivec
- (void)sadOnAdWillLoad:(SADCore *)sadCore
```
광고를 로드할 때 호출됩니다.

```objectivec
- (void)sadOnAdLoaded:(SADCore *)sadCore
```
광고의 로드를 완료하면 호출됩니다.

```objectivec
- (void)sadOnAdClosed:(SADCore *)sadCore byUser:(BOOL)value;
```
플로팅 광고가 닫힐 때 호출됩니다.
> value : 사용자가 닫은 여부

```objectivec
- (void)sadOnAdExpanded:(SADCore *)sadCore
```
광고의 확장이 완료되면 호출됩니다.

```objectivec
- (void)sadOnAdExpandClose:(SADCore *)sadCore
```
확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)sadOnAdResized:(SADCore *)sadCore
```
광고의 부분확장이 완료되면 호출됩니다.

```objectivec
- (void)sadOnAdResizeClosed:(SADCore *)sadCore
```
부분확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)sadOnAdResizeClosed:(SADCore *)sadCore
```
부분확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)willShowModal:(SADCore *)sadCore
```
새로운 화면으로 가려질 때 호출됩니다.

```objectivec
- (void)willDismissModal:(SADCore *)sadCore
```
가려진 화면이 사라질 때 호출됩니다.

```objectivec
- (void)didDismissModal:(SADCore *)sadCore
```
가려진 화면이 사라지고 난 후 호출됩니다.

```objectivec
- (void)willLeaveApplication:(SADCore *)sadCore
```
다른 앱으로 이동 시에 호출됩니다.

```objectivec
- (void)sadCore:(SADCore *)sadCore sadOnAdFailed:(SADErrorCode)errorCode
```
에러가 발생 시 호출됩니다.
