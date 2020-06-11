import React, {useState, useEffect} from 'react';
import {View, Text, Image, ImageBackground, Alert} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import RNPicker from 'react-native-picker-select';
import Geolocation from '@react-native-community/geolocation';

import appLogo from './../../assets/logo.png';
import backgroundImage from './../../assets/home-background.png';
import styles from './styles';
import {getEstados, getMunicipiosByEstado} from './../../services/ibge.api';

export default function Home() {
  const navigation = useNavigation();

  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(null);

  const [municipios, setMunicipios] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const loadEstados = async () => {
      const data = await getEstados();
      setEstados(data);
    };

    loadEstados();
  }, []);

  useEffect(() => {
    const getPosition = () => {
      Geolocation.getCurrentPosition(
        data => {
          const {latitude, longitude} = data.coords;
          setPosition({latitude, longitude});
        },
        err => {
          if (err.PERMISSION_DENIED === 1) {
            Alert.alert(
              'Alerta',
              'Não foi possível obter a sua localização atual!',
            );
          }
        },
      );
    };

    getPosition();
  }, []);

  useEffect(() => {
    const loadMunicipios = async () => {
      if (selectedEstado !== null) {
        const data = await getMunicipiosByEstado(selectedEstado);
        setMunicipios(data);
      }
    };

    loadMunicipios();
  }, [selectedEstado]);

  function navigateToPoints() {
    navigation.navigate('Points', {
      estado: selectedEstado,
      municipio: selectedMunicipio,
      position: position,
    });
  }

  return (
    <ImageBackground style={styles.container} source={backgroundImage}>
      <View style={styles.main}>
        <Image source={appLogo} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <RNPicker
            onValueChange={value => {
              setSelectedEstado(value);
            }}
            placeholder={{
              label: 'Estado',
              value: null,
              color: '#9EA0A4',
            }}
            items={estados.map(estado => {
              return {
                label: estado.nome,
                value: estado.uf,
              };
            })}
            value={selectedEstado}
          />
        </View>

        <View style={styles.inputContainer}>
          <RNPicker
            onValueChange={value => {
              setSelectedMunicipio(value);
            }}
            placeholder={{
              label: 'Cidade',
              value: null,
              color: '#9EA0A4',
            }}
            items={municipios.map(municipio => {
              return {
                label: municipio.nome,
                value: municipio.nome,
              };
            })}
            disabled={selectedEstado === null}
            value={selectedMunicipio}
          />
        </View>

        <RectButton
          style={styles.button}
          onPress={navigateToPoints}
          enabled={
            selectedEstado !== null &&
            selectedMunicipio !== null &&
            position !== null
          }>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}
