# Ny-API [![Discord](https://discordapp.com/api/guilds/254360814063058944/embed.png)](https://skyra.pw/join)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/kyranet/Ny-API.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/kyranet/Ny-API/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/kyranet/Ny-API.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/kyranet/Ny-API/context:javascript)

Microservice for Ny-API, provides backend functionality for Skyra's dashboard.

## Development Requirements

- [`Node.js`]: To run the project.

[`Node.js`]: https://nodejs.org/en/download/current/

## Set-Up

Copy and paste the [`config.ts.example`] file and rename it to `config.ts`, then fill it with the precise variables.
Once all development requirements are set up:

```bash
# Lints and format all the code:
$ yarn lint

# Run Ny-API in development mode:
$ yarn start

# Run Ny-API in production mode:
$ yarn pm2:start
```

> **Note**: Before pushing to the repository, please run `yarn lint` so formatting stays consistent and there are no
linter warnings.

[`config.ts.example`]: /config.ts.example

## Links

**Ny-API links**

- [Support Server](https://skyra.pw/join)
- [Patreon](https://www.patreon.com/kyranet)

**Framework links**

- [Klasa's Website](https://klasa.js.org)
