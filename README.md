# Weather App ☔

[![Build Status](https://github.com/MauricioRobayo/weather-app/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/MauricioRobayo/weather-app/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/mauriciorobayo/weather-app/badge)](https://www.codefactor.io/repository/github/mauriciorobayo/weather-app)

Vanilla JS weather forecast app using the [Open Weather API](https://openweathermap.org/api).

## Built With

- HTML
- CSS
- JavaScript
- [API Key Proxy Server](https://github.com/MauricioRobayo/api-key-proxy-server)

No frameworks were harmed in the making of this project.

## Live Demo

https://mauriciorobayo.github.io/weather-app/

## Getting Started

To get a local copy up and running follow this steps:

1. Clone the repository and `cd` into it

```sh
git clone https://github.com/MauricioRobayo/weather-app
cd weather-app
```

2. Install dependencies

```sh
npm install
```

3. Start the `webpack-dev-server`

```sh
npm run start
```

4. To build the site for production

```sh
npm run build
```

The production site is automatically deployed to GitHub pages using [GitHub Actions](./.github/workflows/main.yml).

## Contributing

Contributions, issues and feature requests are welcome!

## Acknowledgments

This project uses the [linkify-it](https://www.npmjs.com/package/linkify-it).

To be able to remove the API key from the front-end code, the project uses the [API Key Proxy Server](https://github.com/MauricioRobayo/api-key-proxy-server).

## License

[MIT](LICENSE).
