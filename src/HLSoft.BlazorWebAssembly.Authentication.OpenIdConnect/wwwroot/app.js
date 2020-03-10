﻿(function () {
	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect = {};
	let mgr = null;

	function notifySilentRenewError(err) {
		DotNet.invokeMethodAsync('HLSoft.BlazorWebAssembly.Authentication.OpenIdConnect', 'NotifySilentRefreshTokenFail', err);
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.configOidc = function (config) {
		if (!mgr) {
			mgr = new Oidc.UserManager(config);
			// subscribe SilentRenewError event
			mgr.events.addSilentRenewError(notifySilentRenewError);
			// if there is a custom endSessionEndpoint, hack the Oidc.UserManager to use that url as the session endpoint
			if (config.endSessionEndpoint) {
				mgr.metadataService.getEndSessionEndpoint = function () {
					return Promise.resolve(config.endSessionEndpoint);
				}
			}
		}
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.signinRedirect = function () {
		return mgr.signinRedirect();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.signoutRedirect = function () {
		return mgr.signoutRedirect();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.getUser = function () {
		return mgr ? mgr.getUser() : null;
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.removeUser = function () {
		return mgr.removeUser();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.signinPopup = function () {
		return mgr.signinPopup();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.signoutPopup = function () {
		return mgr.signoutPopup();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.signinSilent = function () {
		return mgr.signinSilent();
	}

	function createUserManager(isCode) {
		return isCode
			? new Oidc.UserManager({ loadUserInfo: true, response_mode: "query" })
			: new Oidc.UserManager();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.processSigninCallback = function (isCode) {
		let mgr = createUserManager(isCode);
		return mgr.signinRedirectCallback().then();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.processSilentCallback = function () {
		let mgr = new Oidc.UserManager();
		return mgr.signinSilentCallback(window.location.href);
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.processSigninPopup = function (isCode) {
		let mgr = createUserManager(isCode);
		return mgr.signinPopupCallback();
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.processSignoutPopup = function (isCode) {
		let mgr = createUserManager(isCode);
		mgr.signoutPopupCallback(false);
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.hideAllPage = function () {
		document.body.style.display = "none";
	}

	window.HLSoftBlazorWebAssemblyAuthenticationOpenIdConnect.silentOpenUrlInIframe = function (url, timeout) {
		return new Promise((resolve, reject) => {
			let iframe = document.createElement("iframe");
			iframe.style.display = "none";
			iframe.setAttribute("src", url);
			document.body.appendChild(iframe);

			let timer = window.setTimeout(() => {
				reject(new Error("IFrame window timed out."));
			}, timeout);
			iframe.onload = () => {
				document.body.removeChild(iframe);
				window.clearTimeout(timer);
				resolve();
			};
		});
	}
})();