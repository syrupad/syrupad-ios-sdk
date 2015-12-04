# Syrup Ad iOS SDK Guide

[TOC]

## 준비사항
1. Syrup Ad SDK를 통해 광고를 수신하기 위해서는 Client ID가 필요합니다. http://www.syrupad.co.kr 에서 매체 등록 후 Client ID를 발급 받으세요.
2. Syrup Ad SDK는 다음과 같은 개발환경에서 개발되었습니다.
| 항목 | 내용 |
|:----|:----|
|iOS Base SDK|iOS 9.0|
|iOS Deployment Target|4.3|
|Tested iOS Version|4.3 ~ 9.0|
|Tested iOS Device|iphone (3gs, 4, 4s, 5, 5s, 6, 6s), iPad2, new iPad, iPad Retina 디스플레이, iPad Air, iPad Air 2 iPad mini, iPad mini 2, iPad mini 3|
|Support Core|arm64, armv7, armv7s|
|MAC Development OS|OS X El Capatian|
|Xcode Version|Xcode 7.1.1|
3. Syrup Ad SDK는 다음과 같은 광고 사이즈를 제공합니다.
| 슬롯 | 사이즈 |
|:----|:----|
|TadSlotBanner|320x50|
|TadSlotInterstitial|full-screen|
|TadSlotFloating|100x100|
|TadSlotMediumRectangle|300x250|
|TadSlotLargeBanner|320x100|

## 주의사항
1. 화면의 최상위 view에 banner가 배치되어야 합니다.
최상위 view에 banner가 배치되지 않을 경우 검수 과정에서 반려 사유가 될 수 있습니다.
Syrup Ad SDK 에서 제공하는 bringSubviewToFront: 메소드를 사용하여 최상위 view로 설정 할 수 있습니다.
2. Syrup Ad SDK를 적용한 window에 root view controller 속성이 있어야 합니다.
3. 한 개의 화면에 TadCore instance 한 개만을 사용해야 합니다.
동일 화면에 여러개의 TadCore instance를 사용하는 경우 비정상적인 동작을 할 수 있습니다.
4. 애플리케이션을 AppStore에 배포할 시에는 (BOOL)isTest 값을 반드시 NO로 설정해 주어야 합니다.
5. AppStore 배포 시에 아래와 같이 IDFA 사용여부를 Yes로 체크해 주시기 바랍니다.
<그림>
6. iOS 9 이상의 버전에는 앱과 웹 서비스 간 연결 보안을 강화하는ATS(App Transport Security) 가적용됩니다.
ATS가 적용된 후에는 암호화된 HTTPS 방식만 허용되기에, 기존에 사용하던 HTTP 방식을 사용할 경우 OS에서 강제 차단되어 광고가 노출되지 않을 수있으니 하단 의 내용을 info.plist 파일에 적용해 주시기 바랍니다.
```objectivec
NSAppTransportSecurity NSAllowsArbitraryLoads 
```
==ATS(App Transport Security)에 대한 상세 내용은 App Transport Security Technote 를 참고 해주시기 바랍니다. ==

## Step I. Syrup Ad SDK integration

### Add SDK to Project
프로젝트 폴더에 다음의 파일들을 복사합니다.
> TadCore.h
> libTadCore.a
> TadBundle

<그림>

XCode 상에서 파일을 추가 할 폴더에 우측 클릭 후 Add Files to “...” 를 선택합니다.
<그림>

복사한 파일을 선택 후 Add를 선택합니다.
<그림>

###Link Option
Xcode Project Navigation에서 프로젝트를 선택한 후, Build Phases에서 아래와 같이 라이브러리 파일을 추가합니다.
<그림>

###Add Framework
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
<그림>

## 구현가이드
###선언부
<그림>
1. 헤더파일 첨부
```objectivec
#import "TadCore.h"
```
2. TadCoreDelegate 지정
```objectivec
@interface BaseViewController : UIViewController <TadDelegate, UIActionSheetDelegate, UIAlertViewDelegate, UIActionSheetDelegate>
```
3. SDK 인스턴스 선언
```objectivec
TadCore *tadCore;
```

###구현부
<그림>
1. 초기화
```objectivec
-(id) initWithData:(TadDataInfo *) data nibName:(NSString *) nib
{
    if (self = [super initWithNibNAme:nib bundle:nil]) {
        // TadCore 초기화
        TadCore *core = [[TadCore alloc] initWithSeedView:self.view delegate:self];
        [self setTadCore:core];
        [core release];
        
        self.tadData.slot = TadSlotNone;
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didRotate:)
            name:UIDeviceOrientationDidChangeNotification object:nul];
    }
    return self;
}
```

2. viewWillAppear, viewWillDisappear 호출
광고 뷰를 가진 컨트롤러에서 viewWillAppear, viewWillDisappear를 반드시 호출하여야 합니다.
```objectivec
-(void) viewWillAppear:(BOOL)animated) {
    [tadCore viewWillAppear:animated];
    [super viewWillAppear:animated];
}
```
```objectivec
-(void)viewWillDisappear:(BOOL)animated {
    [tadCore viewWillDisappear:animated];
    [super viewWillDisappear:animated];
}
```

