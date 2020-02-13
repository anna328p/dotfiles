//META{"name":"SteamProfileLink","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/SteamProfileLink","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/SteamProfileLink/SteamProfileLink.plugin.js"}*//

class SteamProfileLink {
	getName () {return "SteamProfileLink";}

	getVersion () {return "1.0.8";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Opens any Steam links in Steam instead of your internet browser.";}

	constructor () {
		this.changelog = {
			"improved":[["Inbuilt Window","Option to use an inbuilt browser instead of the default OS browser"],["New Library Structure & React","Restructured my Library and switched to React rendering instead of DOM manipulation"]]
		};
	}

	initConstructor () {
		this.defaults = {
			settings: {
				useChromium: 			{value:false,			description:"Use inbuilt browser instead of default if fails to open Steam"}
			}
		};
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		let settings = BDFDB.DataUtils.get(this, "settings");
		let settingsitems = [];
		
		settingsitems = settingsitems.concat(this.createSelects(false));
		
		for (let key in settings) settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
			className: BDFDB.disCN.marginbottom8,
			type: "Switch",
			plugin: this,
			keys: ["settings", key],
			label: this.defaults.settings[key].description,
			value: settings[key]
		}));
		
		return BDFDB.PluginUtils.createSettingsPanel(this, settingsitems);
	}

	//legacy
	load () {}

	start () {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script#BDFDBLibraryScript');
		if (!libraryScript || (performance.now() - libraryScript.getAttribute("date")) > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("id", "BDFDBLibraryScript");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.min.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {this.initialize();});
			document.head.appendChild(libraryScript);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();
		this.startTimeout = setTimeout(() => {
			try {return this.initialize();}
			catch (err) {console.error(`%c[${this.getName()}]%c`, "color: #3a71c1; font-weight: 700;", "", "Fatal Error: Could not initiate plugin! " + err);}
		}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.PluginUtils.init(this);

			BDFDB.ListenerUtils.add(this, document, "click", "a[href^='https://steamcommunity.'], a[href^='https://store.steampowered.'], a[href*='a.akamaihd.net/'][href*='steam']", e => {this.openInSteam(e, e.currentTarget.href);});

			BDFDB.ListenerUtils.add(this, document, "click", BDFDB.dotCN.cardstore + BDFDB.dotCN.cardstoreinteractive, e => {
				let news = BDFDB.ReactUtils.getValue(e.currentTarget, "return.return.memoizedProps.news");
				if (news && news.url && news.url.includes("steam")) this.openInSteam(e, news.url);
			});
		}
		else console.error(`%c[${this.getName()}]%c`, "color: #3a71c1; font-weight: 700;", "", "Fatal Error: Could not load BD functions!");
	}


	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			this.stopping = true;

			BDFDB.PluginUtils.clear(this);
		}
	}

	openInSteam (e, url) {
		BDFDB.ListenerUtils.stopEvent(e);
		BDFDB.LibraryRequires.request(url, (error, response, body) => {
			if (BDFDB.LibraryRequires.electron.shell.openExternal("steam://openurl/" + response.request.href));
			else BDFDB.DiscordUtils.openLink(response.request.href, BDFDB.DataUtils.get(this, "settings", "useChromium"));
		});
	}
}