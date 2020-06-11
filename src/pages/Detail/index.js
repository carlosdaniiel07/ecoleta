import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';

import styles from './style';
import api from './../../services/api';

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();

  const {point} = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const data = (await api.get(`/points/${point.id}/items`)).data;
      setItems(data);
    };

    loadItems();
  }, []);

  function navigateBack() {
    navigation.goBack();
  }

  function notAvailable() {
    Alert.alert('Alerta', 'Função não disponível no momento!');
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: point.imageUrl,
          }}
        />

        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>
          {items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {point.city}, {point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={notAvailable}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={notAvailable}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </>
  );
}
