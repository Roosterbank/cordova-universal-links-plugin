#import "SceneDelegate+CULPlugin.h"
#import "CULPlugin.h"
#import <Cordova/CDVSceneDelegate.h>
#import <objc/runtime.h>

static NSString *const PLUGIN_NAME = @"UniversalLinks";

@implementation CDVSceneDelegate (CULPlugin)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];

    SEL originalSelector = @selector(scene:willConnectToSession:options:);
    SEL swizzledSelector = @selector(cul_scene:willConnectToSession:options:);

    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

    BOOL didAddMethod = class_addMethod(class,
                                        originalSelector,
                                        method_getImplementation(swizzledMethod),
                                        method_getTypeEncoding(swizzledMethod));

    if (didAddMethod) {
      class_replaceMethod(class,
                          swizzledSelector,
                          method_getImplementation(originalMethod),
                          method_getTypeEncoding(originalMethod));
    } else {
      method_exchangeImplementations(originalMethod, swizzledMethod);
    }
  });
}

// COLD START: Intercepts connectionOptions after Cordova sets up the window
- (void)cul_scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
  // 1. Call Cordova's original setup first
  [self cul_scene:scene willConnectToSession:session options:connectionOptions];

  // 2. Check for Universal Links in connectionOptions
  for (NSUserActivity *activity in connectionOptions.userActivities) {
    if ([activity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] && activity.webpageURL != nil) {
      [self routeUserActivity:activity];
      break;
    }
  }
}

// WARM START: Existing method called when app is already in background
- (void)scene:(UIScene *)scene continueUserActivity:(NSUserActivity *)userActivity {
  if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] && userActivity.webpageURL != nil) {
    [self routeUserActivity:userActivity];
  }
}

// Helper: Sends to CULPlugin or buffers it if CULPlugin isn't ready
- (void)routeUserActivity:(NSUserActivity *)userActivity {
  UIWindow *window = self.window;
  if ([window.rootViewController respondsToSelector:@selector(getCommandInstance:)]) {
    CDVViewController *viewController = (CDVViewController *)window.rootViewController;
    CULPlugin *plugin = (CULPlugin *)[viewController getCommandInstance:PLUGIN_NAME];
    if (plugin) {
      [plugin handleUserActivity:userActivity];
      return;
    }
  }

  // If the plugin instance isn't available yet during early launch, buffer it statically
  [CULPlugin setPendingUserActivity:userActivity];
}

@end
