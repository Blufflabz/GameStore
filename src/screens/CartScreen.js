import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext'; // Contexte pour la gestion du panier

// Composant réutilisable pour un article du panier
const CartItem = ({ item, onRemove, onDecrease, onIncrease }) => (
  <View style={styles.cartItem}>
    {/* Affichage conditionnel de l'image (locale ou distante) */}
    {typeof item.coverImage === 'number' ? (
      <Image source={item.coverImage} style={styles.itemImage} />
    ) : (
      <Image source={{ uri: item.coverImage }} style={styles.itemImage} />
    )}

    {/* Section d'information de l'article */}
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemPlatform}>{item.platform}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>

    {/* Gestionnaire de quantité */}
    <View style={styles.quantityContainer}>
      <TouchableOpacity 
        style={styles.quantityButton} 
        onPress={onDecrease} // Diminue la quantité
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity 
        style={styles.quantityButton} 
        onPress={onIncrease} // Augmente la quantité
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    {/* Bouton de suppression d'article */}
    <TouchableOpacity 
      style={styles.removeButton} 
      onPress={onRemove} // Supprime l'article
    >
      <Text style={styles.removeButtonText}>✕</Text>
    </TouchableOpacity>
  </View>
);

// Écran principal du panier
export default function CartScreen({ navigation }) {
  // Récupération des fonctions du panier via le contexte
  const { 
    cart, 
    removeFromCart, 
    decreaseQuantity, 
    increaseQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();

  // Gestion de la commande
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des articles avant de payer');
      return;
    }
    navigation.navigate('Checkout'); // Navigation vers l'écran de paiement
  };

  // Confirmation pour vider le panier
  const handleClearCart = () => {
    if (cart.length === 0) return;
    
    Alert.alert(
      'Vider le panier',
      'Supprimer tous les articles ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Vider', style: 'destructive', onPress: () => clearCart() }
      ]
    );
  };

  // Affichage quand le panier est vide
  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate('Store')} // Retour à la boutique
      >
        <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* En-tête avec boutons de navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Retour à l'écran précédent
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Your Cart</Text>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart} // Bouton de suppression totale
        >
          <Text style={styles.clearButtonText}>Empty</Text>
        </TouchableOpacity>
      </View>

      {/* Affichage conditionnel du contenu */}
      {cart.length > 0 ? (
        <>
          {/* Liste des articles avec FlatList pour performance */}
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
                onIncrease={() => increaseQuantity(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
          
          {/* Section de résumé et paiement */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub-total:</Text>
              <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (7%):</Text>
              <Text style={styles.summaryValue}>${(getCartTotal() * 0.07).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${(getCartTotal() * 1.07).toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout} // Déclenche le processus de paiement
            >
              <Text style={styles.checkoutButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        renderEmptyCart() // Affiche le panier vide
      )}
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
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#CF6679',
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  itemPlatform: {
    fontSize: 14,
    color: '#BB86FC',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03DAC5',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    color: '#fff',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 12,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#CF6679',
  },
  summaryContainer: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#ddd',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    color: '#03DAC5',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueShoppingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});