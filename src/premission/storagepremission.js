import { PermissionsAndroid } from 'react-native';

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "This app needs access to your storage to save and open PDFs.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Storage permission granted");
    } else {
      console.log("Storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

export default requestStoragePermission
