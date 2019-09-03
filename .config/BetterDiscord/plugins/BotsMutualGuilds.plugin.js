//META{"name":"BotsMutualGuilds"}*//

var BotsMutualGuilds = (() => {
    const config = {"info":{"name":"BotsMutualGuilds","authors":[{"name":"Nirewen","discord_id":"106915215592923136","github_username":"nirewen"}],"version":"1.1.1","description":"Brings back mutual servers to bot accounts","github":"https://github.com/nirewen/BotsMutualGuilds","github_raw":"https://raw.githubusercontent.com/nirewen/BotsMutualGuilds/master/BotsMutualGuilds.plugin.js"},"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, PluginUpdater, PluginUtilities, ReactTools, Toasts} = Api;
    return class BotsMutualGuilds extends Plugin {
  
  load() {
    //
  }

  unload() {
    //
  }

  start() {
    Toasts.show(`${this.getName()} ${this.getVersion()} has started.`);
    PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), config.info.github_raw);

    this.initialized = true;
    this.MembersStore = WebpackModules.findByUniqueProperties(['getNick']);
  }
  
  stop() {
    this.initialized = false;
  }

  switchToGuild(id) {
    $(DiscordSelectors.Guilds.guildsWrapper.value)
      .find(DiscordSelectors.Guilds.guildInner.value)
      .filter((i, guild) => $(guild).html().includes(id))
      .find('a')[0]
      .click();

    $(DiscordSelectors.Backdrop.backdrop.value).click();
  }

  getUser(guild, id) {
    return this.MembersStore.getMembers(guild.id).find(u => u.userId == id);
  }

  getIconTemplate(guild) {
    return guild.icon
      ? `<div class="avatar-large icon-3o6xvg listAvatar-1NlAhb iconSizeMedium-2OqPjI iconInactive-98JN5i" style="background-image: url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp)"></div>`
      : `<div class="avatar-large icon-3o6xvg listAvatar-1NlAhb guildAvatarWithoutIcon-1sTmE_ iconSizeMedium-2OqPjI iconInactive-98JN5i noIcon-1a_FrS" style="font-size: 8px;">${guild.acronym}</div>`;
  }

  observer(e) {
    if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized)
      return;

    const elem = e.addedNodes[0];
    
    if (!elem.querySelector('.inner-1JeGVc .botTag-2WPJ74') || !this.initialized)
        return;

    const {user} = ReactTools.getOwnerInstance($(DiscordSelectors.UserModal.userSelectText.value)[0]).props;
	
	if (!user || !user.bot) return;

    let oldGuilds;
    
    $('div[class*="topSection"').children('div').first().append(`<div class="tabBarContainer-1s1u-z"><div class="tabBar-2MuP6- top-28JiJ-"><div class="itemSelected-1qLhcL item-PXvHYJ selected-3s45Ha tabBarItem-1b8RUP" style="border-color: rgb(255, 255, 255); color: rgb(255, 255, 255);">${this.locale.infos}</div><div class="itemDefault-3Jdr52 item-PXvHYJ notSelected-1N1G5p tabBarItem-1b8RUP" style="border-color: transparent; color: rgba(255, 255, 255, 0.4);">${this.locale.guild}</div></div></div>`);

    const tabs = $('.inner-1JeGVc')
      .find('.tabBarItem-1b8RUP');

    const guilds = $('.inner-1JeGVc')
      .find('.scrollerWrap-2lJEkd');

    tabs
      .on('mouseenter.bmg', (e) => {
		if (!$(e.currentTarget).hasClass('selected-3s45Ha')) $(e.currentTarget).css('border-color', 'rgba(255, 255, 255, 0.6)').css('color', 'rgba(255, 255, 255, 0.6)');
	  });
    tabs
      .on('mouseleave.bmg', (e) => {
		if (!$(e.currentTarget).hasClass('selected-3s45Ha')) $(e.currentTarget).css('border-color', 'transparent').css('color', 'rgba(255, 255, 255 ,0.4)');
	  });
    tabs.eq(1)
      .on('click.bmg', (e) => {
        e.stopPropagation();

        tabs.toggleClass('selected-3s45Ha').toggleClass('itemSelected-1qLhcL').toggleClass('notSelected-1N1G5p').toggleClass('itemDefault-3Jdr52');
		
		tabs.css('border-color', 'transparent').css('color', 'rgba(255, 255, 255 ,0.4)');
		$(e.currentTarget).css('border-color', 'rgb(255, 255, 255)').css('color', 'rgb(255, 255, 255)');

        oldGuilds = guilds.children();

        oldGuilds.parent().empty();
        
        guilds.append('<div class="scroller-2FKFPG listScroller-2_vlfo">');
	
        ReactTools.getOwnerInstance($(DiscordSelectors.Guilds.guildsWrapper.value)[0])
          .props.guilds.map(o => o.guild)
          .filter(guild => this.getUser(guild, user.id))
          .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
          .forEach((guild) => {
            guilds.find('.scroller-2FKFPG').append(
              $(`<div class="listRow-hutiT_ flex-1O1GKY weightMedium-2iZe9B">
                  ${this.getIconTemplate(guild)}
                  <div class="listRowContent-3Kih4Q">
                    <div class="listName-3w10cx size16-14cGz5 height16-2Lv3qA">${$('<div/>').text(guild.name).html()}</div>
                    <div class="guildNick-3uAm3i weightNormal-WI4TcG">${$('<div/>').text(this.getUser(guild, user.id).nick || '').html()}</div>
                  </div>
                </div>`).click(() => this.switchToGuild(guild.id))
            );
          });
      });

    tabs.eq(0)
      .on('click.bmg', (e) => {

        tabs.toggleClass('selected-3s45Ha').toggleClass('itemSelected-1qLhcL').toggleClass('notSelected-1N1G5p').toggleClass('itemDefault-3Jdr52');
		
		tabs.css('border-color', 'transparent').css('color', 'rgba(255, 255, 255 ,0.4)');
		$(e.currentTarget).css('border-color', 'rgb(255, 255, 255)').css('color', 'rgb(255, 255, 255)');

        guilds.empty();

        guilds.append(oldGuilds);
      });
  }
  
  get locale() {
    switch (document.documentElement.getAttribute('lang').split('-')[0]) {
      case 'en': // English
        return {
          'infos': 'User Info',
          'guild': 'Mutual Servers',
        };
      case 'da': // Dansk
        return {
          'infos': 'User Info',
          'guild': 'Mutual Servers',
        };
      case 'hr': // Croatian
        return {
          'infos': 'Informacije o korisniku',
          'guild': 'Zajednički serveri',
        };
      case 'de': // Deutsch
        return {
          'infos': 'Benutzerinformationen',
          'guild': 'Gemeinsame Server',
        };
      case 'es': // Español
        return {
          'infos': 'Información de usuario', 
          'guild': 'Servidores en común',
        };
      case 'fr': // Français
        return {
          'infos': 'Infos utilisateur', 
          'guild': 'Serveurs en commun',
        };
      case 'it': // Italiano
        return {
          'infos': 'Dati personali', 
          'guild': 'Server in comune',
        };
      case 'nl': // Nederlands
        return {
          'infos': 'Gebruikersinformatie', 
          'guild': 'Gemeenschappelijke servers',
        };
      case 'no': // Norsk
        return {
          'infos': 'User Info', 
          'guild': 'Felles servere',
        };
      case 'pl': // Polski
        return {
          'infos': 'Informacje', 
          'guild': 'Wspólne serwery',
        };
      case 'pt': // Português do Brasil
        return {
          'infos': 'Informações do usuário', 
          'guild': 'Servidores em comum',
        };
      case 'fi': // Suomi
        return {
          'infos': 'Käyttäjätiedot', 
          'guild': 'Yhteiset palvelimet',
        };
      case 'sv': // Svenska
        return {
          'infos': 'Användarinfo', 
          'guild': 'Gemensamma servrar',
        };
      case 'tr': // Türkçe
        return {
          'infos': 'Kullanıcı Bilgisi', 
          'guild': 'Ortak Sunucular',
        };
      case 'cs': // Čeština
        return {
          'infos': 'Údaje uživatele', 
          'guild': 'Společné servery',
        };
      case 'bg': // български
        return {
          'infos': 'User Info', 
          'guild': 'Общи сървъри',
        };
      case 'ru': // Русский
        return {
          'infos': 'Профиль', 
          'guild': 'Общие сервера',
        };
      case 'uk': // Український
        return {
          'infos': 'User Info', 
          'guild': 'Спільні сервери',
        };
      case 'ja': // 日本語
        return {
          'infos': 'ユーザー情報', 
          'guild': '共通のサーバー',
        };
      case 'zh': // 繁體中文
        return {
          'infos': '使用者資訊', 
          'guild': '共同的伺服器',
        };
      case 'ko': // 한국어 
        return {
          'infos': '사용자 정보', 
          'guild': '같이 있는 서버',
        };
    }
  }
}
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
