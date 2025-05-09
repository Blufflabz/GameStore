import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function GameDetailsScreen({ route, navigation }) {
  const { game, isNewGame } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(game);
    // Show a snackbar or toast notification here if you have one
    navigation.setParams({ added: true });
  };

  // Render the image based on its type
  const renderImage = () => {
    // If it's a required module (local image), render it directly
    if (typeof game.coverImage === 'number') {
      return (
        <Image 
          source={game.coverImage} 
          style={styles.gameImage}
          resizeMode="cover"
        />
      );
    } else {
      // If it's a string URL, use the uri prop
      return (
        <Image 
          source={{ uri: game.coverImage }} 
          style={styles.gameImage}
          resizeMode="cover"
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Details</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>Cart</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Game Image */}
        {renderImage()}

        {/* Game Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gamePlatform}>{game.platform}</Text>
          <Text style={styles.gameCondition}>
            {isNewGame ? game.type : `Condition: ${game.condition}`}
          </Text>
          <Text style={styles.gamePrice}>${game.price.toFixed(2)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{game.description}</Text>
          
          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          {/* Buy Now Button */}
          <TouchableOpacity 
            style={styles.buyNowButton}
            onPress={() => {
              addToCart(game);
              navigation.navigate('Checkout');
            }}
          >
            <Text style={styles.buyNowButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#BB86FC',
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 8,
  },
  cartButtonText: {
    color: '#BB86FC',
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
  },
  gameImage: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 16,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  gamePlatform: {
    fontSize: 16,
    color: '#BB86FC',
    marginBottom: 8,
  },
  gameCondition: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  gamePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03DAC5',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
    marginBottom: 24,
  },
  addToCartButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: '#03DAC5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});