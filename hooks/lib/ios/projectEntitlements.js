/*
Script creates entitlements file with the list of hosts, specified in config.xml.
File name is: ProjectName.entitlements
Location: ProjectName/

Script only generates content. File it self is included in the xcode project in another hook: xcodePreferences.js.
*/

var path = require('path');
var fs = require('fs');
var plist = require('plist');
var mkpath = require('mkpath');
var ConfigXmlHelper = require('../configXmlHelper.js');
var ASSOCIATED_DOMAINS = 'com.apple.developer.associated-domains';
var context;

module.exports = {
  generateAssociatedDomainsEntitlements: generateEntitlements,
};

// region Public API

/**
 * Generate entitlements file content.
 *
 * @param {Object} cordovaContext - cordova context object
 * @param {Object} pluginPreferences - plugin preferences from config.xml; already parsed
 */
function generateEntitlements(cordovaContext, pluginPreferences) {
  context = cordovaContext;

  var currentEntitlementsDebug = getEntitlementsFileContent('Debug');
  var currentEntitlementsRelease = getEntitlementsFileContent('Release');
  var newEntitlementsDebug = injectPreferences(currentEntitlementsDebug, pluginPreferences);
  var newEntitlementsRelease = injectPreferences(currentEntitlementsRelease, pluginPreferences);

  saveContentToEntitlementsFile(newEntitlementsDebug, 'Debug');
  saveContentToEntitlementsFile(newEntitlementsRelease, 'Release');
}

// endregion

// region Work with entitlements file

/**
 * Save data to entitlements file.
 *
 * @param {Object} content - data to save; JSON object that will be transformed into xml
 * @param {String} type - the type of the entitlements: Debug or Release
 */
function saveContentToEntitlementsFile(content, type) {
  var plistContent = plist.build(content);
  var filePath = pathToEntitlementsFile(type);

  mkpath.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, plistContent, 'utf8');
}

/**
 * Read data from existing entitlements file. If none exist - default value is returned
 *
 * @return {String} entitlements file content
 */
function getEntitlementsFileContent(type) {
  var pathToFile = pathToEntitlementsFile(type);
  var content;

  try {
    content = fs.readFileSync(pathToFile, 'utf8');
  } catch (err) {
    return defaultEntitlementsFile();
  }

  return plist.parse(content);
}

/**
 * Get content for an empty entitlements file.
 *
 * @return {String} default entitlements file content
 */
function defaultEntitlementsFile() {
  return {};
}

/**
 * Inject list of hosts into entitlements file.
 *
 * @param {Object} currentEntitlements - entitlements where to inject preferences
 * @param {Object} pluginPreferences - list of hosts from config.xml
 * @return {Object} new entitlements content
 */
function injectPreferences(currentEntitlements, pluginPreferences) {
  var newEntitlements = currentEntitlements;
  newEntitlements[ASSOCIATED_DOMAINS] = generateAssociatedDomainsContent(pluginPreferences);
  return newEntitlements;
}

/**
 * Generate content for associated-domains dictionary in the entitlements file.
 *
 * @param {Object} pluginPreferences - list of hosts from conig.xml
 * @return {Object} associated-domains dictionary content
 */
function generateAssociatedDomainsContent(pluginPreferences) {
  var domainsList = [];
  pluginPreferences.hosts.forEach(function (host) {
    var link = domainsListEntryForHost(host, pluginPreferences.iosDevMode);
    if (domainsList.indexOf(link) === -1) {
      domainsList.push(link);
    }
  });

  return domainsList;
}

/**
 * Generate domain record for the given host.
 *
 * @param {Object} host - host entry
 * @param {String} devMode - switch to set devMode
 * @return {String} record
 */
function domainsListEntryForHost(host, devMode) {
  return `applinks:${host.name}${devMode === 'true' ? '?mode=developer' : ''}`;
}

// endregion

// region Path helper methods

/**
 * Path to entitlements file.
 *
 * @return {String} absolute path to entitlements file
 */
function pathToEntitlementsFile(type) {
  return path.join(getProjectRoot(), 'platforms', 'ios', getProjectName(), `Entitlements-${type}.plist`);
}

/**
 * Projects root folder path.
 *
 * @return {String} absolute path to the projects root
 */
function getProjectRoot() {
  return context.opts.projectRoot;
}

/**
 * Name of the project from config.xml
 *
 * @return {String} project name
 */
function getProjectName() {
  var configXmlHelper = new ConfigXmlHelper(context);
  return configXmlHelper.getProjectName();
}

// endregion
