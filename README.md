# momento-playground

learn and experiment with [Momento](https://www.gomomento.com/)

## general

- currently support cache and topic resource types
- simple pay-as-you-go pricing model by data trasfered
- gRPC for efficient communication with server

## demo

see [`index.js`](./index.js)


```sh
cp .env.sample .env
# edit .env to include youe `MOMENTO_AUTH_TOKEN`

npm install
npm start
```

## resources

- [Momento](https://www.gomomento.com/)
- <https://docs.momentohq.com/>
- [Service Limits](https://docs.momentohq.com/manage/limits)