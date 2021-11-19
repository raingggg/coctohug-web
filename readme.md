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
- tab in yellow color when too long not response
- show # under chainname


## Trademark Notice
CHIA NETWORK INC, CHIA™, the CHIA BLOCKCHAIN™, the CHIA PROTOCOL™, CHIALISP™ and the “leaf Logo” (including the leaf logo alone when it refers to or indicates Chia), are trademarks or registered trademarks of Chia Network, Inc., a Delaware corporation. *There is no affliation between this Coctohug project and the main Chia Network project.*
