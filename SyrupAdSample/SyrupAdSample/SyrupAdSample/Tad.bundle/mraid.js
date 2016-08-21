
(function() {
 var isIOS = (/iphone|ipad|ipod/i).test(window.navigator.userAgent.toLowerCase());
 if (isIOS) {
 console = {};
 
 console.log = function(log) {
 var iframe = document.createElement('iframe');
 iframe.setAttribute('src', 'ios-log: ' + log);
 document.documentElement.appendChild(iframe);
 iframe.parentNode.removeChild(iframe);
 iframe = null;
 };
 console.debug = console.info = console.warn = console.error = console.log;
 }
 }());

(function() {
 // Establish the root mraidbridge object.
 var mraidbridge = window.mraidbridge = {};
 
 //var state = window.mraid.state;
 
 // Listeners for bridge events.
 var listeners = {};
 
 // Queue to track pending calls to the native SDK.
 var nativeCallQueue = [];
 
 // Whether a native call is currently in progress.
 var nativeCallInFlight = false;
 
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 mraidbridge.fireReadyEvent = function() {
 mraidbridge.fireEvent('ready');
 
 };
 
 mraidbridge.fireChangeEvent = function(properties) {
 mraidbridge.fireEvent('change', properties);
 };
 
 mraidbridge.fireErrorEvent = function(message, action) {
 mraidbridge.fireEvent('error', message, action);
 };
 
 mraidbridge.fireEvent = function(type) {
 console.log("fireEvent: " + type);
 
 var ls = listeners[type];
 
 if (ls) {
 //console.log("find handler - " + type + " handler: " + ls);
 console.log("find handler - [" + type + "]");
 var args = Array.prototype.slice.call(arguments);
 args.shift();
 var l = ls.length;
 for (var i = 0; i < l; i++) {
 ls[i].apply(null, args);
 }
 }else{ console.log("event handler not found");}
 };
 
 mraidbridge.nativeCallComplete = function(command) {
 if (nativeCallQueue.length === 0) {
 nativeCallInFlight = false;
 return;
 }
 
 mraidbridge.clearQueue = function() {
 
 nativeCallQueue = [];
 nativeCallInFlight = false;
 console.log("clearQueue");
 }
 
 var nextCall = nativeCallQueue.pop();
 console.log ("nativeCallQueue.pop()");
console.log("1");
 window.location = nextCall;
 };
 
 mraidbridge.executeNativeCall = function(command) {
 var call = 'mraid://' + command;
 
 var key, value;
 var isFirstArgument = true;
 
 for (var i = 1; i < arguments.length; i += 2) {
 key = arguments[i];
 value = arguments[i + 1];
 
 if (value === null) continue;
 
 if (isFirstArgument) {
 call += '?';
 isFirstArgument = false;
 } else {
 call += '&';
 }

 call += key + '=' + encodeURIComponent(value);
 }
 
 if (nativeCallInFlight) {
 console.log("nativeCallInFlight");
 nativeCallQueue.push(call);
 } else {
 nativeCallInFlight = true;
 window.location = call;
 console.log("2");
 }
 };
 
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 mraidbridge.addEventListener = function(event, listener) {
 //console.log("mraidbridge add event - event: [" + event + "] listener: [" + listener + "]");
 console.log("mraidbridge add event - event: [" + event + "]");
 var eventListeners;
 listeners[event] = listeners[event] || [];
 eventListeners = listeners[event];
 
 for (var l in eventListeners) {
 // Listener already registered, so no need to add it.
 if (listener === l) return;
 }
 
 eventListeners.push(listener);
 };
 
 mraidbridge.removeEventListener = function(event, listener) {
 console.log("mraidbridge remove event - event: " + event + "listener: " + listener);
 if (listeners.hasOwnProperty(event)) {
 var eventListeners = listeners[event];
 if (eventListeners) {
 var idx = eventListeners.indexOf(listener);
 if (idx !== -1) {
 eventListeners.splice(idx, 1);
 }
 }
 }
 };
 }());

