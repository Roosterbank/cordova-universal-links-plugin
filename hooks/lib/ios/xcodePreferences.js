/*
Script activates support for Universal Links in the application by setting proper preferences in the xcode project file.
Which is:
- deployment target set to iOS 9.0
- .entitlements file added to project PBXGroup and PBXFileReferences section
- path to .entitlements file added to Code Sign Entitlements preference
*/

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var xcode = require('xcode');
var shelljs = require('shelljs');
var compare = require('node-version-compare');
var ConfigXmlHelper = require('../configXmlHelper.js');
var COMMENT_KEY = /_comment$/;
var context;

module.exports = {
  enableAssociativeDomainsCapability: enableAssociativeDomainsCapability,
};

// region Public API

/**
 * Activate associated domains capability for the application.
 *
 * @param {Object} cordovaContext - cordova context object
 */
function enableAssociativeDomainsCapability(cordovaContext) {
  context = cordovaContext;
  var projectFile = loadProjectFile();
  activateAssociativeDomains(projectFile.xcode);

  projectFile.write();
}

// endregion

// region Alter project file preferences

/**
 * Activate associated domains support in the xcode project file:
 * - set deployment target to ios 9;
 * - add .entitlements file to Code Sign Entitlements preference.
 *
 * @param {Object} xcodeProject - xcode project preferences; all changes are made in that instance
 */
function activateAssociativeDomains(xcodeProject) {
  var configurations = nonComments(xcodeProject.pbxXCBuildConfigurationSection());
  var config;
  var buildSettings;

  for (config in configurations) {
    buildSettings = configurations[config].buildSettings;
    buildSettings.CODE_SIGN_ENTITLEMENTS = '"$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist"';
  }
}

// endregion

// region Xcode project file helpers

/**
 * Load iOS project file from platform specific folder.
 *
 * @return {Object} projectFile - project file information
 */
function loadProjectFile() {
  var platform_ios;
  var projectFile;

  var project_files = glob.sync(path.join(iosPlatformPath(), '*.xcodeproj', 'project.pbxproj'));

  if (project_files.length === 0) {
    throw new Error('does not appear to be an xcode project (no xcode project file)');
  }

  var pbxPath = project_files[0];

  var xcodeproj = xcode.project(pbxPath);
  xcodeproj.parseSync();

  projectFile = {
    xcode: xcodeproj,
    write: function () {
      var frameworks_file = path.join(iosPlatformPath(), 'frameworks.json');
      var frameworks = {};
      try {
        frameworks = context.requireCordovaModule(frameworks_file);
      } catch (e) {}

      fs.writeFileSync(pbxPath, xcodeproj.writeSync());
      if (Object.keys(frameworks).length === 0) {
        // If there is no framework references remain in the project, just remove this file
        shelljs.rm('-rf', frameworks_file);
        return;
      }
      fs.writeFileSync(frameworks_file, JSON.stringify(this.frameworks, null, 4));
    },
  };

  return projectFile;
}

/**
 * Remove comments from the file.
 *
 * @param {Object} obj - file object
 * @return {Object} file object without comments
 */
function nonComments(obj) {
  var keys = Object.keys(obj);
  var newObj = {};

  for (var i = 0, len = keys.length; i < len; i++) {
    if (!COMMENT_KEY.test(keys[i])) {
      newObj[keys[i]] = obj[keys[i]];
    }
  }

  return newObj;
}

// endregion

// region Path helpers

function iosPlatformPath() {
  return path.join(projectRoot(), 'platforms', 'ios');
}

function projectRoot() {
  return context.opts.projectRoot;
}

// endregion
