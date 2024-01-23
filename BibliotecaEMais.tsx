/*
extension bscode R Component

rsn (aperta essa 3 letras dai vc escolhe como finalizar)

npx create-expo-app fleet --template

2 opção

// instalar: npm i styled-components@5.3.9
// o styled-components 6 esta dando erro

npm install --save-dev @types/styled-components @types/styled-components-react-native

Fontes personalizadas + Componente de Loading---------------------------------------------

npx expo install expo-font @expo-google-fonts/nome da fonte

Fluxo de autenticação------------------------------------------

https://efficient-sloth-d85.notion.site/OAuth-2-0-1b447112feef4c6296ae36345b3dc667

Variaveis de ambiente ------------------------------------------------

vai lidar com as variaveis de ambiente 

https://www.npmjs.com/package/react-native-dotenv

npm install -D react-native-dotenv

Obtendo ID Android e iOS no GCP--------------------

npx expo prebuild

npx expo run:android

na pasta android dentro do projeto usar

.\gradlew signinReport

serve para pegar a chave 

SHA1

Login com google-----------------------------

https://docs.expo.dev/guides/google-authentication/

npm i @react-native-google-signin/google-signin

Instalando o RealmDB no projeto-----------------

para manter o banco de dados local junto a versao do banco de dados online

https://realm.io

npm install realm

npm install @realm/react

npx expo run:android

Icones e SVG -------------------------------------------------

https://github.com/phosphor-icons/homepage#phosphor-icons

https://github.com/duongdev/phosphor-react-native

npm install --save phosphor-react-native

https://docs.expo.dev/versions/latest/sdk/svg/

npx expo install react-native-svg

imagem do usuario----------------------

https://docs.expo.dev/versions/latest/sdk/image/

npx expo install expo-image

https://blurha.sh

Instalando o React Navigation-----------------------------

https://reactnavigation.org/docs/getting-started/

npm install @react-navigation/native

npx expo install react-native-screens react-native-safe-area-context

https://reactnavigation.org/docs/hello-react-navigation

npm install @react-navigation/native-stack

Criando o schema de historico---------------------------

https://www.mongodb.com/docs/realm/sdk/react-native/model-data/data-types/property-types/

Day.js----------------------------------------------

https://day.js.org/docs/en/installation/node-js

npm install dayjs

react-native-keyboard-aware-scroll-view----------------------------------------------------------------

https://github.com/APSL/react-native-keyboard-aware-scroll-view

npm i react-native-keyboard-aware-scroll-view --save

netInfo-------------------------------------------

para saber se esta Online ou offline

https://docs.expo.dev/versions/latest/sdk/netinfo/

npx expo install @react-native-community/netinfo

Armazenando a data e a hora da ultima sincronização-------------------------

https://docs.expo.dev/versions/latest/sdk/async-storage/

npx expo install @react-native-async-storage/async-storage

React NAtive Toast Message---------------------------------------

a mensagem bonitinha no topo

https://github.com/calintamas/react-native-toast-message

npm install --save react-native-toast-message

Expo Location----------------------------------------------------------

https://docs.expo.dev/versions/latest/sdk/location/

npx expo install expo-location

app.json 

"plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]

Instalando o currentCoords----------------------------------------------------

https://docs.expo.dev/versions/latest/sdk/map-view/

npx expo install react-native-maps

Expo-task-manager---------------------------------------------------------------------------

para gerencia as taferas

https://docs.expo.dev/versions/latest/sdk/task-manager/

npx expo install expo-task-manager


*/