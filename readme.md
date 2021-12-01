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

# todo
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

- wallet mode in dockers
- check mnc.bak
- icon for faq
- news/report with translation
- general alert dialog for all with dynamic message support
- watchdog message do not alert too often - once per 5 minutes
- auto transfer to coldwallet every 5 minutes as a job
- show latest 500 messages
- https://www.coctohug.xyz/latestNews?locale=zh-CN

## Trademark Notice
CHIA NETWORK INC, CHIA™, the CHIA BLOCKCHAIN™, the CHIA PROTOCOL™, CHIALISP™ and the “leaf Logo” (including the leaf logo alone when it refers to or indicates Chia), are trademarks or registered trademarks of Chia Network, Inc., a Delaware corporation. *There is no affliation between this Coctohug project and the main Chia Network project.*
