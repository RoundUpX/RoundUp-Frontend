import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const cameraRef = useRef(null);
  const amountInputRef = useRef<TextInput | null>(null);

  const COLORS = {
    SEXY_white: "white",
  };

  useEffect(() => {
    if (scanned && scannedData) {
      setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 100);
    }
  }, [scanned, scannedData]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannedData(data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barCodeTypes: ["qr"],
        }}
      />

      {!scanned && (
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      )}

      {!scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {scanned && scannedData ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.paymentContainer}
        >
          <Text style={styles.scannedMessage}>
            Scanned QR Code: {scannedData}
          </Text>
          <Text style={styles.amountLabel}>Enter Amount:</Text>
          <TextInput
            ref={amountInputRef}
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            autoFocus
          />
          <Button
            title="Pay"
            onPress={() => {
              console.log("Paying", amount, "to", scannedData);
              setAmount("");
              setScanned(false);
              setScannedData(null);
            }}
          />
        </KeyboardAvoidingView>
      ) : null}
    </View>
  );
}

const { width } = Dimensions.get("window");
const scannerSize = Math.min(width * 0.7, 300);
const cornerLength = 40;
const cornerWidth = 6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
  },
  corner: {
    position: "absolute",
    width: cornerLength,
    height: cornerLength,
    borderColor: "white",
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
    borderRightWidth: cornerWidth,
    borderBottomWidth: cornerWidth,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  paymentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scannedMessage: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  amountLabel: {
    marginBottom: 5,
    fontSize: 16,
  },

  amountInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
