import * as Haptics from 'expo-haptics';
import { hapticLight, hapticMedium, hapticSuccess, hapticError, hapticWarning } from '../haptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Warning: 'Warning', Error: 'Error' },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('hapticLight', () => {
  it('calls impactAsync with Light', () => {
    hapticLight();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Light');
  });
});

describe('hapticMedium', () => {
  it('calls impactAsync with Medium', () => {
    hapticMedium();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
  });
});

describe('hapticSuccess', () => {
  it('calls notificationAsync with Success', () => {
    hapticSuccess();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('Success');
  });
});

describe('hapticError', () => {
  it('calls notificationAsync with Error', () => {
    hapticError();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('Error');
  });
});

describe('hapticWarning', () => {
  it('calls notificationAsync with Warning', () => {
    hapticWarning();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('Warning');
  });
});
