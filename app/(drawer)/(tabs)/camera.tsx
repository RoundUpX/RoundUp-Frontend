import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { COLORS } from '@/constants/theme';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (scanned) {
      // Reset scanned state after a short delay
      setTimeout(() => setScanned(false), 2000);
    }
  }, [scanned]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannedData(data);
    console.log(data);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen camera */}
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      />
      {/* Overlay for scanner corners */}
      <View style={styles.overlay}>
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      {scanned && (
        <View style={styles.scannedMessageContainer}>
          <Text style={styles.scannedMessage}>Scanned QR Code: {scannedData}</Text>
        </View>
      )}
      {/* Flip camera button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Calculate scanner frame size based on screen dimensions
const { width } = Dimensions.get('window');
const scannerSize = Math.min(width * 0.65, 300);
const cornerLength = 60; // Length for each corner line

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    ...StyleSheet.absoluteFillObject, // fills entire screen
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
  },
  corner: {
    position: 'absolute',
    width: cornerLength,
    height: cornerLength,
    borderColor: COLORS.SEXY_white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 8,
    borderRightWidth: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 8,
    borderRightWidth: 8,
  },
  scannedMessageContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
  },
  scannedMessage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
