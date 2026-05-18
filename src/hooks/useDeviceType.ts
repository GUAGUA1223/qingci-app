import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

type DeviceType = 'phone' | 'tablet';

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('phone');

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = width / height;
    setDeviceType(aspectRatio > 1.6 ? 'tablet' : 'phone');
  }, []);

  return deviceType;
}
