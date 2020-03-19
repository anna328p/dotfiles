//META{"name":"ShowHiddenChannels","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/ShowHiddenChannels","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/ShowHiddenChannels/ShowHiddenChannels.plugin.js"}*//

class ShowHiddenChannels {
	getName () {return "ShowHiddenChannels";}

	getVersion () {return "2.6.1";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Displays channels that are hidden from you by role restrictions.";}

	constructor () {
		this.changelog = {
			"fixed":[["Channel Duplicates","Should be impossible now for channels to get duplicated"],["User Duplicates","Removed the user duplicates, which I used for testing, BIG OOF"]],
			"improved":[["New Library Structure & React","Restructured my Library and switched to React rendering instead of DOM manipulation"],["Sort", "You can now sort hidden channels in the native way, meaning they will be placed below their rightful category"],["Tooltip", "The tooltip was removed and was turned into a more friendly modal, which can be access via the right click menu on a channel"]]
		};

		this.patchModules = {
			Channels: "render",
			ChannelItem: ["render", "componentDidMount"]
		};
	}

	initConstructor () {
		this.changedInstances = {};

		this.settingsMap = {
			GUILD_TEXT: "showText",
			GUILD_VOICE: "showVoice",
			GUILD_ANNOUNCEMENT: "showAnnouncement",
			GUILD_STORE: "showStore"
		};

		this.typeNameMap = {
			GUILD_TEXT: "TEXT_CHANNEL",
			GUILD_VOICE: "VOICE_CHANNEL",
			GUILD_ANNOUNCEMENT: "NEWS_CHANNEL",
			GUILD_STORE: "STORE_CHANNEL"
		};

		this.channelIcons = {
			GUILD_TEXT: `M 5.88657 21 C 5.57547 21 5.3399 20.7189 5.39427 20.4126 L 6.00001 17 H 2.59511 C 2.28449 17 2.04905 16.7198 2.10259 16.4138 L 2.27759 15.4138 C 2.31946 15.1746 2.52722 15 2.77011 15 H 6.35001 L 7.41001 9 H 4.00511 C 3.69449 9 3.45905 8.71977 3.51259 8.41381 L 3.68759 7.41381 C 3.72946 7.17456 3.93722 7 4.18011 7 H 7.76001 L 8.39677 3.41262 C 8.43914 3.17391 8.64664 3 8.88907 3 H 9.87344 C 10.1845 3 10.4201 3.28107 10.3657 3.58738 L 9.76001 7 H 15.76 L 16.3968 3.41262 C 16.4391 3.17391 16.6466 3 16.8891 3 H 17.8734 C 18.1845 3 18.4201 3.28107 18.3657 3.58738 L 17.76 7 H 21.1649 C 21.4755 7 21.711 7.28023 21.6574 7.58619 L 21.4824 8.58619 C 21.4406 8.82544 21.2328 9 20.9899 9 H 17.41 L 16.35 15 H 19.7549 C 20.0655 15 20.301 15.2802 20.2474 15.5862 L 20.0724 16.5862 C 20.0306 16.8254 19.8228 17 19.5799 17 H 16 L 15.3632 20.5874 C 15.3209 20.8261 15.1134 21 14.8709 21 H 13.8866 C 13.5755 21 13.3399 20.7189 13.3943 20.4126 L 14 17 H 8.00001 L 7.36325 20.5874 C 7.32088 20.8261 7.11337 21 6.87094 21 H 5.88657Z M 9.41045 9 L 8.35045 15 H 14.3504 L 15.4104 9 H 9.41045 Z`,
			GUILD_VOICE: `M 11.383 3.07904 C 11.009 2.92504 10.579 3.01004 10.293 3.29604 L 6 8.00204 H 3 C 2.45 8.00204 2 8.45304 2 9.00204 V 15.002 C 2 15.552 2.45 16.002 3 16.002 H 6 L 10.293 20.71 C 10.579 20.996 11.009 21.082 11.383 20.927 C 11.757 20.772 12 20.407 12 20.002 V 4.00204 C 12 3.59904 11.757 3.23204 11.383 3.07904Z M 14 5.00195 V 7.00195 C 16.757 7.00195 19 9.24595 19 12.002 C 19 14.759 16.757 17.002 14 17.002 V 19.002 C 17.86 19.002 21 15.863 21 12.002 C 21 8.14295 17.86 5.00195 14 5.00195Z M 14 9.00195 C 15.654 9.00195 17 10.349 17 12.002 C 17 13.657 15.654 15.002 14 15.002 V 13.002 C 14.551 13.002 15 12.553 15 12.002 C 15 11.451 14.551 11.002 14 11.002 V 9.00195 Z`,
			GUILD_ANNOUNCEMENT: `M 22 7 H 19 V 3 C 19 2.448 18.553 2 18 2 H 2 C 1.447 2 1 2.448 1 3 V 21 C 1 21.552 1.447 22 2 22 H 20 C 20.266 22 20.52 21.895 20.707 21.707 L 22.707 19.707 C 22.895 19.519 23 19.265 23 18.999 V 7.999 C 23 7.448 22.553 7 22 7Z M 9 18.999 H 3 V 16.999 H 9 V 18.999Z M 9 15.999 H 3 V 13.999 H 9 V 15.999Z M 9 13 H 3 V 11 H 9 V 13Z M 16 18.999 H 10 V 16.999 H 16 V 18.999Z M 16 15.999 H 10 V 13.999 H 16 V 15.999Z M 16 13 H 10 V 11 H 16 V 13Z M 16 8 H 3 V 5 H 16 V 8Z M 21 18.585 L 20.586 18.999 H 19 V 8.999 H 21 V 18.585 Z`,
			GUILD_STORE: `M 21.707 13.293l -11 -11 C 10.519 2.105 10.266 2 10 2 H 3c -0.553 0 -1 0.447 -1 1 v 7 c 0 0.266 0.105 0.519 0.293 0.707l11 11 c 0.195 0.195 0.451 0.293 0.707 0.293 s 0.512 -0.098 0.707 -0.293l7 -7 c 0.391 -0.391 0.391 -1.023 0 -1.414 z M 7 9c -1.106 0 -2 -0.896 -2 -2 0 -1.106 0.894 -2 2 -2 1.104 0 2 0.894 2 2 0 1.104 -0.896 2 -2 2 z`,
			GUILD_CATEGORY: `M 9.6 1.6 L 9.6 6.4 L 3.2 6.4 L 3.2 1.6 L 9.6 1.6 Z M 16 16 L 22.4 16 L 22.4 20.8 L 16 20.8 L 16 16.533333328 L 16 16 Z M 14.4 12.8 L 8 12.8 L 8 17.6 L 14.4 17.6 L 14.4 20.8 L 8 20.8 L 4.8 20.8 L 4.8 8 L 8 8 L 8 9.6 L 14.4 9.6 L 14.4 12.8 Z`,
			DEFAULT: `M 11.44 0 c 4.07 0 8.07 1.87 8.07 6.35 c 0 4.13 -4.74 5.72 -5.75 7.21 c -0.76 1.11 -0.51 2.67 -2.61 2.67 c -1.37 0 -2.03 -1.11 -2.03 -2.13 c 0 -3.78 5.56 -4.64 5.56 -7.76 c 0 -1.72 -1.14 -2.73 -3.05 -2.73 c -4.07 0 -2.48 4.19 -5.56 4.19 c -1.11 0 -2.07 -0.67 -2.07 -1.94 C 4 2.76 7.56 0 11.44 0 z M 11.28 18.3 c 1.43 0 2.61 1.17 2.61 2.61 c 0 1.43 -1.18 2.61 -2.61 2.61 c -1.43 0 -2.61 -1.17 -2.61 -2.61 C 8.68 19.48 9.85 18.3 11.28 18.3 z`
		};

		this.defaults = {
			settings: {
				sortNative:				{value:false, 	description:"Sort hidden Channels in the native Order"},
				showText:				{value:true, 	description:"Show hidden Text Channels"},
				showVoice:				{value:true, 	description:"Show hidden Voice Channels"},
				showAnnouncement:		{value:true, 	description:"Show hidden Announcement Channels"},
				showStore:				{value:true, 	description:"Show hidden Store Channels"},
				showForNormal:			{value:false,	description:"Add Access-Overview ContextMenu Entry for non-hidden Channels"},
			},
			amounts: {
				hoverDelay:				{value:0, 		min:0,			description:"Tooltip delay in millisec:"}
			}
		};

		this.channelTypes = {};
		for (let type in BDFDB.DiscordConstants.ChannelTypes) this.channelTypes[BDFDB.DiscordConstants.ChannelTypes[type]] = type;
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		let settings = BDFDB.DataUtils.get(this, "settings");
		let settingsitems = [], inneritems = [];
		
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
			
			BDFDB.ModuleUtils.patch(this, BDFDB.LibraryModules.UnreadChannelUtils, "hasUnread", {after: e => {
				return e.returnValue && !this.isChannelHidden(e.methodArguments[0]);
			}});

			BDFDB.ModuleUtils.forceAllUpdates(this);
		}
		else console.error(`%c[${this.getName()}]%c`, "color: #3a71c1; font-weight: 700;", "", "Fatal Error: Could not load BD functions!");
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			this.stopping = true;
			
			for (let guildid in this.changedInstances) this.resetInstance(guildid, true);
			
			BDFDB.PluginUtils.clear(this);
		}
	}


	// begin of own functions

	onSettingsClosed (instance, wrapper, returnvalue) {
		if (this.SettingsUpdated) {
			delete this.SettingsUpdated;
			
			for (let guildid in this.changedInstances) this.resetInstance(guildid, false);

			BDFDB.TimeUtils.timeout(_ => {BDFDB.ModuleUtils.forceAllUpdates(this)}, 3000);
		}
	}
	
	onChannelContextMenu (e) {
		if (e.instance.props.channel) {
			if (e.instance.props.channel.id.endsWith("hidden") && e.instance.props.channel.type == BDFDB.DiscordConstants.ChannelTypes.GUILD_CATEGORY) {
				let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {name: "ChannelMuteItem"});
				if (index > -1) children.splice(index, 1);
			}
			let isHidden = this.isChannelHidden(e.instance.props.channel.id);
			if (isHidden || BDFDB.DataUtils.get(this, "settings", "showForNormal")) {
				let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {name:["FluxContainer(MessageDeveloperModeGroup)", "DeveloperModeGroup"]});
				const itemgroup = BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ContextMenuItemGroup, {
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
						label: BDFDB.LanguageUtils.LanguageStrings.CHANNEL + " " + BDFDB.LanguageUtils.LanguageStrings.ACCESSIBILITY,
						action: _ => {
							BDFDB.ContextMenuUtils.close(e.instance);
							this.showAccessModal(e.instance.props.channel, !isHidden);
						}
					})
				});
				if (index > -1) children.splice(index, 0, itemgroup);
				else children.push(itemgroup);
			}
		}
	}

	processChannels (e) {
		if (!e.instance.props.guild) return;
		let [hiddenChannels, amount] = this.getHiddenChannels(e.instance.props.guild);
		if (amount) {
			let settings = BDFDB.DataUtils.get(this, "settings"), index = -1;
			for (let catId in e.instance.props.categories) for (let channelObj of e.instance.props.categories[catId]) if (channelObj.index > index) index = channelObj.index;
			let categoryType = BDFDB.DiscordConstants.ChannelTypes.GUILD_CATEGORY;
			if (!settings.sortNative) {
				let hiddenCategory = new BDFDB.DiscordObjects.Channel({
					guild_id: e.instance.props.guild.id,
					id: e.instance.props.guild.id + "_hidden",
					name: "hidden",
					type: categoryType
				});
				if (!BDFDB.ArrayUtils.is(e.instance.props.categories[hiddenCategory.id])) e.instance.props.categories[hiddenCategory.id] = [];
				if (!e.instance.props.categories._categories.some(categoryObj => categoryObj.channel && categoryObj.channel.id == hiddenCategory.id)) {
					e.instance.props.categories._categories.push({
						channel: hiddenCategory,
						index: ++index
					});
				}
				if (!e.instance.props.channels[categoryType].some(categoryObj => categoryObj.channel && categoryObj.channel.id == hiddenCategory.id)) {
					e.instance.props.channels[categoryType].push({
						comparator: ++(e.instance.props.channels[categoryType][e.instance.props.channels[categoryType].length - 1] || {comparator: 0}).comparator,
						channel: hiddenCategory
					});
				}
			}
				
			for (let type in hiddenChannels) {
				let channeltype = type == 0 && e.instance.props.channels.SELECTABLE ? "SELECTABLE" : type;
				if (!BDFDB.ArrayUtils.is(e.instance.props.channels[channeltype])) e.instance.props.channels[channeltype] = [];
				let comparator = (e.instance.props.channels[channeltype][e.instance.props.channels[channeltype].length - 1] || {comparator: 0}).comparator;
				for (let channel of hiddenChannels[type]) {
					let hiddenChannel = new BDFDB.DiscordObjects.Channel(Object.assign({}, channel, {
						parent_id: settings.sortNative ? channel.parent_id : e.instance.props.guild.id + "_hidden"
					}));
					let parent_id = hiddenChannel.parent_id || "null";
					if (!e.instance.props.categories[parent_id].some(channelObj => channelObj.channel && channelObj.channel.id == hiddenChannel.id)) {
						e.instance.props.categories[parent_id].push({
							channel: hiddenChannel,
							index: ++(e.instance.props.categories[parent_id][e.instance.props.categories[parent_id].length - 1] || {index: 0}).index
						});
					}
					if (!e.instance.props.channels[channeltype].some(channelObj => channelObj.channel && channelObj.channel.id == hiddenChannel.id)) {
						e.instance.props.channels[channeltype].push({
							comparator: ++comparator,
							channel: hiddenChannel
						});
					}
				}
			}
			
			this.changedInstances[e.instance.props.guild.id] = e.instance;
		}
	}

	processChannelItem (e) {
		if (e.instance.props.channel && this.isChannelHidden(e.instance.props.channel.id)) {
			if (e.returnvalue) {
				let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {name: "Icon"});
				if (index > -1) {
					delete children[index].props.name;
					children[index].props.nativeClass = true;
					children[index].props.iconSVG = `<svg class="${BDFDB.disCN.channelicon}" width="24" height="24" viewBox="0 0 24 24"><mask id="${this.name + e.instance.props.channel.id}" fill="black"><path d="M 0 0 H 24 V 24 H 0 Z" fill="white"></path><path d="M24 0 H 13 V 12 H 24 Z" fill="black"></path></mask><path mask="url(#${this.name + e.instance.props.channel.id})" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="${this.channelIcons[this.channelTypes[e.instance.props.channel.type]] || this.channelIcons.DEFAULT}"></path><path fill="currentColor" d="M 21.025 5 V 4 C 21.025 2.88 20.05 2 19 2 C 17.95 2 17 2.88 17 4 V 5 C 16.4477 5 16 5.44772 16 6 V 9 C 16 9.55228 16.4477 10 17 10 H 19 H 21 C 21.5523 10 22 9.55228 22 9 V 5.975C22 5.43652 21.5635 5 21.025 5 Z M 20 5 H 18 V 4 C 18 3.42857 18.4667 3 19 3 C 19.5333 3 20 3.42857 20 4 V 5 Z"></path></svg>`;
				}
				[children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {props:[["className", BDFDB.disCN.channelchildren]]});
				if (index > -1 && children[index].props && children[index].props.children) {
					children[index].props.children = [BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
						text: BDFDB.LanguageUtils.LanguageStrings.CHANNEL_LOCKED_SHORT,
						children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Clickable, {
							children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, {
								className: BDFDB.disCN.channelactionicon,
								name: BDFDB.LibraryComponents.SvgIcon.Names.LOCK_CLOSED
							})
						})
					})];
				}
			}
			if (e.node) {
				BDFDB.DOMUtils.addClass(e.node, BDFDB.disCN.channelmodelocked);
				e.node.addEventListener("click", BDFDB.ListenerUtils.stopEvent);
				e.node.addEventListener("mousedown", BDFDB.ListenerUtils.stopEvent);
				e.node.addEventListener("mouseup", BDFDB.ListenerUtils.stopEvent);
			}
		}
	}
	
	resetInstance (guildid, update) {
		let instance = this.changedInstances[guildid];
		if (instance) {
			delete instance.props.categories[guildid + "_hidden"];
			let removedCategories = [], categoryType = BDFDB.DiscordConstants.ChannelTypes.GUILD_CATEGORY;
			for (let categoryObj of instance.props.categories._categories) if (categoryObj.channel.id.endsWith("hidden")) removedCategories.push(categoryObj);
			for (let categoryObj of removedCategories) BDFDB.ArrayUtils.remove(instance.props.categories._categories, categoryObj);
			for (let id in instance.props.categories) if (BDFDB.ArrayUtils.is(instance.props.categories[id])) {
				let removedCategories = [];
				for (let categoryObj of instance.props.categories[id]) if (categoryObj.channel.id.endsWith("hidden")) removedCategories.push(categoryObj);
				for (let categoryObj of removedCategories) BDFDB.ArrayUtils.remove(instance.props.categories[id], categoryObj);
			}
			for (let type in instance.props.channels) if (BDFDB.ArrayUtils.is(instance.props.channels[type])) {
				let removedChannels = [];
				for (let channelObj of instance.props.channels[type]) if (this.isChannelHidden(channelObj.channel.id) && (channelObj.channel.type != categoryType || channelObj.channel.id.endsWith("hidden"))) removedChannels.push(channelObj);
				for (let channelObj of removedChannels) BDFDB.ArrayUtils.remove(instance.props.channels[type], channelObj);
			}
			delete this.changedInstances[guildid].instance;
			if (update) BDFDB.ReactUtils.forceUpdate(instance);
		}
	}
	
	isChannelHidden (channelid) {
		return !BDFDB.UserUtils.can("VIEW_CHANNEL", BDFDB.UserUtils.me.id, channelid);
	}
	
	getHiddenChannels (guild) {
		if (!guild) return [{}, 0];
		let settings = BDFDB.DataUtils.get(this, "settings");
		let all = BDFDB.LibraryModules.ChannelStore.getChannels(), hidden = {}, amount = 0;
		for (let type in BDFDB.DiscordConstants.ChannelTypes) hidden[BDFDB.DiscordConstants.ChannelTypes[type]] = [];
		for (let channel_id in all) {
			let channel = all[channel_id];
			if (channel.guild_id == guild.id && (settings[this.settingsMap[this.channelTypes[channel.type]]] || settings[this.settingsMap[this.channelTypes[channel.type]]] === undefined) && this.isChannelHidden(channel.id)) {
				amount++;
				hidden[channel.type].push(channel);
			}
		}
		return [hidden, amount];
	}
	
	showAccessModal (channel, allowed) {
		let guild = BDFDB.LibraryModules.GuildStore.getGuild(channel.guild_id);
		if (guild) {
			let category = BDFDB.LibraryModules.ChannelStore.getChannel(BDFDB.LibraryModules.ChannelStore.getChannel(channel.id).parent_id);
			let lighttheme = BDFDB.DiscordUtils.getTheme() == BDFDB.disCN.themelight;
			let myMember = BDFDB.LibraryModules.MemberStore.getMember(guild.id, BDFDB.UserUtils.me.id);
			let allowedRoles = [], allowedUsers = [], deniedRoles = [], deniedUsers = [], everyoneDenied = false;
			for (let id in channel.permissionOverwrites) {
				if (channel.permissionOverwrites[id].type == "role" && (guild.roles[id] && guild.roles[id].name != "@everyone") && ((channel.permissionOverwrites[id].allow | BDFDB.DiscordConstants.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].allow || (channel.permissionOverwrites[id].allow | BDFDB.DiscordConstants.Permissions.CONNECT) == channel.permissionOverwrites[id].allow)) {
					allowedRoles.push(Object.assign({overwritten: myMember.roles.includes(id) && !allowed}, guild.roles[id]));
				}
				else if (channel.permissionOverwrites[id].type == "member" && ((channel.permissionOverwrites[id].allow | BDFDB.DiscordConstants.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].allow || (channel.permissionOverwrites[id].allow | BDFDB.DiscordConstants.Permissions.CONNECT) == channel.permissionOverwrites[id].allow)) {
					let user = BDFDB.LibraryModules.UserStore.getUser(id);
					let member = BDFDB.LibraryModules.MemberStore.getMember(guild.id,id);
					if (user && member) allowedUsers.push(Object.assign({}, user, member));
				}
				if (channel.permissionOverwrites[id].type == "role" && ((channel.permissionOverwrites[id].deny | BDFDB.DiscordConstants.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].deny || (channel.permissionOverwrites[id].deny | BDFDB.DiscordConstants.Permissions.CONNECT) == channel.permissionOverwrites[id].deny)) {
					deniedRoles.push(guild.roles[id]);
					if (guild.roles[id] && guild.roles[id].name == "@everyone") everyoneDenied = true;
				}
				else if (channel.permissionOverwrites[id].type == "member" && ((channel.permissionOverwrites[id].deny | BDFDB.DiscordConstants.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].deny || (channel.permissionOverwrites[id].deny | BDFDB.DiscordConstants.Permissions.CONNECT) == channel.permissionOverwrites[id].deny)) {
					let user = BDFDB.LibraryModules.UserStore.getUser(id);
					let member = BDFDB.LibraryModules.MemberStore.getMember(guild.id, id);
					if (user && member) deniedUsers.push(Object.assign({}, user, member));
				}
			}
			if (allowed && !everyoneDenied) allowedRoles.push({name: "@everyone"});
			let allowedElements = [], deniedElements = [];
			for (let role of allowedRoles) allowedElements.push(this.createRoleRow(role));
			for (let user of allowedUsers) allowedElements.push(this.createUserRow(user));
			for (let role of deniedRoles) deniedElements.push(this.createRoleRow(role));
			for (let user of deniedUsers) deniedElements.push(this.createUserRow(user));
			
			BDFDB.ModalUtils.open(this, {
				size: "MEDIUM",
				header: BDFDB.LanguageUtils.LanguageStrings.CHANNEL + " " + BDFDB.LanguageUtils.LanguageStrings.ACCESSIBILITY,
				subheader: "#" + channel.name,
				contentClassName: BDFDB.disCN.listscroller,
				children: [
					BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ModalComponents.ModalTabContent, {
						className: BDFDB.disCN.modalsubinner,
						tab: BDFDB.LanguageUtils.LanguageStrings.OVERLAY_SETTINGS_GENERAL_TAB,
						children: [{
								title: BDFDB.LanguageUtils.LanguageStrings.FORM_LABEL_CHANNEL_NAME,
								text: channel.name
							}, {
								title: BDFDB.LanguageUtils.LanguageStrings.FORM_LABEL_CHANNEL_TOPIC,
								text: channel.topic || BDFDB.LanguageUtils.LanguageStrings.CHANNEL_TOPIC_EMPTY
							}, {
								title: BDFDB.LanguageUtils.LanguageStrings.CHANNEL_TYPE,
								text: BDFDB.LanguageUtils.LanguageStrings[this.typeNameMap[this.channelTypes[channel.type]]]
							}, {
								title: BDFDB.LanguageUtils.LanguageStrings.CATEGORY_NAME,
								text: category && category.name || BDFDB.LanguageUtils.LanguageStrings.NO_CATEGORY
							}].map((formlabel, i) => [,
								i == 0 ? null : BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
									className: BDFDB.disCN.marginbottom20
								}),
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormItem, {
									title: `${formlabel.title}:`,
									className: BDFDB.DOMUtils.formatClassName(BDFDB.disCN.marginbottom20, i == 0 && BDFDB.disCN.margintop8),
									children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormText, {
										className: BDFDB.disCN.marginleft8,
										children: formlabel.text
									})
								})
							]).flat().filter(n => n)
					}),
					BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ModalComponents.ModalTabContent, {
						tab: this.labels.modal_allowed_text,
						children: allowedElements.length ? allowedElements :
							BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.MessagesPopoutComponents.EmptyStateBottom, {
								msg: BDFDB.LanguageUtils.LanguageStrings.AUTOCOMPLETE_NO_RESULTS_HEADER,
								image: lighttheme ? "/assets/9b0d90147f7fab54f00dd193fe7f85cd.svg" : "/assets/308e587f3a68412f137f7317206e92c2.svg"
							})
					}),
					BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ModalComponents.ModalTabContent, {
						tab: this.labels.modal_denied_text,
						children: deniedElements.length ? deniedElements :
							BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.MessagesPopoutComponents.EmptyStateBottom, {
								msg: BDFDB.LanguageUtils.LanguageStrings.AUTOCOMPLETE_NO_RESULTS_HEADER,
								image: lighttheme ? "/assets/9b0d90147f7fab54f00dd193fe7f85cd.svg" : "/assets/308e587f3a68412f137f7317206e92c2.svg"
							})
					})
				]
			});
		}
	}
	
	createRoleRow (role) {
		return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ListRow, {
			prefix: BDFDB.ReactUtils.createElement("div", {
				className: BDFDB.disCNS.avataricon + BDFDB.disCNS.listavatar + BDFDB.disCNS.avatariconsizemedium + BDFDB.disCN.avatariconinactive,
				style: {
					boxSizing: "border-box",
					padding: 10
				},
				children: BDFDB.ReactUtils.createElement("div", {
					style: {
						borderRadius: "50%",
						height: "100%",
						width: "100%",
						backgroundColor: BDFDB.ColorUtils.convert(role.colorString || BDFDB.DiscordConstants.Colors.PRIMARY_DARK_300, "RGB")
					}
				})
			}),
			labelClassName: role.overwritten && BDFDB.disCN.linethrough,
			label: BDFDB.ReactUtils.createElement("span", {
				children: role.name,
				style: {color: role.colorString}
			})
		});
	}
	
	createUserRow (user) {
		return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ListRow, {
			prefix: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Avatar, {
				className: BDFDB.disCN.listavatar,
				src: BDFDB.UserUtils.getAvatar(user.id),
				status: BDFDB.UserUtils.getStatus(user.id),
				size: BDFDB.LibraryComponents.Avatar.Sizes.SIZE_40
			}),
			label: [
				BDFDB.ReactUtils.createElement("span", {
					className: BDFDB.disCN.username,
					children: user.username,
					style: {color: user.colorString}
				}),
				BDFDB.ReactUtils.createElement("span", {
					className: BDFDB.disCN.listdiscriminator,
					children: `#${user.discriminator}`
				})
			]
		});
	}

	setLabelsByLanguage () {
		switch (BDFDB.LanguageUtils.getLanguage().id) {
			case "hr":		//croatian
				return {
					modal_allowed_text:				"Dopušteno",
					modal_denied_text:				"Odbijen"
				};
			case "da":		//danish
				return {
					modal_allowed_text:				"Odbijen",
					modal_denied_text:				"Nægtet"
				};
			case "de":		//german
				return {
					modal_allowed_text:				"Erlaubt",
					modal_denied_text:				"Verweigert"
				};
			case "es":		//spanish
				return {
					modal_allowed_text:				"Permitido",
					modal_denied_text:				"Negado"
				};
			case "fr":		//french
				return {
					modal_allowed_text:				"Permis",
					modal_denied_text:				"Nié"
				};
			case "it":		//italian
				return {
					modal_allowed_text:				"Permesso",
					modal_denied_text:				"Negato"
				};
			case "nl":		//dutch
				return {
					modal_allowed_text:				"Toegestaan",
					modal_denied_text:				"Ontkend"
				};
			case "no":		//norwegian
				return {
					modal_allowed_text:				"Tillatt",
					modal_denied_text:				"Benektet"
				};
			case "pl":		//polish
				return {
					modal_allowed_text:				"Dozwolony",
					modal_denied_text:				"Odmówiono"
				};
			case "pt-BR":	//portuguese (brazil)
				return {
					modal_allowed_text:				"Permitido",
					modal_denied_text:				"Negado"
				};
			case "fi":		//finnish
				return {
					modal_allowed_text:				"Sallittu",
					modal_denied_text:				"Evätty"
				};
			case "sv":		//swedish
				return {
					modal_allowed_text:				"Tillåten",
					modal_denied_text:				"Nekas"
				};
			case "tr":		//turkish
				return {
					modal_allowed_text:				"Izin",
					modal_denied_text:				"Inkar"
				};
			case "cs":		//czech
				return {
					modal_allowed_text:				"Povoleno",
					modal_denied_text:				"Odepřeno"
				};
			case "bg":		//bulgarian
				return {
					modal_allowed_text:				"Позволен",
					modal_denied_text:				"Отказан"
				};
			case "ru":		//russian
				return {
					modal_allowed_text:				"Разрешается",
					modal_denied_text:				"Отказано"
				};
			case "uk":		//ukrainian
				return {
					modal_allowed_text:				"Дозволено",
					modal_denied_text:				"Заперечували"
				};
			case "ja":		//japanese
				return {
					modal_allowed_text:				"許可された",
					modal_denied_text:				"拒否されました"
				};
			case "zh-TW":	//chinese (traditional)
				return {
					modal_allowed_text:				"允許的",
					modal_denied_text:				"被拒絕"
				};
			case "ko":		//korean
				return {
					modal_allowed_text:				"허용됨",
					modal_denied_text:				"거부"
				};
			default:		//default: english
				return {
					modal_allowed_text:				"Permitted",
					modal_denied_text:				"Denied"
				};
		}
	}
}
