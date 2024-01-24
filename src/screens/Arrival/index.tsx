import { useEffect, useState } from 'react';
import { AsyncMessage, Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useObject, useRealm } from '../../libs/realm';
import { Alert } from 'react-native';
import { getLastAsyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import {Realm} from '@realm/react';
import { stopLocationTask } from '../../tasks/BackgroundLocationTask';
import { getStorageLocation } from '../../libs/asyncStorage/locationStorage';
import { LatLng } from 'react-native-maps';
import { Map } from '../../components/Map';
import { Locations } from '../../components/Locations';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { LocationInfoProps } from '../../components/LocationInfo';
import dayjs from 'dayjs';

type RouteParamsProps = {
  id: string;
}
export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>({} as LocationInfoProps);
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);



  const route = useRoute();
  const { id} = route.params as RouteParamsProps;

  const realm = useRealm();
  const {goBack} = useNavigation();
  const historic = useObject(Historic, new Realm.BSON.UUID(id) as unknown as string)

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes' 

    function handleRemoveVehicleUsage(){ 
      Alert.alert(
        'Cancelar',
        'Cancelar a utilização do veiculo?',
        [
          {text: 'Não', style: 'cancel'},
          {text: 'Sim', onPress: () => removeVehicleUsage()}
        ]
      )

      async function removeVehicleUsage(){
        realm.write(() => { 
          realm.delete(historic);
        });

        await stopLocationTask(); 
        goBack();
      }
    }

    async function handleArrivalRegister(){ 
      try{
        if(!historic){
          return Alert.alert('Error', 'Não foi possível obter os dados para registrar a chegada do veículo.')
        }
    
        const locations = await getStorageLocation();

        realm.write(() => {  
          historic.status = 'arrival';
          historic.updated_at = new Date();
          historic.coords.push(...locations);
        });

        await stopLocationTask(); 

        Alert.alert('Chegada', 'Chegada registrada com sucesso!')
        goBack()

      } catch (error){
        console.log(error);
        Alert.alert('Error', 'Não foi possível registrar a chegada do veiculo.')
      }
    }

    async function getLocationsInfo(){
      if(!historic){
        return;
      }
      const lastSync = await getLastAsyncTimestamp();
      const updateAt = historic!.updated_at.getTime();
      setDataNotSynced(updateAt > lastSync);

      if(historic?.status === 'departure'){ 
        const locationsStorage = await getStorageLocation();
        setCoordinates(locationsStorage);

      } else {
        setCoordinates(historic?.coords ?? []);
      }

      if(historic?.coords[0]){
        const departureStreetName = await getAddressLocation(historic?.coords[0]);
        setDeparture({
          label: `Saíndo em ${departureStreetName ?? ''}`,
          description: dayjs(new Date(historic?.coords[0].timestamp)).format('DD/MM/YYYY [às] HH.mm')
        })
      }

      if(historic?.status === 'arrival'){
        const lastLocation = historic.coords[historic.coords.length - 1];
        const arrivalStreetName = await getAddressLocation(lastLocation);
         setArrival({
          label: `Chegando em ${arrivalStreetName ?? ''}`,
          description: dayjs(new Date(lastLocation.timestamp)).format('DD/MM/YYYY [às] HH.mm')
        })
      }

    }

    useEffect(() => {
      getLocationsInfo();
    },[historic]);

  return (
    <Container>
      <Header title={title} /> 

      {coordinates.length > 0 && <Map coordinates={coordinates}/> }

      <Content>
      <Locations
          departure={departure}
          arrival={arrival}
        />
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
        {historic?.description}
        </Description>
        
      </Content>

      {
          historic?.status === 'departure' && 
          <Footer>
          <ButtonIcon 
            icon={X}
            onPress={handleRemoveVehicleUsage}
          />
          <Button 
            title='Registrar Chegada'
            onPress={handleArrivalRegister} 
          />
        </Footer>
        }

        {
          
          dataNotSynced &&
          <AsyncMessage>
            Sincronização da {historic?.status === "departure" ? "partida" : "chegada"} pendente.
          </AsyncMessage>
        }

    </Container>
  );
}