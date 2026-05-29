const React = require('react');
const { Text } = require('react-native');

module.exports = {
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  processFontFamily: jest.fn((name) => name),
  default: { loadAsync: jest.fn(), isLoaded: jest.fn(() => true), processFontFamily: jest.fn((name) => name) },
};
