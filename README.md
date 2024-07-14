# <p align="center"> Fractal Shares </p>
#### Revolutionizing Asset Ownership Through Tokenization

Fractal Shares unlocks the potential of real-world assets by tokenizing them into secure, transparent, and tradeable fungible tokens. Our platform addresses the fundamental barriers to asset ownership and investment diversification by offering fractional ownership of high-value assets like real estate, artwork, and intellectual property. Investors can seamlessly buy, sell, and trade fractional shares, democratizing access to lucrative investment opportunities traditionally reserved for the wealthy.

<img width="1431" alt="cover-page" src="https://github.com/user-attachments/assets/85901d7c-7c8b-4d79-86b9-2688fd3d3e21">



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
