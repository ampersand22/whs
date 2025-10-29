# Portuguese Character Display - Priority Implementation

## Immediate Goal
Ensure all Portuguese characters (á, à, â, ã, é, ê, í, ó, ò, ô, õ, ú, ç) display correctly throughout the Worrzle app.

## Current Status
- **Font System**: React Native Paper with MD3LightTheme (system fonts)
- **Expected Support**: iOS/Android system fonts should support Portuguese characters
- **Risk**: Need to verify actual rendering in all game components

## Portuguese Characters to Support

### Vowels with Accents
- **A**: á, à, â, ã
- **E**: é, ê  
- **I**: í
- **O**: ó, ò, ô, õ
- **U**: ú

### Special Consonant
- **C**: ç (cedilla)

### Test String
```
"aáàâãeéêiíoóòôõuúçAÁÀÂÃEÉÊIÍOÓÒÔÕUÚÇ"
```

### Test Words
```
"término", "coração", "ação", "português", "informação"
```

## Implementation Steps

### Step 1: Create Character Test Component
```javascript
// src/components/PortugueseCharacterTest.js
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

const PortugueseCharacterTest = () => {
  const testChars = "aáàâãeéêiíoóòôõuúçAÁÀÂÃEÉÊIÍOÓÒÔÕUÚÇ";
  const testWords = ["término", "coração", "ação", "português", "informação"];
  
  return (
    <ScrollView style={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Title>Character Display Test</Title>
          <Text style={{ fontSize: 24, lineHeight: 32 }}>
            {testChars}
          </Text>
        </Card.Content>
      </Card>
      
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Title>Word Display Test</Title>
          {testWords.map((word, index) => (
            <Text key={index} style={{ fontSize: 20, marginBottom: 8 }}>
              {word}
            </Text>
          ))}
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Content>
          <Title>Grid Letter Test</Title>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {testChars.split('').map((char, index) => (
              <View key={index} style={{
                width: 40,
                height: 40,
                backgroundColor: '#f0f0f0',
                margin: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {char}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default PortugueseCharacterTest;
```

### Step 2: Add Test Route
```javascript
// Add to navigation in App.js (temporarily)
<Stack.Screen 
  name="CharacterTest" 
  component={PortugueseCharacterTest}
  options={{ title: 'Portuguese Characters' }}
/>
```

### Step 3: Test in All Components
- [ ] LetterGrid component
- [ ] WordPreview component  
- [ ] Found words modal
- [ ] Game over modal
- [ ] Leaderboard display
- [ ] Profile screen

### Step 4: Character Configuration
```javascript
// src/config/portugueseCharacters.js
export const PORTUGUESE_CHARACTERS = {
  // All Portuguese characters
  all: 'aáàâãeéêiíoóòôõuúbcçdfghjklmnpqrstvwxyzAÁÀÂÃEÉÊIÍOÓÒÔÕUÚBCÇDFGHJKLMNPQRSTVWXYZ',
  
  // Vowels with accents
  vowels: ['a', 'á', 'à', 'â', 'ã', 'e', 'é', 'ê', 'i', 'í', 'o', 'ó', 'ò', 'ô', 'õ', 'u', 'ú'],
  
  // Consonants including ç
  consonants: ['b', 'c', 'ç', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
  
  // Only accented characters
  accented: ['á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ò', 'ô', 'õ', 'ú', 'ç'],
  
  // Rare letters in Portuguese
  rare: ['k', 'w', 'y', 'z', 'x'],
  
  // Accent normalization map
  accentMap: {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
    'é': 'e', 'ê': 'e',
    'í': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
    'ú': 'u',
    'ç': 'c'
  }
};

// Utility function to remove accents
export const removeAccents = (text) => {
  return text.split('').map(char => 
    PORTUGUESE_CHARACTERS.accentMap[char.toLowerCase()] || char
  ).join('');
};
```

## Success Criteria

### Visual Verification
- [ ] All Portuguese characters render correctly on iOS
- [ ] All Portuguese characters render correctly on Android  
- [ ] Characters display properly in game grid (40x40px cells)
- [ ] Characters display properly in modals and lists
- [ ] No character clipping or spacing issues

### Technical Verification
- [ ] UTF-8 encoding preserved throughout app
- [ ] Character normalization functions work correctly
- [ ] Performance impact is minimal
- [ ] Accessibility features work with Portuguese characters

## Risk Mitigation

### Font Fallback Plan
If system fonts don't support all characters:
1. Add explicit font configuration to theme
2. Consider bundling Roboto or Inter font
3. Test on older devices

### Performance Considerations
- Monitor app size impact
- Test character rendering performance
- Ensure smooth scrolling with Portuguese text

## Next Steps After Character Display
1. Portuguese word validation
2. Portuguese board generation  
3. Language selection UI
4. Complete Portuguese gameplay

## Timeline
- **Day 1**: Create test component and verify current support
- **Day 2**: Test all game components and identify issues
- **Day 3**: Implement fixes and optimizations
- **Day 4**: Device testing and validation
- **Day 5**: Documentation and move to next phase
