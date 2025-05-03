# syncribullet (v2)
SyncriBullet is a Stremio Addon that synchronizes your watchlist with other services.

> [!NOTE]
> - (2025.05.03) Added support for reconfiguring the addon.
> - (2025.03.09) Added support for TVTime! (awful API btw)
> - (2025.03.06) Added support for Kitsu! (also helps with NSFW content)


## Table of Contents
- [Info](#info)
    - [Goal](#goal)
    - [WARNING](#warning)
- [ToDo](#todo)
    - [Dynamic Sync](#dynamic-sync)
    - [Import Sync](#import-sync)
    - [Advanced Sync](#advanced-sync)
    - [Two-Way Sync](#two-way-sync)
    - [Catalogs](#catalogs)
- [Use the Addon](#use-the-addon)
- [Modify and Build yourself](#modify-and-build-yourself)
    - [Build](#build)
    - [Start](#start)
    - [Develop](#develop)
- [Known Issues](#known-issues)
- [What else?](#what-else)
    - [Naming](#naming)
    - [Pull Requests](#pull-requests)
    - [Stars](#stars)
    - [Contact](#contact)
- [Support](#support)
    - [Special Thanks](#special-thanks)


## Info
Currently the addon synchronizes with following services:
- Anilist
- Kitsu
- Simkl
- TVTime

I plan on adding the following in the very near future:
- MyAnimelist
- Trakt

### Goal
I want to implement a two way sync over multiple services with Stremio acting as the _Sender_ and the watchlists acting as the _Receivers_.


### WARNING
> [!WARNING]
> I have tested this as good as possible. Everything published here is currently good to go and shouldn't mess up your library.
> That said if anything does happen... I can't guarantee anything. Open up an Issue and I may be able to help out.

## ToDo

### Dynamic Sync
Dynamic Sync is when an item in the _Senders_ is updated, that it get's reflected on the _Receivers_.

- [X] Dynamic Sync from Stremio to Anilist
- [X] Dynamic Sync from Stremio to Kitsu
- [ ] Dynamic Sync from Stremio to MyAnimelist
- [X] Dynamic Sync from Stremio to Simkl
- [ ] Dynamic Sync from Stremio to Trakt (Already native Support use that)
- [X] Dynamic Sync from Stremio to TVTime

### Import Sync
Import Sync is theoretically a one-time action where the whole library get's synchronised from the _Senders_ to the _Receivers_ and vice-versa. But the plan is, that this can be run multiple times without wierd issues.

- [ ] Import Sync from Stremio to Anilist
- [ ] Import Sync from Stremio to Kitsu
- [ ] Import Sync from Stremio to MyAnimelist
- [ ] Import Sync from Stremio to Simkl (Alternative until tested: [simkl-stremio](https://github.com/aliyss/simkl-stremio))
- [ ] Import Sync from Stremio to Trakt (Alternative until tested: [trakt-stremio-import](https://github.com/aliyss/trakt-stremio-import))
- [ ] Import Sync from Stremio to TVTime

### Advanced Sync
Advanced Sync is when the theoretical _Receivers_ share their data between each other, validating and keeping each other in sync.

- [ ] Sync between all Receivers

### Two-Way Sync
Of course I'm going for the two-way sync. However this is harder than it actually seems at the moment. Due to not knowing what the prefered sync order is. And currently in discussion with Stremio to implement a way to have addons receive events for syncing.

### Catalogs
Stremio Catalog Support, self explanatory if you are using stremio.

- [X] Anilist
- [X] Kitsu
- [ ] MyAnimelist
- [X] Simkl
- [ ] Trakt
- [X] TVTime

## Use the Addon

[Click here!](https://56bca7d190fc-syncribullet.baby-beamup.club/)

## Modify and Build yourself

### Build

```bash
npm install
npm run build
```

### Start
Start the program. Then open the browser at the url mentioned, if this doesn't already happen automatically.

```bash
npm run start:local
```

### Develop
Instead of _Start_. Use the following. This will allow you to see the changes live.

```bash
npm run start:dev
```

## Known Issues
- Authtokens are not updated if they expire. I'm working on that.

## What else?

### Naming
I chose the name SyncriBullet, because I want to blend all of the tracking websites together in a synchronised mix. There's not much more to it.

### Pull Requests
Feel free to open pull requests if you think there can be improvements made. I will add an eslint check asap.

### Stars
A star would be kind, but honestly I use GitHub stars more as bookmarks. So instead bookmark it.

### Contact
- [Stremio Addons Discord Server](https://discord.gg/zNRf6YF)
- [Simkl Discord Server](https://discord.com/invite/u89XfYn)
- [AniList Discord Server](https://discord.com/invite/TF428cr)
- [Aliyss' Discord Server (Mine ^^)](https://discord.com/invite/zAypMTH)

## Support
If you like what I do consider buying me a coffee ;)

[Paypal (preferred)](https://www.paypal.me/aliyssnow)
[Buy Me A Coffee](https://www.buymeacoffee.com/aliyss)

### Special Thanks
- [haumarco](https://github.com/haumarco) for saving an extra character when compressing the user settings.
- [Anilist Wrapper](https://github.com/Api-Wrappers/anilist-wrapper/) for providing the initial code for the Anilist API, which I shamelessly copied and modified.
