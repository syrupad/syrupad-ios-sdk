//
//  ViewController.swift
//  SyrupAdSample-swift
//
//  Created by SKplanet on 2016. 8. 21..
//  Copyright © 2016년 SKplanet. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    var tadBanner: TadBanner!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        tadBanner = TadBanner.init(seedViewController: self)
        tadBanner.seedView = self.view
        tadBanner.clientID = "IXT002001"
        tadBanner.slotNo = TadSlotBanner
        tadBanner.isTest = true
        tadBanner.getAdvertisement()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

