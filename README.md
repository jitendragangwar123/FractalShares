# FractalShares
#### A simple way for tokenization of the Real World Assets


### Project SetUp

```shell
$ git clone https://github.com/jitendragangwar123/FractalShares.git
$ cd FractalShares
```
#### To start the Back-end
```shell
$ cd server
$ npm i
$ npm start
```
#### To start the Front-end
```shell
$ cd client
$ npm i
$ npm run dev
```


#### cURL requests

##### 1. createKeyPair

```shell
curl -X POST http://localhost:8000/createKeyPair -H "Content-Type: application/json" -d '{}'
```

##### 2. generatePublicKey

```shell
curl -X POST http://localhost:8000/generatePublicKey -H "Content-Type: application/json" -d '{"secretKey": "YOUR_SECRET_KEY"}'
```

##### 3. fundDIAMTokens

```shell
curl -X POST http://localhost:8000/fundDiamTokens -H "Content-Type: application/json" -d '{"publicKey": "YOUR_PUBLIC_KEY"}'
```

##### 4. transferDIAMTokens

```shell
curl -X POST http://localhost:8000/transferDiamTokens -H "Content-Type: application/json" -d '{"senderSecretKey": "SENDER_SECRET_KEY",  "receiverPublicKey": "RECEIVER_PUBLIC_KEY", "amount": "50.0000000"}'
```

##### 5. issueAssets

```shell
curl -X POST http://localhost:8000/issueAssets -H "Content-Type: application/json" -d '{"issuerSecret": "ISSUER_SECRET_KEY", "receiverSecret": "RECEIVER_SECRET_KEY", "amountLimit": "1000000.0000000", "assetName":"REALTY", "amount":"500.0000000" }'
```

##### 6. transferAssets

```shell
curl -X POST http://localhost:8000/transferAssets -H "Content-Type: application/json" -d '{"senderSecret": "SENDER_SECRET_KEY", "issuerPublicKey": "ISSUER_PUBLIC_KEY",  "assetName":"REALTY", "amount":"20.0000000" }'
```