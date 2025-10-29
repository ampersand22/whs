import React from 'react';
import { View, Modal } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { getTranslation } from '../constants/translations';

const LanguageModal = ({ visible, onClose, currentLanguage, onLanguageSelect }) => {
  const handleLanguageSelect = (language) => {
    onLanguageSelect(language);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <Card style={{ width: '100%', maxWidth: 300 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', marginBottom: 20 }}>
              {getTranslation('selectLanguage', currentLanguage)}
            </Title>
            
            <Button
              mode={currentLanguage === 'english' ? 'contained' : 'outlined'}
              onPress={() => handleLanguageSelect('english')}
              style={{ marginBottom: 12 }}
              data-testid="select-english-button"
            >
              {getTranslation('english', currentLanguage)}
            </Button>
            
            <Button
              mode={currentLanguage === 'portuguese' ? 'contained' : 'outlined'}
              onPress={() => handleLanguageSelect('portuguese')}
              style={{ marginBottom: 20 }}
              data-testid="select-portuguese-button"
            >
              {getTranslation('portuguese', currentLanguage)}
            </Button>
            
            <Button
              mode="text"
              onPress={onClose}
              style={{ alignSelf: 'center' }}
              data-testid="cancel-language-button"
            >
              {getTranslation('cancel', currentLanguage)}
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

export default LanguageModal;
