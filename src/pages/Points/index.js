import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';

import styles from './style';
import api, {baseURL} from './../../services/api';

export default function App() {
  const navigation = useNavigation();
  const route = useRoute();

  const {estado, municipio, position} = route.params;

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const data = (await api.get('/items')).data;
      setItems(data);
    };

    loadItems();
  }, []);

  useEffect(() => {
    const loadPoints = async () => {
      const params = {
        city: municipio,
        uf: estado,
        items: selectedItems.join(','),
      };

      const data = (await api.get('/points', {
        params,
      })).data;

      setPoints(data);
    };

    loadPoints();
  }, [estado, municipio, selectedItems]);

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDetail(point) {
    navigation.navigate('Detail', {point});
  }

  async function selectItem(item) {
    if (!selectedItems.includes(item.id)) {
      setSelectedItems([...selectedItems, item.id]);
    } else {
      setSelectedItems(selectedItems.filter(i => i !== item.id));
    }
  }

  function getItemUrl(item) {
    return `${baseURL}${item.imageUrl}`;
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}>
            {points.map(point => (
              <Marker
                key={String(point.id)}
                style={styles.mapMarker}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                onPress={() => navigateToDetail(point)}
              />
            ))}
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20}}>
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => {
                selectItem(item);
              }}
              activeOpacity={0.7}>
              <SvgUri width={42} height={42} uri={getItemUrl(item)} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
