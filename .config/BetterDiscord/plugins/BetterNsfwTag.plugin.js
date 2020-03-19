//META{"name":"BetterNsfwTag","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/BetterNsfwTag","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/BetterNsfwTag/BetterNsfwTag.plugin.js"}*//

class BetterNsfwTag {
	getName () {return "BetterNsfwTag";}

	getVersion () {return "1.2.2";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Adds a more noticeable tag to NSFW channels.";}

	constructor () {
		this.changelog = {
			"improved":[["New Library Structure & React","Restructured my Library and switched to React rendering instead of DOM manipulation"]]
		};
		
		this.patchModules = {
			"ChannelItem":"render"
		};
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
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			
			BDFDB.PluginUtils.init(this);

			BDFDB.ModuleUtils.forceAllUpdates(this);
		}
		else console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			this.stopping = true;

			BDFDB.ModuleUtils.forceAllUpdates(this);
			
			BDFDB.PluginUtils.clear(this);
		}
	}


	// begin of own functions

	processChannelItem (e) {
		if (e.instance.props && e.instance.props.channel && e.instance.props.channel.nsfw) {
			let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {props:[["className", BDFDB.disCN.channelchildren]]});
			let firstChildClassName = index > -1 && BDFDB.ReactUtils.getValue(children[index], "props.children.0.props.className");
			if (firstChildClassName && firstChildClassName.indexOf("NSFW-tag") > -1) children[index].props.children.shift();
			if (!this.stopping && index > -1 && children[index].props && children[index].props.children) {
				children[index].props.children.unshift(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.BotTag, {
					className: "NSFW-tag",
					tag: "NSFW",
					style: {backgroundColor: "#F04747"}
				}));
			}
		}
	}
}
