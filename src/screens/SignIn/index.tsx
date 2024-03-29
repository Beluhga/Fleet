import { Container, Slogan, Title } from './styles';

import backgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Realm, useApp } from '@realm/react';

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID

})

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const app = useApp()

  async function handleGoogleSignIn(){
    try {
      setIsAuthenticating(true)
      const {idToken} = await GoogleSignin.signIn()

      if(idToken){
        const credentials = Realm.Credentials.jwt(idToken)

        await app.logIn(credentials)
      } else {
        Alert.alert("Entrar", "Não foi possível conectar")

        setIsAuthenticating(false)
      }
      

    } catch (error) {
      setIsAuthenticating(false)
      console.log(error)
      Alert.alert("Entrar", "Não foi possível conectar A SUA CONTA GOOGLE")
    }
  }
  return (
    <Container source={backgroundImg}>
      <Title>
        Fleet
      </Title>

      <Slogan>
        Gestão de uso de veiculos
      </Slogan>

      <Button title="Entra com Google" isLoading={isAuthenticating} onPress={handleGoogleSignIn} />
    </Container>
  );
}

