// CheckoutScreen.js
// Écran de paiement avec processus en 2 étapes

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext'; // Contexte du panier

export default function CheckoutScreen({ navigation }) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(1); // État pour gérer l'étape actuelle

  // État du formulaire regroupant toutes les entrées utilisateur
  const [formData, setFormData] = useState({
    // Information de livraison
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    
    // Information de paiement
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Met à jour les champs du formulaire dynamiquement
  const updateFormField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Calcul des montants
  const subtotal = getCartTotal();
  const tax = subtotal * 0.07;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  // Validation des informations de livraison
  const validateShippingInfo = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    
    return true;
  };

  // Validation des informations de paiement
  const validatePaymentInfo = () => {
    const requiredFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    
    return true;
  };

  // Gestion de la navigation entre les étapes
  const handleContinue = () => {
    if (activeStep === 1 && validateShippingInfo()) {
      setActiveStep(2);
    } else if (activeStep === 2 && validatePaymentInfo()) {
      handlePlaceOrder();
    }
  };

  // Confirmation de commande et nettoyage du panier
  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Confirmation',
      'Your order has been placed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Store');
          },
        },
      ]
    );
  };

  // Formulaire de livraison
  const renderShippingForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Shipping Information</Text>
      
      {/* Structure des champs de formulaire avec gestion d'état */}
      <View style={styles.formRow}>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>First Name*</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => updateFormField('firstName', text)}
            placeholder="John"
            placeholderTextColor="#888"
          />
        </View>
        {/* Les autres champs suivent la même structure */}
        <View style={styles.formHalfField}>
          <Text style={styles.label}>Last Name*</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => updateFormField('lastName', text)}
            placeholder="Doe"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => updateFormField('address', text)}
          placeholder="123 Main St"
          placeholderTextColor="#888"
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>City*</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => updateFormField('city', text)}
            placeholder="New York"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>State*</Text>
          <TextInput
            style={styles.input}
            value={formData.state}
            onChangeText={(text) => updateFormField('state', text)}
            placeholder="NY"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      
      <View style={styles.formRow}>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>Zip Code*</Text>
          <TextInput
            style={styles.input}
            value={formData.zipCode}
            onChangeText={(text) => updateFormField('zipCode', text)}
            placeholder="10001"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>Country*</Text>
          <TextInput
            style={styles.input}
            value={formData.country}
            onChangeText={(text) => updateFormField('country', text)}
            placeholder="United States"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => updateFormField('phone', text)}
          placeholder="(123) 456-7890"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
  
  // Formulaire de paiement
  const renderPaymentForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Payment Information</Text>
      
      {/* Champs sensibles avec masquage du CVV */}
      <View style={styles.formField}>
        <Text style={styles.label}>Card Number*</Text>
        <TextInput
          style={styles.input}
          value={formData.cardNumber}
          onChangeText={(text) => updateFormField('cardNumber', text)}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#888"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.label}>Cardholder Name*</Text>
        <TextInput
          style={styles.input}
          value={formData.cardName}
          onChangeText={(text) => updateFormField('cardName', text)}
          placeholder="John Doe"
          placeholderTextColor="#888"
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>Expiry Date*</Text>
          <TextInput
            style={styles.input}
            value={formData.expiryDate}
            onChangeText={(text) => updateFormField('expiryDate', text)}
            placeholder="MM/YY"
            placeholderTextColor="#888"
            maxLength={5}
          />
        </View>
        <View style={styles.formHalfField}>
          <Text style={styles.label}>CVV*</Text>
          <TextInput
            style={styles.input}
            value={formData.cvv}
            onChangeText={(text) => updateFormField('cvv', text)}
            placeholder="123"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );
  
  // Récapitulatif de la commande
  const renderOrderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      {/* Liste des articles avec quantité et prix */}
      <View style={styles.summaryItems}>
        {cart.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>
              {item.title} {item.quantity > 1 ? `(${item.quantity})` : ''}
            </Text>
            <Text style={styles.summaryItemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summaryDivider} />

      {/* Calculs des totaux */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (7%)</Text>
        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>
          {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
        </Text>
      </View>
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (activeStep === 1) {
              navigation.goBack();
            } else {
              setActiveStep(1);
            }
          }}
        >
          <Text style={styles.backButtonText}>
            {activeStep === 1 ? '← Back' : '← Previous Step'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 50 }}></View> {/* Empty view for balance */}
      </View>
      
      {/* Indicateur d'étapes visuel */}
      <View style={styles.stepsContainer}>
        <View style={[styles.stepIndicator, activeStep >= 1 && styles.activeStep]}>
          <Text style={[styles.stepNumber, activeStep >= 1 && styles.activeStepNumber]}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepIndicator, activeStep >= 2 && styles.activeStep]}>
          <Text style={[styles.stepNumber, activeStep >= 2 && styles.activeStepNumber]}>2</Text>
        </View>
      </View>
      <View style={styles.stepsLabelContainer}>
        <Text style={[styles.stepLabel, activeStep === 1 && styles.activeStepLabel]}>Shipping</Text>
        <Text style={[styles.stepLabel, activeStep === 2 && styles.activeStepLabel]}>Payment</Text>
      </View>
      
      {/* Contenu principal avec défilement */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeStep === 1 ? renderShippingForm() : renderPaymentForm()}
        {renderOrderSummary()}
        
        {/* Bouton d'action principal */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {activeStep === 1 ? 'Continue to Payment' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles avec thème sombre cohérent
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
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#1E1E1E',
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#6200EE',
  },
  stepNumber: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepLine: {
    flex: 0.2,
    height: 2,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  stepsLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  stepLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  activeStepLabel: {
    color: '#BB86FC',
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formField: {
    marginBottom: 16,
  },
  formHalfField: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  summaryItems: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 14,
    color: '#ddd',
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ddd',
  },
  summaryValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#03DAC5',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});