3. 광고 제거
광고의 제거가 필요한 경우나 광고가 포함된 뷰가 종료될 때에는 destroyAd를 반드시 호출하여야 합니다.
```objectivec
[self.tadCore destroyAd];
```

#### Banner
```objectivec
[self.tadCore setSeedViewController:self];
[self.tadCore setClientID:@"IXT002001"];
[self.tadCore setSlotNo:TadSlotBanner];
[self.tadCore setUseBackFillColor:YES];

if ([[[UIDevice currentDevice] systemVersion] floatValue] < 7.0) {
    [self.tadCore setOffset:CGPointMake(0.0f, 0)];
} else {
    [self.tadCore setOffset:CGPointMake(0.0f, 65)];
}

[self.tadCore getAdvertisement];
```

#### Interstitial
```objectivec
[self.tadCore setSeedViewController:self];
[self.tadCore setClientID:@"IXT003001"];
[self.tadCore setSlotNo:TadSlotInterstitial];
[self.tadCore setUseBackFillColor:YES];
[self.tadCore setAutoCloseWhenNoInteraction:NO];
[self.tadCore setAutoCloseAfterLeaveApplication:NO];
[self.tadCore getAdvertisement];
```

#### Floating
```objectivec
[self.tadCore setSeedViewController:self];
[self.tadCore setClientID:@"IXT103001"];
[self.tadCore setSlotNo:TadSlotFloating];
[self.tadCore setAutoClose:NO];

if ([[[UIDevice currentDevice] systemVersion] floatValue] < 7.0) {
    [self.tadCore setPosition:CGPointMake(0.0f, 0)];
} else {
    [self.tadCore setPosition:CGPointMake(0.0f, 65)];
}

[self.tadCore getAdvertisement];
```

##헤더파일
TadCore.h 헤더 파일에는 Syrup Ad SDK 를 사용하기 위한 설정, 메소드 등이 정의 되어 있습니다.

