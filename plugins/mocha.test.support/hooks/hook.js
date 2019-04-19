/**
 * Copyright (c) 2019 by Axway, Inc.
 * All Rights Reserved. This library contains intellectual
 * property protected by patents and/or patents pending.
 */

'use strict';

const appc = require('node-appc');
const async = require('async');
const path = require('path');

exports.cliVersion = '>=3.2';

let ANDROID_SDK = process.env.ANDROID_SDK; // eslint-disable-line no-undef
let ADB_PATH;

exports.init = function (logger, config, cli) {

	// Obtain Android SDK used by CLI
	if (cli.argv['android-sdk']) {
		ANDROID_SDK = cli.argv['android-sdk'];
	}

	// Set ADB path
	ADB_PATH = path.join(ANDROID_SDK, 'platform-tools', 'adb');

	cli.on('build.post.compile', function (builder, done) {
		if (builder.platformName === 'android') {
			dismissAndroidScreenLock(logger, builder, done);
		} else {
			done();
		}
	});
};

function adbRun(argumentArray, callback) {
	appc.subprocess.run(ADB_PATH, argumentArray, { shell: false, windowsHide: true }, callback);
}

function dismissAndroidScreenLock(logger, builder, callback) {
	const deviceId = builder.target === 'emulator' ? [] : [ '-s', builder.deviceId ];
	logger.info(`Dismissing Android screen-lock for ${builder.deviceId}`);
	async.series([
		function (next) {
			// Power on the screen if currently off.
			adbRun(deviceId.concat([ 'shell', 'input', 'keyevent', 'KEYCODE_MENU' ]), next);
		},
		function (next) {
			// Remove the screen-lock and show the home screen.
			adbRun(deviceId.concat([ 'shell', 'input', 'keyevent', 'KEYCODE_MENU' ]), next);
		},
		function (next) {
			// If the screen-lock was never shown to begin with, then the above might show
			// the home screen's page selection interface. Clear out of it with the home key.
			adbRun(deviceId.concat([ 'shell', 'input', 'keyevent', 'KEYCODE_HOME' ]), next);
		},
		function (next) {
			// Set the device's screen idle timer to 30 minutes. (The default is 30 seconds.)
			adbRun(deviceId.concat([ 'shell', 'settings', 'put', 'system', 'screen_off_timeout', '1800000' ]), next);
		},
	], callback);
}
