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
  const [validationResult, setValidationResult] = useState<any>(null);
  const cameraRef = useRef(null);
  const amountInputRef = useRef<TextInput | null>(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0MjMwODMsInVzZXJfaWQiOiI5OGVlOTE5ZS1kYzI4LTRhOTItOTUxMC01MzU4YWUzODI4NTYifQ.rSt4vBm60jIGuUfaXtbpgqefxhR5JrZ_a6KQ2zGAnGg"; // Change as needed
  const categories = ["Transport", "Groceries", "Dining", "Entertainment", "Utilities"];

  useEffect(() => {
    if (validationResult === false) {
      setScanned(false);
      setScannedData(null);
      console.log(validationResult);
    }
  }, [scanned, scannedData, validationResult]);

  const validateUPI = async (upiUrl: string) => {
    try {
      const response = await fetch("http://10.42.0.1:8082/api/v1/upi/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: upiUrl }),
      });
      const result = await response.json();
      setValidationResult(result.valid);
    } catch (error) {
      console.log("UPI Validation Error:", error);
      setValidationResult(null);
      setScanned(false);
      setScannedData(null);
    }
  };

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

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannedData(data);
  };

  const extractMerchant = (upiString: string) => {
    const match = upiString.match(/pa=([^&]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const handlePayment = async () => {
    if (!scannedData || !amount) {
      console.log("Missing scanned data or amount");
      return;
    }

    const merchant = extractMerchant(scannedData);
    if (!merchant) {
      console.log("Invalid UPI data");
      return;
    }
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const transactionData = {
      amount: parseFloat(amount),
      category: randomCategory,
      merchant: merchant,
      roundup_enabled: true,
    };

    try {
      const response = await fetch("http://10.42.0.1:8082/api/v1/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(transactionData),
      });
      const result = await response.json();
      console.log("Transaction Response:", result);
    } catch (error) {
      console.log("Transaction Error:", error);
    }

    setAmount("");
    setScanned(false);
    setScannedData(null);
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

      {scanned && validateUPI(scannedData) && validationResult ? (
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
            onPress={handlePayment}
          />
        </KeyboardAvoidingView>
      ) : null}
    </View>
  );
}

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