###Constants
####TadSlot
```objectivec
TadSlotNone
TadSlotBanner                       // 320x50  사이즈를 가지는 배너 광고를 의미합니다.
TadSlotInterstitial                 // 320x480 사이즈를 가지는 전면 광고를 의미합니다.
TadSlotFloating                     // 100x100 사이즈를 가지는 플로팅 광고를 의미합니다.
TadSlotMediumRectangle              // 300x250 사이즈를 가지는 배너 광고를 의미합니다.
TadSlotLargeBanner                  // 320x100 사이즈를 가지는 배너 광고를 의미합니다.
```
####TadErrorCode
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
```

###Methods
```objectivec
- (id)initWithSeedView:(UIView *)aSeedView delegate:(id <TadDelegate>)aDelegate
```
SDK 를 초기화하고 구동을 준비합니다.
> aSeedView : 광고를 배치할 뷰
> aDelegate : 콜백을 처리할 딜리게이트

```objectivec
- (void)setSeedViewController : ( UIViewController *) seedViewController
```
광고주 페이지로 이동이 될 때 modal 의 기반이 되는 view controller 를 설정합니다.
==반드시 설정해야 합니다.==
> seedViewController : 뷰 컨트롤

```objectivec
- (void)setSeedView : ( UIView *) seedView
```
광고를 배치할 뷰를 지정합니다.
==반드시 설정해야 합니다.==
> seedView : 광고를 배치할 뷰

```objectivec
- (void)bringSubviewToFront:(UIView *)view
```
광고 뷰를 지정한 뷰의 최상위 뷰로 이동시킵니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==
> view : 광고를 배치할 뷰

```objectivec
- (void)viewWillAppear:(BOOL)animated
```
==광고 뷰를 가진 컨트롤러의 viewWillAppear에서 반드시 호출해 주어야 합니다.==

```objectivec
- (void)viewWillDisappear:(BOOL)animated
```
==광고 뷰를 가진 컨트롤러의 viewWillDisappear에서 반드시 호출해 주어야 합니다.==

```objectivec
- (void)setClientID : (NSString *) clientID
```
매체 등록 시 발급 받은 클라이언트 아이디를 지정합니다.
> clientID : 클라이언트 아이디

```objectivec
- (void)setSlotNo: (TadSlot) slotNo
```
광고 슬롯을 지정합니다.
> slotNo : 광고 슬롯
> 
| 슬롯 | 사이즈 |
|:----|:----|
|TadSlotBanner|320x50|
|TadSlotInterstitial|full-screen|
|TadSlotFloating|100x100|
|TadSlotMediumRectangle|300x250|
|TadSlotLargeBanner|320x100|

```objectivec
- (void)setOffset: (CGPOINT) offset
```
광고 위치의 오프셋을 조정합니다. 오프셋의 기준은 SeedView 입니다.
> offset : 오프셋 좌표

```objectivec
- (void)setPosition: (CGPOINT) offset
```
플로팅 광고 위치의 오프셋을 조정합니다. 오프셋의 기준은 SeedView 입니다.
==TadSlotFloating 에서만 사용됩니다.==
> offset : 오프셋 좌표

```objectivec
- (void)setAutoRefresh: (NSString *) autoRefresh
```
새로운 광고를 요청하는 주기를 설정합니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==
> autoRefresh : 요청 주기 (default: 20)
> 
> | 값 | 설명 |
|:----|:----|
|0|새로운 광고를 요청하지 않습니다.|
|~15|15초 간격으로 새로운 광고를 요청합니다.|
|60~|60초 간격으로 새로운 광고를 요청합니다.|

```objectivec
- (void)setUseBackFillColor: (BOOL) useBackFillColor
```
배너 배경색의 사용 여부를 On/Off 합니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==
> useBackFillColor : 배경색 사용 여부 (defailt : NO)

```objectivec
- (void)setAutoCloseWhenNoInteraction: (BOOL) autoCloseWhenNoInteraction
```
광고 노출 후 사용자의 액션이 없을 시 5 초 후 광고를 자동으로 닫기 여부를 설정합니다.
==TadSlotInterstitial 에서만 사용됩니다.==
> autoCloseWhenNoInteraction : 자동 닫기 여부 (defailt : NO)

```objectivec
- (void)setAutoCloseAfterLeaveApplication:  (BOOL)  autoCloseAfterLeaveApplication
```
광고 클릭 후 랜딩페이지로 이동 시 광고를 자동으로 닫기 여부를 설정합니다.
==TadSlotInterstitial 에서만 사용됩니다.==
> autoCloseAfterLeaveApplication : 자동 닫기 여부 (defailt : NO)

```objectivec
- (void)setAutoClose: (int) autoClose
```
플로팅 광고를 자동으로 닫는 시간을 설정합니다.
==TadSlotFloating 에서만 사용됩니다.==
> autoClose : 시간 (defailt : NO)
> 
> | 값 | 설명 |
|:----|:----|
|0|자동으로 닫지 않습니다.|
|~5|5초 후 닫습니다.|
|10~|10초 후 닫습니다.|

```objectivec
- (void)setLogMode:(BOOL)isLogMode
```
SDK 로그를 On/Off 합니다.
> isLogMode : 로그 활성화 여부 (defailt : NO)

```objectivec
- (void)getAdvertisement:(TadDemographicInfo *)info
```
새로운 광고를 요청합니다.
==반드시 초기화 이후에 호출해야 합니다.==
> info : demographics 정보

```objectivec
- (void)showAd
```
수신한 광고를 노출합니다.
==TadSlotInterstitial 에서만 사용됩니다.==

```objectivec
- (void)pauseAd
```
배너의 자동 갱신을 정지합니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==

```objectivec
- (void)resumeAd
```
배너의 자동 갱신을 재개합니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==

```objectivec
- (void)stopAd
```
배너를 중지합니다.
==TadSlotBanner, TadSlotMediumRectangle, TadSlotLargeBanner 에서만 사용됩니다.==

```objectivec
- (void)closeAd
```
노출 중인 플로팅 광고를 닫습니다.
==TadSlotFloating 에서만 사용됩니다.==

```objectivec
- (void)destroyAd
```
노출 중인 광고를 화면에서 제거합니다.

### Callbacks
```objectivec
- (void)tadOnAdWillReceive:(TadCore *)tadCore
```
광고를 요청하기 직전에 호출됩니다.

```objectivec
- (void)tadOnAdReceived:(TadCore *)tadCore
```
광고의 수신을 완료하면 호출됩니다.

```objectivec
- (void)tadOnAdWillLoad:(TadCore *)tadCore
```
광고를 로드할 때 호출됩니다.

```objectivec
- (void)tadOnAdLoaded:(TadCore *)tadCore
```
광고의 로드를 완료하면 호출됩니다.

```objectivec
- (void)tadOnAdClosed:(TadCore *)tadCore byUser:(BOOL)value;
```
플로팅 광고가 닫힐 때 호출됩니다.
> value : 사용자가 닫은 여부

```objectivec
- (void)tadOnAdExpanded:(TadCore *)tadCore
```
광고의 확장이 완료되면 호출됩니다.

```objectivec
- (void)tadOnAdExpandClose:(TadCore *)tadCore
```
확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)tadOnAdResized:(TadCore *)tadCore
```
광고의 부분확장이 완료되면 호출됩니다.

```objectivec
- (void)tadOnAdResizeClosed:(TadCore *)tadCore
```
부분확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)tadOnAdResizeClosed:(TadCore *)tadCore
```
부분확장된 광고가 닫힐 때 호출됩니다.

```objectivec
- (void)willShowModal:(TadCore *)tadCore
```
새로운 화면으로 가려질 때 호출됩니다.

```objectivec
- (void)willDismissModal:(TadCore *)tadCore
```
가려진 화면이 사라질 때 호출됩니다.

```objectivec
- (void)didDismissModal:(TadCore *)tadCore
```
가려진 화면이 사라지고 난 후 호출됩니다.

```objectivec
- (void)willLeaveApplication:(TadCore *)tadCore
```
다른 앱으로 이동 시에 호출됩니다.

```objectivec
- (void)tadCore:(TadCore *)tadCore tadOnAdFailed:(TadErrorCode)errorCode
```
에러가 발생 시 호출됩니다.
