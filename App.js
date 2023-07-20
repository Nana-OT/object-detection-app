import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

const ImageUploader = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    // Hide the splash screen after 3 seconds
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);
  }, []);

  useEffect(() => {
    // Request camera permissions on component mount
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

    // Keep the splash screen visible while we fetch resources
  
  // Function to handle the camera type switch
  const handleCameraTypeSwitch = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

   // Function to handle clearing the captured image
   const handleClearImage = () => {
    setCapturedImage(null);
  };

  // Function to handle image capture
  const handleCapture = async () => {
    if (cameraPermission) {
      const photo = await camera.takePictureAsync();
      setCapturedImage(photo);
    }
  };

  // Function to handle image selection from gallery
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setCapturedImage(result);
      }
    }
  };

  // Function to handle image upload to API
  const handleImageUpload = async () => {
    if (capturedImage) {
      const apiUrl = 'https://b478-197-251-195-80.ngrok-free.app/upload_image';

      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      try {
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        /* const response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({formData}),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }); */

        // Assuming the API response contains the uploaded image URL
        console.log(response.data)
        //setUploadedImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View>
      {/* <View style={styles.contain}>
      <Image source={require('./assets/splash.png')} style={styles.logo} />
      </View> */}
      <Camera
        style={{ height: 400, }}
        type={cameraType}
        ref={(ref) => (camera = ref)}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={handleCameraTypeSwitch}>
          <View>
            <Text style={styles.button}>Switch Camera</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity onPress={handleCapture}>
          <View>
            <Text style={styles.button}>Capture</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container3}>
        <TouchableOpacity onPress={handleImagePicker}>
          <View>
            <Text style={styles.button}>Pick from Gallery</Text>
          </View>
        </TouchableOpacity>
      </View>
      {capturedImage && (
        <View>
          <Image
            source={{ uri: capturedImage.uri }}
            style={{ width: 200, height: 200 }}
          />
          <View style={styles.container4}>
            <TouchableOpacity onPress={handleImageUpload}>
              <View>
                <Text style={styles.button}>Upload Image</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container5}>
            <TouchableOpacity onPress={handleClearImage}>
              <View>
                <Text style={styles.button}>Clear Image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {uploadedImageUrl && (
        <View>
          <Text>Uploaded Image URL:</Text>
          <Text>{uploadedImageUrl}</Text>
        </View>
      )}
    </View>

    
  );
};

const styles = StyleSheet.create({
  contain:{
    flex: 1
  },
  container: {
    backgroundColor: '#5d57ff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    marginTop: 5,
    borderRadius: 6
  },
  container2:{
    backgroundColor: '#8a87ff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    marginTop: 5,
    borderRadius: 6
  },
  container3:{
    backgroundColor: '#b1afff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    marginTop: 5,
    marginBottom: 7,
    borderRadius: 6
  },
  container4:{
    backgroundColor: '#8a87ff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    marginTop: 15,
    borderRadius: 6
  },
  container5:{
    backgroundColor: '#b1afff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    marginTop: 15,
    borderRadius: 6
  },
  button:{
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold' 
  }    
})

export default ImageUploader;
