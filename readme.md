# Coctohug - Manage dozens of chia blockchain forks  mining from a web browser!
- Nice localization with support of dozens of languages: [English](https://github.com/raingggg/coctohug/blob/main/readme_en.md), [العربية](https://github.com/raingggg/coctohug/blob/main/readme_ar.md), [Bulgarian](https://github.com/raingggg/coctohug/blob/main/readme_bg.md), [Catalan](https://github.com/raingggg/coctohug/blob/main/readme_ca.md), [Deutsch](https://github.com/raingggg/coctohug/blob/main/readme_de.md), [Español](https://github.com/raingggg/coctohug/blob/main/readme_es.md), [زبان فارسی](https://github.com/raingggg/coctohug/blob/main/readme_fa.md), [Français](https://github.com/raingggg/coctohug/blob/main/readme_fr.md), [Galego](https://github.com/raingggg/coctohug/blob/main/readme_gl.md), [Indonesian](https://github.com/raingggg/coctohug/blob/main/readme_id.md), [Italiano](https://github.com/raingggg/coctohug/blob/main/readme_it.md), [日本語](https://github.com/raingggg/coctohug/blob/main/readme_ja.md), [한국어](https://github.com/raingggg/coctohug/blob/main/readme_ko.md), [Português do Brasil](https://github.com/raingggg/coctohug/blob/main/readme_pt.md), [limba română](https://github.com/raingggg/coctohug/blob/main/readme_ro.md), [Русский](https://github.com/raingggg/coctohug/blob/main/readme_ru.md), [Serbian](https://github.com/raingggg/coctohug/blob/main/readme_sr.md), [Thai](https://github.com/raingggg/coctohug/blob/main/readme_th.md), [Tagalog (Filipino)](https://github.com/raingggg/coctohug/blob/main/readme_tl.md), [Türkçe](https://github.com/raingggg/coctohug/blob/main/readme_tr.md), [Українська](https://github.com/raingggg/coctohug/blob/main/readme_uk.md), [Vietnamese](https://github.com/raingggg/coctohug/blob/main/readme_vi.md), [简体中文](https://github.com/raingggg/coctohug/blob/main/readme_zh-CN.md), [繁體中文](https://github.com/raingggg/coctohug/blob/main/readme_zh-TW.md)
- Supports: [cactus](https://github.com/raingggg/coctohug-cactus), [covid](https://github.com/raingggg/coctohug-covid), [cryptodoge](https://github.com/raingggg/coctohug-cryptodoge), [ethgreen](https://github.com/raingggg/coctohug-ethgreen), [flora](https://github.com/raingggg/coctohug-flora), [greendoge](https://github.com/raingggg/coctohug-greendoge), [lucky](https://github.com/raingggg/coctohug-lucky) [pipscoin](https://github.com/raingggg/coctohug-pipscoin), [shibgreen](https://github.com/raingggg/coctohug-shibgreen), [silicoin](https://github.com/raingggg/coctohug-silicoin), [skynet](https://github.com/raingggg/coctohug-skynet) [staicoin](https://github.com/raingggg/coctohug-staicoin), [stor](https://github.com/raingggg/coctohug-stor), [tranzact](https://github.com/raingggg/coctohug-tranzact), [venidium](https://github.com/raingggg/coctohug-venidium), and more...
- Runs on Linux, Windows, MacOS, and more...

Easy Setup using [Quick Start](https://www.coctohug.xyz/)

*Seek more help on our [Website](https://www.coctohug.xyz/) / [Github](https://github.com/raingggg/coctohug) / [Discussions](https://github.com/raingggg/coctohug/discussions) / [Discord](https://discord.com/invite/RcVpCw3ef7)*.

*[Here is more detailed user manual](https://github.com/raingggg/coctohug/blob/main/docs/wiki/wiki_en.md)*


## English View
![English](https://www.coctohug.xyz/images/coctohug-en-min.png)

## Chinese View
![Chinese](https://www.coctohug.xyz/images/coctohug-cn-min.png)

## Russian View
![Russian](https://www.coctohug.xyz/images/coctohug-russian-min.png)

## German View
![German](https://www.coctohug.xyz/images/coctohug-german-min.png)


# web
- a web ui to show the chia forks farming status
- env WEB_MODE=controller (one of controller or hand)

# quick start for chia testing
- WEB_MODE="controller" npm start
- WEB_MODE="worker" npm start

# quick start for flora testing
- WEB_MODE="controller" config_file="/home/username/works/coctohug/coctohug-web/flora.json" npm start
- WEB_MODE="worker" worker_web_port="12632" config_file="/home/username/works/coctohug/coctohug-web/flora.json" npm start
- WEB_MODE="worker" controller_address="192.168.124.158" worker_web_port="12632" config_file="/home/username/works/coctohug/coctohug-web/flora.json" npm start

# Supported Features
- hands tab
- show wallet balance on review page as well
- restart support
- fist time check and generate keys
- cold wallet mode
- import/export cold wallet
- connections add remove support
- nft recovery
- Integrate cold wallet value check into wallet page
- money transfer support
- password protect for setting
- harvester mode
- certificates api interval 30 mins for harvester
- multiple language support
- enable coldwallet in wallet.model

# todo
- wallet mode in dockers
- check mnc.bak
- icon for faq
- news/report with translation
- general alert dialog for all with dynamic message support
- watchdog message do not alert too often - once per 5 minutes
- auto transfer to coldwallet every 5 minutes as a job


## Trademark Notice
CHIA NETWORK INC, CHIA™, the CHIA BLOCKCHAIN™, the CHIA PROTOCOL™, CHIALISP™ and the “leaf Logo” (including the leaf logo alone when it refers to or indicates Chia), are trademarks or registered trademarks of Chia Network, Inc., a Delaware corporation. *There is no affliation between this Coctohug project and the main Chia Network project.*
