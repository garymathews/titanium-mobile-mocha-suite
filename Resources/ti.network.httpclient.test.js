/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-Present by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */
'use strict';
var should = require('./utilities/assertions');

describe('Titanium.Network.HTTPClient', function () {
	this.timeout(6e4);

	it('apiName', function () {
		var client = Ti.Network.createHTTPClient();
		should(client).have.a.readOnlyProperty('apiName').which.is.a.String;
		should(client.apiName).be.eql('Ti.Network.HTTPClient');
	});

	// FIXME iOS gives us an ELEMENT_NODE, not DOCUMENT_NODE
	it.iosBroken('responseXML', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			try {
				should(xhr.responseXML === null).be.false;
				should(xhr.responseXML.nodeType).eql(9); // DOCUMENT_NODE
				finish();
			} catch (err) {
				finish(err);
			}
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to retrieve RSS feed: ' + e)); // Windows fails here. I think we need to update the URL!
			}
		};

		xhr.open('GET', 'http://www.appcelerator.com/feed');
		xhr.send();
	});

	// Test for TIMOB-4513
	it('secureValidateProperty', function () {
		var xhr = Ti.Network.createHTTPClient();
		should(xhr).be.an.Object;

		should(xhr.validatesSecureCertificate).be.undefined;
		xhr.validatesSecureCertificate = true;
		should(xhr.validatesSecureCertificate).be.true;
		xhr.validatesSecureCertificate = false;
		should(xhr.validatesSecureCertificate).be.false;

		xhr.setValidatesSecureCertificate(true);
		should(xhr.getValidatesSecureCertificate()).be.true;
		xhr.setValidatesSecureCertificate(false);
		should(xhr.getValidatesSecureCertificate()).be.false;
	});

	it('downloadLargeFile', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			//  should(xhr.responseData.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to retrieve large image: ' + e));
			}
		};

		xhr.open('GET', 'https://userscontent2.emaze.com/images/de1f3140-6f4e-4a67-9626-14c39a8f93a2/18aaaec3-31fb-463b-bac9-19d848f7a583.png');
		xhr.send();
	});

	it('TIMOB-23127', function (finish) {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			finish();
		};

		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.open('POST', 'http://www.appcelerator.com/');
		xhr.send('TIMOB-23127');
	});

	it('TIMOB-23214', function (finish) {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			finish();
		};

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.open('GET', 'http://www.appcelerator.com/');
		xhr.send();
	});

	it('TIMOB-19042', function (finish) {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			finish(new Error('onload shouldn\'t fire for an URL returning 404'));
		};
		xhr.onerror = function (e) {
			should(e.code).eql(404);
			finish();
		};

		xhr.open('GET', 'http://www.httpbin.org/gert'); // BAD URL, should get 404
		xhr.send();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2156-android-invalid-redirect-alert-on-xhr-file-download
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/1381-android-buffer-large-xhr-downloads
	it('largeFileWithRedirect', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			// should(xhr.responseData.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to retrieve redirected large image: ' + e));
			}
		};

		xhr.open('GET', 'http://www.httpbin.org/redirect-to?url=https%3A%2F%2Fuserscontent2.emaze.com%2Fimages%2Fde1f3140-6f4e-4a67-9626-14c39a8f93a2%2F18aaaec3-31fb-463b-bac9-19d848f7a583.png');
		xhr.send();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/1649-android-httpclientsend-with-no-argument-causes-npe
	it('emptyPOSTSend', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to post empty request: ' + e));
			}
		};

		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2339
	it('responseHeadersBug', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			var allHeaders = xhr.getAllResponseHeaders(),
				header;
			should(allHeaders.toLowerCase().indexOf('server:')).be.within(0, 1 / 0);
			header = xhr.getResponseHeader('Server');
			should(header.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to retrieve headers: ' + e)); // Failing on Windows here, likely need to update test!
			}
		};
		xhr.open('GET', 'http://www.appcelerator.com'); // FIXME Update URL!
		xhr.send();
	});

	it('requestHeaderMethods', function (finish) {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			var response;
			should(e.code).eql(0);
			if (xhr.status === 200) {
				should(e.success).eql(true);

				response = JSON.parse(xhr.responseText);
				response['adhocHeader'].should.eql('notcleared');
				response.should.not.have.property('clearedHeader');
			} else if (xhr.status !== 503) { // service unavailable (over quota)
				finish('Received unexpected response: ' + xhr.status);
				return;
			}
			finish();
		};
		xhr.onerror = function () {
			if (xhr.status !== 503) { // service unavailable (over quota)
				finish('Received unexpected response: ' + xhr.status);
				return;
			}
			finish();
		};
		xhr.open('GET', 'http://headers.jsontest.com/');
		xhr.setRequestHeader('adhocHeader', 'notcleared');
		xhr.setRequestHeader('clearedHeader', 'notcleared');
		should(function () {
			xhr.setRequestHeader('clearedHeader', null);
		}).not.throw();
		xhr.send();
	});

	it('sendData', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to send data: ' + e));
			}
		};
		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send({
			message: 'check me out',
			numericid: 1234
		});
	});

	// Confirms that only the selected cookie is deleted
	// FIXME Windows hangs on this test! Maybe due to setTimeout in onload?
	it.allBroken('clearCookiePositiveTest', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			cookie_string;
		function second_cookie_fn() {
			var second_cookie_string = this.getResponseHeader('Set-Cookie').split(';')[0];
			// New Cookie should be different.
			should(cookie_string).not.be.eql(second_cookie_string);
			finish();
		}
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			cookie_string = this.getResponseHeader('Set-Cookie').split(';')[0];
			xhr.clearCookies('https://www.google.com');
			xhr.onload = second_cookie_fn;
			// Have to do this on delay for Android, or else the open and send get cancelled due to:
			// [WARN]  TiHTTPClient: (main) [2547,14552] open cancelled, a request is already pending for response.
			// [WARN]  TiHTTPClient: (main) [1,14553] send cancelled, a request is already pending for response.
			// FIXME We should file a bug to handle this better! Can't we "queue" up the open/send calls to occur as soon as this callback finishes?
			setTimeout(function () {
				xhr.open('GET', 'https://www.google.com');
				xhr.send();
			}, 5000);
		};
		xhr.onerror = function (e) {
			should(e).should.be.type('undefined');
		};
		xhr.open('GET', 'https://www.google.com');
		xhr.send();
	});

	// Confirms that only the selected cookie is deleted
	it('clearCookieUnaffectedCheck', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			cookie_string;
		function second_cookie_fn() {
			var second_cookie_string;
			Ti.API.info('Second Load');
			second_cookie_string = this.getResponseHeader('Set-Cookie').split(';')[0];
			// Cookie should be the same
			should(cookie_string).eql(second_cookie_string);
			finish();
		}
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			cookie_string = this.getResponseHeader('Set-Cookie').split(';')[0];
			xhr.clearCookies('http://www.microsoft.com');
			xhr.onload = second_cookie_fn;
			// Have to do this on delay for Android, or else the open and send get cancelled due to:
			// [WARN]  TiHTTPClient: (main) [2547,14552] open cancelled, a request is already pending for response.
			// [WARN]  TiHTTPClient: (main) [1,14553] send cancelled, a request is already pending for response.
			// FIXME We should file a bug to handle this better! Can't we "queue" up the open/send calls to occur as soon as this callback finishes?
			setTimeout(function () {
				xhr.open('GET', 'https://www.google.com');
				xhr.send();
			}, 5000);
		};
		xhr.onerror = function (e) {
			should(e).should.be.type('undefined');
		};
		xhr.open('GET', 'https://www.google.com');
		xhr.send();
	});

	// https://jira.appcelerator.org/browse/TIMOB-2849
	// Windows does not yet support Ti.Network.Cookie
	it.windowsMissing('setCookieClearCookieWithMultipleHTTPClients', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(3e4);
		xhr.onload = function () {
			var resp = JSON.parse(this.responseText),
				xhr2;
			attempts = 3;
			should(resp.cookies.k1).eql('v1');
			should(resp.cookies.k2).eql('v2');
			xhr2 = Ti.Network.createHTTPClient();
			xhr2.setTimeout(3e4);
			xhr2.onload = function () {
				var resp2;
				Ti.API.info('Clear Cookie');
				resp2 = JSON.parse(this.responseText);
				should(resp2.cookies).not.have.ownProperty('v1');
				should(resp2.cookies).not.have.ownProperty('v2');
				finish();
			};
			xhr2.onerror = function (e) {
				if (attempts-- > 0) {
					Ti.API.warn('failed, attempting to retry request...');
					xhr2.send();
				} else {
					finish(new Error(e.error || this.responseText));
				}
			};
			xhr2.open('GET', 'http://www.httpbin.org/cookies/delete?k2=&k1=');
			xhr2.send();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				finish(new Error(e.error || this.responseText));
			}
		};
		xhr.open('GET', 'http://www.httpbin.org/cookies/set?k2=v2&k1=v1');
		xhr.send();
	});

	// https://jira.appcelerator.org/browse/TIMOB-11751
	// https://jira.appcelerator.org/browse/TIMOB-17403
	// Windows Desktop is timing out here...
	it('callbackTestForGETMethod', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3,
			dataStreamFinished = false;
		xhr.setTimeout(3e4);

		xhr.onreadystatechange = function () {
			if (this.readyState === this.DONE) {
				if (dataStreamFinished) {
					finish();
				} else if (attempts-- > 0) {
					Ti.API.warn('failed, attempting to retry request...');
					xhr.abort();
					xhr.send();
				} else {
					finish(new Error('onreadystatechange done fired before 100% progress'));
				}
			}
		};

		xhr.ondatastream = function (e) {
			should(e.progress).be.ok;
			if (e.progress >= 1) {
				dataStreamFinished = true;
			}
		};

		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.abort();
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error(e.error || this.responseText));
			}
		};

		xhr.open('GET', 'http://www.pdf995.com/samples/pdf.pdf');
		xhr.send();
	});

	// Windows Desktop is timing out here...
	it('callbackTestForPOSTMethod', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3,
			sendStreamFinished = false,
			buffer;
		xhr.setTimeout(3e4);

		xhr.onreadystatechange = function () {
			if (this.readyState === this.DONE && sendStreamFinished) {
				finish();
			}
		};
		xhr.onsendstream = function (e) {
			should(e.progress).be.ok;
			if (e.progress >= 0.99) {
				sendStreamFinished = true;
			}
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error(e.error || this.responseText));
			}
		};
		buffer = Ti.createBuffer({
			length: 1024 * 10
		}).toBlob();
		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send({
			data: buffer,
			username: 'fgsandford1000',
			password: 'sanford1000',
			message: 'check me out'
		});
	});

	// FIXME Tests pass locally for me, but fail on Windows 8.1 and Win 10 desktop build agents
	// FIXME iOS doesn't work. I think because of app thinning removing Logo.png
	it.iosBroken('POST multipart/form-data containing Ti.Blob', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'Logo.png'),
			newId = new Date().getTime(),
			newName = 'HEY_YOU_GUYS_WAIT_FOR_ME-' + newId,
			form,
			blob = imageFile.read(imageFile),
			attempts = 3;

		xhr.setTimeout(6e4);

		xhr.onload = function () {
			var result;
			// should(e.code).eql(200);// because our API is insane, this always returns 0
			should(xhr.status).eql(200);
			result = JSON.parse(xhr.responseText);
			// check sent headers
			should(result).have.property('headers');
			should(result.headers).have.property('Content-Type');
			should(result.headers['Content-Type']).startWith('multipart/form-data');

			// check name got added
			should(result).have.property('form');
			should(result.form).have.property('name');
			should(result.form.name).eql(newName);

			// check blob data
			should(result).have.property('files');
			should(result.files).have.property('attachment');
			// image/png (Android), image/png (Windows). Ideally this would match the mimetype/contenttype of the file (which it does for Android/Windows). Let's hope it does on iOS?
			should(result.files.attachment).eql('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsNJREFUeNrs3b1NI0EYgGG8InQZlEFCdl1AfhGRayCiABKugMvJaIECKMP53hgZ6QJujXwzuzvf97zSyoEt2Z55NLO2/LMZx/FCqt1gCASWwBJYElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAUusuOHuur6froxoolW6GUdSv8qn057jebzXukSRnH8apcPJZja8VapsPAPx4nAiqwqqxU4XBFQdUzrPtouCZQPYA1U8dzqjC4plCV5/oCFlxQRTh57x1XVFQRXhV2iysyqhCwesQVHVUYWD3hyoAqFKwecGVBFQ7WmnGV+95mQRUS1hpxZUMVFtaacP2F6ioLqtCw1oArK6rwsJbElRlVClhL4MqOKg2sOXFNoPqVBVUqWHPgmkD1Uu77OdNYp/vMeytcJ1A9ZBvnlF+mqI0LKrCq44IKrOq4oAKrOi6owKqOCyqwquOCCqzquKACqwmucuygAqsFrmuowGqBCyqwquF6+8fVv40QWGdVTtZ3X2x/n4X6lRuw5kX1Y+ImW7jAqoEq1A+RgLUiVOWc6w0usGqj2p94KwIusM5DdeKtCLjAOh8VXGA1QwUXWM1QwQVWM1RwgdUMFVxgfaK6q40KruSwyuQeQN22QAVXUlhHVLuWqOBKBmtOVHAlgbUEKriCw1oSVXZcQzJU+zlRZcY1QAUXWP+PatF/Ys2Ea4AKLrA6R5UJ1wAVXGAFQZUB1wAVXGAFQxUZ1wDV+nGBNV8/I6H6Bi6wZmobDdUJXN11GWAuDsieyvZ4ISuWwJLO2NJtIbJiCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWFqyPwIMAMpfdKkmd/FSAAAAAElFTkSuQmCC');

			finish();
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error(e.error || this.responseText));
			}
		};

		xhr.open('POST', 'http://www.httpbin.org/post');

		form = {
			name: newName,
			attachment: blob
		};

		xhr.send(form);
	});

	it.ios('basic-auth success', function (finish) {
		var xhr = Ti.Network.createHTTPClient({
				username: 'user',
				password: 'passwd'
			}),
			attempts = 3;
		xhr.setTimeout(6e4);

		xhr.onload = function () {
			try {
				should(this.responseText).be.a.string;
				finish();
			} catch (err) {
				finish(err);
			}
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to authenticate: ' + e));
			}
		};

		xhr.open('GET', 'http://httpbin.org/basic-auth/user/passwd');
		xhr.send();
	});

	it.ios('basic-auth failure', function (finish) {
		var xhr = Ti.Network.createHTTPClient({
			username: 'user',
			password: 'wrong_password',
		});
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			finish(new Error('Authenticating with wrong password: ' + JSON.stringify(e, null, 1)));
		};
		xhr.onerror = function () {
			// This request should fail as password is wrong.
			finish();
		};

		xhr.open('GET', 'http://httpbin.org/basic-auth/user/passwd');
		xhr.send();
	});

	it.android('save response data to temp directory', function (finish) {
		var xhr = Ti.Network.createHTTPClient(),
			attempts = 3;
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			try {
				should(e.source.responseData.nativePath).be.a.string;
				if (e.source.responseData.nativePath.includes('cache/_tmp') !== -1) {
					finish();
				} else {
					finish(new Error('not saving response data to temp directory'));
				}
			} catch (err) {
				finish(err);
			}
		};
		xhr.onerror = function (e) {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to authenticate: ' + e));
			}
		};

		xhr.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/d/db/Titan-crystal_bar.JPG');
		xhr.send();
	});

	// FIXME: Windows 'source' is missing on onload
	it.windowsMissing('send on response', function (finish) {
		var xhr = Ti.Network.createHTTPClient({}),
			count = 0;

		this.timeout(6e4);
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			try {
				const response = e.source.responseDictionary ? e.source.responseDictionary.json : null;

				if (response !== undefined) {
					if (response && response.count <= 8) {
						return xhr.send(JSON.stringify({ count: ++count }));
					}
					return finish();
				}
				finish(new Error('invalid json response!\n\n' + JSON.stringify(response, null, 1)));
			} catch (err) {
				finish(err);
			}
		};
		xhr.onerror = function (e) {
			finish(e);
		};

		xhr.open('POST', 'http://httpbin.org/post');
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');
		xhr.send(JSON.stringify({ count: count }));
	});

	it.windowsMissing('.file set to a Ti.Filesystem.File object', function (finish) {
		this.timeout(6e4);

		const downloadedImageFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'DownloadedImage.png');
		if (downloadedImageFile.exists()) {
			downloadedImageFile.deleteFile();
		}

		const xhr = Ti.Network.createHTTPClient({});
		xhr.setTimeout(6e4);
		xhr.onload = function (e) {
			try {
				// verify that the destination file now exists
				// TODO: Verify some known contents match?
				should(xhr.file.exists()).be.true;

				finish();
			} catch (err) {
				finish(err);
			}
		};
		xhr.onerror = e => finish(e);

		xhr.open('GET', 'https://avatars1.githubusercontent.com/u/82188?s=200&v=4');
		xhr.setRequestHeader('Accept-Encoding', 'identity');
		xhr.file = downloadedImageFile;
		xhr.send();
	});

	it.android('TLSv3 support', function (finish) {
		// Only supported on Android 10+
		if (parseInt(Ti.Platform.version.split('.')[0]) < 10) {
			return finish();
		}

		const client = Ti.Network.createHTTPClient({
			onload: e => {
				const html = e.source.responseText;
				if (html.includes('protocol_tls1_3">Yes')) {
					finish();
				}
			},
			onerror:
          e => { finish(new Error('Could not determine TLSv3 support.')); },
			timeout: 8000
		});
		client.open('GET', 'https://ssllabs.com/ssltest/viewMyClient.html');
		client.send();
	});

	it.windowsBroken('progress event', finish => {
		let attempts = 3;
		let progressVar = -1;
		const xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(5000);
		xhr.onsendstream = e => {
			try {
				should(e.progress).be.above(0);
				should(e.progress).be.aboveOrEqual(progressVar);
				progressVar = e.progress;
			} catch (error) {
				finish(error);
			}
		};
		xhr.onload = e => {
			finish();
		};
		xhr.onerror = e => {
			if (attempts-- > 0) {
				Ti.API.warn('failed, attempting to retry request...');
				xhr.send();
			} else {
				Ti.API.debug(JSON.stringify(e, null, 2));
				finish(new Error('failed to retrieve large image: ' + e));
			}
		};
		xhr.open('POST', 'https://httpbin.org/post');
		xhr.send(Ti.Utils.base64encode(Ti.Filesystem.getFile('SplashScreen.png')).toString());
	});
});
