//
//  TadDType.h
//
//  Syrup Ad SDK For iOS
//  Copyright © 2016 SKplanet. All rights reserved.
//

// 슬롯 설정
typedef enum {
    TadSlotNone = 0,
    TadSlotBanner = 2,
    TadSlotInterstitial = 3,
    TadSlotFloating100 = 4,
    TadSlotFloating150 = 101,
    TadSlotFloating = 103,
    TadSlotMediumRectangle = 5,
    TadSlotLargeBanner = 6
} TadSlot;

typedef enum {
    NO_AD,                              // 광고 서버에서 송출 가능한 광고가 없는 경우
    MISSING_REQUIRED_PARAMETER_ERROR,   // 필수 파라메터 누락된 경우
    INVAILD_PARAMETER_ERROR,            // 잘못된 파라메터인 경우
    UNSUPPORTED_DEVICE_ERROR,           // 미지원 단말인 경우
    CLIENTID_DENIED_ERROR,              // 지정한 Client ID가 유효하지 않은 경우
    INVAILD_SLOT_NUMBER,                // 지정한 슬롯 번호가 유효하지 않은 경우
    CONNECTION_ERROR,                   // 네트워크 연결이 가능하지 않은 경우
    NETWORK_ERROR,                      // 광고의 수신 및 로딩 과정에서 네트워크 오류가 발생한 경우
    RECEIVE_AD_ERROR,                   // 광고를 수신하는 과정에서 에러가 발생한 경우
    LOAD_ERROR,                         // SDK에서 허용하는 시간 내에 광고를 재요청한 경우
    SHOW_ERROR,                         // 노출할 광고가 없는 경우
    INTERNAL_ERROR,                     // 광고의 수신 및 로딩 과정에서 내부적으로 오류가 발생한 경우
    ALREADY_SHOWN,                      // 이미 광고가 표시되어있는 경우(플로팅)
    NOT_LOAD_AD,                        // 로드된 광고가 없을경우.
    UNKNOWN_SEEDVIEWCONTROLLER,         // 부모뷰컨트롤러가 없을 경우.
    INVALID_REQUEST                     // 비정상적인 요청인 경우.
} TadErrorCode;