//alert('start mraid method');
(function() {
 //  var mraid = window.mraid = {};
 //var tad = window.tad = {};
 var mraid = window.mraid = window.ormma = {};
 //var mraid = window.mraid = window.ormma = window.tad = {};
 var bridge = window.mraidbridge;
 
 // Constants. ////////////////////////////////////////////////////////////////////////////////////
 
 var VERSION = mraid.VERSION = '2.0';
 
 var STATES = mraid.STATES = {
 LOADING: 'loading',     // Initial state.
 DEFAULT: 'default',
 EXPANDED: 'expanded',
 HIDDEN: 'hidden',
 RESIZED: 'resized'
 };
 
 var EVENTS = mraid.EVENTS = {
 ERROR: 'error',
 INFO: 'info',
 READY: 'ready',
 STATECHANGE: 'stateChange',
 SIZECHANGE: 'sizeChange',
 VIEWABLECHANGE: 'viewableChange'
 };
 
 var PLACEMENT_TYPES = mraid.PLACEMENT_TYPES = {
 UNKNOWN: 'unknown',
 INLINE: 'inline',
 INTERSTITIAL: 'interstitial'
 };
 
 // External MRAID state: may be directly or indirectly modified by the ad JS. ////////////////////
 
 // Properties which define the behavior of an expandable ad.
 var expandProperties = {
 width: -1,
 height: -1,
 useCustomClose: false,
 isModal: true,
 //        allowOrientationChange : true, //TODO
 //        forceOrientation : 'none' //TODO
 lockOrientation: false
 };
 
 var resizeProperties = {
 width : -1,
 height : -1,
 customClosePosition : 'top-right',
 offsetX : 0,
 offsetY : 0,
 allowOffscreen : true
 };
 
 var orientationProperties = {
 allowOrientationChange: true,
 forceOrientation: 'none'
 };
 
 var defaultPosition = {
 x : 0,
 y : 0,
 width : 0,
 height : 0
 };
 
 //TODO
 //expand에서도 사용하는지.. 전역변수로 두어야 하나
 //size 와 어떻게 연결시키나?
 var currentPosition = {
 x : 0,
 y : 0,
 width : 0,
 height : 0
 };
 
 var hasSetCustomSize = false;
 
 var hasSetCustomClose = false;
 
 var listeners = {};
 
 // Internal MRAID state. Modified by the native SDK. /////////////////////////////////////////////
 
 //  var state = STATES.LOADING; //test
 var state = STATES.DEFAULT; //test
 
 var size = { width: -1, height: -1 }; //TODO sizeChange event 관련 내용
 
 var isViewable = false;
 
 var screenSize = { width: -1, height: -1 };
 
 var placementType = PLACEMENT_TYPES.UNKNOWN;
 
 
 
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 var EventListeners = function(event) {
 this.event = event;
 this.count = 0;
 var listeners = {};
 
 this.add = function(func) {
 var id = String(func);
 if (!listeners[id]) {
 listeners[id] = func;
 this.count++;
 }
 };
 
 this.remove = function(func) {
 var id = String(func);
 if (listeners[id]) {
 listeners[id] = null;
 delete listeners[id];
 this.count--;
 return true;
 } else {
 return false;
 }
 };
 
 this.removeAll = function() {
 for (var id in listeners) {
 if (listeners.hasOwnProperty(id)) this.remove(listeners[id]);
 }
 };
 
 this.broadcast = function(args) {
 for (var id in listeners) {
 if (listeners.hasOwnProperty(id)) listeners[id].apply({}, args);
 }
 };
 
 this.toString = function() {
 var out = [event, ':'];
 for (var id in listeners) {
 if (listeners.hasOwnProperty(id)) out.push('|', id, '|');
 }
 return out.join('');
 };
 };
 
 var broadcastEvent = function() {
 var args = new Array(arguments.length);
 var l = arguments.length;
 for (var i = 0; i < l; i++) args[i] = arguments[i];
 var event = args.shift();
 if (listeners[event]) listeners[event].broadcast(args);
 };
 
 var contains = function(value, array) {
 for (var i in array) {
 if (array[i] === value) return true;
 }
 return false;
 };
 
 var clone = function(obj) {
 if (obj === null) return null;
 var f = function() {};
 f.prototype = obj;
 return new f();
 };
 
 var stringify = function(obj) {
 if (typeof obj === 'object') {
 var out = [];
 if (obj.push) {
 // Array.
 for (var p in obj) out.push(obj[p]);
 return '[' + out.join(',') + ']';
 } else {
 // Other object.
 for (var p in obj) {
 if (typeof obj[p] === 'object') {
 out.push('"' + p + '": ' + stringify(obj[p]));
 } else if (typeof obj[p] === 'string') {
 out.push('"' + p + '": "' + obj[p] + '"');
 } else {
 out.push('"' + p + '": ' + obj[p]);
 }
 
 }
 return '{' + out.join(',') + '}';
 }
 } else return String(obj);
 };
 
 var trim = function(str) {
 return str.replace(/^\s+|\s+$/g, '');
 };
 
 // Functions that will be invoked by the native SDK whenever a "change" event occurs.
 var changeHandlers = {
 state: function(val) {
 if (state === STATES.LOADING) {
 broadcastEvent(EVENTS.INFO, 'Native SDK initialized.');
 }
 state = val;
 broadcastEvent(EVENTS.INFO, 'Set state to ' + stringify(val));
 broadcastEvent(EVENTS.STATECHANGE, state);
 },
 
 //TODO
 size : function(val) {
 size = val;
 console.log('sizeChange : ');
 broadcastEvent(EVENTS.INFO, 'Set size to ' + stringify(val));
 broadcastEvent(EVENTS.SIZECHANGE, size.width, size.height);
 },
 
 viewable: function(val) {
 isViewable = val;
 broadcastEvent(EVENTS.INFO, 'Set isViewable to ' + stringify(val));
 broadcastEvent(EVENTS.VIEWABLECHANGE, isViewable);
 },
 
 placementType: function(val) {
 broadcastEvent(EVENTS.INFO, 'Set placementType to ' + stringify(val));
 placementType = val;
 },
 
 screenSize: function(val) {
 broadcastEvent(EVENTS.INFO, 'Set screenSize to ' + stringify(val));
 for (var key in val) {
 if (val.hasOwnProperty(key)) screenSize[key] = val[key];
 }
 
 if (!hasSetCustomSize) {
 expandProperties['width'] = screenSize['width'];
 expandProperties['height'] = screenSize['height'];
 }
 },
 
 expandProperties: function(val) {
 broadcastEvent(EVENTS.INFO, 'Merging expandProperties with ' + stringify(val));
 for (var key in val) {
 if (val.hasOwnProperty(key)) expandProperties[key] = val[key];
 }
 }
 };
 
 var validate = function(obj, validators, action, merge) {
 if (!merge) {
 // Check to see if any required properties are missing.
 if (obj === null) {
 broadcastEvent(EVENTS.ERROR, 'Required object not provided.', action);
 return false;
 } else {
 for (var i in validators) {
 if (validators.hasOwnProperty(i) && obj[i] === undefined) {
 broadcastEvent(EVENTS.ERROR, 'Object is missing required property: ' + i + '.', action);
 return false;
 }
 }
 }
 }
 
 for (var prop in obj) {
 var validator = validators[prop];
 var value = obj[prop];
 if (validator && !validator(value)) {
 // Failed validation.
 broadcastEvent(EVENTS.ERROR, 'Value of property ' + prop + ' is invalid.',
                action);
 return false;
 }
 }
 return true;
 };
 
 var expandPropertyValidators = {
 width: function(v) { return !isNaN(v) && v >= 0; },
 height: function(v) { return !isNaN(v) && v >= 0; },
 useCustomClose: function(v) { return (typeof v === 'boolean'); },
 lockOrientation: function(v) { return (typeof v === 'boolean'); }
 };
 
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 bridge.addEventListener('change', function(properties) {
                         for (var p in properties) {
                         if (properties.hasOwnProperty(p)) {
                         var handler = changeHandlers[p];
                         handler(properties[p]);
                         }
                         }
                         });
 
 bridge.addEventListener('error', function(message, action) {
                         broadcastEvent(EVENTS.ERROR, message, action);
                         });
 
 bridge.addEventListener('ready', function() {
                         broadcastEvent(EVENTS.READY);
                         });
 
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 mraid.addEventListener = function(event, listener) {
 //console.log("MRAID addEventListener - event: " + event + " listener: " + listener);
 console.log("MRAID addEventListener - event: [" + event);
 
 if (!event || !listener) {
 broadcastEvent(EVENTS.ERROR, 'Both event and listener are required.', 'addEventListener');
 } else if (!contains(event, EVENTS)) {
 broadcastEvent(EVENTS.ERROR, 'Unknown MRAID event: ' + event, 'addEventListener');
 } else {
 if (!listeners[event]) listeners[event] = new EventListeners(event);
 listeners[event].add(listener);
 }
 };
 
 mraid.close = function() {
 if (state === STATES.DEFAULT || state === STATES.EXPANDED || state === STATES.RESIZED) {
 bridge.executeNativeCall('close');
 } else if (state === STATES.HIDDEN) {
 //            broadcastEvent(EVENTS.ERROR, 'Ad cannot be closed when it is already hidden.', 'close');
 }
 };
 
 mraid.expand = function(URL) {
 console.log("mraid.expand()");
 
 if (state === STATES.DEFAULT || state === STATES.RESIZED) {
 var args = ['expand'];
 
 if (hasSetCustomClose) {
 args = args.concat(['shouldUseCustomClose', expandProperties.useCustomClose ? 'true' : 'false']);
 }
 
 if (hasSetCustomSize) {
 if (expandProperties.width >= 0 && expandProperties.height >= 0) {
 args = args.concat(['w', expandProperties.width, 'h', expandProperties.height]);
 }
 }
 
 if (typeof expandProperties.lockOrientation !== 'undefined') {
 args = args.concat(['lockOrientation', expandProperties.lockOrientation]);
 }
 
 if (URL) {
 args = args.concat(['url', URL]);
 }
 
 bridge.executeNativeCall.apply(this, args);
 } else {
 //            broadcastEvent(EVENTS.ERROR, 'Ad cannot be expanded from this state.', 'state');
 }
 };
 
 mraid.resize = function() {
 console.log("mraid.resize");
 
 console.log("111 " + resizeProperties.width);
 if (resizeProperties.width === 'undefined' || resizeProperties.height === 'undefined' ||
     resizeProperties.width < 0 || resizeProperties.height < 0)
 {
 broadcastEvent(EVENTS.ERROR, 'resizeProperties must be set', 'resize');
 return;
 }
 
 if (state === STATES.DEFAULT || state === STATES.RESIZED) {
 //TODO 현재 화면사이즈보다 큰 영역을 사용해야 할 경우 에러 리턴 - 네이티브의 역할인가?
 var args = ['resize'];
 
 //            args = args.concat(['width', resizeProperties.width]);
 //            args = args.concat(['height', resizeProperties.height]);
 args = args.concat(['w', resizeProperties.width]);
 args = args.concat(['h', resizeProperties.height]);
 
 
 if (resizeProperties.customClosePosition !== 'undefined') {
 args = args.concat(['customClosePosition', resizeProperties.customClosePosition]);
 }
 
 if (resizeProperties.offsetX !== 'undefined') {
 args = args.concat(['offsetX', resizeProperties.offsetX]);
 }
 
 if (resizeProperties.offsetY !== 'undefined') {
 args = args.concat(['offsetY', resizeProperties.offsetY]);
 }
 
 if (resizeProperties.allowOffscreen !== 'undefined') {
 args = args.concat(['allowOffscreen', resizeProperties.offsetY]);
 }
 
 bridge.executeNativeCall.apply(this, args);
 } else if (state === STATES.EXPANDED) {
 broadcastEvent(EVENTS.ERROR, 'Ad cannot be resized from expanded state', 'resize');
 }
 };
 
 mraid.getExpandProperties = function() {
 var properties = {
 width: expandProperties.width,
 height: expandProperties.height,
 useCustomClose: expandProperties.useCustomClose,
 isModal: expandProperties.isModal
 };
 
 return properties;
 };
 
 mraid.getResizeProperties = function() {
 var properties = {
 width : resizeProperties.width,
 height : resizeProperties.height,
 customClosePosition : resizeProperties.customClosePosition,
 offsetX : resizeProperties.offsetX,
 offsetY : resizeProperties.offsetY,
 allowOffscreen : resizeProperties.allowOffscreen
 };
 return properties;
 };
 
 mraid.getPlacementType = function() {
 return placementType;
 };
 
 mraid.getState = function() {
 console.log("get Status :" + state);
 return state;
 };
 
 mraid.getVersion = function() {
 console.log("getVersion :" + mraid.VERSION);
 return mraid.VERSION;
 };
 
 mraid.isViewable = function() {
 console.log("isViewable :" + isViewable);
 return isViewable;
 };
 
 mraid.open = function(URL) {
 console.log("open :" + URL);
 if (!URL) broadcastEvent(EVENTS.ERROR, 'URL is required.', 'open');
 else bridge.executeNativeCall('open', 'url', URL);
 };
 
 mraid.removeEventListener = function(event, listener) {
 console.log("mraid remove event - event: " + event + "listener: " + listener);
 if (!event) broadcastEvent(EVENTS.ERROR, 'Event is required.', 'removeEventListener');
 else {
 if (listener && (!listeners[event] || !listeners[event].remove(listener))) {
 broadcastEvent(EVENTS.ERROR, 'Listener not currently registered for event.',
                'removeEventListener');
 return;
 } else if (listeners[event]) listeners[event].removeAll();
 
 if (listeners[event] && listeners[event].count === 0) {
 listeners[event] = null;
 delete listeners[event];
 }
 }
 };
 
 mraid.setExpandProperties = function(properties) {
 if (validate(properties, expandPropertyValidators, 'setExpandProperties', true)) {
 if (properties.hasOwnProperty('width') || properties.hasOwnProperty('height')) {
 hasSetCustomSize = true;
 }
 
 if (properties.hasOwnProperty('useCustomClose')) hasSetCustomClose = true;
 
 var desiredProperties = ['width', 'height', 'useCustomClose', 'lockOrientation'];
 var length = desiredProperties.length;
 for (var i = 0; i < length; i++) {
 var propname = desiredProperties[i];
 if (properties.hasOwnProperty(propname)) expandProperties[propname] = properties[propname];
 }
 }
 };
 
 mraid.useCustomClose = function(shouldUseCustomClose) {
 expandProperties.useCustomClose = shouldUseCustomClose;
 hasSetCustomClose = true;
 bridge.executeNativeCall('usecustomclose', 'shouldUseCustomClose', shouldUseCustomClose);
 };
 
 mraid.setResizeProperties = function(properties) {
 if (true) { //TODO validate
 var desiredProperties = ['width', 'height', 'customClosePosition', 'offsetX', 'offsetY', 'allowOffscreen'];
 var length = desiredProperties.length;
 for (var i = 0; i < length; i++) {
 var propname = desiredProperties[i];
 if (properties.hasOwnProperty(propname)) resizeProperties[propname] = properties[propname];
 }
 }
 };
 
 mraid.getCurrentPosition = function() {
 var position = {
 x : currentPosition.x,
 y : currentPosition.y,
 width : currentPosition.width,
 height : currentPosition.height
 };
 console.log("getCurrentPosition :" + position);
 return position;
 };
 
 mraid.getDefaultPosition = function() {
 return mraid.getCurrentPosition(); //TODO
 };
 
 mraid.getMaxSize = function() {
 //TODO screenSize 가 아닌 실제 픽셀을 리턴해야함
 //status bar 등 제외한 앱에서 사용 가능한 영역
 var size = {
 width : screenSize.width,
 heigth : screenSize.height
 };
 
 console.log("Width : " + screenSize.width);
 console.log("Height : " + screenSize.height);
 
 return size;
 };
 
 mraid.getScreenSize = function() {
 return mraid.getMaxSize(); //TODO hardware에서 제공하는 전체 스크린 사이즈를 pixel로 return, orientation 에 따라 다른 값을 return
 };
 
 mraid.playVideo = function(URL) {
 if (!URL) broadcastEvent(EVENTS.ERROR, 'URL is required.', 'playVideo');
 else bridge.executeNativeCall('playVideo', 'url', URL);
 };
 
 mraid.getOrientationProperties = function() {
 console.log("getOrientation is calling");
 console.log("allow:" + orientationProperties.allowOrientationChange);
 console.log("force:" + orientationProperties.forceOrientation);
 return mraid.orientationProperties;
 };
 
 mraid.setOrientationProperties = function(properties) {
 
 console.log("setOrientationProperties is Calling");
 
 console.log("allowOrientation:" + properties.allowOrientationChange);
 //         console.log("allowOrientation:" + properties.allowOrientation);
 console.log("forceOrientation:" + properties.forceOrientation);
 
 var args = ['setOrientation'];
 
 if (properties.hasOwnProperty('allowOrientationChange')) {
 //         if (properties.hasOwnProperty('allowOrientation')) {
 orientationProperties.allowOrientationChange = properties.allowOrientationChange;
 //              orientationProperties.allowOrientationChange = properties.allowOrientation;
 args = args.concat(['allowOrientationChange', orientationProperties.allowOrientationChange]);
 }
 
 if (properties.hasOwnProperty('forceOrientation')){
 orientationProperties.forceOrientation = properties.forceOrientation;
 args = args.concat(['forceOrientation', orientationProperties.forceOrientation]);
 }
 
 
 bridge.executeNativeCall.apply(this, args);
 };
 
 mraid.supports = function(feature)
 {
 console.log("support feature :" + feature.toLowerCase());
 
 if (feature.toLowerCase() == 'sms' ||
     feature.toLowerCase() == 'tel' ||
     feature.toLowerCase() == 'caledar' ||
     feature.toLowerCase() == 'storePicture' ||
     feature.toLowerCase() == 'inlinevideo')
 {
 return true;
 }else{
 return false;
 }
 };
 
 mraid.storePicture = function (url)
 {
 console.log("storePicture: " + url);
 
 var args = ['storePicture'];
 args = args.concat(['uri', url]);
 
 bridge.executeNativeCall.apply(this, args);
 };
 
 mraid.testMethod = function(obj)
 {
 console.log("testMethod :" + obj);
 };
 
 mraid.getLocalStr = function(UTCString) {
 
 var dt = new Date();
 // set date
 var param = UTCString.split('T');
 var dateStr = param[0];
 var dateParam = dateStr.split('-');
 dt.setUTCFullYear(dateParam[0]);
 dt.setUTCMonth(dateParam[1]-1);
 dt.setUTCDate(dateParam[2]);
 
 // set time
 var timeStr = param[1];
 var delem = '';
 if (timeStr.indexOf('-') !=-1) {
 delem = '-';
 } else if (timeStr.indexOf('+') !=-1) {
 delem = '+';
 }
 
 var offset = 0;
 var time;
 if (delem == '') {
 time = timeStr.split(':');
 } else {
 var timeParam = timeStr.split(delem);
 time = timeParam[0].split(':');
 }
 dt.setUTCHours(time[0]);
 dt.setUTCMinutes(time[1]);
 
 var millis = dt.getTime() - (dt.getTimezoneOffset()*60000);
 
 var s = (new Date(millis)).toISOString();
 
 return s.substring(0,16);

 };

 mraid.createCalendarEvent = function (obj)
 {
  console.log("createCalendarEvent - " + stringify(obj));
 obj.start = mraid.getLocalStr(obj.start);
 obj.end = mraid.getLocalStr(obj.end);
 console.log("createCalendarEvent - " + stringify(obj));
 bridge.executeNativeCall('createCalendarEvent', 'JSON', stringify(obj));
 };
 }());


