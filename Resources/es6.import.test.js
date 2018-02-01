/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2018 by Axway, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
import * as a from './es6.module';
import b from './es6.module';
import { testExport } from './es6.module';

const SUCCESS = 'SUCCESS!';

describe('ES6 Import', function () {

	it('imported module', function () {

		should(a).not.be.undefined;
		should(a.testExport).be.a.Function;
		should(a.testExport()).equal(SUCCESS);

		should(b).not.be.undefined;
		should(b).be.a.Function;
		should(b()).equal(SUCCESS);

		should(testExport).not.be.undefined;
		should(testExport).be.a.Function;
		should(testExport()).equal(SUCCESS);
	});
});