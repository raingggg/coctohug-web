# Changelog

## [1.7.5] - 2022-09-30
- moon fork support

## [1.7.4] - 2022-05-15
- connection height not showing fix for some forks
- auto restart when memory exceeds limit
- restart all feature on restart page
- new warnings and received coins message clearing fix
- netspace size fix for petroleum
- chinilla vkey fix
- noticeable mark on clicked menu
- chia claim nft REGEX update for the pooling part

## [1.7.3] - 2022-04-27
- update chia to latest 1.3.4
- update chinilla to latest 1.0.3
- update staicoin to latest 1.2.2
- add MaxPost link to best practice menu: https://discord.gg/Df8s3KAg5n
- remove xch donation address from best practice menu
- Farming menu hands removing fix
- chinilla path mapping fix
- investigate on latest posat v2 api: https://mrkt.posat.io/api/prices/v2

## [1.7.2] - 2022-04-10
- add chinilla icon
- ccm custom script for chinilla
- chinilla harvester fix

## [1.7.1] - 2022-04-07
- new fork support: chinilla
- Estimated effective network space for petroleum

## [1.7.0] - 2022-04-05
- fix chives mojo unit

## [1.6.9] - 2022-04-04
- new fork support: petroleum

## [1.6.8] - 2022-04-01
- new fork support: ecostake

## [1.6.7] - 2022-03-19
- update chia to latest 1.3.1
- add icons for joker and profit
- add filter to all tables
- restart fork after editing the config.yaml
- update profit: target address, monthly usd for app, staking formulation
- add donation address
- add more useful links to 'Best Practice' menu

## [1.6.6] - 2022-03-15
- new fork support: profit

## [1.6.5] - 2022-03-13
- correct farming detail issue

## [1.6.4] - 2022-03-13
- correct farming menu page

## [1.6.3] - 2022-03-13
- Add Farming Page for showing raw farming detail, including the staking amount
- new fork support: joker

## [1.6.2] - 2022-03-12
- chia wallet balance does not include CAT
- add useful site links to Best Practice menu

## [1.6.1] - 2022-03-03
- translation improvement for config.yaml page

## [1.6.0] - 2022-03-03
- mark error with red colors; mark syncing with yellow colors

## [1.5.9] - 2022-03-03
- mark error with red colors; mark syncing with yellow colors
- add possibility to change config files via gui
- "Daily Report" and "Weekly Report" a. remove message column b. add instead Amount column and Token name collumn

## [1.5.8] - 2022-02-27
- go to alltheblocks.net when clicking on fork icon for table view

## [1.5.7] - 2022-02-27
- more forks have a price now by merging alltheblocks.net and posat.io pricing information

## [1.5.6] - 2022-02-22
- fix forks price issue by using new API

## [1.5.5] - 2022-02-20
- add logos, tokenname, sorting to all tabs
- add isValidETW to show forks out of expectation with red font
- move best practices from summary chart to a new tab

## [1.5.4] - 2022-02-14
- add logos, tokenname, sorting to balance tab
- add logos, tokenname, sorting to recieved coins tab
- add logos to summary chart

## [1.5.3] - 2022-02-14
- add logos for all forks

## [1.5.2] - 2022-02-09
- new fork support: gold

## [1.5.1] - 2022-02-09
- new fork support: bpx

## [1.5.0] - 2022-02-09
- table veiw improvement for columns: version, #plots, blocksToday, ETW
- ccm improvement for: restart, silicoin
- peers_count improvement for all forks

## [1.4.8] - 2022-01-28
- standard wallet mode support

## [1.4.7] - 2022-01-22
- correct littlelambocoin mojo unit

## [1.4.6] - 2022-01-22
- littlelambocoin support

## [1.4.5] - 2022-01-22
- no_block_time and today_block_count added to balance view
- claim nft 7/8 reward button for chia
- alter force-status from 90 minutes to 4 hours
- improve logger info for api access failure cases
- move hostname into last column for restart menu

## [1.4.4] - 2022-01-18
- hours_since_last_block with 1 decimal point