(function() {
 var tad = window.tad = {};
 var bridge = window.mraidbridge;
 
 var CLIENT_ID;
 var DEVICE_ID;
 var IDFA_ID;
 var SDK_VERSION;
// var CANOPEN_FLAG;
 
 /**
  * This method allows the ad to confirm a basic feature set before display.
  * The version number corresponds with the API specification version and not a vendor's SDK version.
  * @param none
  * @returns {String} the API specification that this container is certified against
  */
 
 tad.getVersion = function() {
 console.log("tad getVersion :" + tad);
 return "1.0";
 };
 
 /**
  * The method will send an event to log server.
  * @param {String}  an event code for user action.
  * @returns none
  */
 tad.sendEventCode = function(action) {
 console.log("tad sendEventCode :" + action);
 bridge.executeNativeCall('sendEvent', 'event', action);
 };
 
 tad.downloadApplication = function(downloadInfo) {
 console.log("tad downloadApplication :" + tad.stringify(downloadInfo));
 bridge.executeNativeCall('downloadApp', 'JSON', tad.stringify(downloadInfo));
 };
 
 tad.runApplication = function(packageInfo, downloadInfo) {
 console.log("tad runApplication package:" + tad.stringify(packageInfo) + "downInfo:" + tad.stringify(downloadInfo));
 var runInfo = {
 android : packageInfo.android,
 ios : packageInfo.ios,
 tstore : downloadInfo.tstore,
 market : downloadInfo.market,
 itunes : downloadInfo.itunes,
 alternative : downloadInfo.alternative,
 };
 bridge.executeNativeCall('runApp', 'JSON', tad.stringify(runInfo));
 };
 
 tad.playVideo = function(url) {
 console.log("tad playVideo :" + url);
 bridge.executeNativeCall('playPlayer', 'url', url);
 };
 
 tad.playAudio = function(url) {
 console.log("tad playAudio :" + url);
 bridge.executeNativeCall('playAudio', 'url', url);
 };
 
 tad.openUrl = function(url){
 console.log("tad openUrl :" + url);
 bridge.executeNativeCall('openUrl', 'url', url);
 }
 
// tad.canOpenUri = function(properties, cons) {
// console.log("tad openUrl_______333 =>>>>> ");
// js_test = cons;
// 
// bridge.executeNativeCall('canOpenUri', 'properties', properties);
// };
 
// tad.canOpenUri = function(properties) {
// console.log("tad openUrl_______333 =>>>>> ");
//// window.location="jscall://callObjectiveCFromJavascript" + properties;
//// bridge.executeNativeCall('canOpenUri', 'properties', properties);
// return CANOPEN_FLAG;
// };
// 
// mraid.getPrecanOpenUri = function(properties) {
// console.log("tad openUrl_______111 =>>>>> " + properties);
// bridge.executeNativeCall('canOpenUri', 'properties', properties);
// };
// 
// mraid.getFixcanOpenUri = function(properties) {
// console.log("tad openUrl_______222 =>>>>> " + properties);
// 
//// js_test(properties);
// 
// CANOPEN_FLAG = properties;
// };
 
 tad.getClientId = function() {
 return CLIENT_ID;
 };
 
 mraid.getPreClientId = function(properties) {
 CLIENT_ID = properties;
 };

 tad.getDeviceId = function() {
 return DEVICE_ID;
 };
 
 mraid.getPreDeviceId = function(properties) {
 DEVICE_ID = properties;
 };
 
 tad.getAppleAdvertisingId = function() {
 return IDFA_ID;
 };
 
 mraid.getPreAppleAdvertisingId = function(properties) {
 IDFA_ID = properties;
 };
 
 tad.getSdkVersion = function() {
 return SDK_VERSION;
 };
 
 mraid.getPregetSdkVersion = function(properties) {
 SDK_VERSION = properties;
 };

 window.open = function(url) {
 console.log("window.openurl called, use tad.openUrl");
 tad.openUrl(url);
 }
 
 tad.stringify = function(args) {
 if (typeof JSON === "undefined") {
 var s = "";
 var len = args.length;
 var i;
 if (typeof len == "undefined") {
 return stringifyArg(args);
 }
 for (i = 0; i < args.length; i++) {
 if (i > 0) {
 s = s + ",";
 }
 s = s + stringifyArg(args[i]);
 }
 s = s + "]";
 return s;
 } else {
 return JSON.stringify(args);
 }
 };
 
 stringifyArg = function(arg) {
 var s, type, start, name, nameType, a;
 type = typeof arg;
 s = "";
 if ((type === "number") || (type === "boolean")) {
 s = s + args;
 } else if (arg instanceof Array) {
 s = s + "[" + arg + "]";
 } else if (arg instanceof Object) {
 start = true;
 s = s + '{';
 for (name in arg) {
 if (arg[name] !== null) {
 if (!start) {
 s = s + ',';
 }
 s = s + '"' + name + '":';
 nameType = typeof arg[name];
 if ((nameType === "number") || (nameType === "boolean")) {
 s = s + arg[name];
 } else if ((typeof arg[name]) === 'function') {
 // don't copy the functions
 s = s + '""';
 } else if (arg[name] instanceof Object) {
 s = s + this.stringify(args[i][name]);
 } else {
 s = s + '"' + arg[name] + '"';
 }
 start = false;
 }
 }
 s = s + '}';
 } else {
 a = arg.replace(/\\/g, '\\\\');
 a = a.replace(/"/g, '\\"');
               s = s + '"' + a + '"';
               }
               
               return s;
               };
               })();
 
