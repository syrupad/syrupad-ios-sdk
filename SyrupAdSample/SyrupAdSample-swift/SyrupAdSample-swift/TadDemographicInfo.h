//
//  TadDemographicInfo.h
//
//  Syrup Ad SDK For iOS
//  Copyright © 2016 SKplanet. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 이 클래스는 광고를 요청할 때, 사용자 타게팅 정보 입력을 위한 클래스입니다.
 이 클래스의 인스턴스를 생성하여 광고를 요청할 때 함께 보내주세요.
 SADBanner의 getAdvertisement: 참조
 */
@interface TadDemographicInfo : NSObject

/**
 *  타게팅을 위한 사용자 나이
 */
@property (strong, nonatomic, setter=setAge:, getter=age) NSString *u_age;

/**
 *  타게팅을 위한 사용자 생년월일
 */
@property (strong, nonatomic, setter=setBirthdayDate:, getter=birthdayDate) NSDate *u_birthdayDate;

/**
 *  타게팅을 위한 사용자 성별
 *  'M' or 'W'
 */
@property (strong, nonatomic, setter=setGender:, getter=gender) NSString *u_gender;

/**
 *  타게팅을 위한 사용자 keyword
 */
@property (strong, nonatomic, setter=setKeywords:, getter=keywords) NSString *u_keywords;

- (NSDictionary *)toDictionary;

@end
