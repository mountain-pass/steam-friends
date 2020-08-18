# steam-friends

Shows common games between all your friends.

# Running Locally

```sh
docker run -it -e STEAM_API_KEY=XXXXX -p 3000:3000 mountainpass/steam-friends
```

Then open the url:

- [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

## See also

- [Steam > Get Web API Key](http://steamcommunity.com/dev/apikey)
- [Steam > How to find your Steam ID](https://steamcommunity.com/sharedfiles/filedetails/?id=209000244)
- [Steam > Web API Definitions](https://developer.valvesoftware.com/wiki/Steam_Web_API)

* use steamid at step 1, instead of username
* handle generic name lookup e.g. "King"
* add link to g2a to purchase game
*
