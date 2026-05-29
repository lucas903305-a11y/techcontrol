const React = require('react');
const { Text } = require('react-native');

function createMockIcon(name) {
  const Icon = React.forwardRef((props, ref) =>
    React.createElement(Text, { ...props, ref }, props.name || name),
  );
  Icon.displayName = name;
  return Icon;
}

module.exports = {
  Ionicons: createMockIcon('Ionicons'),
  MaterialIcons: createMockIcon('MaterialIcons'),
  MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
  FontAwesome: createMockIcon('FontAwesome'),
  AntDesign: createMockIcon('AntDesign'),
  Feather: createMockIcon('Feather'),
  Zocial: createMockIcon('Zocial'),
  SimpleLineIcons: createMockIcon('SimpleLineIcons'),
  Octicons: createMockIcon('Octicons'),
  Foundation: createMockIcon('Foundation'),
  EvilIcons: createMockIcon('EvilIcons'),
  Entypo: createMockIcon('Entypo'),
  createIconSet: jest.fn(),
  createIconSetFromFontello: jest.fn(),
  createIconSetFromIcoMoon: jest.fn(),
};
