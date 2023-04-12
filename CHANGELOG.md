# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines

## 1.3.1
* updated and pinned xml2js due to a breaking change in a minor version release
* changed dependency versioning

## 1.3.0
* added ios-dev-mode
* removed some ancient cordova code for ios

##1.2.3
* changes for cordova 9

##1.2.2
* updated to use new entitlements
* removed some defaults and global vars
* bugfixes

## 1.2.1 (2016-10-23)

**Bug fixes:**

- [Issue #79](https://github.com/nordnet/cordova-universal-links-plugin/issues/79). Fixed installation error: header files were added to the compile section of the project.
- [Issue #77](https://github.com/nordnet/cordova-universal-links-plugin/issues/77). Fixed `before_prepare` hook for iOS that crashed on several systems. Thanks to [@lunchbag](https://github.com/lunchbag) for providing a fix.

**Enhancements:**

- [Issue #93](https://github.com/nordnet/cordova-universal-links-plugin/issues/93). Fixed iOS build warnings.

## 1.2.0 (2016-07-27)

**Enhancements:**

- [Merged pull request #56](https://github.com/nordnet/cordova-universal-links-plugin/pull/56). Adds support for wildcard domains. Thanks to [@schmidt](https://github.com/schmidt) for implementation.

**Docs:**

- [Merged pull request #67](https://github.com/nordnet/cordova-universal-links-plugin/pull/67). Added `Prevent Android from creating multiple app instances` section. Thanks to [@yernandus](https://github.com/yernandus).
- [Merged pull request #70](https://github.com/nordnet/cordova-universal-links-plugin/pull/70). Added `Digital Asset Links support` section. Thanks to [@ghybs](https://github.com/ghybs).

## 1.1.2 (2016-04-27)

**Bug fixes:**

- [Issue #27](https://github.com/nordnet/cordova-universal-links-plugin/issues/27). From now on dependency packages will be installed in the plugin's folder instead of the project's root folder.

## 1.1.1 (2016-03-17)

**Bug fixes:**

- [Issue #52](https://github.com/nordnet/cordova-universal-links-plugin/issues/52). Fixed `config.xml` file preferences reading. Thanks to [@ikostic](https://github.com/ikostic) for providing fix.
- [Issue #47](https://github.com/nordnet/cordova-universal-links-plugin/issues/47). If `paths` in `apple-app-site-association` file contains only `*` - we will also add `/`, so that app would be opened from root domain.
- Merged [PR #42](https://github.com/nordnet/cordova-universal-links-plugin/pull/42). Fixed Android web integration on Android 6.0. Thanks to [@mohamed-ahmed](https://github.com/mohamed-ahmed).

**Docs:**

- Merged [PR #50](https://github.com/nordnet/cordova-universal-links-plugin/pull/50). Fixed typo in documentation. Thanks to [@rafaellop](https://github.com/rafaellop).
- Merged [PR #43](https://github.com/nordnet/cordova-universal-links-plugin/pull/43). Updated documentation regarding `apple-app-site-association` file. Thanks to [@Chun-Yang](https://github.com/Chun-Yang).
- Updated `Useful notes on Universal Links for iOS` section. Thanks to [@conor-mac-aoidh](https://github.com/conor-mac-aoidh) for providing information.

<a name="1.1.0"></a>
## [1.1.0](https://github.com/e-imaxina/cordova-plugin-deeplinks/compare/v1.0.1...v1.1.0) (2018-04-06)

### Bug Fixes

* Use ES5 syntax to support older android versions (5.1 and lower) ([3107b6e](https://github.com/e-imaxina/cordova-plugin-deeplinks/commit/3107b6e))

### Features

* Add support for cordova-android 7.0+ ([823e704](https://github.com/e-imaxina/cordova-plugin-deeplinks/commit/823e704))

<a name="1.0.1"></a>
## [1.0.1](https://github.com/e-imaxina/cordova-plugin-deeplinks/compare/v1.0.0...v1.0.1) (2018-03-07)

### Bug Fixes

* **hooks:** Invalid hook path (using old plugin name) ([1bb2aa4](https://github.com/e-imaxina/cordova-plugin-deeplinks/commit/1bb2aa4))

## 1.0.0 (2018-03-02)

**initial-release**: Initial release
