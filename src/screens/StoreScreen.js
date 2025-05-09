import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { usedGames, newGames } from '../data/gameData';
import { useCart } from '../context/CartContext';

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.activeTabButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const GameCard = ({ item, isNewGame, onPress, onAddToCart }) => {
  // Handle image rendering properly
  const renderImage = () => {
    // If the image is a required module (local image), render it directly
    // Otherwise, if it's a string URL, use the uri prop
    if (typeof item.coverImage === 'number') {
      return <Image source={item.coverImage} style={styles.gameCover} />;
    } else {
      return <Image source={{ uri: item.coverImage }} style={styles.gameCover} />;
    }
  };

  return (
    <TouchableOpacity style={styles.gameCard} onPress={onPress}>
      {renderImage()}
      <View style={styles.gameDetails}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gamePlatform}>{item.platform}</Text>
        <Text style={styles.gameInfo}>
          {isNewGame ? item.type : `Condition: ${item.condition}`}
        </Text>
        <Text style={styles.gamePrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering parent TouchableOpacity
          onAddToCart(item);
        }}
      >
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function StoreScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('used');
  const { addToCart, getItemsCount } = useCart();
  
  const handleAddToCart = (game) => {
    addToCart(game);
    // You could add a toast notification here
  };
  
  const navigateToGameDetails = (game) => {
    navigation.navigate('GameDetails', {
      game,
      isNewGame: activeTab === 'new'
    });
  };
  
  const renderItem = ({ item }) => (
    <GameCard 
      item={item} 
      isNewGame={activeTab === 'new'} 
      onPress={() => navigateToGameDetails(item)}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pass&Play</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.cartButtonText}>Cart ({getItemsCount()})</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TabButton
          title="Used Games"
          active={activeTab === 'used'}
          onPress={() => setActiveTab('used')}
        />
        <TabButton
          title="New Games (Keys)"
          active={activeTab === 'new'}
          onPress={() => setActiveTab('new')}
        />
      </View>
      
      <FlatList
        data={activeTab === 'used' ? usedGames : newGames}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',
    elevation: Platform.OS === 'android' ? 4 : 0, // Add elevation for Android
    zIndex: 1000, // Ensure header is above other elements
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: Platform.OS === 'android' ? 6 : 0, // Add extra elevation for Android
    zIndex: 1001, // Ensure button is above header
    position: 'relative', // Needed for proper z-index on Android
    marginRight: Platform.OS === 'android' ? 4 : 0, // Add margin for Android
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    paddingBottom: 8,
    zIndex: 999,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#6200EE',
  },
  tabButtonText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gameCover: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  gameDetails: {
    padding: 16,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gamePlatform: {
    fontSize: 14,
    color: '#BB86FC',
    marginBottom: 4,
  },
  gameInfo: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  gamePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03DAC5',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#6200EE',
    alignItems: 'center',
    padding: 12,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});