## [1.4.2] - 2022-01-18
- how long it has passed since last winning block
- how many blocks winned today
- add order into hands-table and move ip to the last column
- allow harvester in 120 minutes

## [1.4.1] - 2022-01-11
- Fix last_block_time on simple_view sorting issue

## [1.4.0] - 2022-01-11
- Fix hddcoin wallet not showing issue
- Add last_block_time to simple_view

## [1.3.9] - 2022-01-09
- Fix hddcoin and melati wallet not showing issue

## [1.3.8] - 2022-01-09
- 0 coin price fix
- Fix 5 connection-of-less-memory not working issue

## [1.3.7] - 2022-01-08
- Support 3 new forks: lotus thyme kiwi
- Make timeout longer for farm_summary and wallet_summary

## [1.3.6] - 2022-01-07
- Support 4 new forks: rolls melon goldcoin kujenga
- fix fullnode wallet_balance not accurate issue

## [1.3.5] - 2022-01-06
- Support 4 new forks: rolls melon goldcoin kujenga
- Save RAM usage by more than 30% improvement

## [1.3.4] - 2021-12-31
- Remember font-size choices for desktop review page
- Mark one row when been clicked for desktop review page
- Improve sorting feature for netspace and expected_win_time
- Coin Address > Wallet Address
- Mark wallet balance with green color
- Cold wallet > Reward address

## [1.3.3] - 2021-12-30
- Reward address updates balance every hour
  
## [1.3.2] - 2021-12-28
- call APIs with random interval to reduce PC and Server pressure

## [1.3.1] - 2021-12-28
- show correct farming status immediately after users opening the summary page
- update coin price and amount to show at most 8 digits
- optimize docker file to speed up the deploying process
  
## [1.3.0] - 2021-12-27
- fix too many offline and signage point warning issue

## [1.2.9] - 2021-12-27
- don't show harvester records on summary page

## [1.2.8] - 2021-12-27
- only execute jobs when WebUser is accessing Coctohug, otherwise once per hour at most
- sample 1% chia-watch-dog to save computer resource
- connections page supports adding multiple peers with multiple format
- add blockchain version and port to UI
- show wallet address on Keys and Wallet page
- toggle font-size support on table layout page
- wallet mode js function to automatically alter configuration of connecting fullnode
- table layout ui improvement
- move all js/css into coctohug, instead of using online cdn

## [1.2.7] - 2021-12-24
- summary table layout
- summary board color fix when fork number bigger than 20
- keep 2 days record for: received coins and daily report

## [1.2.6] - 2021-12-22
- clear news data longer than 2 days
- clear weekly/all data longer than 2 weeks
- remove chia-watch-dog events from log
- docker wallet-no-farmer mode config.yml edit fix with nodejs
- support new 10+ forks:
chives
avocado
kale
cannabis
melati
sector
scam
fork

seno
rose
goji
spare
chaingreen

## [1.2.5] - 2021-12-21
- allow harverst fix for farmer-no-wallet mode
- ccm full guide

## [1.2.4] - 2021-12-20
- show yellow background for not getting data longer than 30 minutes cases
- add version number to leftbar
- use ccm for guide

## [1.2.3] - 2021-12-20
- clear logs everyday: watchdoglog, blockchainlog, weblog
- fix chia-watch-dog not sending daily stats
- wallet-no-farmer docker-image fix

## [1.2.2] - 2021-12-17
- coin amount fix for 1e-7 cases

## [1.2.1] - 2021-12-17
- farmer mode add watch-dog
- wallet mode start blockchain by default

## [1.2.0] - 2021-12-17
- farmer support for all forks
- restart fix depeneds on modes

## [1.1.0] - 2021-12-16
- harvester support for all forks
- chia and nchain support
- trivial ui fix

## [1.0.5] - 2021-12-15
- Account balance of Wallet in US Dollar
- weekly report with coldwallet
- daily report with coldwallet
- auto add 30 peers when it is less than 3
- fast node sync doc update
- auto archive warning more than 3 days

## [1.0.1] - 2021-12-12
- cold wallet support
- received coins support
- watch-dog support
- password protected