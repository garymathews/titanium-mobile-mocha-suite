/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2016 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

var should = require('./should'),
	utilities = require('./utilities/utilities'),
	assert = require('./utilities/assertions');

describe('Titanium', function () {

	it('apiName', function () {
		should(Ti.apiName).be.eql('Ti');
		should(Ti.apiName).be.a.readOnlyString;
	});

	it('version', function () {
		should(Ti.version).not.eql('__TITANIUM_VERSION__');
		should(Ti.version).be.a.readOnlyString;
	});

	it('getVersion()', function () {
		should(Ti.getVersion).be.a.Function;
		should(Ti.getVersion()).be.a.String;
		should(Ti.getVersion()).not.eql('__TITANIUM_VERSION__');
	});

	it('buildDate', function () {
		should(Ti.buildDate).not.eql('__TITANIUM_BUILD_DATE__');
		should(Ti.buildDate).be.a.readOnlyString;
	});

	it('getBuildDate()', function () {
		should(Ti.getBuildDate).be.a.Function;
		should(Ti.getBuildDate()).be.a.String;
		should(Ti.getBuildDate()).not.eql('__TITANIUM_BUILD_DATE__');
	});

	it('buildHash', function () {
		should(Ti.buildHash).not.eql('__TITANIUM_BUILD_HASH__');
		should(Ti.buildHash).be.a.readOnlyString;
	});

	it('getBuildHash()', function () {
		should(Ti.getBuildHash).be.a.Function;
		should(Ti.getBuildHash()).be.a.String;
		should(Ti.getBuildHash()).not.eql('__TITANIUM_BUILD_HASH__');
	});

	it('userAgent', function () {
		should(Ti.userAgent).be.a.String;

		var save = Ti.userAgent;
		Ti.userAgent = 'Titanium_Mocha_Test';
		should(Ti.userAgent).be.eql('Titanium_Mocha_Test');
		Ti.userAgent = save;
		should(Ti.userAgent).be.eql(save);
	});

	it('getUserAgent()', function () {
		should(Ti.getUserAgent).be.a.Function;
		should(Ti.getUserAgent()).be.a.String;
	});

	it('setUserAgent()', function () {
		should(Ti.setUserAgent).be.a.Function;
		var save = Ti.getUserAgent();
		Ti.setUserAgent('Titanium_Mocha_Test');
		should(Ti.getUserAgent()).be.eql('Titanium_Mocha_Test');
		should(Ti.userAgent).be.eql('Titanium_Mocha_Test');
		Ti.setUserAgent(save);
		should(Ti.getUserAgent()).be.eql(save);
		should(Ti.userAgent).be.eql(save);
	});

	it('addEventListener()', function () {
		should(Ti.addEventListener).be.a.Function;
	});

	it('removeEventListener()', function () {
		should(Ti.removeEventListener).be.a.Function;
	});

	it('applyProperties()', function () {
		should(Ti.applyProperties).be.a.Function;
		Ti.mocha_test = undefined;
		should(Ti.applyProperties({ mocha_test: 'mocha_test_value' }))
		should(Ti.mocha_test !== undefined);
		should(Ti.mocha_test).be.eql('mocha_test_value');
		Ti.mocha_test = undefined;
	});

	it('createBuffer()', function () {
		should(Ti.createBuffer).be.a.Function;
	});

	it('createProxy()', function () {
		should(Ti.createProxy).be.a.Function;
	});

	it('fireEvent()', function () {
		should(Ti.fireEvent).be.a.Function;
	});
});
