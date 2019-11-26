//META{"name":"CompleteTimestamps","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/CompleteTimestamps","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/CompleteTimestamps/CompleteTimestamps.plugin.js"}*//

class CompleteTimestamps {
	getName () {return "CompleteTimestamps";}

	getVersion () {return "1.3.7";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Replace all timestamps with complete timestamps.";}

	constructor () {
		this.changelog = {
			"fixed":[["Arabic Usernames","Fixed issue where arabic usernames would break timestamps that contain a space"]],
			"improved":[["New Library Structure & React","Restructured my Library and switched to React rendering instead of DOM manipulation"]]
		};

		this.patchedModules = {
			after: {
				Message: "render",
				MessageContent: "render",
				Embed: "render"
			}
		};
	}

	initConstructor () {
		this.languages = {};
		
		this.defaults = {
			settings: {
				showInChat:		{value:true, 	description:"Replace Chat Timestamp with Complete Timestamp:"},
				showInEmbed:	{value:true, 	description:"Replace Embed Timestamp with Complete Timestamp:"},
				showOnHover:	{value:false, 	description:"Also show Timestamp when you hover over a message:"},
				changeForEdit:	{value:false, 	description:"Change the Time for the Edited Time Tooltips:"},
				displayTime:	{value:true, 	description:"Display the Time in the Timestamp:"},
				displayDate:	{value:true, 	description:"Display the Date in the Timestamp:"},
				cutSeconds:		{value:false, 	description:"Cut off Seconds of the Time:"},
				forceZeros:		{value:false, 	description:"Force leading Zeros:"},
				otherOrder:		{value:false, 	description:"Show the Time before the Date:"}
			},
			choices: {
				creationDateLang:		{value:"$discord", 	description:"Timestamp Format:"}
			},
			formats: {
				ownFormat:				{value:"$hour:$minute:$second, $day.$month.$year", 	description:"Own Format:"}
			}
		};
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		let settings = BDFDB.DataUtils.get(this, "settings");
		let choices = BDFDB.DataUtils.get(this, "choices");
		let formats = BDFDB.DataUtils.get(this, "formats");
		let settingsitems = [];
		
		for (let key in settings) settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
			className: BDFDB.disCN.marginbottom8,
			type: "Switch",
			plugin: this,
			keys: ["settings", key],
			label: this.defaults.settings[key].description,
			value: settings[key],
			onChange: (e, instance) => {
				BDFDB.ReactUtils.forceUpdate(BDFDB.ReactUtils.findOwner(BDFDB.ReactUtils.findOwner(instance, {name:"BDFDB_SettingsPanel", up:true}), {name:"BDFDB_Select", all:true, noCopies:true}));
			}
		}));
		
		settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
			className: BDFDB.disCN.marginbottom8
		}));
		
		for (let key in choices) settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
			className: BDFDB.disCN.marginbottom8,
			type: "Select",
			plugin: this,
			keys: ["choices", key],
			label: this.defaults.choices[key].description,
			basis: "70%",
			value: choices[key],
			options: BDFDB.ObjectUtils.toArray(BDFDB.ObjectUtils.map(this.languages, (lang, id) => {return {value:id, label:lang.name}})),
			searchable: true,
			optionRenderer: lang => {
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {
					align: BDFDB.LibraryComponents.Flex.Align.CENTER,
					children: [
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex.Child, {
							grow: 0,
							shrink: 0,
							basis: "40%",
							children: lang.label
						}),
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex.Child, {
							grow: 0,
							shrink: 0,
							basis: "60%",
							children: this.getTimestamp(this.languages[lang.value].id)
						})
					]
				});
			},
			valueRenderer: lang => {
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {
					align: BDFDB.LibraryComponents.Flex.Align.CENTER,
					children: [
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex.Child, {
							grow: 0,
							shrink: 0,
							children: lang.label
						}),
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex.Child, {
							grow: 1,
							shrink: 0,
							basis: "70%",
							children: this.getTimestamp(this.languages[lang.value].id)
						})
					]
				});
			}
		}));
		
		settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
			className: BDFDB.disCN.marginbottom8
		}));
		
		for (let key in formats) settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
			className: BDFDB.disCN.marginbottom8,
			type: "TextInput",
			plugin: this,
			keys: ["formats", key],
			label: this.defaults.formats[key].description,
			basis: "70%",
			value: formats[key],
			onChange: (e, instance) => {
				BDFDB.ReactUtils.forceUpdate(BDFDB.ReactUtils.findOwner(BDFDB.ReactUtils.findOwner(instance, {name:"BDFDB_SettingsPanel", up:true}), {name:"BDFDB_Select", all:true, noCopies:true}));
			}
		}));
		
		settingsitems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
			title: "Placeholder Guide",
			dividertop: true,
			collapsed: BDFDB.DataUtils.load(this, "hideInfo", "hideInfo"),
			children: ["$hour will be replaced with the current hour", "$minute will be replaced with the current minutes", "$second will be replaced with the current seconds", "$msecond will be replaced with the current milliseconds", "$timemode will change $hour to a 12h format and will be replaced with AM/PM", "$year will be replaced with the current year", "$month will be replaced with the current month", "$day will be replaced with the current day", "$monthnameL will be replaced with the monthname in long format based on the Discord Language", "$monthnameS will be replaced with the monthname in short format based on the Discord Language", "$weekdayL will be replaced with the weekday in long format based on the Discord Language", "$weekdayS will be replaced with the weekday in short format based on the Discord Language"].map(string => {
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormText, {
					type: BDFDB.LibraryComponents.FormComponents.FormTextTypes.DESCRIPTION,
					children: string
				});
			}),
			onClick: collapsed => {
				BDFDB.DataUtils.save(collapsed, this, "hideInfo", "hideInfo");
			}
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

			this.languages = Object.assign({"own":{name:"Own",id:"own",integrated:false,dic:false}}, BDFDB.LanguageUtils.languages);

			BDFDB.ModuleUtils.forceAllUpdates(this);
		}
		else console.error(`%c[${this.getName()}]%c`, "color: #3a71c1; font-weight: 700;", "", "Fatal Error: Could not load BD functions!");
	}


	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			this.stopping = true;
			
			BDFDB.DOMUtils.removeLocalStyle(this.name + "CompactCorrection");

			BDFDB.ModuleUtils.forceAllUpdates(this);

			BDFDB.PluginUtils.clear(this);
		}
	}


	// begin of own functions

	onSettingsClosed () {
		if (this.SettingsUpdated) {
			delete this.SettingsUpdated;
			BDFDB.ModuleUtils.forceAllUpdates(this);
		}
	}

	processMessage (e) {
		if (!e.instance.props.isCompact) {
			let settings = BDFDB.DataUtils.get(this, "settings");
			if (settings.showInChat) this.injectTimestamp(e.returnvalue, e.instance.props);
			if (settings.showOnHover) {
				let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {props:[["className", BDFDB.disCN.messagecontent]]});
				if (index > -1) {
					let content = children[index];
					children[index] = BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
						text: this.getTimestamp(this.languages[BDFDB.DataUtils.get(this, "choices", "creationDateLang")].id, e.instance.props.message.timestamp._i),
						tooltipConfig: {
							type: "left"
						},
						children: content
					});
				}
			}
		}
	}

	processMessageContent (e) {
		if (typeof e.returnvalue.props.children == "function") {
			let settings = BDFDB.DataUtils.get(this, "settings");
			let renderChildren = e.returnvalue.props.children;
			e.returnvalue.props.children = (...args) => {
				let renderedChildren = renderChildren(...args);
				if (e.instance.props.isCompact && settings.showInChat) this.injectTimestamp(renderedChildren, e.instance.props);
				if (settings.changeForEdit) this.injectEditStamp(renderedChildren, e.instance.props);
				return renderedChildren;
			};
			BDFDB.TimeUtils.timeout(this.setMaxWidth.bind(this));
		}
	}

	processEmbed (e) {
		if (e.instance.props.embed.timestamp && BDFDB.DataUtils.get(this, "settings", "showInEmbed")) {
			let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {props:[["className", BDFDB.disCN.embedfootertext]]});
			if (index > -1 && BDFDB.ArrayUtils.is(children[index].props.children)) children[index].props.children.splice(children[index].props.children.length - 1, 1, this.getTimestamp(this.languages[BDFDB.DataUtils.get(this, "choices", "creationDateLang")].id, e.instance.props.embed.timestamp._i));
		}
	}
	
	injectTimestamp (parent, props) {
		let [children, index] = BDFDB.ReactUtils.findChildren(parent, {name: "MessageTimestamp"});
		if (index > -1) {
			if (!props.isCompact) children.splice(index++, 0, BDFDB.ReactUtils.createElement("span", {
				children: "ARABIC-FIX",
				style: {
					fontSize: 0,
					visibility: "hidden"
				}
			}));
			children.splice(index, 1, BDFDB.ReactUtils.createElement("time", {
				className: BDFDB.DOMUtils.formatClassName(props.backgroundOpacity ? BDFDB.disCN["message" + props.backgroundOpacity + "backgroundopacity"] : null, !(props.isEditing || props.isHeader) ? BDFDB.disCN.messagetimestampvisibleonhover : null, props.isCompact ? (props.isMentioned ? BDFDB.disCN.messagetimestampcompactismentioned : BDFDB.disCN.messagetimestampcompact) : BDFDB.disCN.messagetimestampcozy),
				dateTime: props.message.timestamp,
				children: [
					BDFDB.ReactUtils.createElement("i", {
						className: BDFDB.disCN.messagetimestampseparatorleft,
						children: props.isCompact ? "[" : " ["
					}),
					this.getTimestamp(this.languages[BDFDB.DataUtils.get(this, "choices", "creationDateLang")].id, props.message.timestamp._i),
					BDFDB.ReactUtils.createElement("i", {
						className: BDFDB.disCN.messagetimestampseparatorright,
						children: props.isCompact ? "] " : "]"
					})
				]
			}));
		}
	}
	
	injectEditStamp (parent, props) {
		let [children, index] = BDFDB.ReactUtils.findChildren(parent, {name: "SuffixEdited"});
		if (index > -1) children.splice(index, 1, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
			text: this.getTimestamp(this.languages[BDFDB.DataUtils.get(this, "choices", "creationDateLang")].id, props.message.editedTimestamp._i),
			children: BDFDB.ReactUtils.createElement("time", {
				className: BDFDB.disCN.messageedited,
				dateTime: props.message.editedTimestamp,
				children: `(${BDFDB.LanguageStrings.MESSAGE_EDITED.toLowerCase()})`
			})
		}));
	}

	getTimestamp (languageid, time) {
		let timeobj = time ? time : new Date();
		if (typeof time == "string") timeobj = new Date(time);
		if (timeobj.toString() == "Invalid Date") timeobj = new Date(parseInt(time));
		if (timeobj.toString() == "Invalid Date") return;
		let settings = BDFDB.DataUtils.get(this, "settings"), timestring = "";
		if (languageid != "own") {
			let timestamp = [];
			if (settings.displayDate) 	timestamp.push(timeobj.toLocaleDateString(languageid));
			if (settings.displayTime) 	timestamp.push(settings.cutSeconds ? this.cutOffSeconds(timeobj.toLocaleTimeString(languageid)) : timeobj.toLocaleTimeString(languageid));
			if (settings.otherOrder)	timestamp.reverse();
			timestring = timestamp.length > 1 ? timestamp.join(", ") : (timestamp.length > 0 ? timestamp[0] : "");
			if (timestring && settings.forceZeros) timestring = this.addLeadingZeros(timestring);
		}
		else {
			let ownformat = BDFDB.DataUtils.get(this, "formats", "ownFormat");
			languageid = BDFDB.LanguageUtils.getLanguage().id;
			let hour = timeobj.getHours(), minute = timeobj.getMinutes(), second = timeobj.getSeconds(), msecond = timeobj.getMilliseconds(), day = timeobj.getDate(), month = timeobj.getMonth()+1, timemode = "";
			if (ownformat.indexOf("$timemode") > -1) {
				timemode = hour >= 12 ? "PM" : "AM";
				hour = hour % 12;
				hour = hour ? hour : 12;
			}
			timestring = ownformat
				.replace("$hour", settings.forceZeros && hour < 10 ? "0" + hour : hour)
				.replace("$minute", minute < 10 ? "0" + minute : minute)
				.replace("$second", second < 10 ? "0" + second : second)
				.replace("$msecond", settings.forceZeros ? (msecond < 10 ? "00" + msecond : (msecond < 100 ? "0" + msecond : msecond)) : msecond)
				.replace("$timemode", timemode)
				.replace("$weekdayL", timeobj.toLocaleDateString(languageid,{weekday: "long"}))
				.replace("$weekdayS", timeobj.toLocaleDateString(languageid,{weekday: "short"}))
				.replace("$monthnameL", timeobj.toLocaleDateString(languageid,{month: "long"}))
				.replace("$monthnameS", timeobj.toLocaleDateString(languageid,{month: "short"}))
				.replace("$day", settings.forceZeros && day < 10 ? "0" + day : day)
				.replace("$month", settings.forceZeros && month < 10 ? "0" + month : month)
				.replace("$year", timeobj.getFullYear());
		}
		return timestring;
	}

	cutOffSeconds (timestring) {
		return timestring.replace(/(.{1,2}:.{1,2}):.{1,2}(.*)/, "$1$2").replace(/(.{1,2}\..{1,2})\..{1,2}(.*)/, "$1$2").replace(/(.{1,2} h .{1,2} min) .{1,2} s(.*)/, "$1$2");
	}

	addLeadingZeros (timestring) {
		let chararray = timestring.split("");
		let numreg = /[0-9]/;
		for (let i = 0; i < chararray.length; i++) {
			if (!numreg.test(chararray[i-1]) && numreg.test(chararray[i]) && !numreg.test(chararray[i+1])) chararray[i] = "0" + chararray[i];
		}

		return chararray.join("");
	}

	setMaxWidth () {
		if (this.currentMode != BDFDB.DiscordUtils.getMode()) {
			this.currentMode = BDFDB.DiscordUtils.getMode();
			let timestamp = document.querySelector(BDFDB.dotCN.messagetimestampcompact);
			if (timestamp) {
				let choice = BDFDB.DataUtils.get(this, "choices", "creationDateLang");
				let testtimestamp = BDFDB.DOMUtils.create(`<time class="${timestamp.className}" style="width: auto !important;">${this.getTimestamp(this.languages[choice].id, new Date(253402124399995))}</time>`);
				document.body.appendChild(testtimestamp);
				let width = BDFDB.DOMUtils.getRects(testtimestamp).width + 5;
				testtimestamp.remove();
				BDFDB.DOMUtils.appendLocalStyle(this.name + "CompactCorrection", `
					${BDFDB.dotCN.messagetimestampcompact} {
						width: ${width}px !important;
					}
					${BDFDB.dotCN.messagetimestampcompactismentioned} {
						width: ${width + 2}px !important;
					}
					${BDFDB.dotCN.messagemarkupiscompact} {
						margin-left: calc(${width}px + 4ch) !important;
						text-indent: calc(-${width}px - 4ch) !important;
					}
					${BDFDB.dotCN.messagemarkupiscompact} > label {
						margin-left: calc(${width}px + 4ch) !important;
					}
					${BDFDB.dotCN.messageaccessorycompact} {
						padding-left: ${width}px !important;
					}
				`);
			}
			else BDFDB.DOMUtils.removeLocalStyle(this.name + "CompactCorrection");
		}
	}
}
