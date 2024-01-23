import React from 'react';
import { Container, IconBox, Message, TextHightlight } from './styles';
import {Key, Car} from 'phosphor-react-native'
import { useTheme } from 'styled-components';
import { TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
    licensePlate?: string | null;
}

export function CarStatus({licensePlate = null, ...rest}: Props) {
    const theme = useTheme();

    const Icon = licensePlate ? Car : Key ; // mudou aqui
    const message = licensePlate ? `Veículo ${licensePlate} em uso` : `Nenhum veículo em uso.` ;
    const status = licensePlate ? 'chegada' : 'saída';
  return (
    <Container {...rest}>
        <IconBox>
            <Icon
                size={52}
                color={theme.COLORS.BRAND_LIGHT}
            />
        </IconBox>

        <Message>
            {message}
            <TextHightlight>
                Clique aqui para registrar a {status}
            </TextHightlight>
        </Message>
    </Container>
  );
}