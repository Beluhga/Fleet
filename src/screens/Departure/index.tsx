import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Container, Content, Message } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { Alert, ScrollView, TextInput } from 'react-native';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { useUser } from '@realm/react';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '../../libs/realm';
import { 
  useForegroundPermissions, 
  watchPositionAsync, 
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
  requestBackgroundPermissionsAsync
} from 'expo-location';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { Car } from 'phosphor-react-native';
import { Map } from '../../components/Map';
import { startLocationTask } from '../../tasks/BackgroundLocationTask';


export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); 
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null)


  const [permissaoDeLocalizacao, requestPermissaoDeLocalizacao] = useForegroundPermissions();

  const {goBack} = useNavigation()
  const realm = useRealm();  
  const user = useUser(); 

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  async function handleDepartureRegister(){
    try{
    if (!licensePlateValidate(licensePlate)) {
      licensePlateRef.current?.focus();
      return Alert.alert('Placa Inválida')
    }
    if(description.trim().length === 0){
      descriptionRef.current?.focus();
      return Alert.alert('Finalidade', 'Por favor, informa a finalidade da utilização do veículo.')
    }
    if(!currentCoords?.latitude && !currentCoords?.longitude){
      return Alert.alert('Localização', 'Não foi possível obter a localização atual. Tente novamente mais tarde!')
    }

    setIsRegistering(true);

    const backgroundPermissions = await requestBackgroundPermissionsAsync();
    
    if(!backgroundPermissions.granted){
      setIsRegistering(false);

      return Alert.alert('Localização', 'É necessário permitir que o App tenha acesso a localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo".')
    }
   
    await startLocationTask();
    
    realm.write(() => {
      realm.create('Historic', Historic.generate({
        user_id: user!.id, 
        license_plate: licensePlate.toUpperCase(), 
        description,
        coords: [{
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          timestamp: new Date().getTime()
        }]

      })) 
    }); 

    Alert.alert('Saída', 'Saída do veículo registrada com sucesso!')
    goBack();

  }catch(error) {
    console.log(error);
    Alert.alert('Error', 'Não foi possível registrar a saída do veículo')
    setIsRegistering(false) 
   }
  }

  useEffect(() => {
    requestPermissaoDeLocalizacao();
  }, [])

  useEffect(() => {
    if(!permissaoDeLocalizacao?.granted){
      return;
    }

    let subscription: LocationSubscription;
    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoords(location.coords) 
      getAddressLocation(location.coords) 
      .then((address) => {
        if(address){
         
          setCurrentAddress(address)
        }
      })
      .finally(() => setIsLoadingLocation(false)) 
    }).then((response) => subscription = response)

    return () => {
      if(subscription){ 
        subscription.remove()
      }
    }; 
  },[permissaoDeLocalizacao])

  if(!permissaoDeLocalizacao?.granted){
    return (
      <Container>
        <Header title='Saída' />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para utilizar essa funcionalidade.
          Por favor, acesse as configurações do seu dispositivo para conceder essa permissão ao aplicativo.
        </Message>
      </Container>
    )
  }

  if(isLoadingLocation){ 
    return(
      <Loading />
    )
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]}/>}
          <Content>
            {
              currentAddress && 
              <LocationInfo 
                icon={Car}
                label='Localização atual'
                description={currentAddress}
              />
            }

            <LicensePlateInput 
              ref={licensePlateRef}
              label='Placa do veículo'
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next' 
              onChangeText={setLicensePlate}
            />
            <TextAreaInput 
              ref={descriptionRef}
              label='Finalidade'
              placeholder='Vou utilizar o veículo para...'
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              blurOnSubmit
              onChangeText={setDescription}
            /> 
          <Button
            title='Registrar Saída'
            onPress={handleDepartureRegister}
            isLoading={isRegistering} 
          />
          </Content>
      </ScrollView>
    </KeyboardAwareScrollView>

      </Container>
  );
}